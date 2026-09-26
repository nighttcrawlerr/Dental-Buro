import { CtaSection } from "@/components/home/cta-section";
import { PriceList } from "@/components/prices/price-list";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { RevealWords } from "@/components/ui/reveal-words";
import { pricesUpdatedAt } from "@/content/prices";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Цены",
  description:
    "Прейскурант стоматологической клиники Dental Buro: диагностика, имплантация, ортодонтия, эстетика, хирургия, терапия, гигиена и детская стоматология.",
  path: "/prices",
});

/**
 * Прейскурант. Публикация обязательна для медицинской организации, и это же
 * одна из самых посещаемых страниц: человек сверяет цены раньше, чем решает
 * записаться. Поэтому предупреждение о том, что итоговая сумма определяется
 * после осмотра, стоит над таблицей, а не под ней.
 */
export default function PricesPage() {
  return (
    <>
      <section className="bg-cream">
        <Container className="flex flex-col gap-14 py-20 lg:gap-20 lg:py-28">
          <div className="flex max-w-3xl flex-col gap-8">
            <h1 className="font-display text-display-xl text-balance text-ink">
              <RevealWords text="Цены." trigger="load" />
            </h1>
            <Reveal trigger="load" index={2} className="flex flex-col gap-6">
              <p className="max-w-2xl text-body-lg text-graphite">
                Точная стоимость лечения определяется после осмотра и фиксируется в плане лечения.
                Если по ходу план меняется, мы согласуем это с вами отдельно.
              </p>
              <p className="label-mono text-graphite">
                Цены в рублях, актуальны на {pricesUpdatedAt}. Не является публичной офертой.
                Имеются противопоказания, необходима консультация специалиста.
              </p>
            </Reveal>
          </div>

          <Reveal trigger="load" index={3}>
            <PriceList />
          </Reveal>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
