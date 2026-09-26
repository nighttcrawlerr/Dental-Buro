import { doctors, services } from "@/content/site";
import { visitTimes } from "./lead";

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

export function doctorName(slug: string | null) {
  return slug ? (doctors.find((d) => d.slug === slug)?.name ?? null) : null;
}

/** +79123456789 → +7 (912) 345-67-89: так номер читается глазами. */
export function prettyPhone(phone: string) {
  const d = phone.replace(/\D/g, "").slice(-10);
  if (d.length !== 10) return phone;
  return `+7 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 8)}-${d.slice(8)}`;
}
