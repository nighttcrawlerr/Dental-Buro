import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { siteUrl } from "./site-url";

/**
 * Вход в закрытый раздел с заявками.
 *
 * Один общий пароль администратора (ADMIN_PASSWORD) и подписанная cookie
 * сессии. Аккаунтов нет намеренно: заявки смотрят один-два администратора,
 * а каждая система аккаунтов — это восстановление паролей, приглашения и
 * ещё одна таблица с персональными данными. Когда сотрудников станет
 * больше — переходим на аккаунты.
 *
 * Cookie содержит только срок действия и подпись HMAC. Подделать её без
 * ADMIN_SESSION_SECRET нельзя; смена секрета разлогинивает всех.
 */

const COOKIE = "db_admin";
const SESSION_HOURS = 12;

function secret() {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET не задан или короче 32 символов");
  }
  return s;
}

function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("base64url");
}

/** Сравнение без утечки по времени: хэшируем, чтобы длины совпадали. */
function safeEqual(a: string, b: string) {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function passwordMatches(input: string) {
  const password = process.env.ADMIN_PASSWORD;
  // Пароль не задан — вход закрыт для всех, а не открыт для пустого пароля.
  if (!password) return false;
  return safeEqual(input, password);
}

function isValidSession(value: string | undefined) {
  if (!value) return false;
  const [expires, signature] = value.split(".");
  if (!expires || !signature) return false;
  if (Number(expires) < Date.now()) return false;
  return safeEqual(signature, sign(expires));
}

export async function startSession() {
  const expires = String(Date.now() + SESSION_HOURS * 60 * 60 * 1000);
  (await cookies()).set(COOKIE, `${expires}.${sign(expires)}`, {
    httpOnly: true,
    sameSite: "lax",
    // На https — только по защищённому соединению. Локально сайт на http,
    // и secure-cookie браузер бы просто не сохранил.
    secure: siteUrl.startsWith("https://"),
    path: "/admin",
    maxAge: SESSION_HOURS * 60 * 60,
  });
}

export async function endSession() {
  (await cookies()).delete({ name: COOKIE, path: "/admin" });
}

export async function isAdmin() {
  return isValidSession((await cookies()).get(COOKIE)?.value);
}

/** Для страниц и серверных действий: без входа — на страницу входа. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
