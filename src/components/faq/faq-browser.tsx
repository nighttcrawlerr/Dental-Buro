"use client";

import Link from "next/link";
import { useState } from "react";
import { FaqList } from "@/components/faq/faq-list";
import { FilterChips } from "@/components/ui/filter-chips";
import type { ServiceFaq } from "@/content/service-details";

export type FaqGroup = { slug: string; title: string; items: ServiceFaq[] };

/**
 * Все вопросы по направлениям с переключателем. Под «Все» — группы с
 * заголовками, под конкретным направлением — только его вопросы.
 *
 * Скрытые группы не рендерятся, а не прячутся стилем: иначе поиск по
 * странице находил бы ответ в невидимой группе.
 */
export function FaqBrowser({ groups }: { groups: FaqGroup[] }) {
  const [active, setActive] = useState("all");

  const options = [
    { id: "all", label: "Все", count: groups.reduce((n, g) => n + g.items.length, 0) },
    ...groups.map((g) => ({ id: g.slug, label: g.title, count: g.items.length })),
  ];
  const shown = active === "all" ? groups : groups.filter((g) => g.slug === active);

  return (
    <div className="flex flex-col gap-14">
      <FilterChips label="Направление" options={options} value={active} onChange={setActive} />

      {shown.map((group) => (
        <section key={group.slug} className="grid gap-8 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-20">
          <div className="flex flex-col gap-4 lg:sticky lg:top-28 lg:self-start">
            <h2 className="font-display text-heading-lg text-ink">{group.title}</h2>
            <Link
              href={`/services/${group.slug}`}
              className="label-mono self-start text-graphite underline underline-offset-4 hover:text-ink"
            >
              Об услуге и цены
            </Link>
          </div>
          <FaqList items={group.items} />
        </section>
      ))}
    </div>
  );
}
