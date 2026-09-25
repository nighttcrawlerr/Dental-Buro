import Link from "next/link";
import { DoctorCard } from "@/components/doctors/doctor-card";
import { Container } from "@/components/ui/container";
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
 *
 * На телефоне карточки едут вбок лентой с прилипанием, как на сайте-образце.
 * Прокрутка нативная, без скриптов: работает с клавиатуры, с трекпада и с
 * пальца, и не ломает поиск по странице.
 */
export function DoctorsSection() {
  return (
    <section className="bg-cream">
      <Container className="flex flex-col gap-14 py-20 lg:gap-20 lg:py-28">
        <SectionHeading
          className="reveal"
          counter={{ current: 3, total: 6 }}
          title="Врачи"
          description="Каждый врач ведёт своё направление и остаётся с вами до конца лечения — вас не передают из рук в руки."
        />

        <ul className="-mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-8 sm:overflow-visible sm:px-0 lg:grid-cols-4">
          {doctors.map((doctor, index) => (
            <li
              key={doctor.slug}
              className="reveal-item w-[72%] shrink-0 snap-start sm:w-auto sm:shrink"
              style={{ "--i": index } as React.CSSProperties}
            >
              <DoctorCard doctor={doctor} />
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
