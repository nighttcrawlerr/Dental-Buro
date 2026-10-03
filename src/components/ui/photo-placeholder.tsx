import { cn } from "@/lib/cn";

/**
 * Заглушка на месте будущего фото.
 *
 * Сделана нарочито служебной — подпись моноширинным, никакой имитации
 * содержимого. Серый прямоугольник, похожий на настоящее фото, обманывает и
 * нас, и заказчика: на согласовании такую заглушку перестают замечать и
 * выкатывают в продакшен.
 *
 * Заменяется на next/image, когда клиника пришлёт материалы.
 */
export function PhotoPlaceholder({
  label,
  ratio = "portrait",
  decorative,
  surface = "light",
  className,
}: {
  label: string;
  /**
   * Внутри ссылки или карточки, где рядом есть текст, картинка ничего не
   * добавляет — и скринридер не должен зачитывать «Заглушка: портрет врача»
   * перед именем. С настоящим фото это будет alt="".
   */
  decorative?: boolean;
  ratio?: "portrait" | "landscape" | "square";
  /**
   * Поверхность, на которой стоит заглушка, — от неё цвет подписи. Серый
   * graphite на бежевой заливке давал 3.91, ниже нормы 4.5 для мелкого текста.
   */
  surface?: "light" | "dark";
  className?: string;
}) {
  const ratioClass = {
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
    square: "aspect-square",
  }[ratio];

  return (
    <div
      {...(decorative
        ? { "aria-hidden": true }
        : { role: "img", "aria-label": `Заглушка: ${label}` })}
      className={cn(
        "media-in flex items-center justify-center rounded-media border border-dashed border-stone bg-linen",
        ratioClass,
        className,
      )}
    >
      <span
        className={cn(
          "label-mono px-4 text-center",
          surface === "dark" ? "text-stone" : "text-ink",
        )}
      >
        {label}
      </span>
    </div>
  );
}
