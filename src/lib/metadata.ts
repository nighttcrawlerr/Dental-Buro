import type { Metadata } from "next";

const siteName = "Dental Buro Clinic";
const defaultTitle = `${siteName} — стоматология полного цикла`;

/**
 * Метаданные страницы одним вызовом: заголовок, описание, канонический
 * адрес и превью для соцсетей и мессенджеров.
 *
 * Зачем обёртка: openGraph страницы не сливается с openGraph из layout, а
 * заменяет его целиком. Без неё каждая страница должна помнить о siteName,
 * locale и url, и какая-нибудь обязательно забудет.
 */
export function pageMetadata({
  title,
  description,
  path,
  noindex,
}: {
  /** Без названия клиники — его добавит шаблон из layout. */
  title?: string;
  description: string;
  /** Путь страницы: «/services/implantaciya». */
  path: string;
  noindex?: boolean;
}): Metadata {
  const fullTitle = title ? `${title} — ${siteName}` : defaultTitle;

  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "ru_RU",
      siteName,
      url: path,
      title: fullTitle,
      description,
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
