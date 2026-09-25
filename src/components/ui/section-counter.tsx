import { cn } from "@/lib/cn";
import type { Surface } from "./hairline";

/**
 * Счётчик секции «01 / 04» в пилюле.
 *
 * Голос оглавления: показывает, где пациент находится в длинной странице.
 * Для скринридера озвучивается как «раздел 1 из 4» — голая пара цифр вслух
 * звучит бессмыслицей.
 */
const toneBySurface: Record<Surface, string> = {
  light: "border-hairline text-graphite",
  dark: "border-hairline-dark text-stone",
  sky: "border-cream/35 text-cream/85",
};

export function SectionCounter({
  current,
  total,
  surface = "light",
  className,
}: {
  current: number;
  total: number;
  surface?: Surface;
  className?: string;
}) {
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <span
      className={cn(
        "label-mono inline-flex items-center rounded-full border px-3 py-1.5",
        toneBySurface[surface],
        className,
      )}
    >
      <span aria-hidden="true">
        {pad(current)} / {pad(total)}
      </span>
      <span className="sr-only">
        Раздел {current} из {total}
      </span>
    </span>
  );
}
