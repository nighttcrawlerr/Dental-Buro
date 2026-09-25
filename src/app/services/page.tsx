import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/components/home/cta-section";
import { ServicesCatalog } from "@/components/services/services-catalog";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { RevealWords } from "@/components/ui/reveal-words";

export const metadata: Metadata = {
  title: "Услуги и цены",
  description:
    "Имплантация, ортодонтия, эстетическая реставрация, хирургия, терапия, гигиена и детская стоматология в Dental Buro. Цены «от» и план лечения до начала работ.",
};

/**
 * Каталог услуг.
 *
 * Страница-развилка: отсюда человек уходит на страницу своей услуги. Поэтому
 * здесь нет подробностей — только направление, короткое описание и цена «от»,
 * по которой можно понять, по карману ли вообще.
 *
 * Заканчивается тем же призывом, что и главная: кто не нашёл свою услугу,
 * должен иметь возможность просто записаться на осмотр.
 */
export default function ServicesPage() {
  return (
    <>
      <section className="bg-cream">
        <Container className="flex flex-col gap-14 py-20 lg:gap-20 lg:py-28">
          <div className="flex max-w-3xl flex-col gap-8">
            <h1 className="font-display text-display-xl text-balance text-ink">
              <RevealWords text="Услуги и цены." trigger="load" />
            </h1>
            <Reveal trigger="load" index={2}>
              <p className="max-w-2xl text-body-lg text-graphite">
                Полный цикл в одной клинике — от гигиены до полного протезирования. Каждое лечение
                начинается с диагностики и плана с фиксированной стоимостью.
              </p>
            </Reveal>
          </div>

          <Reveal trigger="load" index={3}>
            <ServicesCatalog />
          </Reveal>

          <p className="max-w-2xl text-graphite">
            Цены указаны «от»: точная стоимость зависит от клинической ситуации и фиксируется в плане
            лечения после осмотра. Подробный прейскурант — на странице{" "}
            <Link href="/prices" className="text-ink underline underline-offset-2 hover:text-sky">
              цен
            </Link>
            .
          </p>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
