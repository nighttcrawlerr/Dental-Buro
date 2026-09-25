import { BookButton } from "@/components/lead/book-button";
import { ServiceCard } from "@/components/services/service-card";
import type { Service } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * Сетка карточек направлений на зазоре 1px поверх цвета линии — так
 * разделители получаются ровно между карточками, без рамок на каждой.
 *
 * У такой сетки есть слабое место: пустые ячейки в последнем ряду заливаются
 * цветом линии и выглядят серой дырой. Поэтому сетка всегда заканчивается
 * плиткой «не знаете, с чего начать», которая растягивается ровно на
 * оставшееся место. Если ряд заполнен целиком, плитка встаёт отдельной
 * строкой во всю ширину.
 *
 * Классы перечислены целиком, а не собираются из числа: Tailwind находит
 * классы по тексту исходника, и `md:col-span-${n}` он бы не увидел.
 */
const mdSpan = ["md:col-span-2", "md:col-span-1"];
const lgSpan = ["lg:col-span-3", "lg:col-span-1", "lg:col-span-2"];

export function ServicesGrid({
  items,
  className,
}: {
  /** Карточки с номером — номер задаётся снаружи и не зависит от фильтра. */
  items: { service: Service; number: number }[];
  className?: string;
}) {
  const n = items.length;
  const mdRest = (2 - (n % 2)) % 2;
  const lgRest = (3 - (n % 3)) % 3;

  return (
    <ul
      className={cn(
        "grid gap-px overflow-hidden rounded-card bg-hairline md:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {items.map(({ service, number }) => (
        <li key={service.slug} className="bg-paper">
          <ServiceCard service={service} number={number} />
        </li>
      ))}

      <li className={cn("bg-cream", mdSpan[mdRest], lgSpan[lgRest])}>
        <div className="flex h-full flex-col justify-between gap-8 p-8 lg:p-10">
          <div className="flex flex-col gap-4">
            <p className="font-display text-heading-sm text-ink">Не знаете, с чего начать?</p>
            <p className="max-w-md text-graphite">
              Приходите на осмотр. Врач посмотрит, сделает снимки и предложит план с фиксированной
              стоимостью — а решение вы примете уже дома.
            </p>
          </div>
          <BookButton className="self-start">Записаться на осмотр</BookButton>
        </div>
      </li>
    </ul>
  );
}
