import Link from "next/link";

/**
 * 404 внутри раздела заявок — своя, без оформления сайта. Корневая 404
 * подключает шапку, подвал и Метрику, а их в разделе с персональными
 * данными быть не должно даже на странице ошибки.
 */
export default function AdminNotFound() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-display text-heading-lg text-ink">Заявка не найдена</h1>
      <p className="text-graphite">Возможно, её уже удалили.</p>
      <Link href="/admin/leads" className="label-mono text-ink underline">
        ← Все заявки
      </Link>
    </div>
  );
}
