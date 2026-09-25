"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { clinic } from "@/content/site";
import { priceSections } from "@/content/prices";
import { cn } from "@/lib/cn";
import { formatPriceItem, plural } from "@/lib/format";

/** Регистр и «ё» не должны мешать: «Лечение» = «лечение», «ретейнёр» = «ретейнер». */
function normalize(text: string) {
  return text.toLowerCase().replace(/ё/g, "е");
}

/**
 * Прейскурант с поиском.
 *
 * Поиск ищет каждое слово запроса отдельно и в любом порядке: «снимок
 * панорамный» находит «Панорамный снимок». Если запрос совпал с названием
 * раздела, раздел показывается целиком — человек, набравший «имплантация»,
 * хочет видеть всё про имплантацию, а не строки, где встречается это слово.
 *
 * Шапка таблицы прилипает под шапкой сайта. На длинном разделе иначе через
 * пару экранов непонятно, какой столбец что значит.
 */
export function PriceList() {
  const [query, setQuery] = useState("");
  const inputId = useId();

  const words = normalize(query).split(/\s+/).filter(Boolean);
  const matches = (text: string) => words.every((w) => normalize(text).includes(w));

  const sections = priceSections
    .map((section) => ({
      ...section,
      items:
        words.length === 0 || matches(section.title)
          ? section.items
          : section.items.filter((item) => matches(item.name)),
    }))
    .filter((section) => section.items.length > 0);

  const found = sections.reduce((sum, s) => sum + s.items.length, 0);

  return (
    <div className="flex flex-col gap-14">
      <div className="flex flex-col gap-6">
        <div className="flex max-w-xl flex-col gap-2">
          <label htmlFor={inputId} className="label-mono text-graphite">
            Поиск по прайсу
          </label>
          <input
            id={inputId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Например, имплант или снимок"
            autoComplete="off"
            className="block min-h-13 w-full rounded-button border border-hairline bg-paper px-4 text-body text-ink transition-colors placeholder:text-smoke hover:border-smoke focus:border-ink"
          />
        </div>

        {/* Оглавление по разделам. Во время поиска показывает только те, где
            что-то нашлось, — заодно видно, в каких разделах совпадения. */}
        <nav aria-label="Разделы прайса">
          <ul className="flex flex-wrap gap-2">
            {sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  className="label-mono inline-flex min-h-11 items-center rounded-full border border-hairline px-4 text-graphite transition-colors hover:border-graphite hover:text-ink"
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <p aria-live="polite" className="sr-only">
        {words.length ? `Найдено: ${plural(found, ["позиция", "позиции", "позиций"])}` : ""}
      </p>

      {sections.length === 0 ? (
        <div className="flex max-w-xl flex-col gap-3 border-t border-hairline pt-8">
          <p className="font-display text-heading-sm text-ink">
            По запросу «{query.trim()}» ничего не нашлось.
          </p>
          <p className="text-graphite">
            Попробуйте другое слово или позвоните — администратор подскажет цену:{" "}
            <a href={clinic.phoneHref} className="text-ink underline underline-offset-2">
              {clinic.phone}
            </a>
          </p>
        </div>
      ) : null}

      {sections.map((section) => (
        <section key={section.id} id={section.id} className="flex scroll-mt-28 flex-col gap-6">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 className="font-display text-heading-sm text-ink">{section.title}</h2>
            {section.service ? (
              <Link
                href={`/services/${section.service}`}
                className="label-mono text-graphite underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                Подробнее о направлении
              </Link>
            ) : null}
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr>
                {/* Прилипает под шапкой сайта: у неё высота 80px (top-20).
                    Линия снизу — внутренней тенью, а не рамкой: при
                    border-collapse рамка остаётся на месте, когда ячейка
                    прилипла, и шапка едет без линии. */}
                <th
                  scope="col"
                  className="label-mono sticky top-20 z-10 bg-cream shadow-[inset_0_-1px_0_var(--color-hairline)] py-3 pr-6 text-left font-normal text-graphite"
                >
                  Услуга
                </th>
                <th
                  scope="col"
                  className="label-mono sticky top-20 z-10 bg-cream shadow-[inset_0_-1px_0_var(--color-hairline)] py-3 text-right font-normal text-graphite"
                >
                  Стоимость
                </th>
              </tr>
            </thead>
            <tbody>
              {section.items.map((item) => (
                <tr key={item.name} className="border-b border-hairline">
                  <th scope="row" className="py-4 pr-6 text-left font-normal text-ink">
                    {item.name}
                  </th>
                  <td
                    className={cn(
                      "label-mono py-4 text-right whitespace-nowrap",
                      item.price === 0 ? "text-sky" : "text-ink",
                    )}
                  >
                    {formatPriceItem(item)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}
