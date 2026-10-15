"use client";

import { useEffect, useRef } from "react";

/**
 * Прячет шапку при прокрутке вниз и возвращает при прокрутке вверх.
 *
 * Работает только на узком экране — там 80px шапки отъедают заметную долю
 * высоты, а полупрозрачная плашка поверх текста при чтении мешает. На
 * широком экране шапка остаётся липкой, это ограничено в CSS.
 *
 * Сам компонент ничего не рисует: ставит data-hidden на <header>, в котором
 * лежит, а сдвиг и анимация — в globals.css. Порог в несколько пикселей
 * нужен, чтобы шапка не дёргалась от дрожания пальца и докатки инерции.
 */
export function HeaderAutoHide() {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const header = ref.current?.closest("header");
    if (!header) return;

    const threshold = 8;
    let last = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - last;

      // У самого верха шапка видна всегда: под ней ещё нечего читать.
      if (y < header.offsetHeight) {
        header.removeAttribute("data-hidden");
      } else if (delta > threshold && !header.contains(document.activeElement)) {
        header.setAttribute("data-hidden", "");
      } else if (delta < -threshold) {
        header.removeAttribute("data-hidden");
      } else {
        return;
      }
      last = y;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    // Таб с клавиатуры в шапку должен её показать, иначе фокус уходит в
    // невидимую кнопку.
    const onFocus = () => header.removeAttribute("data-hidden");

    window.addEventListener("scroll", onScroll, { passive: true });
    header.addEventListener("focusin", onFocus);
    return () => {
      window.removeEventListener("scroll", onScroll);
      header.removeEventListener("focusin", onFocus);
      cancelAnimationFrame(frame);
    };
  }, []);

  return <span ref={ref} hidden />;
}
