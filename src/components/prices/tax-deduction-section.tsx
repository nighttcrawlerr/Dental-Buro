import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { taxDeductionPoints, taxDeductionSource } from "@/content/tax-deduction";

/**
 * Налоговый вычет — на странице цен, сразу под прейскурантом: человек
 * прикидывает сумму, и тут же видит, что часть вернётся. Для имплантации и
 * ортодонтии за сотни тысяч это сильный довод.
 *
 * Холодная полоса, как «Почему Dental Buro» на главной: отделяет блок от
 * таблицы без линии. id — для ссылки из квиза расчёта стоимости.
 */
export function TaxDeductionSection() {
  return (
    <section id="vychet" className="grain scroll-mt-20 bg-sky">
      <Container className="flex flex-col gap-14 py-20 lg:gap-20 lg:py-28">
        <SectionHeading
          className="reveal"
          surface="sky"
          title="Налоговый вычет"
          description="Часть расходов на лечение вернёт государство — если у вас есть официальный доход."
        />

        <ul className="grid gap-x-10 gap-y-12 md:grid-cols-2">
          {taxDeductionPoints.map((point, index) => (
            <li
              key={point.title}
              className="reveal-item flex flex-col gap-4 border-t border-cream/25 pt-6"
              style={{ "--i": index } as React.CSSProperties}
            >
              <span className="label-mono text-cream/85">{String(index + 1).padStart(2, "0")}</span>
              <h3 className="font-display text-subheading text-cream">{point.title}</h3>
              <p className="text-cream/85">{point.text}</p>
            </li>
          ))}
        </ul>

        <p className="label-mono max-w-3xl text-cream/85">
          Общие правила по статье 219 Налогового кодекса. Подробнее —{" "}
          <a
            href={taxDeductionSource}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-cream"
          >
            на сайте ФНС
            <span className="sr-only"> (откроется в новой вкладке)</span>
          </a>
          .
        </p>
      </Container>
    </section>
  );
}
