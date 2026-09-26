import { CtaSection } from "@/components/home/cta-section";
import { LegalDetails } from "@/components/legal/legal-details";
import { Container } from "@/components/ui/container";
import { PhotoPlaceholder } from "@/components/ui/photo-placeholder";
import { Reveal } from "@/components/ui/reveal";
import { RevealWords } from "@/components/ui/reveal-words";
import { SectionHeading } from "@/components/ui/section-heading";
import { documents, equipment, spaces, sterilization } from "@/content/about";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "О клинике",
  description:
    "Клиника Dental Buro: интерьер, оборудование, стерилизация инструментов, лицензия и документы.",
  path: "/about",
});

/**
 * О клинике.
 *
 * Страница отвечает на вопросы, которые пациент не задаёт вслух: где я
 * окажусь, чем меня будут лечить и чистые ли инструменты. Последний блок —
 * документы: лицензия и реквизиты, которые обязательно публиковать. На него
 * ведёт ссылка из подвала, поэтому у секции есть якорь #documents.
 *
 * Ритм полос как на главной: кремовая → холодная → тёмная → кремовая.
 */
export default function AboutPage() {
  return (
    <>
      {/* ---- Первый экран ---------------------------------------------- */}
      <section className="bg-cream">
        <Container className="flex flex-col gap-14 py-20 lg:gap-20 lg:py-28">
          <div className="flex max-w-3xl flex-col gap-8">
            <h1 className="font-display text-display-xl text-balance text-ink">
              <RevealWords text="О клинике." trigger="load" />
            </h1>
            <Reveal trigger="load" index={2}>
              <p className="max-w-2xl text-body-lg text-graphite">
                Мы строили клинику, в которую не страшно прийти. Тёплые материалы вместо кафеля,
                своя лаборатория вместо посредников и план лечения до первого укола.
              </p>
            </Reveal>
          </div>

          <PhotoPlaceholder label="Интерьер клиники" ratio="landscape" className="w-full lg:aspect-[21/9]" />
        </Container>
      </section>

      {/* ---- Пространство ---------------------------------------------- */}
      <section className="border-t border-hairline bg-cream">
        <Container className="flex flex-col gap-14 py-20 lg:gap-20 lg:py-28">
          <SectionHeading
            className="reveal"
            title="Пространство"
            description="Мрамор, дерево и мягкий свет. Всё, чтобы визит к стоматологу перестал ощущаться как визит в больницу."
          />
          <ul className="grid gap-x-8 gap-y-14 md:grid-cols-2">
            {spaces.map((space, index) => (
              <Reveal as="li" key={space.title} index={index} className="flex flex-col gap-5">
                <PhotoPlaceholder label={space.title} ratio="landscape" />
                <h3 className="font-display text-heading-sm text-ink">{space.title}</h3>
                <p className="max-w-lg text-graphite">{space.text}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* ---- Оборудование ---------------------------------------------- */}
      <section className="bg-sky">
        <Container className="flex flex-col gap-14 py-20 lg:gap-20 lg:py-28">
          <SectionHeading
            className="reveal"
            surface="sky"
            title="Оборудование"
            description="Цифровой протокол от диагностики до коронки: меньше решений на глаз, меньше переделок."
          />
          <ul className="grid gap-x-10 gap-y-12 md:grid-cols-2">
            {equipment.map((item, index) => (
              <Reveal
                as="li"
                key={item.title}
                index={index}
                className="flex flex-col gap-4 border-t border-cream/25 pt-6"
              >
                <span className="label-mono text-cream/70">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="font-display text-subheading text-cream">{item.title}</h3>
                <p className="text-cream/85">{item.text}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* ---- Стерилизация ---------------------------------------------- */}
      <section className="bg-espresso">
        <Container className="flex flex-col gap-14 py-20 lg:gap-20 lg:py-28">
          <SectionHeading
            className="reveal"
            surface="dark"
            title="Стерилизация"
            description="Путь инструмента от кресла до следующего пациента. Пять шагов, ни одного пропущенного."
          />
          <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
            {sterilization.map((step, index) => (
              <Reveal
                as="li"
                key={step.title}
                index={index}
                className="flex flex-col gap-4 border-t border-hairline-dark pt-6"
              >
                <span className="label-mono text-sky-pale">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="font-display text-subheading text-cream">{step.title}</h3>
                <p className="text-stone">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* ---- Документы ------------------------------------------------- */}
      <section id="documents" className="scroll-mt-20 bg-cream">
        <Container className="grid gap-14 py-20 lg:grid-cols-2 lg:gap-20 lg:py-28">
          <div className="flex flex-col gap-10">
            <SectionHeading
              title="Лицензия и документы"
              description="Сведения, которые медицинская организация обязана публиковать. Оригиналы можно посмотреть на ресепшене."
            />

            <LegalDetails />
          </div>

          <div className="flex flex-col gap-10">
            <PhotoPlaceholder label="Скан лицензии" ratio="portrait" className="w-full max-w-sm" />
            <ul className="flex flex-col">
              {documents.map((doc) => (
                <li
                  key={doc}
                  className="flex items-center justify-between gap-6 border-t border-hairline py-4 last:border-b"
                >
                  <span className="text-ink">{doc}</span>
                  {/* Когда появится файл — ссылка на PDF с пометкой размера. */}
                  <span className="label-mono shrink-0 text-graphite">скоро</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
