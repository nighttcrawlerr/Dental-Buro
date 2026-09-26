import { SiteLeadForm } from "@/components/lead/site-lead-form";
import { LegalDetails } from "@/components/legal/legal-details";
import { ArrowGlyph } from "@/components/ui/arrow-button";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PhotoPlaceholder } from "@/components/ui/photo-placeholder";
import { Reveal } from "@/components/ui/reveal";
import { RevealWords } from "@/components/ui/reveal-words";
import { SectionHeading } from "@/components/ui/section-heading";
import { clinic, directions } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Контакты",
  description:
    `Адрес, телефон и часы работы клиники Dental Buro. ${clinic.address}. ${clinic.schedule}.`,
  path: "/contacts",
});

/**
 * Контакты.
 *
 * Сюда ведут все кнопки «Записаться», если на странице не загрузились
 * скрипты, — поэтому форма здесь не в конце, а сразу за адресом, и у неё
 * якорь #booking.
 *
 * Карта пока заглушка. Встроенная Яндекс Карта ставит свои cookie, и вместе
 * с ней понадобится плашка согласия (шаг 5.7). Ссылка «Открыть в Яндекс
 * Картах» работает уже сейчас: она ищет по адресу и не зависит от координат.
 */
export default function ContactsPage() {
  const mapUrl = `https://yandex.ru/maps/?text=${encodeURIComponent(`${clinic.name}, ${clinic.address}`)}`;

  return (
    <>
      {/* ---- Адрес и связь --------------------------------------------- */}
      <section className="bg-cream">
        <Container className="grid gap-14 py-20 lg:grid-cols-2 lg:gap-20 lg:py-28">
          <div className="flex flex-col gap-10">
            <h1 className="font-display text-display-xl text-balance text-ink">
              <RevealWords text="Контакты." trigger="load" />
            </h1>

            <Reveal trigger="load" index={2} className="flex flex-col gap-10">
              <a
                href={clinic.phoneHref}
                className="font-display text-heading-lg text-ink transition-opacity hover:opacity-70"
              >
                {clinic.phone}
              </a>

              <dl className="flex flex-col">
                {[
                  ["Адрес", clinic.address],
                  ["Часы работы", clinic.schedule],
                  ["Почта", clinic.email],
                ].map(([term, value]) => (
                  <div
                    key={term}
                    className="grid gap-1 border-t border-hairline py-4 last:border-b sm:grid-cols-[10rem_1fr] sm:gap-6"
                  >
                    <dt className="label-mono pt-1 text-graphite">{term}</dt>
                    <dd className="text-body-lg text-ink">
                      {term === "Почта" ? (
                        <a href={`mailto:${value}`} className="underline-offset-4 hover:underline">
                          {value}
                        </a>
                      ) : (
                        value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="flex flex-wrap gap-3">
                <Button href={clinic.telegram} variant="ghost">
                  Telegram
                </Button>
                <Button href={clinic.whatsapp} variant="ghost">
                  WhatsApp
                </Button>
              </div>
            </Reveal>
          </div>

          <Reveal trigger="load" index={3} className="flex flex-col gap-5">
            <PhotoPlaceholder label="Карта проезда" ratio="square" className="w-full" />
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group label-mono inline-flex items-center gap-3 self-start text-ink"
            >
              Открыть в Яндекс Картах
              <span className="sr-only"> (откроется в новой вкладке)</span>
              <ArrowGlyph direction="up-right" />
            </a>
          </Reveal>
        </Container>
      </section>

      {/* ---- Запись ---------------------------------------------------- */}
      <section id="booking" className="scroll-mt-20 bg-espresso">
        <Container className="grid gap-12 py-20 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-20 lg:py-28">
          <div className="flex flex-col gap-6">
            <h2 className="font-display text-heading-lg text-balance text-cream">
              <RevealWords text="Запись на приём" />
            </h2>
            <p className="text-body-lg text-stone">
              Оставьте телефон — администратор перезвонит, ответит на вопросы и подберёт время.
            </p>
          </div>
          <SiteLeadForm surface="dark" />
        </Container>
      </section>

      {/* ---- Как добраться --------------------------------------------- */}
      <section className="bg-cream">
        <Container className="flex flex-col gap-14 py-20 lg:gap-20 lg:py-28">
          <SectionHeading className="reveal" title="Как добраться" />
          <ul className="grid gap-x-10 gap-y-12 md:grid-cols-3">
            {directions.map((d, index) => (
              <Reveal
                as="li"
                key={d.title}
                index={index}
                className="flex flex-col gap-4 border-t border-hairline pt-6"
              >
                <h3 className="font-display text-heading-sm text-ink">{d.title}</h3>
                <p className="text-graphite">{d.text}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* ---- Реквизиты ------------------------------------------------- */}
      <section className="border-t border-hairline bg-cream">
        <Container className="grid gap-12 py-20 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-20 lg:py-28">
          <SectionHeading className="reveal" title="Реквизиты" />
          <div className="reveal">
            <LegalDetails />
          </div>
        </Container>
      </section>
    </>
  );
}
