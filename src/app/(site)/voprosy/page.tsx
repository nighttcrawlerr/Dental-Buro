import { CtaSection } from "@/components/home/cta-section";
import { FaqBrowser, type FaqGroup } from "@/components/faq/faq-browser";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { RevealWords } from "@/components/ui/reveal-words";
import { getServiceDetails } from "@/content/service-details";
import { services } from "@/content/site";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Вопросы и ответы",
  description:
    "Ответы на частые вопросы о лечении в Dental Buro: больно ли, сколько длится, как подготовиться — по каждому направлению.",
  path: "/voprosy",
});

/**
 * Все вопросы со страниц услуг в одном месте.
 *
 * Отдельных вопросов у страницы нет: ответы живут в service-details.ts и
 * показываются и здесь, и на странице услуги — две копии одного ответа
 * рано или поздно разошлись бы.
 *
 * Разметки FAQPage здесь нет намеренно: те же вопросы уже размечены на
 * страницах услуг, а одинаковые FAQ на нескольких страницах поисковики
 * считают дублями.
 */
export default function FaqPage() {
  const groups: FaqGroup[] = services.flatMap((service) => {
    const details = getServiceDetails(service.slug);
    return details?.faq.length ? [{ slug: service.slug, title: service.title, items: details.faq }] : [];
  });

  return (
    <>
      <section className="bg-cream">
        <Container className="flex flex-col gap-14 py-20 lg:gap-20 lg:py-28">
          <div className="flex max-w-3xl flex-col gap-8">
            <h1 className="font-display text-display-xl text-balance text-ink">
              <RevealWords text="Вопросы и ответы." trigger="load" />
            </h1>
            <Reveal trigger="load" index={2}>
              <p className="max-w-2xl text-body-lg text-graphite">
                То, о чём спрашивают чаще всего: больно ли, сколько длится, как подготовиться.
                Не нашли своего вопроса — задайте его администратору при записи.
              </p>
            </Reveal>
          </div>

          <Reveal trigger="load" index={3}>
            <FaqBrowser groups={groups} />
          </Reveal>
        </Container>
      </section>

      <CtaSection />
    </>
  );
}
