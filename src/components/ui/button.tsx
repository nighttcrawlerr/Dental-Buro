import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Surface } from "./hairline";

/**
 * Кнопка действия.
 *
 * Правило системы: заливка кнопки — противоположная поверхность. На светлой
 * канве кнопка тёмная, на тёмной — светлая. Акцентный цвет заливкой кнопки не
 * бывает никогда: он рационирован под микроповерхности вроде стрелок и точек,
 * и большая акцентная плашка убивает его сигнальную функцию.
 *
 * Высота держится не меньше 44px. Дизайн-система просит компактные кнопки, но
 * 44px — минимальная цель для пальца, а среди пациентов клиники будут пожилые
 * люди. Компактность добирается горизонтальными полями, а не высотой.
 */
const solidBySurface: Record<Surface, string> = {
  light: "bg-ink text-cream hover:bg-espresso",
  dark: "bg-cream text-ink hover:bg-paper",
  sky: "bg-cream text-sky-deep hover:bg-paper",
};

const ghostBySurface: Record<Surface, string> = {
  light: "border border-graphite text-ink hover:bg-ink hover:text-cream",
  dark: "border border-cream/40 text-cream hover:bg-cream hover:text-ink",
  sky: "border border-cream/50 text-cream hover:bg-cream hover:text-sky-deep",
};

type ButtonProps = {
  variant?: "solid" | "ghost";
  surface?: Surface;
  href?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children: React.ReactNode;
};

const base =
  "label-mono inline-flex min-h-11 items-center justify-center gap-2 rounded-button " +
  "px-5 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-45";

export function Button({
  variant = "solid",
  surface = "light",
  href,
  type = "button",
  onClick,
  disabled,
  className,
  children,
}: ButtonProps) {
  const classes = cn(
    base,
    variant === "solid" ? solidBySurface[surface] : ghostBySurface[surface],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
