"use client";

import { cn } from "@/lib/cn";

export type FilterOption<T extends string> = { id: T; label: string; count: number };

/**
 * Ряд переключателей-фильтров: «Все · 7», «Хирургия · 2».
 *
 * Кнопки с aria-pressed, а не вкладки: вкладки обещают, что под каждой свой
 * раздел, а фильтр показывает тот же список, только короче.
 */
export function FilterChips<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  /** Название группы для скринридера: «Фильтр по направлениям». */
  label: string;
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(o.id)}
            className={cn(
              "label-mono inline-flex min-h-11 items-center gap-2 rounded-full border px-4 transition-colors duration-200",
              active
                ? "border-ink bg-ink text-cream"
                : "border-hairline text-graphite hover:border-graphite hover:text-ink",
            )}
          >
            {o.label}
            <span className={active ? "text-stone" : "text-graphite"}>{o.count}</span>
          </button>
        );
      })}
    </div>
  );
}
