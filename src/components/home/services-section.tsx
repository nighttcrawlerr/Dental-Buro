import Link from "next/link";
import { ArrowGlyph, arrowSurfaceClasses } from "@/components/ui/arrow-button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServiceCard } from "@/components/services/service-card";
import { services } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * Каталог направлений на главной.
 *
 * Сетка собрана на зазоре в 1px поверх цвета линии — так разделители между
 * карточками получаются ровно там, где нужно, без бордюров на каждой ячейке.
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
              <ServiceCard service={service} number={index + 1} />
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
