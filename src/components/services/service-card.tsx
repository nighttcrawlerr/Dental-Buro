import Link from "next/link";
import { ArrowGlyph, arrowSurfaceClasses } from "@/components/ui/arrow-button";
import type { Service } from "@/content/site";
import { cn } from "@/lib/cn";
import { formatPriceFrom } from "@/lib/format";

/**
 * Карточка направления — на главной и в каталоге.
 *
 * Карточка целиком — одна ссылка, а стрелка внутри декоративная. Иначе внутри
 * карточки оказываются две ссылки на один адрес: клавиатура проходит их
 * дважды, а скринридер зачитывает дубль.
 *
 * При наведении карточка инвертируется целиком — приём с сайта-образца, там
 * так ведут себя строки списков. Инвертируется вся карточка, а не только фон:
 * иначе тёмно-серый текст останется на тёмном фоне и пропадёт.
 *
 * Ставится в сетку на зазоре 1px поверх цвета линии, поэтому своих рамок нет.
 */
export function ServiceCard({ service, number }: { service: Service; number: number }) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group flex h-full flex-col gap-6 bg-paper p-8 transition-colors duration-300 hover:bg-espresso lg:p-10"
    >
      <span className="label-mono text-graphite transition-colors duration-300 group-hover:text-stone">
        {String(number).padStart(2, "0")}
      </span>

      <span className="font-display text-heading-sm text-ink transition-colors duration-300 group-hover:text-cream">
        {service.title}
      </span>

      <span className="flex-1 text-graphite transition-colors duration-300 group-hover:text-stone">
        {service.summary}
      </span>

      <span className="flex items-center justify-between gap-4 border-t border-hairline pt-6 transition-colors duration-300 group-hover:border-hairline-dark">
        <span className="label-mono text-ink transition-colors duration-300 group-hover:text-cream">
          {formatPriceFrom(service.priceFrom)}
        </span>
        <span
          className={cn(arrowSurfaceClasses(), "group-hover:bg-sky-pale group-hover:text-sky-deep")}
        >
          <ArrowGlyph />
        </span>
      </span>
    </Link>
  );
}
