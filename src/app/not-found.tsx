import Link from "next/link";
import { SiteChrome } from "@/components/site-chrome";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { clinic } from "@/content/site";

const popular = [
  { label: "Услуги и цены", href: "/services" },
  { label: "Врачи", href: "/doctors" },
  { label: "Прейскурант", href: "/prices" },
  { label: "Контакты", href: "/contacts" },
];

/**
 * 404. Сюда чаще всего попадают по старой ссылке или с опечаткой в адресе.
 * Не извиняемся абзацем, а сразу даём, куда пойти, — и телефон, потому что
 * человек, скорее всего, хотел записаться.
 */
export default function NotFound() {
  // Корневая 404 рендерится вне группы (site), поэтому оформление сайта
  // подключает сама — иначе человек с опечаткой в адресе остался бы без
  // шапки, меню и телефона в подвале.
  return (
    <SiteChrome>
      <section className="bg-cream">
        <Container className="flex flex-col gap-12 py-24 lg:py-32">
          <div className="flex max-w-3xl flex-col gap-6">
            <p className="label-mono text-sky">Ошибка 404</p>
            <h1 className="font-display text-display text-balance text-ink">Такой страницы нет.</h1>
            <p className="max-w-xl text-body-lg text-graphite">
              Возможно, ссылка устарела или в адресе опечатка. Вот что обычно ищут:
            </p>
          </div>

          <ul className="flex flex-wrap gap-2">
            {popular.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="label-mono inline-flex min-h-11 items-center rounded-full border border-hairline px-4 text-ink transition-colors hover:border-ink"
                >
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap gap-3">
            <Button href="/">На главную</Button>
            <Button variant="ghost" href={clinic.phoneHref}>
              {clinic.phone}
            </Button>
          </div>
        </Container>
      </section>
    </SiteChrome>
  );
}
