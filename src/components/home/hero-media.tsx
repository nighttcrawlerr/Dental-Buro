"use client";

import { useEffect, useRef } from "react";
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
 * скрыто от скринридера.
 *
 * Кнопки паузы нет — решение владельца, кнопка мешала первому экрану. Это
 * отступление от WCAG 2.2.2 (уровень A): движение, которое запускается само
 * и идёт дольше 5 секунд, человек должен уметь остановить. Смягчает то, что
 * при «уменьшении движения» и на телефоне видео не запускается вовсе. Если
 * понадобится строгое соответствие — вернуть кнопку (см. историю git) или
 * останавливать видео через 5 секунд.
 */
export function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const allowed =
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
      window.matchMedia("(min-width: 768px)").matches;

    if (!allowed) return;

    video.play().catch(() => {
      // Браузер вправе отказать в автопроигрывании. Остаётся постер —
      // первый экран от этого не ломается.
    });
  }, []);

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
    </div>
  );
}
