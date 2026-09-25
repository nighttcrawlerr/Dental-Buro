/**
 * UTM-метки из адреса, по которому человек пришёл на сайт.
 *
 * Запоминаются на входе, а не при отправке: к моменту заявки человек успевает
 * походить по страницам, и метки из адреса пропадают. Хранятся в
 * sessionStorage — живут до закрытия вкладки, и заявка на следующий день
 * не припишется вчерашней рекламе.
 */

const KEY = "db-utm";
const PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

export type Utm = Partial<Record<(typeof PARAMS)[number], string>>;

/** Вызывается один раз при загрузке сайта. Новые метки перекрывают старые. */
export function captureUtm() {
  const search = new URLSearchParams(window.location.search);
  const utm: Utm = {};
  for (const p of PARAMS) {
    const v = search.get(p);
    if (v) utm[p] = v.slice(0, 200);
  }
  if (Object.keys(utm).length === 0) return;

  try {
    sessionStorage.setItem(KEY, JSON.stringify(utm));
  } catch {
    // Приватный режим или запрет хранилища: заявка уйдёт без меток, и это не страшно.
  }
}

export function readUtm(): Utm {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? "{}") as Utm;
  } catch {
    return {};
  }
}
