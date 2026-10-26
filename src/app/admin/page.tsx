import Link from "next/link";
import { isAdmin, requireAdmin } from "@/lib/admin-auth";
import { formatLeadDate, prettyPhone, serviceTitle, waitingFor } from "@/lib/admin-format";
import { cn } from "@/lib/cn";
import {
  breakdowns,
  callbacksToday,
  countNewLeads,
  dashboardStats,
  overdueCallbacks,
  staleNewLeads,
  type Breakdown,
  type StoredLead,
} from "@/lib/leads-repo";
import { cardClass, statusLabel } from "./ui";

// Шаблон названия из layout действует только на вложенные страницы, а сводка
// лежит с ним на одном уровне — число новых ставим сами.
export async function generateMetadata() {
  const newCount = (await isAdmin()) ? await countNewLeads() : 0;
  return { title: { absolute: newCount ? `(${newCount}) Сводка` : "Сводка" } };
}

/**
 * Сводка — первое, что видит администратор. Сверху то, что требует
 * действия сейчас; ниже — цифры за месяц, чтобы понимать, работает ли сайт.
 */
export default async function DashboardPage() {
  await requireAdmin();

  const [stats, parts, overdue, stale, today] = await Promise.all([
    dashboardStats(),
    breakdowns(),
    overdueCallbacks(),
    staleNewLeads(15),
    callbacksToday(),
  ]);

  const now = new Date();
  const conversion = stats.d30 ? Math.round((stats.booked30 / stats.d30) * 100) : 0;

  return (
    <div className="flex flex-col gap-10">
      <h1 className="font-display text-heading-lg text-ink">Сводка</h1>

      <div className="grid gap-4 lg:grid-cols-3">
        <AttentionList
          title="Просрочен перезвон"
          tone="alert"
          empty="Просроченных нет"
          leads={overdue}
          detail={(l) => `перезвонить было ${formatLeadDate(l.callbackAt!)}`}
        />
        <AttentionList
          title="Новые ждут больше 15 минут"
          tone="sky"
          empty="Все новые заявки разобраны"
          leads={stale}
          detail={(l) => `ждёт ${waitingFor(l.createdAt, now)}`}
        />
        <AttentionList
          title="Перезвонить сегодня"
          tone="ink"
          empty="На сегодня перезвонов нет"
          leads={today}
          detail={(l) => `в ${formatLeadDate(l.callbackAt!).slice(-5)}`}
        />
      </div>

      <section aria-labelledby="numbers" className="flex flex-col gap-4">
        <h2 id="numbers" className="label-mono text-graphite">
          Заявки без спама
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Сегодня" value={stats.today} href="/admin/leads?period=today" />
          <Stat label="За 7 дней" value={stats.d7} href="/admin/leads?period=7d" />
          <Stat label="За 30 дней" value={stats.d30} href="/admin/leads?period=30d" />
          <Stat
            label="Записались за 30 дней"
            value={stats.booked30}
            note={stats.d30 ? `${conversion}% заявок` : undefined}
            href="/admin/leads?status=booked&period=30d"
          />
        </ul>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <Bars title="Статусы за 30 дней" rows={parts.byStatus} label={statusLabel} />
        <Bars title="Услуги за 30 дней" rows={parts.byService} label={serviceTitle} />
        <Bars title="Откуда пришли" rows={parts.bySource} label={sourceLabel} />
      </div>
    </div>
  );
}

/** utm_source как есть, страница сайта — путём; корень назван словами. */
function sourceLabel(key: string) {
  return key === "/" ? "Главная страница" : key;
}

function Stat({ label, value, note, href }: { label: string; value: number; note?: string; href: string }) {
  return (
    <li>
      <Link href={href} className={cn(cardClass, "flex h-full flex-col gap-2 p-5 hover:border-graphite")}>
        <span className="label-mono text-graphite">{label}</span>
        <span className="flex items-baseline gap-3">
          <span className="font-display text-heading-sm text-ink">{value}</span>
          {note ? <span className="text-caption tracking-normal text-graphite">{note}</span> : null}
        </span>
      </Link>
    </li>
  );
}

const toneClass = {
  alert: "text-alert",
  sky: "text-sky",
  ink: "text-ink",
} as const;

function AttentionList({
  title,
  tone,
  empty,
  leads,
  detail,
}: {
  title: string;
  tone: keyof typeof toneClass;
  empty: string;
  leads: StoredLead[];
  detail: (lead: StoredLead) => string;
}) {
  return (
    <section className={cn(cardClass, "flex flex-col gap-3 p-5")}>
      <h2
        className={cn(
          "label-mono flex items-center justify-between gap-3",
          leads.length ? toneClass[tone] : "text-graphite",
        )}
      >
        {title}
        <span>{leads.length}</span>
      </h2>
      {leads.length === 0 ? (
        <p className="text-graphite">{empty}</p>
      ) : (
        <ul className="flex flex-col">
          {leads.map((lead) => (
            <li key={lead.id} className="border-t border-hairline py-2.5 first:border-t-0 first:pt-0">
              <Link href={`/admin/leads/${lead.id}`} className="text-ink hover:underline">
                {lead.name}
              </Link>
              <p className="text-caption tracking-normal text-graphite">
                {prettyPhone(lead.phone)} · {detail(lead)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

/** Полоски — для глаза; число всегда написано рядом. */
function Bars({ title, rows, label }: { title: string; rows: Breakdown; label: (key: string) => string }) {
  const max = Math.max(1, ...rows.map((r) => r.n));
  return (
    <section className={cn(cardClass, "flex flex-col gap-4 p-5")}>
      <h2 className="label-mono text-graphite">{title}</h2>
      {rows.length === 0 ? (
        <p className="text-graphite">Заявок пока нет</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {rows.map((r) => (
            <li key={r.key} className="flex flex-col gap-1.5">
              <div className="flex justify-between gap-3">
                <span className="text-ink">{label(r.key)}</span>
                <span className="text-graphite">{r.n}</span>
              </div>
              <div aria-hidden="true" className="h-1.5 rounded-full bg-hairline">
                <div className="h-full rounded-full bg-sky" style={{ width: `${(r.n / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
