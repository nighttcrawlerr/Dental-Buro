/**
 * Яндекс Метрика: номер счётчика, согласие на cookie и цели.
 *
 * Номер берётся из NEXT_PUBLIC_YM_ID. Пока он не задан, Метрика не
 * загружается вовсе и плашка cookie не показывается — других cookie сайт
 * не ставит.
 */

export const metrikaId = Number(process.env.NEXT_PUBLIC_YM_ID) || null;

/**
 * Цели. Имена должны совпадать с идентификаторами целей типа «JavaScript-
 * событие» в настройках счётчика — там их нужно создать руками.
 */
export const goals = {
  /** Заявка принята сервером. Дублирует цель по посещению /thanks. */
  leadSent: "lead_sent",
  /** Открыто окно записи. Вместе с leadSent даёт конверсию формы. */
  bookingOpened: "booking_opened",
  phoneClick: "phone_click",
  messengerClick: "messenger_click",
  /** Открыта страница цен — цель из плана (9.2). */
  pricesViewed: "prices_viewed",
} as const;

export type Goal = (typeof goals)[keyof typeof goals];

type Ym = (id: number, method: string, ...args: unknown[]) => void;

function ym(): Ym | null {
  if (typeof window === "undefined") return null;
  return (window as unknown as { ym?: Ym }).ym ?? null;
}

/** Отправить цель. Без согласия или без счётчика — молча ничего. */
export function reachGoal(goal: Goal) {
  if (metrikaId) ym()?.(metrikaId, "reachGoal", goal);
}

export function sendHit(url: string) {
  if (metrikaId) ym()?.(metrikaId, "hit", url, { referer: document.referrer });
}

// ---- Согласие ----------------------------------------------------------

export type Consent = "all" | "necessary";

const CONSENT_KEY = "db-cookie-consent";
/** Событие, по которому плашка открывается снова — из подвала. */
export const OPEN_CONSENT_EVENT = "db:open-cookie-consent";
/** Событие, по которому Метрика узнаёт о новом выборе без перезагрузки. */
export const CONSENT_CHANGED_EVENT = "db:cookie-consent-changed";

export function readConsent(): Consent | null {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "all" || v === "necessary" ? v : null;
  } catch {
    return null;
  }
}

export function saveConsent(consent: Consent) {
  try {
    localStorage.setItem(CONSENT_KEY, consent);
  } catch {
    // Хранилище запрещено — выбор проживёт до перезагрузки страницы.
  }
  window.dispatchEvent(new Event(CONSENT_CHANGED_EVENT));
}
