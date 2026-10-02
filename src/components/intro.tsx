import { LogoMark, PATH_CUT, PATH_TOOTH } from "@/components/logo";

/**
 * Заставка первого захода: с контура зуба съезжает кремовая шторка, знак
 * заливается цветом, и заставка уезжает вверх занавесом, открывая первый
 * экран. Шторка — тот же приём, что раскрывает слова в заголовках.
 *
 * Всё движение — transform и opacity. Заставка идёт ровно в те полсекунды,
 * когда браузер загружает и оживляет страницу, и основной поток подвисает
 * на 120–160 мс. Прорисовка линии (stroke-dashoffset) считается в основном
 * потоке и на этих паузах дёргалась; transform и opacity браузер ведёт
 * отдельно и не замечает занятости.
 *
 * Показывать ли её, решает скрипт в <head> (src/app/layout.tsx) ещё до
 * первой отрисовки: только первый заход за сессию и только без «уменьшения
 * движения». Он ставит на <html> атрибут data-intro, а всё движение — в CSS
 * (.intro в globals.css). Без атрибута заставки нет совсем, в том числе без
 * JavaScript.
 *
 * Первый экран под ней уже отрисован, поэтому скорость загрузки (LCP) она не
 * портит. Клики проходят сквозь неё: заставка не должна ничего задерживать.
 */
export function Intro() {
  return (
    <div aria-hidden="true" className="intro">
      <div className="intro-mark relative h-24 lg:h-32">
        <svg viewBox="6 8 88 102" className="intro-outline absolute inset-0 h-full w-auto">
          <path d={PATH_TOOTH} />
          <path d={PATH_CUT} />
        </svg>
        <LogoMark className="intro-fill h-full" />
        <span className="intro-plate absolute -inset-1 bg-cream" />
      </div>
    </div>
  );
}
