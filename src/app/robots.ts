import type { MetadataRoute } from "next";
import { absoluteUrl, isLiveSite } from "@/lib/site-url";

/**
 * robots.txt. Закрываем то, что не нужно в поиске: API, страницу
 * благодарности (иначе на неё будут приходить из поиска и портить цель в
 * аналитике) и витрину дизайн-системы.
 *
 * Пока сайт не на боевом домене, закрыт целиком: тестовая копия в выдаче
 * потом годами конкурирует с настоящим сайтом за те же запросы.
 *
 * Host нет: Яндекс перестал его читать в 2018-м, главное зеркало задаётся
 * редиректом и в Вебмастере.
 */

const disallow = ["/api/", "/admin", "/thanks", "/kitchen-sink"];

/**
 * Метки рекламы и аналитики, которые не меняют содержимое страницы.
 * Google склеивает такие адреса по canonical, Яндекс — медленно и не всегда,
 * поэтому ему они перечислены явно.
 */
const trackingParams = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "yclid",
  "ysclid",
  "gclid",
  "fbclid",
];
export default function robots(): MetadataRoute.Robots {
  if (!isLiveSite) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      // Своя секция для Яндекса заменяет общую, а не дополняет — запреты
      // повторяются.
      {
        userAgent: "Yandex",
        allow: "/",
        disallow,
        other: { "Clean-param": `${trackingParams.join("&")} /` },
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
