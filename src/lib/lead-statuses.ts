/** Статусы заявки. Отдельно от leads-repo, чтобы их видели и клиентские компоненты. */
export const leadStatuses = [
  { value: "new", label: "Новая" },
  { value: "called", label: "Перезвонили" },
  { value: "booked", label: "Записан" },
  { value: "declined", label: "Отказ" },
  { value: "spam", label: "Спам" },
] as const;

export type LeadStatus = (typeof leadStatuses)[number]["value"];

export function isLeadStatus(v: unknown): v is LeadStatus {
  return leadStatuses.some((s) => s.value === v);
}
