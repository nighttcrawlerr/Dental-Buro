import type { Lead, LeadErrors } from "./lead";
import { readUtm } from "./utm";

/**
 * Почему заявка не ушла. От этого зависит, что сказать человеку:
 * - network — не дошли до сервера: скорее всего, пропал интернет;
 * - invalid — сервер не принял поля (форма такое пропустить не должна, но
 *   схемы могут разойтись после обновления);
 * - rate — слишком много заявок подряд;
 * - server — сервер принял, но не смог доставить. Это наша поломка.
 */
export type LeadSubmitErrorKind = "network" | "invalid" | "rate" | "server";

export class LeadSubmitError extends Error {
  constructor(
    readonly kind: LeadSubmitErrorKind,
    readonly fields: LeadErrors = {},
  ) {
    super(`Заявка не отправлена: ${kind}`);
    this.name = "LeadSubmitError";
  }
}

/**
 * Отправка заявки на сервер. Бросает LeadSubmitError, если заявка не
 * принята, — форма в таком случае оставляет набранное на месте.
 */
export async function submitLead(lead: Lead, { website }: { website: string }) {
  let response: Response;
  try {
    response = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...lead,
        page: window.location.href,
        utm: readUtm(),
        website,
      }),
    });
  } catch {
    throw new LeadSubmitError("network");
  }

  if (response.ok) return;

  if (response.status === 429) throw new LeadSubmitError("rate");

  if (response.status === 400) {
    const body = (await response.json().catch(() => null)) as {
      fields?: Record<string, string[] | undefined>;
    } | null;
    const fields: LeadErrors = {};
    for (const [key, messages] of Object.entries(body?.fields ?? {})) {
      if (messages?.[0]) fields[key as keyof LeadErrors] = messages[0];
    }
    throw new LeadSubmitError("invalid", fields);
  }

  throw new LeadSubmitError("server");
}
