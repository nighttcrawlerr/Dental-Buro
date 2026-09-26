import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import {
  doctorName,
  formatLeadDate,
  prettyPhone,
  serviceTitle,
  visitTimeLabel,
} from "@/lib/admin-format";
import { cn } from "@/lib/cn";
import { getLead, leadStatuses } from "@/lib/leads-repo";
import { removeLead, updateStatus } from "../../actions";
import { DeleteButton } from "./delete-button";

/** Карточка заявки: всё, что прислал человек, и смена статуса. */
export default async function LeadPage({ params }: PageProps<"/admin/leads/[id]">) {
  await requireAdmin();

  const { id } = await params;
  const lead = Number.isInteger(Number(id)) ? await getLead(Number(id)) : null;
  if (!lead) notFound();

  const doctor = doctorName(lead.doctor);
  const utm = Object.entries(lead.utm);
  const rows: [string, React.ReactNode][] = [
    ["Получена", formatLeadDate(lead.createdAt)],
    ["Имя", lead.name],
    [
      "Телефон",
      <a key="tel" href={`tel:${lead.phone}`} className="text-sky underline underline-offset-2">
        {prettyPhone(lead.phone)}
      </a>,
    ],
    ["Услуга", serviceTitle(lead.service)],
    ["Удобное время", visitTimeLabel(lead.visitTime)],
    ...(doctor ? [["Врач", doctor] as [string, string]] : []),
    ...(lead.comment ? [["Комментарий", lead.comment] as [string, string]] : []),
    ...(lead.page ? [["Страница", new URL(lead.page).pathname] as [string, string]] : []),
    ...(utm.length ? [["UTM", utm.map(([k, v]) => `${k}: ${v}`).join(", ")] as [string, string]] : []),
  ];

  return (
    <div className="flex max-w-3xl flex-col gap-10">
      <div className="flex flex-col gap-3">
        <Link href="/admin/leads" className="label-mono text-graphite hover:text-ink">
          ← Все заявки
        </Link>
        <h1 className="font-display text-heading-lg text-ink">Заявка №{lead.id}</h1>
      </div>

      <dl className="flex flex-col rounded-card border border-hairline bg-paper px-6">
        {rows.map(([term, value]) => (
          <div
            key={term}
            className="grid gap-1 border-b border-hairline py-4 last:border-b-0 sm:grid-cols-[10rem_1fr] sm:gap-6"
          >
            <dt className="label-mono pt-1 text-graphite">{term}</dt>
            <dd className="whitespace-pre-wrap text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <section className="flex flex-col gap-4">
        <h2 className="label-mono text-graphite">Статус</h2>
        <div className="flex flex-wrap gap-2">
          {leadStatuses.map((s) => {
            const active = s.value === lead.status;
            return (
              <form key={s.value} action={updateStatus}>
                <input type="hidden" name="id" value={lead.id} />
                <input type="hidden" name="status" value={s.value} />
                <button
                  type="submit"
                  aria-pressed={active}
                  className={cn(
                    "label-mono min-h-11 cursor-pointer rounded-full border px-4",
                    active ? "border-ink bg-ink text-cream" : "border-hairline text-graphite hover:border-graphite",
                  )}
                >
                  {s.label}
                </button>
              </form>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3 border-t border-hairline pt-8">
        <p className="max-w-xl text-caption leading-normal tracking-normal text-graphite">
          Удаляйте заявку, если человек попросил удалить свои данные или это спам. По закону о
          персональных данных на просьбу об удалении нужно ответить в течение 10 рабочих дней.
        </p>
        <form action={removeLead}>
          <input type="hidden" name="id" value={lead.id} />
          <DeleteButton />
        </form>
      </section>
    </div>
  );
}
