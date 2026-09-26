import { SiteChrome } from "@/components/site-chrome";

/** Публичный сайт: все страницы для пациентов. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
