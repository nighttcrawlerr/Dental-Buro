import type { Lead } from "./lead";

/**
 * Отправка заявки на сервер. Бросает ошибку, если заявка не принята, —
 * форма в таком случае оставляет набранное на месте.
 */
export async function submitLead(lead: Lead) {
  const response = await fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...lead, page: window.location.href }),
  });

  if (!response.ok) throw new Error(`Заявка не принята: ${response.status}`);
}
