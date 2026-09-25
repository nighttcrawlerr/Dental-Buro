import type { Lead } from "./lead";
import { readUtm } from "./utm";

/**
 * Отправка заявки на сервер. Бросает ошибку, если заявка не принята, —
 * форма в таком случае оставляет набранное на месте.
 */
export async function submitLead(lead: Lead, { website }: { website: string }) {
  const response = await fetch("/api/lead", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...lead,
      page: window.location.href,
      utm: readUtm(),
      website,
    }),
  });

  if (!response.ok) throw new Error(`Заявка не принята: ${response.status}`);
}
