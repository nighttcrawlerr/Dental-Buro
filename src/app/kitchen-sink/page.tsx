import type { Metadata } from "next";
import { Logo, LogoMark } from "@/components/logo";

/**
 * Служебная витрина дизайн-системы. Нужна нам, а не пациентам:
 * здесь одним взглядом видно, не разъехалось ли что-то после правок.
 * Закрыта от индексации, перед продакшеном удаляется вместе с папкой.
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

export default function KitchenSinkPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 py-20 md:px-10">
      <header className="pb-12">
        <p className="label-mono text-bronze">Шаг 1.1</p>
        <h1 className="font-display mt-4 text-display text-ink">Логотип</h1>
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
