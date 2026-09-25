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
  className,
}: {
  label: string;
  ratio?: "portrait" | "landscape" | "square";
  className?: string;
}) {
  const ratioClass = {
    portrait: "aspect-[3/4]",
    landscape: "aspect-[4/3]",
    square: "aspect-square",
  }[ratio];

  return (
    <div
      role="img"
      aria-label={`Заглушка: ${label}`}
      className={cn(
        "media-in flex items-center justify-center rounded-media border border-dashed border-stone bg-linen",
        ratioClass,
        className,
      )}
    >
      <span className="label-mono px-4 text-center text-graphite">{label}</span>
    </div>
  );
}
