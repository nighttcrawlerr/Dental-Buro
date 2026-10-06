/**
 * Адрес сайта для канонических ссылок, карты сайта и превью в соцсетях.
 *
 * Берётся из переменной окружения SITE_URL, потому что домен ещё не выбран
 * (этап 10). Без неё — localhost: так в разработке ссылки ведут туда же,
 * где открыт сайт, а на проде забытая переменная сразу видна в превью.
 */
// Пустая строка — тоже «не задан»: Dockerfile объявляет SITE_URL всегда, и
// без аргумента сборки переменная есть, но пустая.
const configured = process.env.SITE_URL?.trim() || undefined;

export const siteUrl = (configured ?? "http://localhost:3000").replace(/\/$/, "");

export function absoluteUrl(path: string) {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Боевой ли это сайт: задан SITE_URL, и он не localhost. По этому флагу
 * robots.txt открывает сайт поисковикам, а служебные страницы прячутся.
 */
export const isLiveSite = configured !== undefined && !siteUrl.includes("localhost");
