import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { advantages } from "@/content/site";

/**
 * «Почему Dental Buro» — единственная холодная полоса на главной.
 *
 * Переход на Sky Silver сам работает разделителем: в дизайн-системе смена
 * поверхности заменяет линию, поэтому никакого бордюра между секциями нет.
 *
 * Содержание отвечает на главный страх пациента — непредсказуемость суммы и
 * ощущение, что с ним что-то делают, не объясняя.
 */
export function AdvantagesSection() {
  return (
    <section className="bg-sky">
      <Container className="flex flex-col gap-14 py-20 lg:gap-20 lg:py-28">
        <SectionHeading
          surface="sky"
          counter={{ current: 2, total: 4 }}
          title="Почему Dental Buro"
          description="Четыре вещи, из-за которых к нам возвращаются и приводят родителей и детей."
        />

        <ul className="grid gap-x-10 gap-y-12 md:grid-cols-2">
          {advantages.map((advantage) => (
            <li key={advantage.number} className="flex flex-col gap-4 border-t border-cream/25 pt-6">
              <span className="label-mono text-cream/70">{advantage.number}</span>
              <h3 className="font-display text-subheading text-cream">{advantage.title}</h3>
              <p className="text-cream/85">{advantage.text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
