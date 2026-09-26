import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Logo, LogoMark } from "@/components/logo";
import { ArrowButton } from "@/components/ui/arrow-button";
import { Button } from "@/components/ui/button";
import { Hairline, type Surface } from "@/components/ui/hairline";
import { SectionCounter } from "@/components/ui/section-counter";
import { SectionHeading } from "@/components/ui/section-heading";
import { Tag } from "@/components/ui/tag";
import { isLiveSite } from "@/lib/site-url";
import { LeadFormDemo } from "./lead-form-demo";

/**
 * Служебная витрина дизайн-системы. Нужна нам, а не пациентам:
 * здесь одним взглядом видно, не разъехалось ли что-то после правок.
 * Закрыта от индексации, а на боевом сайте (SITE_URL задан) отдаёт 404 —
 * удалять папку перед запуском не нужно, забыть про неё тоже нельзя.
 */
export const metadata: Metadata = {
  title: "Дизайн-система",
  robots: { index: false, follow: false },
};

function Row({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-hairline py-12">
      <div className="mb-8">
        <h2 className="label-mono text-graphite">{title}</h2>
        {note ? <p className="mt-2 max-w-xl text-graphite">{note}</p> : null}
      </div>
      {children}
    </section>
  );
}

const surfaces: { key: Surface; label: string; bg: string }[] = [
  { key: "light", label: "На светлой канве", bg: "bg-paper" },
  { key: "dark", label: "На эспрессо", bg: "bg-espresso" },
  { key: "sky", label: "На Sky Silver", bg: "bg-sky" },
];

export default function KitchenSinkPage() {
  if (isLiveSite) notFound();

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-10">
      <header className="pb-12">
        <p className="label-mono text-sky">Шаги 1.1 и 1.2</p>
        <h1 className="font-display mt-4 text-display text-ink">Дизайн-система</h1>
      </header>

      <Row
        title="Полный вариант / on light"
        note="Для первого экрана, подвала и печатных носителей. Монограмма 56px, шрифтовая часть в Onest с разрядкой 0.2em."
      >
        <div className="rounded-card bg-paper p-12">
          <Logo variant="full" tone="onLight" asLink={false} />
        </div>
      </Row>

      <Row title="Полный вариант / on dark и on Sky Silver">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-card bg-espresso p-12">
            <Logo variant="full" tone="onDark" asLink={false} />
          </div>
          <div className="rounded-card bg-sky p-12">
            <Logo variant="full" tone="onDark" asLink={false} />
          </div>
        </div>
      </Row>

      <Row
        title="Компактный вариант — для шапки"
        note="Монограмма 36px. Высота блока укладывается в шапку 80px с полями по 22px."
      >
        <div className="flex flex-col gap-4">
          <div className="rounded-card bg-paper p-8">
            <Logo variant="compact" tone="onLight" asLink={false} />
          </div>
          <div className="rounded-card bg-espresso p-8">
            <Logo variant="compact" tone="onDark" asLink={false} />
          </div>
        </div>
      </Row>

      <Row
        title="Только знак"
        note="Для фавикона, мобильной шапки и аватарок в соцсетях. Проверка читаемости: 96 / 48 / 32 / 24 / 16px."
      >
        <div className="rounded-card flex flex-wrap items-end gap-10 bg-paper p-12">
          {[96, 48, 32, 24, 16].map((size) => (
            <div key={size} className="flex flex-col items-center gap-3">
              <LogoMark style={{ height: size }} />
              <span className="label-mono text-graphite">{size}px</span>
            </div>
          ))}
        </div>
      </Row>

      <Row
        title="Фавикон"
        note="Знак на Espresso со скруглением. Разрез в фавиконе убран — в 16px он замыливается и превращается в грязь."
      >
        <div className="rounded-card flex flex-wrap items-end gap-10 bg-paper p-12">
          {[128, 64, 32, 16].map((size) => (
            <div key={size} className="flex flex-col items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icon.svg" alt="" width={size} height={size} />
              <span className="label-mono text-graphite">{size}px</span>
            </div>
          ))}
        </div>
      </Row>


      <Row
        title="Кнопки"
        note="Заливка кнопки — противоположная поверхность: на светлом тёмная, на тёмном светлая. Акцент кнопку не заливает никогда. Высота не меньше 44px — минимальная цель для пальца."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {surfaces.map(({ key, label, bg }) => (
            <div key={key} className={`rounded-card p-8 ${bg}`}>
              <p className={`label-mono mb-6 ${key === "light" ? "text-graphite" : "text-cream/85"}`}>
                {label}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <Button surface={key}>Записаться</Button>
                <Button surface={key} variant="ghost">
                  Смотреть цены
                </Button>
                <ArrowButton surface={key} label="Перейти к услугам" />
                <ArrowButton surface={key} direction="up-right" label="Открыть в новой вкладке" />
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <SectionCounter current={1} total={4} surface={key} />
                <Tag surface={key}>Имплантация</Tag>
              </div>
              <Hairline surface={key} className="mt-6" />
            </div>
          ))}
        </div>
      </Row>

      <Row title="Шапка секции" note="Счётчик, заголовок и пояснение. На странице ровно один h1, поэтому здесь по умолчанию h2.">
        <div className="flex flex-col gap-4">
          <div className="rounded-card bg-paper p-10">
            <SectionHeading
              counter={{ current: 2, total: 4 }}
              title="Восстанавливаем зубной ряд за один визит"
              description="Планирование по КТ, установка по хирургическому шаблону и временная коронка в день операции."
            />
          </div>
          <div className="rounded-card bg-espresso p-10">
            <SectionHeading
              surface="dark"
              counter={{ current: 3, total: 4 }}
              title="Цифровой протокол лечения"
              description="Никаких слепочных масс и решений на глаз — каждый шаг просчитан заранее."
            />
          </div>
          <div className="rounded-card bg-sky p-10">
            <SectionHeading
              surface="sky"
              counter={{ current: 4, total: 4 }}
              title="План лечения до начала работ"
              description="Документ с этапами, сроками и фиксированной стоимостью. Сумма в конце совпадает с той, что была в начале."
            />
          </div>
        </div>
      </Row>

      <Row title="Типографическая шкала">
        <div className="rounded-card flex flex-col gap-6 bg-paper p-10">
          <p className="font-display text-hero text-ink">Улыбка.</p>
          <p className="font-display text-display text-ink">Имплантация</p>
          <p className="font-display text-heading-lg text-ink">Заголовок секции</p>
          <p className="font-display text-heading-sm text-ink">Заголовок карточки</p>
          <p className="text-body-lg text-graphite">Крупный текст — вводные абзацы и лиды секций.</p>
          <p className="max-w-2xl text-body text-graphite">
            Основной текст. Здесь живут описания услуг, этапы лечения и ответы на вопросы. Строка
            держится в пределах 70 знаков, дальше читать тяжело.
          </p>
          <p className="label-mono text-graphite">Служебная подпись · моноширинная</p>
        </div>
      </Row>

      <Row
        title="Форма записи"
        note="Отправки нет. Светлая форма показывает, что ушло бы на сервер; тёмная всегда падает с ошибкой сервера — чтобы было видно, как выглядит ошибка."
      >
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-card bg-paper p-6 md:p-10">
            <LeadFormDemo surface="light" />
          </div>
          <div className="rounded-card bg-espresso p-6 md:p-10">
            <LeadFormDemo surface="dark" fail="server" />
          </div>
        </div>
      </Row>

      <Row title="Палитра">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-card bg-hairline md:grid-cols-4">
          {[
            ["cream", "#F3EEE8", "text-ink"],
            ["paper", "#FFFFFF", "text-ink"],
            ["linen", "#D9CBC2", "text-ink"],
            ["sand", "#DBD1C7", "text-ink"],
            ["stone", "#C6BCB2", "text-ink"],
            ["graphite", "#6B5F53", "text-cream"],
            ["espresso", "#3E342B", "text-cream"],
            ["ink", "#241E19", "text-cream"],
            ["sky", "#3F5F7E", "text-cream"],
            ["bronze", "#825A34", "text-cream"],
            ["bronze-soft", "#CFA36A", "text-ink"],
            ["clay", "#987E67", "text-cream"],
          ].map(([name, hex, text]) => (
            <div key={name} className={`p-6 ${text}`} style={{ background: hex }}>
              <div className="label-mono">{name}</div>
              <div className="label-mono mt-1 opacity-60">{hex}</div>
            </div>
          ))}
        </div>
      </Row>
    </div>
  );
}
