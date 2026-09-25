"use client";

import { useState } from "react";
import { ReviewCard } from "@/components/reviews/review-card";
import { FilterChips } from "@/components/ui/filter-chips";
import { reviews } from "@/content/site";
import { plural } from "@/lib/format";

const ALL = "Все";

/**
 * Все отзывы с фильтром по услуге. Услуги для фильтра берутся из самих
 * отзывов, а не из каталога: кнопка, под которой ноль отзывов, — тупик.
 */
export function ReviewsList() {
  const [filter, setFilter] = useState(ALL);

  const tags = [...new Set(reviews.map((r) => r.service))];
  const options = [
    { id: ALL, label: ALL, count: reviews.length },
    ...tags.map((t) => ({ id: t, label: t, count: reviews.filter((r) => r.service === t).length })),
  ];
  const visible = filter === ALL ? reviews : reviews.filter((r) => r.service === filter);

  return (
    <div className="flex flex-col gap-8">
      <FilterChips label="Фильтр по услуге" options={options} value={filter} onChange={setFilter} />

      <p aria-live="polite" className="sr-only">
        Показано: {plural(visible.length, ["отзыв", "отзыва", "отзывов"])}
      </p>

      <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((review) => (
          <li key={review.author}>
            <ReviewCard review={review} />
          </li>
        ))}
      </ul>
    </div>
  );
}
