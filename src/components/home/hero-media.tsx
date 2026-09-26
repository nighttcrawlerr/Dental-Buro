"use client";

import { useEffect, useRef, useState } from "react";
import { heroMedia } from "@/content/site";

/**
 * Видео на фоне первого экрана.
 *
 * Атрибута autoplay намеренно нет. Вместо него проигрывание запускается
 * скриптом и только при двух условиях: человек не просил уменьшить движение и
 * экран шире телефона. Причины:
 *
 * 1. Движущаяся картинка под текстом — сильный раздражитель для людей с
 *    вестибулярными нарушениями, а среди пациентов клиники будут пожилые.
 * 2. На телефоне это мегабайты мобильного трафика ради фона, который
 *    наполовину закрыт текстом. Там остаётся постер — один кадр.
 *
 * Постер показывается всегда и грузится первым, поэтому первый экран не бывает
 * пустым, даже пока видео качается.
 *
 * Видео декоративное: оно ничего не сообщает сверх текста рядом, поэтому
 * скрыто от скринридера. Но кнопка паузы у него есть: движение, которое
 * запускается само и идёт дольше 5 секунд, человек должен уметь остановить
 * (WCAG 2.2.2, уровень A — декоративность от этого не освобождает).
 */
export function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);
  // off — видео не запускалось (телефон, «уменьшение движения», отказ
  // браузера): управлять нечем, кнопки нет.
  const [status, setStatus] = useState<"off" | "playing" | "paused">("off");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const allowed =
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      window.matchMedia("(min-width: 768px)").matches;

    if (!allowed) return;

    video
      .play()
      .then(() => setStatus("playing"))
      .catch(() => {
        // Браузер вправе отказать в автопроигрывании. Остаётся постер —
        // первый экран от этого не ломается.
      });
  }, []);

  function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (status === "playing") {
      video.pause();
      setStatus("paused");
    } else {
      video.play().then(() => setStatus("playing")).catch(() => {});
    }
  }

  if (!heroMedia) return null;

  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          className="hero-video size-full object-cover"
          poster={heroMedia.poster}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src={heroMedia.video} type="video/mp4" />
        </video>

        {/*
          Подложка 75% плотности. Значение не на глаз: даже если кадр видео
          окажется белым, кремовый текст поверх даёт контраст 4.83 — выше нормы
          4.5 для мелкого текста. Так первый экран читается на любом материале,
          который пришлёт клиника.
        */}
        <div className="absolute inset-0 bg-espresso/75" />
      </div>

      {status !== "off" ? (
        <button
          type="button"
          onClick={toggle}
          aria-label={status === "playing" ? "Остановить фоновое видео" : "Включить фоновое видео"}
          className="absolute right-4 bottom-4 z-10 flex size-11 items-center justify-center rounded-button border border-cream/40 text-cream transition-colors hover:bg-cream hover:text-ink sm:right-6 sm:bottom-6"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-4">
            {status === "playing" ? (
              <path d="M7 5h3v14H7zM14 5h3v14h-3z" />
            ) : (
              <path d="M8 5l11 7-11 7z" />
            )}
          </svg>
        </button>
      ) : null}
    </div>
  );
}
