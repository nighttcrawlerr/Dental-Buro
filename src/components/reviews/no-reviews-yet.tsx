import { ArrowGlyph } from "@/components/ui/arrow-button";
import { clinic } from "@/content/site";

/** Пока отзывов нет — честно говорим почему и зовём оставить первый. */
export function NoReviewsYet() {
  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <p className="text-body-lg text-graphite">
        Клиника только открылась, и отзывов пока нет. Будем благодарны, если после приёма вы
        расскажете о нём на Яндекс Картах — там мы не можем ничего удалить или отредактировать.
      </p>
      <a
        href={clinic.yandexMaps}
        target="_blank"
        rel="noopener noreferrer"
        className="label-mono inline-flex items-center gap-3 self-start text-ink"
      >
        Оставить отзыв на Яндекс Картах
        <span className="sr-only"> (откроется в новой вкладке)</span>
        <ArrowGlyph direction="up-right" />
      </a>
    </div>
  );
}
