import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { formatLeadDate, prettyPhone, serviceTitle, waitingFor } from "@/lib/admin-format";
import { cn } from "@/lib/cn";
import {
  isLeadStatus,
  isPeriod,
  leadStatuses,
  listLeads,
  periods,
  statusCounts,
  type LeadFilter,
} from "@/lib/leads-repo";
import { cardClass, fieldClass, ghostButtonClass, pillClass } from "../ui";
import { StatusSelect } from "./status-select";

export const metadata = { title: "Заявки" };

/**
 * Список заявок, новые сверху. Поиск, статус и период — в адресе: вкладку
 * «Новые за сегодня» можно держать открытой, а ссылку — переслать коллеге.
 */
export default async function LeadsPage({ searchParams }: PageProps<"/admin/leads">) {
  await requireAdmin();

  const params = await searchParams;
  const filter: LeadFilter = {
    status: isLeadStatus(params.status) ? params.status : undefined,
    period: isPeriod(params.period) ? params.period : "all",
    q: typeof params.q === "string" ? params.q.trim() : undefined,
  };
  const page = Math.max(1, Number(params.page) || 1);
  const [{ leads, hasMore }, counts] = await Promise.all([
    listLeads({ ...filter, page }),
    statusCounts(filter),
  ]);

  /** Адрес с текущими фильтрами и заменой части из них. */
  const href = (change: Partial<LeadFilter & { page: number }>) => {
    const next = {
      ...filter,
      page: undefined as number | undefined,
      ...change,
    };
    const query = new URLSearchParams();
    if (next.q) query.set("q", next.q);
    if (next.status) query.set("status", next.status);
    if (next.period && next.period !== "all") query.set("period", next.period);
    if (next.page && next.page > 1) query.set("page", String(next.page));
    const s = query.toString();
    return s ? `/admin/leads?${s}` : "/admin/leads";
  };

  const now = new Date();
  const filtered = Boolean(filter.q || filter.status || filter.period !== "all");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-heading-lg text-ink">Заявки</h1>

        {/* Обычная форма GET: работает и без скриптов, результат — в адресе. */}
        <form action="/admin/leads" role="search" className="flex w-full max-w-md gap-2">
          {filter.status ? <input type="hidden" name="status" value={filter.status} /> : null}
          {filter.period !== "all" ? <input type="hidden" name="period" value={filter.period} /> : null}
          <label htmlFor="q" className="sr-only">
            Поиск: имя, телефон или комментарий
          </label>
          <input
            id="q"
            name="q"
            type="search"
            defaultValue={filter.q}
            placeholder="Имя, телефон или комментарий"
            className={fieldClass}
          />
          <button type="submit" className={ghostButtonClass}>
            Найти
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-3">
        <nav aria-label="Статус" className="flex flex-wrap gap-2">
          {[{ value: undefined, label: "Все" }, ...leadStatuses].map((s) => {
            const active = s.value === filter.status;
            const n = s.value ? counts[s.value] : counts.all;
            return (
              <Link
                key={s.label}
                href={href({ status: s.value })}
                aria-current={active ? "page" : undefined}
                className={pillClass(active)}
              >
                {s.label}
                <span className={active ? "text-stone" : "text-graphite"}>{n}</span>
              </Link>
            );
          })}
        </nav>

        <nav aria-label="Период" className="flex flex-wrap items-center gap-2">
          {periods.map((p) => {
            const active = p.value === filter.period;
            return (
              <Link
                key={p.value}
                href={href({ period: p.value })}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "label-mono inline-flex min-h-9 items-center rounded-button px-3",
                  active
                    ? "bg-paper text-ink underline underline-offset-4 ring-1 ring-hairline"
                    : "text-graphite hover:text-ink",
                )}
              >
                {p.label}
              </Link>
            );
          })}
          {filtered ? (
            <Link href="/admin/leads" className="label-mono ml-2 text-sky underline underline-offset-2">
              Сбросить
            </Link>
          ) : null}
        </nav>
      </div>

      {leads.length === 0 ? (
        <p className={cn(cardClass, "px-6 py-10 text-center text-graphite")}>
          {filtered ? "По этим условиям заявок нет." : "Заявок пока нет."}
        </p>
      ) : (
        <div className={cn(cardClass, "overflow-x-auto")}>
          <table className="w-full min-w-[60rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-hairline">
                {["№", "Получена", "Имя", "Телефон", "Услуга", "Перезвонить", "Статус"].map((h) => (
                  <th key={h} scope="col" className="label-mono px-4 py-3 font-normal text-graphite">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => {
                const isNew = lead.status === "new";
                const open = lead.status === "new" || lead.status === "called";
                const overdue = open && lead.callbackAt !== null && lead.callbackAt < now;
                return (
                  <tr
                    key={lead.id}
                    className={cn(
                      "border-b border-hairline last:border-b-0 hover:bg-cream/60",
                      isNew && "bg-sky-mist/40",
                    )}
                  >
                    <td className="px-4 py-2.5">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="text-sky underline underline-offset-2 [outline-offset:-2px]"
                      >
                        {lead.id}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className="text-graphite">{formatLeadDate(lead.createdAt)}</span>
                      {isNew ? (
                        <span className="block text-caption text-sky">
                          ждёт {waitingFor(lead.createdAt, now)}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-4 py-2.5">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className={cn(
                          "text-ink hover:underline [outline-offset:-2px]",
                          isNew && "font-medium",
                        )}
                      >
                        {lead.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <a href={`tel:${lead.phone}`} className="text-ink hover:underline">
                        {prettyPhone(lead.phone)}
                      </a>
                    </td>
                    <td className="px-4 py-2.5 text-ink">{serviceTitle(lead.service)}</td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      {lead.callbackAt && open ? (
                        <span className={overdue ? "text-alert" : "text-ink"}>
                          {overdue ? "Просрочен · " : ""}
                          {formatLeadDate(lead.callbackAt)}
                        </span>
                      ) : (
                        <span className="text-graphite">—</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      {/* key — чтобы после автообновления выбор показал новый статус. */}
                      <StatusSelect key={lead.status} id={lead.id} status={lead.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {page > 1 || hasMore ? (
        <div className="flex gap-3">
          {page > 1 ? (
            <Link href={href({ page: page - 1 })} className={ghostButtonClass}>
              ← Новее
            </Link>
          ) : null}
          {hasMore ? (
            <Link href={href({ page: page + 1 })} className={ghostButtonClass}>
              Старее →
            </Link>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
