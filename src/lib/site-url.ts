/**
 * Адрес сайта для канонических ссылок, карты сайта и превью в соцсетях.
 *
 * Берётся из переменной окружения SITE_URL, потому что домен ещё не выбран
 * (этап 10). Без неё — localhost: так в разработке ссылки ведут туда же,
 * где открыт сайт, а на проде забытая переменная сразу видна в превью.
 */
export const siteUrl = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export function absoluteUrl(path: string) {
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
