import Link from "next/link";
import { cn } from "@/lib/cn";

/**
 * Монограмма DB.
 *
 * Литеры построены геометрией, а не обведённым шрифтом. Штрих модулирован:
 * внешний и внутренний овалы имеют разное соотношение осей, поэтому штрих
 * толстый по бокам (12–16) и тонкий сверху и снизу (6). Это рифмуется с
 * антиквой Cormorant в заголовках.
 *
 * Переплетения литер, как в исходном знаке клиники, здесь сознательно нет.
 * В точке пересечения овал D и стойка B оба находятся в самом толстом месте,
 * поэтому любой вырез уродует одну из литер. Вместо этого литеры поставлены
 * встык с оптическим зазором 4 — знак читается с 16px и не ломается.
 */

/** Литера D: стойка 12..23, овал с вылетом вправо до x=62. */
const PATH_D =
  "M12 16 H23 A39 34 0 0 1 23 84 H12 Z" + // внешний контур
  "M23 22.5 A28 27.5 0 0 1 23 77.5 Z"; // внутренний просвет

/**
 * Литера B: стойка 66..77, верхний овал уже нижнего — как в классической антикве.
 * Просветы подобраны так, чтобы штрих по бокам был 11 — вровень со стойкой и с D,
 * иначе B выглядит легче и монограмма заваливается вправо.
 */
const PATH_B =
  "M66 16 H77 A23 17 0 0 1 77 50 A26 17 0 0 1 77 84 H66 Z" + // внешний контур
  "M77 22.5 A12 10.5 0 0 1 77 43.5 Z" + // верхний просвет
  "M77 56.5 A15 10.5 0 0 1 77 77.5 Z"; // нижний просвет

export function LogoMark({
  className,
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      style={style}
      // viewBox по габаритам знака, без полей: отступы задаёт вёрстка
      viewBox="12 16 91 68"
      fill="currentColor"
      fillRule="evenodd"
      aria-hidden="true"
      focusable="false"
      className={cn("h-10 w-auto", className)}
    >
      <path d={PATH_D} />
      <path d={PATH_B} />
    </svg>
  );
}

type Tone = "onLight" | "onDark";

const markTone: Record<Tone, string> = {
  onLight: "text-bronze",
  onDark: "text-bronze-soft",
};

const wordTone: Record<Tone, string> = {
  onLight: "text-ink",
  onDark: "text-cream",
};

const ruleTone: Record<Tone, string> = {
  onLight: "bg-bronze/45",
  onDark: "bg-bronze-soft/45",
};

type LogoProps = {
  /** full — для подвала и первого экрана; compact — для шапки; mark — только монограмма. */
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
  const content =
    variant === "mark" ? (
      <LogoMark className={cn("h-9", markTone[tone])} />
    ) : (
      <span className={cn("flex items-center", variant === "full" ? "gap-4" : "gap-3")}>
        <LogoMark
          className={cn(variant === "full" ? "h-14" : "h-9", markTone[tone])}
        />
        <span className="flex flex-col">
          <span
            className={cn(
              "font-sans leading-none whitespace-nowrap",
              wordTone[tone],
              variant === "full"
                ? "text-[1.5rem] tracking-[0.2em]"
                : "text-[1.0625rem] tracking-[0.18em]",
            )}
          >
            DENTAL BURO
          </span>
          {/* «CLINIC» с линиями по бокам — цитата из фирменного блока клиники */}
          <span
            className={cn(
              "flex items-center",
              variant === "full" ? "mt-2 gap-2.5" : "mt-1.5 gap-2",
            )}
          >
            <span className={cn("h-px flex-1", ruleTone[tone])} />
            <span
              className={cn(
                "label-mono leading-none",
                variant === "full"
                  ? "text-[0.8125rem] tracking-[0.42em]"
                  : "text-[0.625rem] tracking-[0.38em]",
                tone === "onLight" ? "text-graphite" : "text-stone",
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

  const label = "Dental Buro Clinic, на главную";

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
      aria-label={label}
      className={cn(
        "inline-flex transition-opacity duration-300 hover:opacity-70",
        className,
      )}
    >
      {content}
    </Link>
  );
}
