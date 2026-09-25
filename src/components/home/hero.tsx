import { BookButton } from "@/components/lead/book-button";
import { Button } from "@/components/ui/button";
import { HeroMedia } from "@/components/home/hero-media";
import { RevealWords } from "@/components/ui/reveal-words";
import { Reveal } from "@/components/ui/reveal";
import { Container } from "@/components/ui/container";
import { facts } from "@/content/site";

/**
 * Первый экран.
 *
 * Тёмная канва на эспрессо, заголовок в Cormorant на всю доступную ширину.
 * Между заголовком и остальным намеренно много воздуха — в дизайн-системе это
 * главный приём первого экрана, сжатие убивает всю интонацию.
 *
 * Заголовок заканчивается точкой: система ставит точку в конце дисплейных
 * строк, это придаёт им утвердительность.
 */
export function Hero() {
  return (
    <section className="hero-panel relative isolate bg-espresso">
      <HeroMedia />

      <Container className="relative flex flex-col gap-16 py-20 lg:gap-28 lg:py-32">
        <div className="flex flex-col gap-10">
          <h1 className="font-display text-hero max-w-5xl text-balance text-cream">
            <RevealWords text="Стоматология, которой не боятся." trigger="load" />
          </h1>

          <Reveal trigger="load" index={3} className="flex max-w-xl flex-col gap-8">
            <p className="text-body-lg text-stone">
              План лечения с фиксированной стоимостью — до начала работ. Цифровой протокол, своя
              зуботехническая лаборатория и наблюдение после лечения, а не закрытый случай.
            </p>

            <div className="flex flex-wrap gap-3">
              <BookButton surface="dark">Записаться на приём</BookButton>
              <Button surface="dark" variant="ghost" href="/prices">
                Смотреть цены
              </Button>
            </div>
          </Reveal>
        </div>

        <dl className="grid grid-cols-2 gap-x-8 gap-y-10 border-t border-hairline-dark pt-10 lg:grid-cols-4">
          {facts.map((fact, index) => (
            <Reveal
              key={fact.label}
              index={index + 4}
              trigger="load"
              className="flex flex-col gap-2"
            >
              <dt className="sr-only">{fact.label}</dt>
              <dd className="flex flex-col gap-2">
                <span className="font-display text-heading-lg text-cream">{fact.value}</span>
                <span className="label-mono text-stone">{fact.label}</span>
              </dd>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
