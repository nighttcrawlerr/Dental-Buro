import "server-only";

/**
 * Отправка сообщения в чат клиники через Bot API.
 *
 * Токен и id чата — только из окружения сервера. Модуль помечен server-only:
 * если его случайно импортируют в клиентский компонент, сборка упадёт, а не
 * положит токен в браузер.
 */
export async function sendTelegramMessage(html: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) throw new Error("TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID не заданы");

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: html,
      parse_mode: "HTML",
      link_preview_options: { is_disabled: true },
    }),
    // Telegram иногда отвечает долго. Человек с формой ждать минуту не должен.
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    // В тексте ответа Telegram нет токена, его можно писать в лог.
    throw new Error(`Telegram ответил ${response.status}: ${await response.text()}`);
  }
}

/** Экранирование для parse_mode HTML: Telegram понимает только эти три сущности. */
export function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
