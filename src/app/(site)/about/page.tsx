import { CtaSection } from "@/components/home/cta-section";
import { LegalDetails } from "@/components/legal/legal-details";
import { Container } from "@/components/ui/container";
import { Photo } from "@/components/ui/photo";
import { Reveal } from "@/components/ui/reveal";
import { RevealWords } from "@/components/ui/reveal-words";
import { SectionHeading } from "@/components/ui/section-heading";
import { documents, equipment, spaces, sterilization } from "@/content/about";
import { brand } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "О клинике",
  description:
    `Клиника «${brand.name}»: интерьер, оборудование, стерилизация инструментов, лицензия и документы.`,
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
        <Container className="pt-20 lg:pt-28">
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
        </Container>

        {/* Снимок вне колонки: на широких экранах он начинается обрезанным по
            колонке и при прокрутке раскрывается во всю ширину (.unfold в
            globals.css). На телефоне и без анимаций стоит в колонке. */}
        <div className="unfold mx-auto mt-14 w-full max-w-[1200px] px-4 pb-20 sm:px-6 lg:mt-20 lg:px-10 lg:pb-28">
          <Photo
            src="/media/clinic/lounge.jpg"
            alt="Холл клиники: ресепшен с логотипом и зона ожидания"
            sizes="(min-width: 1200px) 1200px, 100vw"
            className="w-full lg:aspect-[21/9]"
          />
        </div>
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
                <Photo src={space.photo} alt="" />
                <h3 className="font-display text-heading-sm text-ink">{space.title}</h3>
                <p className="max-w-lg text-graphite">{space.text}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* ---- Оборудование ---------------------------------------------- */}
      <section className="grain bg-sky">
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
                <span className="label-mono text-cream/85">{String(index + 1).padStart(2, "0")}</span>
                <h3 className="font-display text-subheading text-cream">{item.title}</h3>
                <p className="text-cream/85">{item.text}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* ---- Стерилизация ---------------------------------------------- */}
      <section className="grain bg-espresso">
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
            <ul className="flex flex-col">
              {documents.map((doc) => (
                <li key={doc.title} className="border-t border-hairline last:border-b">
                  {doc.href ? (
                    <a
                      href={doc.href}
                      target="_blank"
                      rel="noopener"
                      className="flex items-center justify-between gap-6 py-4 hover:underline"
                    >
                      <span className="text-ink">{doc.title}</span>
                      <span className="label-mono shrink-0 text-ink">
                        PDF<span className="sr-only"> (откроется в новой вкладке)</span>
                      </span>
                    </a>
                  ) : (
                    <div className="flex items-center justify-between gap-6 py-4">
                      <span className="text-ink">{doc.title}</span>
                      <span className="label-mono shrink-0 text-graphite">скоро</span>
                    </div>
                  )}
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
