import { cn } from "@/lib/cn";

/**
 * Колонка контента шириной 1200px по центру.
 *
 * Тёмные и светлые секции растягиваются во всю ширину экрана, а контент внутри
 * держится этой колонки — так работает ритм полос из дизайн-системы. Боковые
 * поля растут со шириной экрана: 16 → 24 → 40px.
 */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-10", className)}>
      {children}
    </div>
  );
}
