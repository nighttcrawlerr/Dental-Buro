import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PhotoPlaceholder } from "@/components/ui/photo-placeholder";
import { SectionHeading } from "@/components/ui/section-heading";
import { ArrowGlyph, arrowSurfaceClasses } from "@/components/ui/arrow-button";
import { doctors } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * Врачи.
 *
 * Для медицинской организации это не блок «о команде», а обязательные
 * сведения: закон требует публиковать ФИО, специальность, образование и стаж.
 * Здесь показываем короткую карточку, полные сведения — на странице врача.
 */
export function DoctorsSection() {
  return (
    <section className="bg-cream">
      <Container className="flex flex-col gap-14 py-20 lg:gap-20 lg:py-28">
        <SectionHeading
          counter={{ current: 3, total: 6 }}
          title="Врачи"
          description="Каждый врач ведёт своё направление и остаётся с вами до конца лечения — вас не передают из рук в руки."
        />

        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {doctors.map((doctor) => (
            <li key={doctor.slug}>
              <Link href={`/doctors/${doctor.slug}`} className="group flex flex-col gap-5">
                <PhotoPlaceholder label="Портрет врача" />

                <span className="flex flex-col gap-2">
                  <span className="font-display text-subheading text-ink">{doctor.name}</span>
                  <span className="label-mono text-sky">{doctor.role}</span>
                  <span className="label-mono text-graphite">{doctor.experience}</span>
                </span>

                <span className="text-graphite">{doctor.focus}</span>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/doctors"
          className="group inline-flex items-center gap-4 self-start transition-opacity hover:opacity-80"
        >
          <span className={cn(arrowSurfaceClasses(), "group-hover:bg-sky-deep")}>
            <ArrowGlyph />
          </span>
          <span className="label-mono text-ink">Все врачи клиники</span>
        </Link>
      </Container>
    </section>
  );
}
