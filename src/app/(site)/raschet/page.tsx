import Link from "next/link";
import { Quiz } from "@/components/quiz/quiz";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { RevealWords } from "@/components/ui/reveal-words";
import { assertEstimateItems } from "@/content/estimate";
import { pricesUpdatedAt } from "@/content/prices";
import { pageMetadata } from "@/lib/metadata";

// Страница статическая и собирается при сборке: если при замене прайса
// потерялась позиция, которую использует расчёт, сборка упадёт здесь.
assertEstimateItems();

export const metadata = pageMetadata({
  title: "Расчёт стоимости лечения",
  description:
    "Узнайте, сколько будет стоить лечение в Dental Buro: выберите, что хотите решить, отметьте зубы на схеме — и получите расчёт по прайсу с разбивкой.",
  path: "/raschet",
});

/**
 * Расчёт стоимости. Отвечает на главный страх пациента — неизвестную цену —
 * до звонка в клинику. Сам квиз — в src/components/quiz, состав лечения — в
 * src/content/estimate.ts, суммы — из прайса.
 */
export default function EstimatePage() {
  return (
    <section className="bg-cream">
      <Container className="flex flex-col gap-14 py-20 lg:gap-20 lg:py-28">
        <div className="flex max-w-3xl flex-col gap-8">
          <h1 className="font-display text-display-xl text-balance text-ink">
            <RevealWords text="Сколько будет стоить." trigger="load" />
          </h1>
          <Reveal trigger="load" index={2} className="flex flex-col gap-6">
            <p className="max-w-2xl text-body-lg text-graphite">
              Три вопроса — и расчёт по нашему прайсу с разбивкой: что входит и сколько стоит
              каждая часть. Без звонка и без телефона, пока вы сами не решите записаться.
            </p>
            <p className="label-mono text-graphite">
              Цены актуальны на {pricesUpdatedAt}. Не является публичной офертой.
            </p>
          </Reveal>
        </div>

        <Reveal trigger="load" index={3}>
          <noscript>
            <p className="text-graphite">
              Для расчёта нужен JavaScript. Все цены есть в{" "}
              <Link href="/prices" className="text-ink underline underline-offset-2">
                прейскуранте
              </Link>
              .
            </p>
          </noscript>
          <Quiz />
        </Reveal>
      </Container>
    </section>
  );
}
