import Link from "next/link";
import { ArrowGlyph, arrowSurfaceClasses } from "@/components/ui/arrow-button";
import { ReviewCard } from "@/components/reviews/review-card";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { reviews } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * Отзывы.
 *
 * Карточки на тёплой альтернативной поверхности, чтобы секция отличалась от
 * соседней светлой полосы без разделительной линии.
 *
 * Текст отзыва — blockquote с указанием автора в figcaption: это цитата
 * реального человека, и разметка должна это отражать, а не изображать цитату
 * кавычками в тексте.
 */
export function ReviewsSection() {
  return (
    <section className="bg-cream">
      <Container className="flex flex-col gap-14 pb-20 lg:gap-20 lg:pb-28">
        <SectionHeading
          className="reveal"
          counter={{ current: 6, total: 6 }}
          title="Отзывы"
          description="Собраны после лечения и с Яндекс.Карт. Мы не удаляем негативные — на них отвечает главный врач."
        />

        <ul className="grid gap-6 md:grid-cols-3">
          {reviews.slice(0, 3).map((review, index) => (
            <li
              key={review.author}
              className="reveal-item"
              style={{ "--i": index } as React.CSSProperties}
            >
              <ReviewCard review={review} />
            </li>
          ))}
        </ul>

        <Link
          href="/reviews"
          className="group inline-flex items-center gap-4 self-start transition-opacity hover:opacity-80"
        >
          <span className={cn(arrowSurfaceClasses(), "group-hover:bg-sky-deep")}>
            <ArrowGlyph />
          </span>
          <span className="label-mono text-ink">Все отзывы</span>
        </Link>
      </Container>
    </section>
  );
}
