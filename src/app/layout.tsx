import type { Metadata } from "next";
import { Cormorant_Garamond, JetBrains_Mono, Onest } from "next/font/google";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  // Только 400: .font-display задаёт именно его, других начертаний на сайте
  // нет. Каждый лишний вес — ещё два файла шрифта в предзагрузке.
  weight: ["400"],
  display: "swap",
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "cyrillic"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  // Относительные адреса в метаданных (canonical, картинки превью)
  // достраиваются от него.
  metadataBase: new URL(siteUrl),
  title: {
    default: "Dental Buro Clinic — стоматология полного цикла",
    template: "%s — Dental Buro Clinic",
  },
  description:
    "Стоматологическая клиника Dental Buro: имплантация, ортодонтия, эстетическая реставрация. Цифровой протокол лечения и план до начала работ.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "Dental Buro Clinic",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ru"
      className={`${cormorant.variable} ${onest.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-cream">
        {/* Оформление сайта (шапка, подвал, Метрика) — в layout группы
            (site): у закрытого раздела /admin его быть не должно. */}
        {children}
      </body>
    </html>
  );
}
