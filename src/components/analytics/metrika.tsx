"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { goals, metrikaId, reachGoal, sendHit } from "@/lib/analytics";
import { useConsent } from "./use-consent";

/**
 * Яндекс Метрика. Загружается только после согласия на cookie.
 *
 * Сайт переходит между страницами без перезагрузки, поэтому просмотры
 * страниц отправляются вручную (hit) при смене адреса — сама Метрика видит
 * только первую загрузку.
 *
 * Клики по телефону и мессенджерам ловятся одним обработчиком на весь
 * документ: ссылки tel: разбросаны по шапке, подвалу, контактам и формам, и
 * вешать цель на каждую руками — гарантированно забыть одну.
 */
export function Metrika() {
  const consent = useConsent();
  const pathname = usePathname();
  const loaded = useRef(false);

  // Загрузка счётчика — стандартный код Метрики, переписанный без eval-строк.
  useEffect(() => {
    if (!metrikaId || consent !== "all" || loaded.current) return;
    loaded.current = true;

    const w = window as unknown as {
      ym?: ((...args: unknown[]) => void) & { a?: unknown[]; l?: number };
    };
    w.ym =
      w.ym ??
      Object.assign(
        (...args: unknown[]) => {
          (w.ym!.a = w.ym!.a ?? []).push(args);
        },
        { l: Date.now() },
      );

    const script = document.createElement("script");
    script.async = true;
    script.src = "https://mc.yandex.ru/metrika/tag.js";
    document.head.appendChild(script);

    w.ym(metrikaId, "init", {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
    });
  }, [consent]);

  // Просмотр страницы при переходе без перезагрузки. Эффект срабатывает
  // только на смену адреса, а к первой странице счётчик ещё не загружен —
  // её Метрика засчитывает сама при init, дубля нет.
  useEffect(() => {
    if (loaded.current) sendHit(window.location.href);
  }, [pathname]);

  useEffect(() => {
    if (pathname === "/prices") reachGoal(goals.pricesViewed);
  }, [pathname, consent]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.("a[href]");
      const href = link?.getAttribute("href") ?? "";
      if (href.startsWith("tel:")) reachGoal(goals.phoneClick);
      else if (/^https:\/\/(t\.me|wa\.me)\//.test(href)) reachGoal(goals.messengerClick);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
