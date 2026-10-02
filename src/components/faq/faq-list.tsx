import type { ServiceFaq } from "@/content/service-details";

/**
 * Список вопросов с раскрывающимися ответами — на странице услуги и на
 * общей странице вопросов.
 *
 * Нативный details: раскрывается с клавиатуры, находится поиском по
 * странице и не требует ни строчки скрипта.
 */
export function FaqList({ items }: { items: ServiceFaq[] }) {
  return (
    <div className="flex flex-col">
      {items.map((item) => (
        <details key={item.question} className="group border-t border-hairline last:border-b">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
            <span className="font-display text-heading-sm text-ink">{item.question}</span>
            <span
              aria-hidden="true"
              className="flex size-11 shrink-0 items-center justify-center rounded-button border border-hairline text-ink transition-transform duration-300 group-open:rotate-45"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="size-5"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
          </summary>
          <p className="max-w-2xl pb-8 text-body-lg text-graphite">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
