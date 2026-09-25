import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { treatmentSteps } from "@/content/site";

/**
 * Как проходит лечение.
 *
 * Самый недооценённый блок на сайте клиники. Пациент боится не боли, а того,
 * что сумма вырастет по ходу, а его никто не предупредит. Здесь показан
 * порядок, в котором это исключено: план и смета появляются раньше лечения.
 *
 * Список нумерованный не только визуально — это ol, потому что порядок шагов
 * несёт смысл и должен читаться скринридером как последовательность.
 */
export function TreatmentSection() {
  return (
    <section className="bg-espresso">
      <Container className="flex flex-col gap-14 py-20 lg:gap-20 lg:py-28">
        <SectionHeading
          surface="dark"
          counter={{ current: 4, total: 6 }}
          title="Как проходит лечение"
          description="Четыре шага. Сумма фиксируется на втором и дальше не меняется без вашего согласия."
        />

        <ol className="grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
          {treatmentSteps.map((step) => (
            <li key={step.number} className="flex flex-col gap-4 border-t border-hairline-dark pt-6">
              <span className="label-mono text-sky-pale">{step.number}</span>
              <h3 className="font-display text-subheading text-cream">{step.title}</h3>
              <p className="flex-1 text-stone">{step.text}</p>
              <span className="label-mono text-cream/60">{step.duration}</span>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
