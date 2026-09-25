import { clinic } from "@/content/site";

/**
 * Закреплённая внизу экрана панель «Позвонить / Записаться». Только телефоны.
 *
 * Шапка по дизайн-системе не липкая, и на длинной странице услуги пациент
 * доходит до конца без единой кнопки записи в поле зрения. На десктопе это
 * терпимо — там есть шапка в одном движении колеса. На телефоне прокрутка
 * втрое длиннее, поэтому кнопка едет с пользователем.
 *
 * Высота панели компенсируется отступом снизу у body, иначе она накрывает
 * последние строки подвала.
 */
export function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-cream/95 backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-[1200px] gap-3 px-4 py-3">
        <a
          href={clinic.phoneHref}
          className="label-mono flex min-h-11 flex-1 items-center justify-center rounded-button border border-graphite text-ink"
        >
          Позвонить
        </a>
        <a
          href="/contacts"
          className="label-mono flex min-h-11 flex-1 items-center justify-center rounded-button bg-ink text-cream"
        >
          Записаться
        </a>
      </div>
    </div>
  );
}
