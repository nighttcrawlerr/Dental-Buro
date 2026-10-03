import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { getPriceItem } from "@/content/prices";
import { formatPriceItem } from "@/lib/format";

/**
 * «Из чего состоит имплант» — на странице имплантации.
 *
 * Рисунок в разрезе: кость, десна и имплант с коронкой. На широком экране
 * секция залипает, и при прокрутке конструкция раскладывается: коронка и
 * абатмент поднимаются, у частей появляются подписи (.implant-* в
 * globals.css). Отвечает на вопрос «за что я плачу» — цены частей из того же
 * прайса, что и квиз.
 *
 * Части нарисованы в разобранном положении, а собранное задаёт анимация.
 * Поэтому без неё — на телефоне, в Firefox, при «уменьшении движения» —
 * рисунок сразу разобран и подписан: это самое понятное состояние.
 *
 * У абатмента цены нет: в прайсе нет такой позиции, а придумывать её нельзя.
 */

const parts = [
  {
    title: "Коронка",
    text: "Видимая часть зуба из диоксида циркония. Прочная и по цвету как соседние зубы.",
    price: "implant-crown",
  },
  {
    title: "Абатмент",
    text: "Переходник между имплантом и коронкой. Выходит из десны и держит коронку под нужным углом.",
  },
  {
    title: "Имплант",
    text: "Титановый винт вместо корня. За 2–4 месяца срастается с костью и после этого держит нагрузку, как свой зуб.",
    price: "implant",
  },
];

/** Края тела импланта — сужается от 52 к 40 единицам книзу. */
const bodyTop = 462;
const bodyBottom = 600;
function edges(y: number) {
  const t = (y - bodyTop) / (bodyBottom - bodyTop);
  return { left: 184 + 6 * t, right: 236 - 6 * t };
}
/** Витки резьбы: наклонные линии поперёк тела. */
const threads = Array.from({ length: 11 }, (_, i) => {
  const y = 472 + i * 12;
  return { x1: edges(y).left, y1: y, x2: edges(y + 6).right, y2: y + 6 };
});

function Figure() {
  return (
    <svg
      viewBox="0 0 420 640"
      role="img"
      aria-label="Имплант в разрезе: в кости — титановый винт, над десной — абатмент, сверху — коронка"
      className="implant-figure mx-auto h-auto w-full max-w-sm lg:h-full lg:max-h-[38rem] lg:w-auto lg:max-w-none"
    >
      {/* Кость и десна — неподвижная основа. */}
      <rect x="0" y="466" width="420" height="174" fill="var(--color-linen)" />
      <path
        d="M0 470 L0 446 C100 437 140 435 176 440 L244 440 C280 435 320 437 420 446 L420 470 Z"
        fill="var(--color-clay)"
        opacity="0.45"
      />

      {/* Имплант — стоит в кости всегда. */}
      <g className="implant-screw">
        <path
          d={`M184 ${bodyTop} L236 ${bodyTop} L230 ${bodyBottom} C228 614 192 614 190 ${bodyBottom} Z`}
          fill="var(--color-sky-mist)"
          stroke="var(--color-sky)"
          strokeWidth="1.5"
        />
        {threads.map((t) => (
          <line
            key={t.y1}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke="var(--color-sky)"
            strokeWidth="1.5"
          />
        ))}
        <rect
          x="182"
          y="448"
          width="56"
          height="14"
          rx="3"
          fill="var(--color-sky-pale)"
          stroke="var(--color-sky)"
          strokeWidth="1.5"
        />
      </g>

      {/* Абатмент: в собранном виде — на 120 ниже, внутри коронки. */}
      <g className="implant-abutment">
        <path
          d="M195 250 L225 250 L232 318 L188 318 Z"
          fill="var(--color-sky-pale)"
          stroke="var(--color-sky)"
          strokeWidth="1.5"
        />
        <rect
          x="186"
          y="318"
          width="48"
          height="14"
          rx="2"
          fill="var(--color-sky-pale)"
          stroke="var(--color-sky)"
          strokeWidth="1.5"
        />
      </g>

      {/* Коронка: в собранном виде — на 250 ниже, на линии десны. */}
      <g className="implant-crown">
        <path
          d="M160 195 C150 170 146 135 150 105 C153 80 162 60 178 58 C190 56 196 70 210 70 C224 70 230 56 242 58 C258 60 267 80 270 105 C274 135 270 170 260 195 Z"
          fill="var(--color-paper)"
          stroke="var(--color-graphite)"
          strokeWidth="1.5"
        />
        <path
          d="M170 100 C172 86 178 78 186 76"
          fill="none"
          stroke="var(--color-hairline)"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>

      {/* Подписи — появляются, когда части разошлись. */}
      <g className="implant-labels" fontSize="15" fill="var(--color-ink)">
        {[
          { n: "01", label: "Коронка", y: 128, from: 272 },
          { n: "02", label: "Абатмент", y: 286, from: 232 },
          { n: "03", label: "Имплант", y: 536, from: 236 },
        ].map((l) => (
          <g key={l.n}>
            <line
              x1={l.from + 6}
              y1={l.y}
              x2="300"
              y2={l.y}
              stroke="var(--color-graphite)"
              strokeWidth="1"
            />
            <text x="308" y={l.y + 5} className="label-mono">
              <tspan fill="var(--color-graphite)">{l.n}</tspan> {l.label}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}

export function ImplantAnatomy() {
  return (
    <section className="border-t border-hairline bg-cream">
      {/* Заголовок вне залипающей сцены: он уезжает как обычно, а залипают
          только список и рисунок — так сцена помещается и в низкий экран
          ноутбука. */}
      <Container className="pt-20 lg:pt-28">
        <SectionHeading
          className="reveal"
          title="Из чего состоит имплант"
          description="Цены — из прайса. Точную сумму для вашего случая посчитаем в плане лечения."
        />
      </Container>

      <div className="implant-scene">
        <div className="implant-stage">
          <Container className="grid items-center gap-12 py-14 lg:grid-cols-2 lg:gap-20 lg:py-0">
            <div className="flex flex-col gap-8">
              <ol className="flex flex-col">
                {parts.map((part, index) => {
                  const item = part.price ? getPriceItem(part.price) : null;
                  return (
                    <li
                      key={part.title}
                      className="grid grid-cols-[2.5rem_1fr_auto] gap-x-4 gap-y-1 border-t border-hairline py-4 last:border-b"
                    >
                      <span className="label-mono pt-1 text-graphite">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-subheading text-ink">{part.title}</span>
                      <span className="label-mono pt-1 text-right whitespace-nowrap text-ink">
                        {item ? formatPriceItem(item) : ""}
                      </span>
                      <span className="col-start-2 col-end-4 text-graphite">{part.text}</span>
                    </li>
                  );
                })}
              </ol>

              <Button variant="ghost" href="/raschet" className="self-start">
                Посчитать для своего случая
              </Button>
            </div>

            <Figure />
          </Container>
        </div>
      </div>
    </section>
  );
}
