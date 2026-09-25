import { Container } from "@/components/ui/container";
import { PhotoPlaceholder } from "@/components/ui/photo-placeholder";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tag } from "@/components/ui/tag";
import { works } from "@/content/site";

/**
 * Работы «до/после».
 *
 * Пока это каркас с заглушками. Шторку-слайдер, которая была в плане, делать
 * рано: она имеет смысл только на реальной паре снимков, снятых в одном
 * ракурсе и при одном свете, иначе показывает не результат лечения, а разницу
 * в освещении.
 *
 * Отдельно от фото понадобится письменное согласие пациента на публикацию —
 * без него снимки выкладывать нельзя.
 */
export function WorksSection() {
  return (
    <section className="bg-cream">
      <Container className="flex flex-col gap-14 py-20 lg:gap-20 lg:py-28">
        <SectionHeading
          className="reveal"
          counter={{ current: 5, total: 6 }}
          title="Работы"
          description="Снимки до и после лечения, снятые в одном ракурсе и при одном свете. Опубликованы с письменного согласия пациентов."
        />

        <ul className="grid gap-8 md:grid-cols-3">
          {works.map((work, index) => (
            <li
              key={work.slug}
              className="reveal-item flex flex-col gap-5 rounded-card bg-paper p-6"
              style={{ "--i": index } as React.CSSProperties}
            >
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <PhotoPlaceholder label="До" ratio="square" />
                  <span className="label-mono text-graphite">До</span>
                </div>
                <div className="flex flex-col gap-2">
                  <PhotoPlaceholder label="После" ratio="square" />
                  <span className="label-mono text-graphite">После</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Tag>{work.service}</Tag>
                <h3 className="font-display text-subheading text-ink">{work.title}</h3>
                <span className="label-mono text-graphite">Срок лечения: {work.duration}</span>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
