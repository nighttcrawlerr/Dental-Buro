import { Fragment } from "react";
import { cn } from "@/lib/cn";

/**
 * Пословное раскрытие заголовка.
 *
 * Каждое слово закрыто плашкой цвета текста, которая уезжает вправо по мере
 * прокрутки. Приём взят с сайта-образца: там при прокрутке заголовок собирается
 * из тёмных прямоугольников.
 *
 * Держим на двух-трёх заголовках страницы. На всех восьми это перестаёт быть
 * приёмом и становится аттракционом, который раздражает на втором заходе.
 *
 * Для скринридера и для поиска это обычный текст: плашки нарисованы поверх и
 * помечены как декоративные, слова из разметки никуда не исчезают.
 */
export function RevealWords({
  text,
  /**
   * scroll — плашки снимаются по мере прокрутки; для заголовков ниже сгиба.
   * load — сразу после загрузки страницы; для первого экрана, который на
   * момент загрузки уже виден и по прокрутке анимироваться не может.
   */
  trigger = "scroll",
  className,
}: {
  text: string;
  trigger?: "scroll" | "load";
  className?: string;
}) {
  const words = text.split(" ");

  return (
    <span className={cn(trigger === "load" && "rw-load", className)}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className="rw-word" style={{ "--i": index } as React.CSSProperties}>
            {word}
            <span aria-hidden="true" className="rw-block" />
          </span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}
