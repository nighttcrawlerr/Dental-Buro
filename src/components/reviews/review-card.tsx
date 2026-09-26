import type { Review } from "@/content/site";

/**
 * Отзыв пациента: услуга, дата, текст и подпись.
 *
 * Карточка на linen, а graphite на нём даёт только 3.9:1 — мелким
 * моноширинным это не читается. Поэтому служебные подписи здесь espresso
 * (7.7:1), и метка услуги собрана на месте, а не из Tag, который красит
 * подпись в graphite.
 */
export function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="flex h-full flex-col gap-5 rounded-card bg-linen p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="size-1.5 rounded-full bg-sky" />
          <span className="label-mono text-espresso">{review.service}</span>
        </span>
        <span className="label-mono text-espresso">{review.date}</span>
      </div>

      <blockquote className="flex-1 text-ink">{review.text}</blockquote>

      <figcaption className="label-mono border-t border-stone pt-5 text-espresso">
        {review.author}
      </figcaption>
    </figure>
  );
}
