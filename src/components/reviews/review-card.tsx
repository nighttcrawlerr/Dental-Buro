import { Tag } from "@/components/ui/tag";
import type { Review } from "@/content/site";

/** Отзыв пациента: услуга, дата, текст и подпись. */
export function ReviewCard({ review }: { review: Review }) {
  return (
    <figure className="flex h-full flex-col gap-5 rounded-card bg-linen p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tag>{review.service}</Tag>
        <span className="label-mono text-graphite">{review.date}</span>
      </div>

      <blockquote className="flex-1 text-ink">{review.text}</blockquote>

      <figcaption className="label-mono border-t border-stone pt-5 text-graphite">
        {review.author}
      </figcaption>
    </figure>
  );
}
