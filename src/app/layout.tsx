import type { Metadata } from "next";
import { Cormorant_Garamond, JetBrains_Mono, Onest } from "next/font/google";
import { brand } from "@/content/site";
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
    default: `${brand.fullName} — стоматология полного цикла`,
    template: `%s — ${brand.fullName}`,
  },
  description:
    "Стоматологическая клиника «Дентал Бюро»: имплантация, ортодонтия, эстетическая реставрация. Цифровой протокол лечения и план до начала работ.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: brand.fullName,
  },
};

/**
 * Решает до первой отрисовки, показывать ли заставку (src/components/intro.tsx):
 * один раз за сессию, без «уменьшения движения», не в /admin. Через 3,2 с
 * атрибут снимается — к этому времени отыграли и заставка, и отложенные ею
 * анимации первого экрана, так что снятие задержки ничего не дёргает, а на
 * следующих страницах первый экран снова появляется без ожидания.
 */
const introScript = `try{var d=document.documentElement;if(location.pathname.indexOf("/admin")!==0&&!matchMedia("(prefers-reduced-motion: reduce)").matches&&!sessionStorage.getItem("db-intro")){sessionStorage.setItem("db-intro","1");d.setAttribute("data-intro","");setTimeout(function(){d.removeAttribute("data-intro")},3200)}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-scroll-behavior: на время перехода Next выключает плавную прокрутку,
    // и новая страница открывается сразу сверху, а не доезжает туда поверх
    // анимации перехода.
    <html
      lang="ru"
      data-scroll-behavior="smooth"
      // Атрибут data-intro ставит скрипт ниже до гидратации — расхождение
      // с серверной разметкой здесь намеренное.
      suppressHydrationWarning
      className={`${cormorant.variable} ${onest.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-cream">
        {/* Оформление сайта (шапка, подвал, Метрика) — в layout группы
            (site): у закрытого раздела /admin его быть не должно. */}
        {children}
      </body>
    </html>
  );
}
