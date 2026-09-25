import { cn } from "@/lib/cn";
import { SectionCounter } from "./section-counter";
import type { Surface } from "./hairline";

/**
 * Шапка секции: счётчик, заголовок и необязательное пояснение.
 *
 * Заголовок по умолчанию h2 — h1 на странице ровно один, и он живёт в первом
 * экране. Уровень вынесен в проп, чтобы на страницах услуг можно было опустить
 * заголовки до h3, не ломая иерархию.
 */
const titleBySurface: Record<Surface, string> = {
  light: "text-ink",
  dark: "text-cream",
  sky: "text-cream",
};

const textBySurface: Record<Surface, string> = {
  light: "text-graphite",
  dark: "text-stone",
  sky: "text-cream/85",
};

export function SectionHeading({
  title,
  description,
  counter,
  surface = "light",
  as: Tag = "h2",
  className,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  counter?: { current: number; total: number };
  surface?: Surface;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-5", className)}>
      {counter ? (
        <SectionCounter current={counter.current} total={counter.total} surface={surface} />
      ) : null}
      <Tag
        className={cn(
          "font-display text-heading-lg text-balance",
          titleBySurface[surface],
        )}
      >
        {title}
      </Tag>
      {description ? (
        <p className={cn("max-w-2xl text-body-lg", textBySurface[surface])}>{description}</p>
      ) : null}
    </div>
  );
}
