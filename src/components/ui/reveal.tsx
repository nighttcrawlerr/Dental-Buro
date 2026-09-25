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
  as: Tag = "div",
  className,
  children,
}: {
  index?: number;
  as?: "div" | "li" | "section" | "span";
  className?: string;
  children: React.ReactNode;
}) {
  const staggered = typeof index === "number";

  return (
    <Tag
      className={cn(staggered ? "reveal-item" : "reveal", className)}
      style={staggered ? ({ "--i": index } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
