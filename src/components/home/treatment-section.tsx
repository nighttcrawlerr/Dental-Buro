import { Container } from "@/components/ui/container";
import { SectionCounter } from "@/components/ui/section-counter";
import { RevealWords } from "@/components/ui/reveal-words";
import { treatmentSteps } from "@/content/site";

/**
 * Как проходит лечение.
 *
 * Самый недооценённый блок на сайте клиники. Пациент боится не боли, а того,
 * что сумма вырастет по ходу, а его никто не предупредит. Здесь показан
 * порядок, в котором это исключено: план и смета появляются раньше лечения.
 *
 * Раскладка залипающая: заголовок стоит на месте, шаги проходят мимо него.
 * Пока читаешь четвёртый шаг, на экране всё ещё видно, о чём раздел, — и
 * именно в этом месте на экране действительно что-то происходит, а не просто
 * проматывается.
 *
 * Слева у каждого шага прочерчивается линия по мере прокрутки. Я сознательно
 * не стал приглушать текст неактивных шагов, хотя так делают чаще: если
 * человек остановится между шагами, он упрётся в нечитаемый серый абзац.
 * Двигается линия, текст остаётся в полную силу.
 *
 * Список нумерованный не только визуально — это ol, потому что порядок шагов
 * несёт смысл и должен читаться скринридером как последовательность.
 */
export function TreatmentSection() {
  return (
    <section className="bg-espresso">
      <Container className="grid gap-14 py-20 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-24 lg:py-28">
        <div className="flex flex-col gap-6 lg:sticky lg:top-28 lg:self-start">
          <SectionCounter current={4} total={6} surface="dark" />
          <h2 className="font-display text-heading-lg text-balance text-cream">
            <RevealWords text="Как проходит лечение" />
          </h2>
          <p className="text-body-lg text-stone">
            Четыре шага. Сумма фиксируется на втором и дальше не меняется без вашего согласия.
          </p>
        </div>

        <ol className="flex flex-col gap-14 lg:gap-20">
          {treatmentSteps.map((step, index) => (
            <li
              key={step.number}
              className="reveal-item relative flex flex-col gap-4 pl-8"
              style={{ "--i": index } as React.CSSProperties}
            >
              {/* Линия слева прочерчивается сверху вниз, пока шаг проходит экран. */}
              <span
                aria-hidden="true"
                className="step-rule absolute top-1 bottom-1 left-0 w-px origin-top bg-sky-pale"
              />

              <span className="label-mono text-sky-pale">{step.number}</span>
              <h3 className="font-display text-heading-sm text-cream">{step.title}</h3>
              <p className="max-w-xl text-body-lg text-stone">{step.text}</p>
              <span className="label-mono text-cream/60">{step.duration}</span>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
