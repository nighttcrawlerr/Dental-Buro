import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Знак Dental Buro — силуэт зуба, рассечённый диагональю на две доли.
 *
 * Построен на основе прежнего логотипа клиники: там был тот же приём —
 * зуб из двух форм, разделённых светлым просветом.
 *
 * Два отличия от исходника:
 *
 * 1. Просвет прозрачный, а не залит светлым. В оригинале линия белая, поэтому
 *    на любом небелом фоне она себя выдаёт. Здесь это вырез маской, и знак
 *    ложится на кремовую канву, на эспрессо и на фотографию без переделки.
 * 2. Корпус зуба всегда светлее доли. Тёмный корпус читается как потемневшая
 *    эмаль, тёмные корни — как кариес; оба варианта отброшены на макетах.
 *
 * Идентификаторы фиксированные. На странице может оказаться несколько знаков,
 * но определения у всех одинаковые, поэтому совпадение ни на что не влияет.
 */
const CLIP_ID = "db-tooth";
const MASK_ID = "db-tooth-gap";

/** Контур зуба: два бугра сверху, борозда по центру, два корня снизу. */
const PATH_TOOTH =
  "M50 30 C50 18 41 10 29 10 C15 10 6 24 8 46 C10 66 14 86 20 100 " +
  "C23 107 30 107 33 100 C37 90 42 76 50 76 C58 76 63 90 67 100 " +
  "C70 107 77 107 80 100 C86 86 90 66 92 46 C94 24 85 10 71 10 " +
  "C59 10 50 18 50 30 Z";

/** Линия разреза. Просвет вырезается по ней маской. */
const PATH_CUT = "M44 2 C50 34 62 54 96 66";

/** Тёмная доля — всё, что выше и правее линии разреза. */
const PATH_LOBE = "M44 -6 L44 2 C50 34 62 54 96 66 L106 66 L106 -6 Z";

type Tone = "onLight" | "onDark";

/**
 * Заливки знака: корпус и доля. Корпус всегда светлее доли.
 *
 * На тёмных фонах доля светлее фона, а не темнее. Иначе она исчезает:
 * Sky Silver в доле на секции того же Sky Silver давал контраст 1.44, то есть
 * доли просто не было, а на эспрессо — 1.82, что чуть лучше только за счёт
 * разницы оттенков. Sky Mist даёт 5.97 на эспрессо и 3.28 на Sky Silver, и
 * одного значения хватает на оба тёмных фона — отдельный режим не нужен.
 */
const markFills: Record<Tone, { body: string; lobe: string }> = {
  onLight: { body: "var(--color-sky-pale)", lobe: "var(--color-sky)" },
  onDark: { body: "var(--color-cream)", lobe: "var(--color-sky-mist)" },
};

export function LogoMark({
  tone = "onLight",
  className,
  style,
}: {
  tone?: Tone;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { body, lobe } = markFills[tone];

  return (
    <svg
      viewBox="6 8 88 102"
      aria-hidden="true"
      focusable="false"
      style={style}
      className={cn("h-10 w-auto", className)}
    >
      <defs>
        <clipPath id={CLIP_ID}>
          <path d={PATH_TOOTH} />
        </clipPath>
        <mask id={MASK_ID}>
          <rect x="-12" y="-12" width="136" height="156" fill="#fff" />
          <path d={PATH_CUT} fill="none" stroke="#000" strokeWidth="4.5" />
        </mask>
      </defs>
      <g clipPath={`url(#${CLIP_ID})`} mask={`url(#${MASK_ID})`}>
        <rect x="-12" y="-12" width="136" height="156" fill={body} />
        <path d={PATH_LOBE} fill={lobe} />
      </g>
    </svg>
  );
}

const wordTone: Record<Tone, string> = {
  onLight: "text-ink",
  onDark: "text-cream",
};

/**
 * Подпись и линейки на тёмных фонах строятся от кремового с прозрачностью,
 * а не от тёплых нейтралей. Graphite и Stone — коричневые, на Sky Silver они
 * выглядят грязными пятнами и почти не видны.
 */
const subTone: Record<Tone, string> = {
  onLight: "text-graphite",
  // 85% — минимум, при котором подпись проходит 4.5:1 на Sky Silver (4.71).
  onDark: "text-cream/85",
};

const ruleTone: Record<Tone, string> = {
  onLight: "bg-stone",
  onDark: "bg-cream/30",
};

type LogoProps = {
  /** full — для подвала и первого экрана; compact — для шапки; mark — только знак. */
  variant?: "full" | "compact" | "mark";
  tone?: Tone;
  /** Ссылка на главную. Выключается на самой главной, чтобы не ссылаться на себя. */
  asLink?: boolean;
  className?: string;
};

export function Logo({
  variant = "compact",
  tone = "onLight",
  asLink = true,
  className,
}: LogoProps) {
  const full = variant === "full";

  const content =
    variant === "mark" ? (
      <LogoMark tone={tone} className="h-9" />
    ) : (
      <span className={cn("flex items-center", full ? "gap-4" : "gap-3")}>
        <LogoMark tone={tone} className={full ? "h-14" : "h-9"} />
        <span className="flex flex-col">
          <span
            className={cn(
              "font-display leading-none whitespace-nowrap",
              wordTone[tone],
              full
                ? "text-[1.75rem] tracking-[0.13em]"
                : "text-[1.1875rem] tracking-[0.13em]",
            )}
          >
            DENTAL BURO
          </span>
          {/* «CLINIC» с линиями по бокам — цитата из фирменного блока клиники */}
          <span className={cn("flex items-center", full ? "mt-2 gap-2.5" : "mt-1.5 gap-2")}>
            <span className={cn("h-px flex-1", ruleTone[tone])} />
            <span
              className={cn(
                "label-mono leading-none",
                subTone[tone],
                full
                  ? "text-[0.8125rem] tracking-[0.42em]"
                  : "text-[0.625rem] tracking-[0.38em]",
              )}
            >
              {/* последняя буква тоже получает разрядку, иначе блок съезжает влево */}
              <span className="pl-[0.42em]">CLINIC</span>
            </span>
            <span className={cn("h-px flex-1", ruleTone[tone])} />
          </span>
        </span>
      </span>
    );

  if (!asLink) {
    return (
      <span className={cn("inline-flex", className)} aria-label="Dental Buro Clinic">
        {content}
      </span>
    );
  }

  return (
    <Link
      href="/"
      aria-label="Dental Buro Clinic, на главную"
      className={cn("inline-flex transition-opacity duration-300 hover:opacity-70", className)}
    >
      {content}
    </Link>
  );
}
