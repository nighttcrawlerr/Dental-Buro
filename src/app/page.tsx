import { AdvantagesSection } from "@/components/home/advantages-section";
import { Hero } from "@/components/home/hero";
import { ServicesSection } from "@/components/home/services-section";

/**
 * Главная страница.
 *
 * Порядок секций — сценарий убеждения: сначала обещание, потом чем именно мы
 * можем помочь, потом почему нам можно верить. Полосы чередуются тёмная →
 * светлая → холодная, смена поверхности работает разделителем вместо линии.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <AdvantagesSection />
    </>
  );
}
