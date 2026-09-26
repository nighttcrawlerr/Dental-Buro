import { BookButton } from "@/components/lead/book-button";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PhotoPlaceholder } from "@/components/ui/photo-placeholder";
import { RevealWords } from "@/components/ui/reveal-words";
import { clinic } from "@/content/site";

/**
 * Финальный призыв и контакты.
 *
 * Заканчивает страницу тем же тёмным тоном, с которого она началась, —
 * страница закрывается, а не обрывается.
 *
 * Здесь кнопка, а не форма: секция стоит в конце многих страниц, и форма на
 * каждой из них удваивала бы длину. Кнопка открывает окно записи; там, где
 * форма нужна прямо на странице (услуга, врач, контакты), она своя.
 */
export function CtaSection() {
  return (
    <section className="bg-espresso">
      <Container className="flex flex-col gap-14 py-20 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="flex flex-col gap-8">
            <h2 className="font-display text-display text-balance text-cream">
              <RevealWords text="Начнём с осмотра." />
            </h2>
            <p className="max-w-md text-body-lg text-stone">
              На первом визите мы только смотрим и считаем. Вы уходите с планом лечения и точной
              суммой — и решаете уже дома, без давления в кресле.
            </p>

            <div className="flex flex-wrap gap-3">
              <BookButton surface="dark">Записаться на приём</BookButton>
              <Button surface="dark" variant="ghost" href={clinic.phoneHref}>
                {clinic.phone}
              </Button>
            </div>

            <dl className="flex flex-col gap-5 border-t border-hairline-dark pt-8">
              <div className="flex flex-col gap-1">
                <dt className="label-mono text-cream/60">Адрес</dt>
                <dd className="text-cream">{clinic.address}</dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="label-mono text-cream/60">Часы работы</dt>
                <dd className="text-cream">{clinic.schedule}</dd>
              </div>
            </dl>
          </div>

          <PhotoPlaceholder
            label="Карта проезда"
            ratio="landscape"
            className="h-full w-full border-hairline-dark bg-espresso"
          />
        </div>
      </Container>
    </section>
  );
}
