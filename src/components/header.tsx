import { Logo } from "@/components/logo";
import { MainNav } from "@/components/main-nav";
import { MobileMenu } from "@/components/mobile-menu";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { clinic } from "@/content/site";

/**
 * Шапка сайта — липкая.
 *
 * Восстановленный DESIGN.md утверждает «no sticky header», но на записи
 * настоящего сайта-референса шапка висит сверху на всех без исключения
 * позициях прокрутки. Документ восстановлен по внешнему виду и в этом месте
 * ошибается, поэтому идём за реальным сайтом.
 *
 * Для клиники это к тому же снимает отдельную проблему: кнопка записи всегда
 * на экране, и не нужна закреплённая панель внизу, которая на телефоне
 * отъедала высоту и накрывала подвал.
 *
 * Сама шапка рендерится на сервере; клиентские только меню и подсветка
 * текущего раздела.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-cream/90 backdrop-blur-md">
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

          {/* На телефоне кнопка остаётся, но без слова «на приём» — иначе
              шапка переносится в две строки на 375px. */}
          <Button href="/contacts">Записаться</Button>

          <MobileMenu />
        </div>
      </Container>
    </header>
  );
}
