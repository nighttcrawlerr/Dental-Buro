"use client";

import { cn } from "@/lib/cn";

/**
 * Схема зубов: человек отмечает зубы, которые нужно лечить.
 *
 * Нумерация международная (FDI): первая цифра — четверть челюсти, вторая —
 * зуб от центра. Пациенту номера ничего не говорят, поэтому у каждой
 * четверти подпись словами, а у кнопки — полное название для скринридера:
 * «Зуб 16, первый моляр, верхний справа».
 *
 * Расположение как на схеме у врача: правая сторона пациента — слева на
 * экране. Подписи «справа / слева» — со стороны пациента.
 *
 * На телефоне четыре ряда по восемь — так кнопка выходит около 41px, по
 * пальцу. На широком экране две дуги по шестнадцать: верх и низ.
 *
 * Отмеченные зубы никуда не отправляются — это медицинские данные. Квиз
 * берёт из схемы только количество.
 */

const toothNames = [
  "центральный резец",
  "боковой резец",
  "клык",
  "первый премоляр",
  "второй премоляр",
  "первый моляр",
  "второй моляр",
  "зуб мудрости",
];

/** Ширина зуба на дуге: резцы узкие, моляры широкие. Индекс — позиция от центра. */
const toothWidth = [0.8, 0.75, 0.85, 0.9, 0.9, 1.15, 1.1, 1];

type Quadrant = { q: number; label: string; jaw: "верхний" | "нижний"; side: "справа" | "слева" };

/** Четверти в порядке «как на схеме»: верх слева направо, низ слева направо. */
const quadrants: Quadrant[] = [
  { q: 1, label: "Верхние справа", jaw: "верхний", side: "справа" },
  { q: 2, label: "Верхние слева", jaw: "верхний", side: "слева" },
  { q: 4, label: "Нижние справа", jaw: "нижний", side: "справа" },
  { q: 3, label: "Нижние слева", jaw: "нижний", side: "слева" },
];

/** Зубы четверти в порядке на экране: правая сторона пациента — от моляров к центру. */
function teethOf({ q, side }: Quadrant) {
  const fromCenter = [1, 2, 3, 4, 5, 6, 7, 8];
  const order = side === "справа" ? [...fromCenter].reverse() : fromCenter;
  return order.map((n) => q * 10 + n);
}

export function ToothChart({
  selected,
  onToggle,
}: {
  selected: ReadonlySet<number>;
  onToggle: (tooth: number) => void;
}) {
  return (
    <div className="tooth-chart grid gap-x-3 gap-y-6 lg:grid-cols-2 lg:gap-y-10">
      {quadrants.map((quad) => (
        <div
          key={quad.q}
          role="group"
          aria-label={quad.label}
          className={cn("flex flex-col gap-3", quad.side === "справа" ? "lg:items-end" : "lg:items-start")}
        >
          <span
            className={cn(
              "label-mono text-graphite",
              // Подписи верхней дуги — над зубами, нижней — под ними.
              quad.jaw === "нижний" && "lg:order-last",
            )}
          >
            {quad.label}
          </span>

          <div className="grid w-full grid-cols-8 gap-1 lg:flex lg:gap-1.5">
            {teethOf(quad).map((tooth, i) => {
              const pos = tooth % 10;
              const isSelected = selected.has(tooth);
              // Расстояние от центра дуги: 0 у резцов, 1 у зубов мудрости.
              const fromCenter = (pos - 1) / 7;
              return (
                <button
                  key={tooth}
                  type="button"
                  aria-pressed={isSelected}
                  aria-label={`Зуб ${tooth}, ${toothNames[pos - 1]}, ${quad.jaw} ${quad.side}`}
                  onClick={() => onToggle(tooth)}
                  style={
                    {
                      "--grow": toothWidth[pos - 1],
                      // Дуга: края верхней челюсти опускаются, нижней — поднимаются.
                      "--arch": `${(quad.jaw === "верхний" ? 1 : -1) * fromCenter * fromCenter * 28}px`,
                      "--i": i,
                    } as React.CSSProperties
                  }
                  className={cn(
                    "tooth group flex min-h-11 flex-col items-center justify-center gap-1 rounded-button border transition-colors duration-200",
                    isSelected
                      ? "border-sky bg-sky text-cream"
                      : "border-hairline bg-paper text-graphite hover:border-sky hover:text-ink",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-5 w-[70%] rounded-[40%_40%_45%_45%/55%_55%_45%_45%] transition-colors duration-200",
                      isSelected ? "bg-cream" : "bg-sky-pale group-hover:bg-sky-mist",
                    )}
                  />
                  <span aria-hidden="true" className="label-mono text-[0.625rem] leading-none">
                    {tooth}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
