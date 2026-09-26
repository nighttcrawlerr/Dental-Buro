import { CtaSection } from "@/components/home/cta-section";
import { ReviewsList } from "@/components/reviews/reviews-list";
import { ArrowGlyph } from "@/components/ui/arrow-button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { RevealWords } from "@/components/ui/reveal-words";
import { SectionHeading } from "@/components/ui/section-heading";
import { reviewPlatforms } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Отзывы",
  description:
    "Отзывы пациентов клиники Dental Buro об имплантации, ортодонтии, эстетике, хирургии и детской стоматологии.",
  path: "/reviews",
});

/**
 * Отзывы.
 *
 * Отзывам на собственном сайте верят меньше всего, поэтому рядом — ссылки на
 * внешние площадки, где клиника не может ничего удалить. Это не уводит
 * пациента, а наоборот: он проверит и вернётся.
 */
export default function ReviewsPage() {
  return (
    <>
      <section className="bg-cream">
        <Container className="flex flex-col gap-14 py-20 lg:gap-20 lg:py-28">
          <div className="flex max-w-3xl flex-col gap-8">
            <h1 className="font-display text-display-xl text-balance text-ink">
              <RevealWords text="Отзывы." trigger="load" />
            </h1>
            <Reveal trigger="load" index={2}>
              <p className="max-w-2xl text-body-lg text-graphite">
                Собираем после лечения и с внешних площадок. Негативные не удаляем — на них отвечает
                главный врач.
              </p>
            </Reveal>
          </div>

          <Reveal trigger="load" index={3}>
            <ReviewsList />
          </Reveal>
        </Container>
      </section>

      <section className="border-t border-hairline bg-cream">
        <Container className="grid gap-12 py-20 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-20 lg:py-28">
          <SectionHeading
            className="reveal"
            title="Отзывы на других площадках"
            description="Там мы не можем ничего удалить или отредактировать."
          />
          <ul className="reveal flex flex-col">
            {reviewPlatforms.map((p) => (
              <li key={p.name} className="border-t border-hairline last:border-b">
                {p.url ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex min-h-16 items-center justify-between gap-6 py-4"
                  >
                    <span className="font-display text-heading-sm text-ink">
                      {p.name}
                      <span className="sr-only"> (откроется в новой вкладке)</span>
                    </span>
                    <ArrowGlyph direction="up-right" className="text-ink" />
                  </a>
                ) : (
                  <div className="flex min-h-16 items-center justify-between gap-6 py-4">
                    <span className="font-display text-heading-sm text-ink">{p.name}</span>
                    <span className="label-mono text-graphite">ссылка появится</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
