"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Плавная прокрутка.
 *
 * Единственное место на сайте, где мы перехватываем нативное поведение
 * браузера, поэтому ограничений здесь больше, чем кода:
 *
 * 1. При включённом «уменьшении движения» не запускается вообще. Инерционная
 *    прокрутка у части людей вызывает настоящую тошноту, а среди пациентов
 *    клиники будут пожилые.
 * 2. На тач-устройствах не трогаем ничего. Нативная прокрутка на телефоне
 *    отработана производителем и на среднем Android заметно плавнее любой
 *    эмуляции; плюс перехват ломает жест «свайп назад».
 * 3. Прокрутка остаётся настоящей — Lenis двигает реальный scrollTop, а не
 *    трансформирует обёртку. Поэтому продолжают работать поиск по странице,
 *    якорные ссылки и CSS-анимации, привязанные к прокрутке.
 * 4. Переход на другую страницу гасит инерцию. Иначе клик посреди прокрутки
 *    колесом даёт такую картину: Next поднимает новую страницу наверх, а
 *    Lenis ещё докатывается к своей цели и утаскивает её обратно вниз —
 *    анимация перехода разыгрывается за кадром.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      // На тач-устройствах остаётся нативная прокрутка.
      syncTouch: false,
    });

    let frame = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);

    // stop + start — публичный способ сбросить инерцию: прокрутка
    // останавливается там, где сейчас стоит страница. В фазе перехвата —
    // раньше, чем Next начнёт переход по ссылке.
    const settle = () => {
      lenis.stop();
      lenis.start();
    };
    const onClick = (event: MouseEvent) => {
      if (event.target instanceof Element && event.target.closest("a[href]")) settle();
    };
    document.addEventListener("click", onClick, true);
    window.addEventListener("popstate", settle);

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("popstate", settle);
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
