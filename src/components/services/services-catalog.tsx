"use client";

import { useState } from "react";
import { ServicesGrid } from "@/components/services/services-grid";
import { serviceGroups, services, type ServiceGroup } from "@/content/site";
import { cn } from "@/lib/cn";

type Filter = ServiceGroup | "all";

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "Все" },
  ...serviceGroups,
];

function countLabel(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} направление`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} направления`;
  return `${n} направлений`;
}

/**
 * Сетка всех направлений с фильтром по группам.
 *
 * Фильтр — кнопки с aria-pressed, а не вкладки: вкладки обещают, что под
 * каждой свой раздел, а здесь один и тот же список, только короче.
 *
 * Номер на карточке — место услуги в полном списке, а не в отфильтрованном.
 * Иначе «Хирургия» была бы то 04, то 01, и номер ничего бы не значил.
 */
export function ServicesCatalog() {
  const [filter, setFilter] = useState<Filter>("all");

  const visible = services
    .map((service, index) => ({ service, number: index + 1 }))
    .filter(({ service }) => filter === "all" || service.group === filter);

  return (
    <div className="flex flex-col gap-8">
      <div role="group" aria-label="Фильтр по направлениям" className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const count =
            f.id === "all" ? services.length : services.filter((s) => s.group === f.id).length;
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f.id)}
              className={cn(
                "label-mono inline-flex min-h-11 items-center gap-2 rounded-full border px-4 transition-colors duration-200",
                active
                  ? "border-ink bg-ink text-cream"
                  : "border-hairline text-graphite hover:border-graphite hover:text-ink",
              )}
            >
              {f.label}
              <span className={active ? "text-stone" : "text-smoke"}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Скринридеру сообщаем, что список изменился: визуально это видно
          сразу, а на слух нажатие кнопки проходит беззвучно. */}
      <p aria-live="polite" className="sr-only">
        Показано: {countLabel(visible.length)}
      </p>

      <ServicesGrid items={visible} />
    </div>
  );
}
