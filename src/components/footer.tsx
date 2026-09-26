import Link from "next/link";
import { CookieSettingsButton } from "@/components/analytics/cookie-banner";
import { Logo } from "@/components/logo";
import { Container } from "@/components/ui/container";
import { clinic, legal, mainNav } from "@/content/site";
import { metrikaId } from "@/lib/analytics";

/**
 * Подвал сайта.
 *
 * Фон — Ink, самая тёмная поверхность системы: подвал обозначает абсолютный
 * конец страницы и должен быть глубже контентных секций на эспрессо.
 *
 * Нижний блок — не формальность. Для медицинской организации публикация
 * лицензии, реквизитов и предупреждения о противопоказаниях обязательна, за
 * отсутствие штрафуют. Здесь заглушки; реальные данные и финальные
 * формулировки согласует юрист клиники — см. этап 5 в PLAN.md.
 */
const legalLinks = [
  { label: "Политика обработки персональных данных", href: "/legal/privacy" },
  { label: "Согласие на обработку данных", href: "/legal/consent" },
  { label: "Пользовательское соглашение", href: "/legal/terms" },
  { label: "Лицензия и документы", href: "/about#documents" },
];

export function Footer() {
  return (
    <footer className="bg-ink text-cream">
      <Container className="py-16 lg:py-20">
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div className="flex flex-col gap-6">
            <Logo variant="full" tone="onDark" />
            <p className="max-w-xs text-cream/70">
              Стоматология полного цикла: диагностика, лечение и наблюдение в одной клинике.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-3">
            <div className="flex flex-col gap-4">
              <p className="label-mono text-cream/60">Разделы</p>
              <ul className="flex flex-col gap-3">
                {mainNav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="transition-opacity hover:opacity-70">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <p className="label-mono text-cream/60">Контакты</p>
              <a href={clinic.phoneHref} className="font-display text-subheading">
                {clinic.phone}
              </a>
              <a href={`mailto:${clinic.email}`} className="transition-opacity hover:opacity-70">
                {clinic.email}
              </a>
              <p className="text-cream/70">{clinic.address}</p>
              <p className="text-cream/70">{clinic.schedule}</p>
            </div>

            <div className="flex flex-col gap-4">
              <p className="label-mono text-cream/60">Мессенджеры</p>
              <a
                href={clinic.telegram}
                className="transition-opacity hover:opacity-70"
                rel="noopener noreferrer"
                target="_blank"
              >
                Telegram
                <span className="sr-only"> (откроется в новой вкладке)</span>
              </a>
              <a
                href={clinic.whatsapp}
                className="transition-opacity hover:opacity-70"
                rel="noopener noreferrer"
                target="_blank"
              >
                WhatsApp
                <span className="sr-only"> (откроется в новой вкладке)</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-cream/15 pt-8">
          <ul className="flex flex-wrap gap-x-8 gap-y-3">
            {legalLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="label-mono text-cream/60 hover:text-cream">
                  {item.label}
                </Link>
              </li>
            ))}
            {/* Отозвать согласие должно быть так же просто, как дать. */}
            {metrikaId ? (
              <li>
                <CookieSettingsButton className="label-mono cursor-pointer text-cream/60 hover:text-cream" />
              </li>
            ) : null}
          </ul>

          <div className="flex flex-col gap-3 text-cream/50">
            <p className="text-caption">
              {legal.fullName}. ИНН {legal.inn} · ОГРН {legal.ogrn} · {clinic.address}
            </p>
            <p className="text-caption">
              Лицензия на осуществление медицинской деятельности № {legal.license.number} от{" "}
              {legal.license.date}, выдана {legal.license.issuer}.
            </p>
            <p className="text-caption">
              Имеются противопоказания, необходима консультация специалиста.
            </p>
            <p className="text-caption">
              Информация на сайте не является публичной офертой. Точная стоимость лечения
              определяется после осмотра врачом.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
