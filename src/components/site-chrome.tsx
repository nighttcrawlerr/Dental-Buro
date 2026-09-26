import { CookieBanner } from "@/components/analytics/cookie-banner";
import { Metrika } from "@/components/analytics/metrika";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { LeadModalProvider } from "@/components/lead/lead-modal";
import { JsonLd } from "@/components/seo/json-ld";
import { SmoothScroll } from "@/components/smooth-scroll";
import { clinicSchema } from "@/lib/schema";

/**
 * Оформление публичного сайта: шапка, подвал, окно записи, плавная
 * прокрутка, Метрика и плашка cookie.
 *
 * Вынесено из корневого layout, чтобы закрытый раздел /admin его не
 * получал. Главное там — не шапка, а Метрика: Вебвизор записывал бы экран
 * администратора со списком имён и телефонов.
 *
 * Используется в layout группы (site) и в корневой странице 404, которая
 * рендерится вне групп.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#content"
        className="label-mono sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-60 focus:rounded-button focus:bg-ink focus:px-4 focus:py-3 focus:text-cream"
      >
        Перейти к содержимому
      </a>
      {/* Клиника в разметке Schema.org — на всех страницах: услуги и врачи
          ссылаются на неё по @id. */}
      <JsonLd data={clinicSchema()} />
      <SmoothScroll />
      <LeadModalProvider>
        <Header />
        <main id="content" className="flex-1">
          {children}
        </main>
        <Footer />
      </LeadModalProvider>
      <Metrika />
      <CookieBanner />
    </>
  );
}
