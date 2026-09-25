import { cn } from "@/lib/cn";

/**
 * Появление блока при въезде в экран.
 *
 * Серверный компонент — вся механика живёт в CSS, здесь только класс и индекс
 * для волны. Ничего не прячется за скриптом: если браузер не умеет анимации по
 * прокрутке, содержимое просто видно сразу.
 */
export function Reveal({
  /** Порядковый номер в группе. Задаёт задержку, чтобы карточки шли волной. */
  index,
  /** load — для содержимого первого экрана, оно по прокрутке не анимируется. */
  trigger = "scroll",
  as: Tag = "div",
  className,
  children,
}: {
  index?: number;
  trigger?: "scroll" | "load";
  as?: "div" | "li" | "section" | "span";
  className?: string;
  children: React.ReactNode;
}) {
  const staggered = typeof index === "number";
  const motionClass =
    trigger === "load" ? "reveal-load" : staggered ? "reveal-item" : "reveal";

  return (
    <Tag
      className={cn(motionClass, className)}
      style={staggered ? ({ "--i": index } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
