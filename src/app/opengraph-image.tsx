import { ogContentType, ogSize, renderOgImage } from "@/lib/og-image";

/** Превью по умолчанию — для всех страниц, у которых нет своего. */
export const alt = "Дентал Бюро Клиник — стоматология полного цикла";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "Стоматология полного цикла",
    title: "Стоматология, которой не боятся.",
    note: "План лечения с фиксированной стоимостью",
  });
}
