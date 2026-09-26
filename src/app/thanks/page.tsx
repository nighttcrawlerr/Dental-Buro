import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Tag } from "@/components/ui/tag";
import { clinic } from "@/content/site";

/**
 * Страница после отправки заявки.
 *
 * Отдельный адрес нужен аналитике: на посещение /thanks вешается цель
 * «заявка отправлена» (этап 9). Из поиска сюда попадать незачем, поэтому
 * страница закрыта от индексации.
 */
export const metadata: Metadata = {
  title: "Заявка отправлена",
  robots: { index: false, follow: false },
  alternates: { canonical: "/thanks" },
};

const firstVisit = [
  {
    title: "Паспорт",
    text: "Нужен для договора и медицинской карты.",
  },
  {
    title: "Снимки, если есть",
    text: "КТ или панорамный снимок за последний год — иногда это избавляет от повторного облучения.",
  },
  {
    title: "Список лекарств",
    text: "Что принимаете постоянно и на что бывает аллергия. Это важно для выбора анестезии.",
  },
];

export default function ThanksPage() {
  return (
    <section className="bg-cream">
      <Container className="flex flex-col gap-16 py-20 lg:gap-24 lg:py-32">
        <div className="flex max-w-3xl flex-col gap-8">
          <Tag>Заявка принята</Tag>
          <h1 className="font-display text-display text-balance text-ink">
            Спасибо. Мы скоро перезвоним.
          </h1>
          <p className="max-w-xl text-body-lg text-graphite">
            Администратор позвонит, ответит на вопросы и подберёт время приёма. Звоним в часы
            работы клиники — {clinic.schedule.toLowerCase()}.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button href="/">На главную</Button>
            <Button variant="ghost" href={clinic.phoneHref}>
              {clinic.phone}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <h2 className="label-mono text-graphite">Что взять на первый визит</h2>
          <ol className="grid gap-px overflow-hidden rounded-card bg-hairline md:grid-cols-3">
            {firstVisit.map((item, i) => (
              <li key={item.title} className="flex flex-col gap-3 bg-paper p-6 md:p-8">
                <span className="label-mono text-sky">{String(i + 1).padStart(2, "0")}</span>
                <p className="font-display text-heading-sm text-ink">{item.title}</p>
                <p className="text-graphite">{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
