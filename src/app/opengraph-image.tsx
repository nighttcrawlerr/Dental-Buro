import { defaultTitle } from "@/lib/metadata";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

/** Превью по умолчанию — для всех страниц, у которых нет своего. */
export const alt = defaultTitle;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "Стоматология полного цикла",
    title: "Стоматология, которой не боятся.",
    note: "План лечения с фиксированной стоимостью",
  });
}
