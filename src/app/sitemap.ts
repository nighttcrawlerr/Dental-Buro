import type { MetadataRoute } from "next";
import { legalDocs } from "@/content/legal";
import { doctors, services } from "@/content/site";
import { absoluteUrl } from "@/lib/site-url";

/**
 * Карта сайта для поисковиков. Собирается из тех же данных, что и страницы,
 * поэтому новая услуга или врач попадают сюда сами.
 *
 * Служебных страниц нет намеренно: /thanks и /kitchen-sink закрыты от
 * индексации, а черновики юридических документов появятся здесь, когда с
 * них снимут пометку.
 *
 * lastModified не ставим: без реальной даты изменения Яндекс и Google
 * быстро перестают ему верить.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/services",
    ...services.map((s) => `/services/${s.slug}`),
    "/doctors",
    ...doctors.map((d) => `/doctors/${d.slug}`),
    "/prices",
    "/about",
    "/reviews",
    "/contacts",
    ...legalDocs.filter((d) => !d.draft).map((d) => `/legal/${d.slug}`),
  ];

  return paths.map((path) => ({ url: absoluteUrl(path) }));
}
