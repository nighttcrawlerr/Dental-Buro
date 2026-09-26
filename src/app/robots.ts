import type { MetadataRoute } from "next";
import { absoluteUrl, siteUrl } from "@/lib/site-url";

/**
 * robots.txt. Закрываем то, что не нужно в поиске: API, страницу
 * благодарности (иначе на неё будут приходить из поиска и портить цель в
 * аналитике) и витрину дизайн-системы.
 *
 * Пока сайт не на боевом домене, закрыт целиком: тестовая копия в выдаче
 * потом годами конкурирует с настоящим сайтом за те же запросы.
 */
export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.SITE_URL !== undefined && !siteUrl.includes("localhost");

  if (!isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/thanks", "/kitchen-sink"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteUrl,
  };
}
