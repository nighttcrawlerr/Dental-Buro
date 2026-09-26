import { DoctorCard } from "@/components/doctors/doctor-card";
import { CtaSection } from "@/components/home/cta-section";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { RevealWords } from "@/components/ui/reveal-words";
import { doctors } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Врачи",
  description:
    "Врачи клиники Dental Buro: имплантолог, ортодонт, терапевт, детский стоматолог. Образование, квалификация, стаж и стоимость консультации.",
  path: "/doctors",
});

/**
 * Список врачей. Короткие карточки; образование, квалификацию и цену
 * консультации — всё, что требует закон, — показывает страница врача.
 */
export default function DoctorsPage() {
  return (
    <>
      <section className="bg-cream">
        <Container className="flex flex-col gap-14 py-20 lg:gap-20 lg:py-28">
          <div className="flex max-w-3xl flex-col gap-8">
            <h1 className="font-display text-display-xl text-balance text-ink">
              <RevealWords text="Врачи." trigger="load" />
            </h1>
            <Reveal trigger="load" index={2}>
              <p className="max-w-2xl text-body-lg text-graphite">
                Каждый врач ведёт своё направление и остаётся с вами до конца лечения — вас не
                передают из рук в руки. Сложные случаи разбираем вместе, до того как начать.
              </p>
            </Reveal>
          </div>

          <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {doctors.map((doctor, index) => (
              <Reveal as="li" key={doctor.slug} index={index}>
                <DoctorCard doctor={doctor} />
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
