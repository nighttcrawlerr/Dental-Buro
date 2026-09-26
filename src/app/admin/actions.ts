"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { endSession, passwordMatches, requireAdmin, startSession } from "@/lib/admin-auth";
import { deleteLead, isLeadStatus, setLeadStatus } from "@/lib/leads-repo";
import { createRateLimit } from "@/lib/rate-limit";

/*
 * Серверные действия раздела заявок. Их можно вызвать прямым POST-запросом,
 * минуя интерфейс, поэтому каждое, кроме входа, первым делом проверяет
 * сессию — проверка в странице их не защищает.
 */

// Десять попыток за 15 минут с одного адреса: хватит, чтобы ошибиться
// раскладкой, и мало для подбора пароля.
const loginAllowed = createRateLimit({ limit: 10, windowMs: 15 * 60 * 1000 });

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
  if (!loginAllowed(ip)) {
    return { error: "Слишком много попыток. Подождите 15 минут." };
  }

  const password = formData.get("password");
  if (typeof password !== "string" || !passwordMatches(password)) {
    return { error: "Неверный пароль." };
  }

  await startSession();
  redirect("/admin/leads");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

function readId(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) throw new Error("Неверный номер заявки");
  return id;
}

export async function updateStatus(formData: FormData) {
  await requireAdmin();
  const id = readId(formData);
  const status = formData.get("status");
  if (!isLeadStatus(status)) throw new Error("Неверный статус");
  await setLeadStatus(id, status);
  redirect(`/admin/leads/${id}`);
}

export async function removeLead(formData: FormData) {
  await requireAdmin();
  await deleteLead(readId(formData));
  redirect("/admin/leads");
}
