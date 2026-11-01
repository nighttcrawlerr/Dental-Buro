import Image from "next/image";
import { cn } from "@/lib/cn";

/** Фото в рамке заглушки: те же пропорции и скругление, чтобы замена не сдвигала вёрстку. */
export function Photo({
  src,
  alt,
  ratio = "landscape",
  sizes = "(min-width: 768px) 50vw, 100vw",
  priority,
  className,
}: {
  src: string;
  /** Пустой — если рядом подпись говорит то же самое. */
  alt: string;
  ratio?: "portrait" | "landscape" | "square";
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const ratioClass = { portrait: "aspect-[3/4]", landscape: "aspect-[4/3]", square: "aspect-square" }[ratio];

  return (
    <div className={cn("media-in relative overflow-hidden rounded-media bg-linen", ratioClass, className)}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}
