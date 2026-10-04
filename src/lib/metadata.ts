import type { Metadata } from "next";
import { ogSize } from "@/lib/og-image";

const siteName = "Dental Buro Clinic";
const defaultTitle = `${siteName} — стоматология полного цикла`;

/**
 * Метаданные страницы одним вызовом: заголовок, описание, канонический
 * адрес и превью для соцсетей и мессенджеров.
 *
 * Зачем обёртка: openGraph страницы не сливается с openGraph из layout, а
 * заменяет его целиком. Без неё каждая страница должна помнить о siteName,
 * locale и url, и какая-нибудь обязательно забудет.
 *
 * Картинка тоже терялась: превью из src/app/opengraph-image.tsx пропадало у
 * всех страниц со своим openGraph, и ссылка в мессенджере приходила без
 * картинки. Поэтому оно указано здесь явно. У врачей и услуг свои файлы
 * opengraph-image, и общее превью их перекрывало бы — хотя документация
 * обещает обратное, на деле побеждает объект. Такие страницы передают
 * ownImage, и общее превью не подставляется.
 */
export function pageMetadata({
  title,
  description,
  path,
  noindex,
  ownImage,
}: {
  /** Без названия клиники — его добавит шаблон из layout. */
  title?: string;
  description: string;
  /** Путь страницы: «/services/implantaciya». */
  path: string;
  noindex?: boolean;
  /** Рядом со страницей свой opengraph-image — общее превью не нужно. */
  ownImage?: boolean;
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
      ...(ownImage ? {} : { images: [{ url: "/opengraph-image", ...ogSize, alt: defaultTitle }] }),
    },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
