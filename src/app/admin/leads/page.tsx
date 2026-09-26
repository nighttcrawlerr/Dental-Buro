import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { formatLeadDate, prettyPhone, serviceTitle, visitTimeLabel } from "@/lib/admin-format";
import { cn } from "@/lib/cn";
import { isLeadStatus, leadStatuses, listLeads } from "@/lib/leads-repo";

/**
 * Список заявок, новые сверху. Фильтр по статусу — через адрес
 * (?status=new), чтобы вкладку «Новые» можно было держать открытой и
 * обновлять.
 */
export default async function LeadsPage({ searchParams }: PageProps<"/admin/leads">) {
  await requireAdmin();

  const params = await searchParams;
  const status = isLeadStatus(params.status) ? params.status : undefined;
  const page = Math.max(1, Number(params.page) || 1);
  const { leads, hasMore } = await listLeads({ status, page });

  const statusLabel = (v: string) => leadStatuses.find((s) => s.value === v)?.label ?? v;
  const filterHref = (s?: string) => (s ? `/admin/leads?status=${s}` : "/admin/leads");

  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-display text-heading-lg text-ink">Заявки</h1>

      <nav aria-label="Фильтр по статусу" className="flex flex-wrap gap-2">
        {[{ value: undefined, label: "Все" }, ...leadStatuses].map((s) => {
          const active = s.value === status;
          return (
            <Link
              key={s.label}
              href={filterHref(s.value)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "label-mono inline-flex min-h-11 items-center rounded-full border px-4",
                active ? "border-ink bg-ink text-cream" : "border-hairline text-graphite hover:border-graphite",
              )}
            >
              {s.label}
            </Link>
          );
        })}
      </nav>

      {leads.length === 0 ? (
        <p className="text-graphite">Заявок нет.</p>
      ) : (
        <div className="overflow-x-auto rounded-card border border-hairline bg-paper">
          <table className="w-full min-w-[44rem] border-collapse text-left">
            <thead>
              <tr className="border-b border-hairline">
                {["№", "Когда", "Имя", "Телефон", "Услуга", "Время", "Статус"].map((h) => (
                  <th key={h} scope="col" className="label-mono px-4 py-3 font-normal text-graphite">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  className={cn(
                    "border-b border-hairline last:border-b-0",
                    lead.status === "new" && "bg-cream",
                  )}
                >
                  <td className="px-4 py-3">
                    <Link href={`/admin/leads/${lead.id}`} className="text-sky underline underline-offset-2">
                      {lead.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-graphite">
                    {formatLeadDate(lead.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-ink">{lead.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <a href={`tel:${lead.phone}`} className="text-ink underline-offset-2 hover:underline">
                      {prettyPhone(lead.phone)}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-ink">{serviceTitle(lead.service)}</td>
                  <td className="px-4 py-3 text-graphite">{visitTimeLabel(lead.visitTime)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "label-mono",
                        lead.status === "new" ? "text-sky" : "text-graphite",
                      )}
                    >
                      {statusLabel(lead.status)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex gap-4">
        {page > 1 ? (
          <Link
            href={`${filterHref(status)}${status ? "&" : "?"}page=${page - 1}`}
            className="label-mono text-ink underline"
          >
            ← Новее
          </Link>
        ) : null}
        {hasMore ? (
          <Link
            href={`${filterHref(status)}${status ? "&" : "?"}page=${page + 1}`}
            className="label-mono text-ink underline"
          >
            Старее →
          </Link>
        ) : null}
      </div>
    </div>
  );
}
