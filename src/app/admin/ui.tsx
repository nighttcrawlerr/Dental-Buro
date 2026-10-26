import { cn } from "@/lib/cn";
import { leadStatuses, type LeadStatus } from "@/lib/lead-statuses";

/*
 * Общие кусочки раздела заявок. Своих компонентов у сайта под плотный
 * рабочий интерфейс нет: кнопки и поля сайта рассчитаны на крупный шрифт
 * и анимации, здесь нужна таблица, которую читают весь день.
 */

/**
 * Статусы различаются формой, а не только цветом: в палитре сайта нет
 * зелёного и красного, а подпись есть всегда. «Новая» — единственная
 * залитая, на неё глаз должен попадать первым.
 */
const statusTone: Record<LeadStatus, string> = {
  new: "border-sky bg-sky text-cream",
  called: "border-sky bg-paper text-sky",
  booked: "border-bronze bg-paper text-bronze",
  declined: "border-hairline bg-cream text-graphite",
  spam: "border-hairline bg-cream text-graphite line-through",
};

export function statusLabel(status: string) {
  return leadStatuses.find((s) => s.value === status)?.label ?? status;
}

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={cn(
        "label-mono inline-flex items-center rounded-full border px-2.5 py-0.5 whitespace-nowrap",
        statusTone[status],
      )}
    >
      {statusLabel(status)}
    </span>
  );
}

/** Поле ввода в духе формы записи, но ниже: здесь 15px текста, а не 18. */
export const fieldClass =
  "block min-h-11 w-full rounded-button border border-smoke bg-paper px-3 text-[15px] text-ink placeholder:text-graphite hover:border-graphite focus:border-ink";

export const buttonClass =
  "label-mono inline-flex min-h-11 cursor-pointer items-center justify-center rounded-button bg-ink px-4 text-cream hover:bg-espresso";

export const ghostButtonClass =
  "label-mono inline-flex min-h-11 cursor-pointer items-center justify-center rounded-button border border-hairline bg-paper px-4 text-ink hover:border-graphite";

export const cardClass = "rounded-card border border-hairline bg-paper";

/** Пилюля фильтра — та же, что была на вкладках статусов. */
export function pillClass(active: boolean) {
  return cn(
    "label-mono inline-flex min-h-10 items-center gap-2 rounded-full border px-4",
    active ? "border-ink bg-ink text-cream" : "border-hairline bg-paper text-graphite hover:border-graphite",
  );
}
