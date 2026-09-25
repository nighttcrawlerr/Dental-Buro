import Link from "next/link";
import { ArrowGlyph, arrowSurfaceClasses } from "@/components/ui/arrow-button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ServicesGrid } from "@/components/services/services-grid";
import { services } from "@/content/site";
import { cn } from "@/lib/cn";

/** Каталог направлений на главной. */
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

        {/* Сетка появляется целиком, а не по карточке. Карточки на линиях
            стоят вплотную: пока одна уже на месте, а соседняя ещё въезжает,
            в щель между ними видно фон, и ряд выглядит кривым. */}
        <ServicesGrid
          className="reveal"
          items={services.map((service, index) => ({ service, number: index + 1 }))}
        />

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
