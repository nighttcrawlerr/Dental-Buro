import { cn } from "@/lib/cn";
import type { Surface } from "./hairline";

/**
 * Метка категории: точка 6px плюс моноширинная подпись.
 *
 * Единственный в системе цветовой классификатор. Точка — вторая и последняя
 * форма, которую заливает акцент, после стрелки.
 */
const dotBySurface: Record<Surface, string> = {
  light: "bg-sky",
  dark: "bg-sky-pale",
  sky: "bg-sky-pale",
};

const textBySurface: Record<Surface, string> = {
  light: "text-graphite",
  dark: "text-stone",
  sky: "text-cream/85",
};

export function Tag({
  children,
  surface = "light",
  className,
}: {
  children: React.ReactNode;
  surface?: Surface;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <span aria-hidden="true" className={cn("size-1.5 rounded-full", dotBySurface[surface])} />
      <span className={cn("label-mono", textBySurface[surface])}>{children}</span>
    </span>
  );
}
