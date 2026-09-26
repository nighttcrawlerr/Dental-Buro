import { AdvantagesSection } from "@/components/home/advantages-section";
import { CtaSection } from "@/components/home/cta-section";
import { DoctorsSection } from "@/components/home/doctors-section";
import { Hero } from "@/components/home/hero";
import { ReviewsSection } from "@/components/home/reviews-section";
import { ServicesSection } from "@/components/home/services-section";
import { TreatmentSection } from "@/components/home/treatment-section";
import { WorksSection } from "@/components/home/works-section";
import { pageMetadata } from "@/lib/metadata";

// Заголовок — из layout (title.default), здесь только canonical и превью.
export const metadata = pageMetadata({
  description:
    "Стоматологическая клиника Dental Buro: имплантация, ортодонтия, эстетическая реставрация. Цифровой протокол лечения и план до начала работ.",
  path: "/",
});

/**
 * Главная страница.
 *
 * Порядок секций — сценарий убеждения: обещание, чем можем помочь, почему нам
 * можно верить, кто будет лечить, как это устроено, что получилось у других,
 * что о нас говорят, и наконец — приглашение прийти.
 *
 * Полосы чередуются тёмная → светлая → холодная; смена поверхности работает
 * разделителем вместо линии. Заканчивается страница тем же тёмным тоном, с
 * которого началась.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <AdvantagesSection />
      <DoctorsSection />
      <TreatmentSection />
      <WorksSection />
      <ReviewsSection />
      <CtaSection />
    </>
  );
}
