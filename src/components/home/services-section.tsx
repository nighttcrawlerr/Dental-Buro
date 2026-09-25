import Link from "next/link";
import { ArrowGlyph, arrowSurfaceClasses } from "@/components/ui/arrow-button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { services } from "@/content/site";
import { formatPriceFrom } from "@/lib/format";
import { cn } from "@/lib/cn";

/**
 * Каталог направлений на главной.
 *
 * Карточка целиком — одна ссылка, а стрелка внутри декоративная. Иначе внутри
 * карточки оказываются две ссылки на один адрес: клавиатура проходит их
 * дважды, а скринридер зачитывает дубль.
 *
 * Сетка собрана на зазоре в 1px поверх цвета линии — так разделители между
 * карточками получаются ровно там, где нужно, без бордюров на каждой ячейке.
 *
 * При наведении карточка инвертируется целиком — приём с сайта-образца, там
 * так ведут себя строки списков. Инвертируется вся карточка, а не только фон:
 * иначе тёмно-серый текст останется на тёмном фоне и пропадёт.
 */
export function ServicesSection() {
  return (
    <section className="bg-cream">
      <Container className="flex flex-col gap-14 py-20 lg:gap-20 lg:py-28">
        <SectionHeading
          className="reveal"
          counter={{ current: 1, total: 6 }}
          title="Направления"
          description="Полный цикл в одной клинике: от гигиены до полного протезирования. Диагностика и план лечения — до начала работ."
        />

        <ul className="grid gap-px overflow-hidden rounded-card bg-hairline md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <li
              key={service.slug}
              className="reveal-item bg-paper"
              style={{ "--i": index } as React.CSSProperties}
            >
              <Link
                href={`/services/${service.slug}`}
                className="group flex h-full flex-col gap-6 p-8 transition-colors duration-300 hover:bg-espresso lg:p-10"
              >
                <span className="label-mono text-graphite transition-colors duration-300 group-hover:text-stone">
                  {String(index + 1).padStart(2, "0")}
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
                    className={cn(
                      arrowSurfaceClasses(),
                      "group-hover:bg-sky-pale group-hover:text-sky-deep",
                    )}
                  >
                    <ArrowGlyph />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/services"
          className="group inline-flex items-center gap-4 self-start transition-opacity hover:opacity-80"
        >
          <span className={cn(arrowSurfaceClasses(), "group-hover:bg-sky-deep")}>
            <ArrowGlyph />
          </span>
          <span className="label-mono text-ink">Все направления и цены</span>
        </Link>
      </Container>
    </section>
  );
}
