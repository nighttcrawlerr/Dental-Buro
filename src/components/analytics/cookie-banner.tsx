"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { metrikaId, OPEN_CONSENT_EVENT, saveConsent, type Consent } from "@/lib/analytics";
import { useConsent } from "./use-consent";

/** Cookie Метрики начинаются с _ym. Удаляем на всех уровнях домена. */
function deleteMetrikaCookies() {
  const host = window.location.hostname;
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  for (const name of document.cookie.split(";").map((c) => c.split("=")[0].trim())) {
    if (!name.startsWith("_ym")) continue;
    for (const d of domains) {
      document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
    }
  }
}

/**
 * Плашка согласия на cookie аналитики.
 *
 * Появляется, только если подключена Метрика: без неё сайт cookie не
 * ставит и спрашивать не о чем. Два равноценных варианта, без «принять» на
 * всю ширину и мелкой ссылки «отказаться» — навязанное согласие закон
 * согласием не считает.
 *
 * Не модальная и не перекрывает страницу: человек, пришедший за телефоном
 * клиники, должен увидеть телефон, а не решать вопрос о cookie.
 */
export function CookieBanner() {
  const consent = useConsent();
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    const onOpen = () => setReopened(true);
    window.addEventListener(OPEN_CONSENT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, onOpen);
  }, []);

  // undefined — ещё на сервере или до гидратации: ничего не показываем,
  // иначе плашка мелькнёт у тех, кто давно сделал выбор.
  if (!metrikaId || consent === undefined) return null;
  if (consent !== null && !reopened) return null;

  function choose(next: Consent) {
    const revoked = consent === "all" && next === "necessary";
    saveConsent(next);
    setReopened(false);
    if (revoked) {
      // Работающий счётчик не выгрузить — только перезагрузкой.
      deleteMetrikaCookies();
      window.location.reload();
    }
  }

  return (
    <section
      aria-label="Настройки cookie"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto flex max-w-3xl flex-col gap-5 rounded-card border border-hairline bg-paper p-6 text-ink sm:flex-row sm:items-center sm:justify-between"
    >
      <p className="text-caption leading-normal tracking-normal text-graphite">
        Мы используем cookie Яндекс Метрики, чтобы понимать, какие страницы помогают пациентам, и
        делать сайт удобнее. Подробнее — в{" "}
        <Link href="/legal/privacy" className="text-ink underline underline-offset-2">
          политике обработки данных
        </Link>
        .
      </p>
      <div className="flex shrink-0 flex-wrap gap-2">
        <Button onClick={() => choose("all")}>Разрешить</Button>
        <Button variant="ghost" onClick={() => choose("necessary")}>
          Только необходимые
        </Button>
      </div>
    </section>
  );
}

/** Ссылка в подвале: вернуть плашку и изменить выбор. */
export function CookieSettingsButton({ className }: { className?: string }) {
  if (!metrikaId) return null;
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
      className={className}
    >
      Настройки cookie
    </button>
  );
}
