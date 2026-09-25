"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

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

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return null;
}
