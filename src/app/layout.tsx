import type { Metadata } from "next";
import { Cormorant_Garamond, JetBrains_Mono, Onest } from "next/font/google";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LeadModalProvider } from "@/components/lead/lead-modal";
import { SmoothScroll } from "@/components/smooth-scroll";
import { siteUrl } from "@/lib/site-url";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500"],
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
        <a
          href="#content"
          className="label-mono sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60 focus:rounded-button focus:bg-ink focus:px-4 focus:py-3 focus:text-cream"
        >
          Перейти к содержимому
        </a>
        <SmoothScroll />
        <LeadModalProvider>
          <Header />
          <main id="content" className="flex-1">
            {children}
          </main>
          <Footer />
        </LeadModalProvider>
      </body>
    </html>
  );
}
