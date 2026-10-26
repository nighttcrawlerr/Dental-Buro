"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { endSession, passwordMatches, requireAdmin, startSession } from "@/lib/admin-auth";
import { addLeadNote, deleteLead, isLeadStatus, setLeadSchedule, setLeadStatus } from "@/lib/leads-repo";
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
  redirect("/admin");
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

// После правки администратор остаётся там, где был: на той же строке списка
// или в той же карточке. Обновляем весь раздел — счётчики в шапке и сводке
// тоже зависят от правки.
const refreshAdmin = () => revalidatePath("/admin", "layout");

export async function updateStatus(formData: FormData) {
  await requireAdmin();
  const id = readId(formData);
  const status = formData.get("status");
  if (!isLeadStatus(status)) throw new Error("Неверный статус");
  await setLeadStatus(id, status);
  refreshAdmin();
}

export async function addNote(formData: FormData) {
  await requireAdmin();
  const id = readId(formData);
  // NUL Postgres в тексте не принимает — заметка падала бы с ошибкой.
  const body = String(formData.get("body") ?? "")
    .replace(/\0/g, "")
    .trim();
  if (!body) return;
  if (body.length > 2000) throw new Error("Заметка длиннее 2000 символов");
  await addLeadNote(id, body);
  refreshAdmin();
}

/** Время из datetime-local («2026-10-27T14:30») или пустая строка — снять. */
function readLocalTime(formData: FormData) {
  // Быстрые кнопки («Через час», «Снять») передают своё at вдобавок к полю.
  // Кнопка стоит в форме после поля, поэтому её значение — последнее.
  const at = String(formData.getAll("at").at(-1) ?? "");
  if (at === "") return null;
  // Сверка «туда и обратно» отсекает 31 февраля: Date.parse такую дату
  // молча переносит на март, а Postgres на ней падает.
  const date = new Date(`${at}Z`);
  if (
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(at) ||
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 16) !== at
  ) {
    throw new Error("Неверное время");
  }
  return at;
}

export async function setCallback(formData: FormData) {
  await requireAdmin();
  await setLeadSchedule(readId(formData), "callback", readLocalTime(formData));
  refreshAdmin();
}

export async function setAppointment(formData: FormData) {
  await requireAdmin();
  const id = readId(formData);
  const at = readLocalTime(formData);
  await setLeadSchedule(id, "appointment", at);
  // Назначили приём — значит, записан; второй клик ради статуса не нужен.
  if (at) await setLeadStatus(id, "booked");
  refreshAdmin();
}

export async function removeLead(formData: FormData) {
  await requireAdmin();
  await deleteLead(readId(formData));
  redirect("/admin/leads");
}
