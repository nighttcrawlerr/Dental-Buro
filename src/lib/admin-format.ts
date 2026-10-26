import { doctors, services } from "@/content/site";
import { comfortOptions, visitTimes } from "./lead";

/** Дата и время заявки по Москве — сервер может стоять в любом часовом поясе. */
const dateTime = new Intl.DateTimeFormat("ru-RU", {
  timeZone: "Europe/Moscow",
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatLeadDate(date: Date) {
  return dateTime.format(date);
}

export function serviceTitle(slug: string) {
  return services.find((s) => s.slug === slug)?.title ?? "Консультация";
}

export function visitTimeLabel(value: string) {
  return visitTimes.find((t) => t.value === value)?.label ?? value;
}

/** Пожелания к приёму словами, по одному на строку. */
export function comfortLabels(values: string[]) {
  return comfortOptions.filter((c) => values.includes(c.value)).map((c) => c.label);
}

export function doctorName(slug: string | null) {
  return slug ? (doctors.find((d) => d.slug === slug)?.name ?? null) : null;
}

/** +79123456789 → +7 (912) 345-67-89: так номер читается глазами. */
export function prettyPhone(phone: string) {
  const d = phone.replace(/\D/g, "").slice(-10);
  if (d.length !== 10) return phone;
  return `+7 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 8)}-${d.slice(8)}`;
}

/** Сколько прошло: «12 мин», «2 ч 5 мин», «3 дн». Для «ждёт ответа». */
export function waitingFor(date: Date, now = new Date()) {
  const minutes = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 60_000));
  if (minutes < 60) return `${minutes} мин`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return minutes % 60 ? `${hours} ч ${minutes % 60} мин` : `${hours} ч`;
  return `${Math.floor(hours / 24)} дн`;
}

// sv-SE даёт «2026-10-27 14:30» — почти тот формат, что ждёт datetime-local.
const isoLocal = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Europe/Moscow",
  dateStyle: "short",
  timeStyle: "short",
});

/** Значение для <input type="datetime-local"> по московскому времени. */
export function toMoscowLocal(date: Date | null) {
  return date ? isoLocal.format(date).replace(" ", "T") : "";
}
