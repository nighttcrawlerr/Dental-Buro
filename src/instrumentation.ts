/**
 * Проверка окружения при старте сервера.
 *
 * Забытая переменная на хостинге иначе проявится не сразу, а на первой
 * заявке пациента — ошибкой, которую никто не увидит. Здесь сервер при
 * запуске либо падает с понятным списком того, чего не хватает, либо
 * предупреждает в логе, если без переменной сайт работает, но хуже.
 */
export function register() {
  // Только боевой сервер: при сборке и в разработке переменных может не быть.
  if (process.env.NODE_ENV !== "production") return;
  if (process.env.NEXT_PHASE === "phase-production-build") return;
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const missing: string[] = [];
  if (!process.env.DATABASE_URL) missing.push("DATABASE_URL — без базы заявки не принимаются");
  if (!process.env.ADMIN_PASSWORD) missing.push("ADMIN_PASSWORD — без него не войти в /admin");
  if ((process.env.ADMIN_SESSION_SECRET ?? "").length < 32) {
    missing.push("ADMIN_SESSION_SECRET — не задан или короче 32 символов");
  }

  if (missing.length) {
    throw new Error(`Сервер не запущен, не заданы переменные окружения:\n- ${missing.join("\n- ")}`);
  }

  // Без этих сайт работает, но что-то теряет — предупреждаем, не падаем.
  if (!process.env.TELEGRAM_BOT_TOKEN || !process.env.TELEGRAM_CHAT_ID) {
    console.warn("[env] Нет TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID: заявки сохраняются, но в Telegram уведомлений не будет");
  }
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD || !process.env.NOTIFY_EMAIL) {
    console.warn("[env] Почта не настроена (SMTP_* и NOTIFY_EMAIL): уведомления о заявках только в Telegram");
  }
  if (!process.env.SITE_URL) {
    console.warn(
      "[env] SITE_URL не задан при сборке: сайт закрыт от поисковиков, ссылки в уведомлениях ведут на localhost",
    );
  }
}
