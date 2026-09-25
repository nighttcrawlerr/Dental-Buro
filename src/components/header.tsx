import { Logo } from "@/components/logo";
import { MainNav } from "@/components/main-nav";
import { MobileMenu } from "@/components/mobile-menu";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { clinic } from "@/content/site";

/**
 * Шапка сайта.
 *
 * Не липкая — так задумано в дизайн-системе, содержание важнее навигации.
 * Но для клиники это рискованно: пациент дочитывает до конца длинной страницы
 * и остаётся без кнопки записи. Компромисс — MobileCtaBar внизу экрана на
 * телефоне, где прокрутка длиннее всего.
 *
 * Сама шапка рендерится на сервере; клиентские только меню и подсветка
 * текущего раздела.
 */
export function Header() {
  return (
    <header className="border-b border-hairline bg-cream">
      <Container className="flex h-20 items-center justify-between gap-6">
        <Logo variant="compact" />

        <div className="flex items-center gap-4">
          <MainNav />

          <a
            href={clinic.phoneHref}
            className="label-mono hidden text-ink transition-opacity hover:opacity-70 xl:block"
          >
            {clinic.phone}
          </a>

          <Button href="/contacts" className="hidden lg:inline-flex">
            Записаться
          </Button>

          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
