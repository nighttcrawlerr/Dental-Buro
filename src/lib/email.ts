import "server-only";
import nodemailer, { type Transporter } from "nodemailer";

/**
 * Письмо администратору через SMTP почтового ящика клиники.
 *
 * Второй канал уведомлений рядом с Telegram: до Telegram из облака в РФ
 * связь бывает нестабильной, а почтовый сервер Яндекса — внутри страны.
 *
 * Настройки — из окружения: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD
 * (для Яндекс Почты — пароль приложения, не пароль от аккаунта) и
 * NOTIFY_EMAIL — кому слать, можно несколько через запятую.
 */

export function isEmailConfigured() {
  return Boolean(
    process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD && process.env.NOTIFY_EMAIL,
  );
}

let transport: Transporter | undefined;

function getTransport() {
  if (!transport) {
    const port = Number(process.env.SMTP_PORT || 465);
    transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      // 465 — шифрование сразу, 587 — после STARTTLS.
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
      // Как и с Telegram: человек с формой не должен ждать минуту.
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 10_000,
    });
  }
  return transport;
}

export async function sendEmail(subject: string, text: string) {
  if (!isEmailConfigured()) throw new Error("SMTP_HOST, SMTP_USER, SMTP_PASSWORD или NOTIFY_EMAIL не заданы");

  await getTransport().sendMail({
    // Яндекс отклоняет письма, где отправитель не совпадает с ящиком входа.
    from: { name: "Сайт Dental Buro", address: process.env.SMTP_USER! },
    to: process.env.NOTIFY_EMAIL,
    subject,
    text,
  });
}
