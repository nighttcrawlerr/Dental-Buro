"use client";

import { useState } from "react";
import { ServicesGrid } from "@/components/services/services-grid";
import { FilterChips } from "@/components/ui/filter-chips";
import { serviceGroups, services, type ServiceGroup } from "@/content/site";
import { plural } from "@/lib/format";

type Filter = ServiceGroup | "all";

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "Все" },
  ...serviceGroups,
];

/**
 * Сетка всех направлений с фильтром по группам.
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
      <FilterChips
        label="Фильтр по направлениям"
        options={filters.map((f) => ({
          ...f,
          count:
            f.id === "all" ? services.length : services.filter((s) => s.group === f.id).length,
        }))}
        value={filter}
        onChange={setFilter}
      />

      {/* Скринридеру сообщаем, что список изменился: визуально это видно
          сразу, а на слух нажатие кнопки проходит беззвучно. */}
      <p aria-live="polite" className="sr-only">
        Показано: {plural(visible.length, ["направление", "направления", "направлений"])}
      </p>

      <ServicesGrid items={visible} />
    </div>
  );
}
