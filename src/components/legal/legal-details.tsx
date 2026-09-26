import { clinic, legal } from "@/content/site";

/**
 * Реквизиты и лицензия списком «термин — значение». Публиковать их
 * обязательно; показываются на /about и /contacts.
 */
export function LegalDetails() {
  const rows: [string, string][] = [
    ["Организация", legal.fullName],
    ["ИНН", legal.inn],
    ["ОГРН", legal.ogrn],
    ["Юридический адрес", legal.legalAddress],
    ["Адрес клиники", clinic.address],
    ["Лицензия", `№ ${legal.license.number} от ${legal.license.date}, выдана ${legal.license.issuer}`],
    ["Режим работы", clinic.schedule],
  ];

  return (
    <dl className="flex flex-col">
      {rows.map(([term, value]) => (
        <div
          key={term}
          className="grid gap-1 border-t border-hairline py-4 last:border-b sm:grid-cols-[12rem_1fr] sm:gap-6"
        >
          <dt className="label-mono pt-1 text-graphite">{term}</dt>
          <dd className="text-ink">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
