import Link from "next/link";
import { cn } from "@/lib/cn";
import type { Surface } from "./hairline";

/** Поворот стрелки: вперёд, назад, вверх-вправо для внешних ссылок. */
export type ArrowDirection = "right" | "left" | "up-right";

const rotationByDirection: Record<ArrowDirection, string> = {
  right: "",
  left: "rotate-180",
  "up-right": "-rotate-45",
};

/**
 * Акцент системы — Sky, он же цвет знака. Бронза осталась в палитре, но
 * действия больше не красит.
 *
 * На секции Sky Silver акцент не может быть самим Sky — он исчезнет в фоне,
 * как исчезала доля знака. Там и на эспрессо заливка уходит в светлый конец
 * той же синей гаммы, а иконка внутри становится тёмной.
 */
const fillBySurface: Record<Surface, string> = {
  light: "bg-sky text-cream hover:bg-sky-deep",
  dark: "bg-sky-pale text-sky-deep hover:bg-cream",
  sky: "bg-sky-pale text-sky-deep hover:bg-cream",
};

/**
 * Глиф стрелки без кнопки вокруг.
 *
 * Нужен внутри карточек, где ссылкой работает вся карточка: там стрелка
 * декоративная. Если поставить туда настоящую кнопку-ссылку, на один адрес
 * придётся две ссылки подряд — клавиатура пройдёт их дважды, а скринридер
 * зачитает дубль.
 */
export function ArrowGlyph({
  direction = "right",
  className,
}: {
  direction?: ArrowDirection;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn(
        "size-5 transition-transform duration-300 group-hover:translate-x-1",
        rotationByDirection[direction],
        className,
      )}
    >
      <path d="M4 12h15" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}

/** Оформление подложки под глифом — общее у кнопки и у стрелок внутри карточек. */
export function arrowSurfaceClasses(surface: Surface = "light") {
  return cn(
    "inline-flex size-11 shrink-0 items-center justify-center rounded-button transition-colors duration-200",
    fillBySurface[surface],
  );
}

type ArrowButtonProps = {
  surface?: Surface;
  href?: string;
  onClick?: () => void;
  /** Куда ведёт. Читается вслух скринридером, поэтому пишем по-человечески. */
  label: string;
  direction?: ArrowDirection;
  className?: string;
};

/**
 * Квадратная кнопка со стрелкой — единственное место, где акцент заливает
 * целую форму. Работает как сигнальная лампа: «сюда, дальше».
 *
 * Размер 44×44, а не 40×40 из исходной дизайн-системы: 40px меньше
 * минимальной цели для пальца, а кнопка ставится в конце карточек, куда
 * пациент тычет на телефоне.
 *
 * Подпись обязательна: визуального текста у кнопки нет, и без неё скринридер
 * прочитает пустую ссылку.
 */
export function ArrowButton({
  surface = "light",
  href,
  onClick,
  label,
  direction = "right",
  className,
}: ArrowButtonProps) {
  const classes = cn(arrowSurfaceClasses(surface), className);
  const icon = <ArrowGlyph direction={direction} />;

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
