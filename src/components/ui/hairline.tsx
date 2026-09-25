import { cn } from "@/lib/cn";

export type Surface = "light" | "dark" | "sky";

/**
 * Линия в 1px — единственный разделитель в системе.
 *
 * Только горизонтальная, никогда двойная и никогда пунктиром. Тени в системе
 * не используются вообще, поэтому вся структура держится на этих линиях и на
 * контрасте поверхностей.
 */
const lineBySurface: Record<Surface, string> = {
  light: "bg-hairline",
  dark: "bg-hairline-dark",
  sky: "bg-hairline-sky",
};

export function Hairline({
  surface = "light",
  className,
}: {
  surface?: Surface;
  className?: string;
}) {
  return <div aria-hidden="true" className={cn("h-px w-full", lineBySurface[surface], className)} />;
}
