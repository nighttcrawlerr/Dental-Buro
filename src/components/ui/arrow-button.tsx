import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Surface } from "./hairline";

/**
 * Квадратная кнопка со стрелкой — единственное место, где акцент заливает
 * целую форму. Работает как сигнальная лампа: «сюда, дальше».
 *
 * Размер 44×44, а не 40×40 из исходной дизайн-системы: 40px меньше
 * минимальной цели для пальца, а кнопка ставится в конце карточек, куда
 * пациент тычет на телефоне.
 *
 * Иконка не декоративная: у кнопки всегда есть текстовая подпись для
 * скринридера, потому что визуальной подписи у неё нет.
 */
const fillBySurface: Record<Surface, string> = {
  light: "bg-bronze text-cream hover:bg-clay",
  dark: "bg-bronze-soft text-espresso hover:bg-linen",
  sky: "bg-bronze-soft text-sky-deep hover:bg-linen",
};

type ArrowButtonProps = {
  surface?: Surface;
  href?: string;
  onClick?: () => void;
  /** Куда ведёт. Читается вслух скринридером, поэтому пишем по-человечески. */
  label: string;
  /** Поворот стрелки: вперёд, назад, вверх-вправо для внешних ссылок. */
  direction?: "right" | "left" | "up-right";
  className?: string;
};

const rotationByDirection = {
  right: "",
  left: "rotate-180",
  "up-right": "-rotate-45",
};

export function ArrowButton({
  surface = "light",
  href,
  onClick,
  label,
  direction = "right",
  className,
}: ArrowButtonProps) {
  const classes = cn(
    "inline-flex size-11 shrink-0 items-center justify-center rounded-button transition-colors duration-200",
    fillBySurface[surface],
    className,
  );

  const icon = (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("size-5", rotationByDirection[direction])}
    >
      <path d="M4 12h15" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );

  if (href) {
    return (
      <Link href={href} aria-label={label} className={classes}>
        {icon}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} aria-label={label} className={classes}>
      {icon}
    </button>
  );
}
