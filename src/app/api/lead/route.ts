import { z } from "zod";
import { clinic, doctors, services } from "@/content/site";
import { comfortOptions, leadSchema, visitTimes, type Lead } from "@/lib/lead";
import { saveLead } from "@/lib/leads-repo";
import { createRateLimit } from "@/lib/rate-limit";
import { absoluteUrl } from "@/lib/site-url";
import { isEmailConfigured, sendEmail } from "@/lib/email";
import { escapeHtml, sendTelegramMessage } from "@/lib/telegram";

/**
 * Приём заявок с сайта.
 *
 * Порядок проверок — от дешёвых к дорогим: сначала частота, потом ловушка
 * для ботов, потом разбор полей. Дальше заявка сохраняется в базу (она на
 * российском хостинге — это требование закона о персональных данных), и
 * только потом в Telegram и на почту уходит уведомление без имени и телефона.
 */

const utmValue = z.string().max(200).optional();

const requestSchema = leadSchema.extend({
  page: z.url().max(2000).optional(),
  // Неизвестные ключи zod отбрасывает сам, в чат попадают только эти пять.
  utm: z
    .object({
      utm_source: utmValue,
      utm_medium: utmValue,
      utm_campaign: utmValue,
      utm_content: utmValue,
      utm_term: utmValue,
    })
    .optional(),
  doctor: z.string().max(80).optional(),
  /** Ловушка: поле невидимо для людей, его заполняют только боты. */
  website: z.string().max(200).optional(),
});

// Пять заявок за десять минут с одного адреса — с запасом для человека,
// который ошибся в номере и отправил ещё раз.
const isAllowed = createRateLimit({ limit: 5, windowMs: 10 * 60 * 1000 });

/**
 * Заявка приходит двумя путями. Обычно — JSON из скрипта формы. Но если
 * скрипт не загрузился, браузер отправит форму сам, обычным POST. Тогда
 * отвечаем не JSON, а тем, что можно показать человеку: переходом на
 * /thanks или простой страницей с ошибкой и телефоном.
 */
function isFormPost(request: Request) {
  const type = request.headers.get("content-type") ?? "";
  return type.includes("application/x-www-form-urlencoded") || type.includes("multipart/form-data");
}

async function readForm(request: Request) {
  const form = await request.formData();
  const text = (key: string) => {
    const v = form.get(key);
    return typeof v === "string" ? v : undefined;
  };

  return {
    name: text("name") ?? "",
    phone: text("phone") ?? "",
    service: text("service") ?? "",
    time: text("time") ?? "any",
    comment: text("comment") ?? "",
    comfort: form.getAll("comfort").filter((v): v is string => typeof v === "string"),
    // Отмеченный чекбокс браузер присылает как «on», неотмеченный — никак.
    consent: form.get("consent") !== null,
    website: text("website"),
    page: request.headers.get("referer") ?? undefined,
  };
}

function fallbackPage(message: string, status: number) {
  const html = `<!doctype html>
<html lang="ru">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>Заявка не отправлена</title>
<body style="font-family: system-ui, sans-serif; max-width: 32rem; margin: 4rem auto; padding: 0 1rem; line-height: 1.5; color: #241e19; background: #f3eee8">
  <h1 style="font-weight: 400">Заявка не отправлена</h1>
  <p>${escapeHtml(message)}</p>
  <p>Позвоните нам: <a href="${clinic.phoneHref}">${escapeHtml(clinic.phone)}</a></p>
  <p><a href="/contacts#booking">Вернуться к форме</a></p>
</body>
</html>`;
  return new Response(html, { status, headers: { "Content-Type": "text/html; charset=utf-8" } });
}

export async function POST(request: Request) {
  const isForm = isFormPost(request);
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!isAllowed(ip)) {
    return isForm
      ? fallbackPage("С этого устройства уже пришло несколько заявок подряд.", 429)
      : Response.json({ ok: false, error: "too_many_requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = isForm ? await readForm(request) : await request.json();
  } catch {
    return Response.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return isForm
      ? fallbackPage(
          "Проверьте, что указаны имя, телефон из 10 цифр после +7 и отмечено согласие на обработку данных.",
          400,
        )
      : Response.json(
          { ok: false, error: "invalid", fields: z.flattenError(parsed.error).fieldErrors },
          { status: 400 },
        );
  }

  const { page, utm, website, doctor, ...lead } = parsed.data;

  // 303 — чтобы браузер пришёл на /thanks обычным GET и кнопка «Назад» не
  // предлагала отправить форму повторно.
  const success = () =>
    isForm ? Response.redirect(new URL("/thanks", request.url), 303) : Response.json({ ok: true });

  // Боту отвечаем успехом: получив ошибку, он начнёт подбирать, что не так.
  if (website) return success();

  // Врача сохраняем, только если он есть в наших данных: slug приходит из
  // браузера, и в базу не должен попасть произвольный текст.
  const knownDoctor = doctors.some((d) => d.slug === doctor) ? doctor : undefined;

  // Сначала база. Если она недоступна, заявку принять нельзя: отправить
  // имя и телефон в Telegram «пока база лежит» — это и есть нарушение
  // локализации, которого вся схема избегает.
  let id: number;
  try {
    id = await saveLead(lead, { doctor: knownDoctor, page, utm });
  } catch (error) {
    console.error("[lead] Не удалось сохранить заявку:", error);
    return isForm
      ? fallbackPage("Это сбой на нашей стороне. Попробуйте через минуту.", 502)
      : Response.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }

  // Уведомление — уже необязательная часть. Заявка сохранена, поэтому сбой
  // канала человек не видит: администратор найдёт заявку в списке. Каналы
  // независимы — Telegram из облака в РФ бывает недоступен, тогда остаётся
  // почта.
  const notification = buildNotification(id, lead, { page, utm, doctor: knownDoctor });
  const channels: [string, Promise<void>][] = [["Telegram", sendTelegramMessage(toTelegram(notification))]];
  if (isEmailConfigured()) {
    channels.push(["почта", sendEmail(`Новая заявка №${id}`, toPlainText(notification))]);
  }
  const results = await Promise.allSettled(channels.map(([, sending]) => sending));
  results.forEach((result, i) => {
    if (result.status === "rejected") {
      console.error(`[lead] Заявка №${id} сохранена, но уведомление (${channels[i][0]}) не ушло:`, result.reason);
    }
  });

  return success();
}

type Notification = { title: string; rows: [label: string, value: string][]; url: string };

/**
 * Уведомление о заявке — без персональных данных.
 *
 * Серверы Telegram за границей, поэтому имени, телефона и комментария здесь
 * нет (в комментарии человек тоже может написать о себе что угодно). Только
 * номер заявки, что и когда человек хочет, и ссылка на карточку в закрытом
 * разделе сайта, где лежит всё остальное. Письмо собирается из того же
 * набора: одно правило для всех каналов проще проверить.
 */
function buildNotification(
  id: number,
  lead: Lead,
  {
    page,
    utm,
    doctor,
  }: { page?: string; utm?: Partial<Record<string, string>>; doctor?: string },
): Notification {
  const service = services.find((s) => s.slug === lead.service)?.title ?? "Консультация, услуга не выбрана";
  const time = visitTimes.find((t) => t.value === lead.time)?.label ?? lead.time;

  const rows: Notification["rows"] = [
    ["Услуга", service],
    ["Удобное время", time],
  ];

  const doctorName = doctors.find((d) => d.slug === doctor)?.name;
  if (doctorName) rows.push(["Врач", doctorName]);

  // Пожелания — не персональные данные: по ним человека не узнать, а
  // администратору полезно знать заранее, например, что зовут на седацию.
  const comfort = comfortOptions.filter((c) => lead.comfort.includes(c.value)).map((c) => c.label);
  if (comfort.length) rows.push(["Пожелания", comfort.join("; ")]);

  // Страницу показываем без домена и параметров. Адрес присылает браузер, и
  // полная ссылка позволила бы спамеру положить в чат клиники любую ссылку.
  if (page) rows.push(["Страница", new URL(page).pathname]);

  for (const [key, value] of Object.entries(utm ?? {})) {
    if (value) rows.push([key, value]);
  }

  return { title: `Новая заявка №${id}`, rows, url: absoluteUrl(`/admin/leads/${id}`) };
}

function toTelegram({ title, rows, url }: Notification) {
  return [
    `<b>${escapeHtml(title)}</b>`,
    "",
    ...rows.map(([label, value]) => `<b>${escapeHtml(label)}:</b> ${escapeHtml(value)}`),
    "",
    `<a href="${url}">Открыть заявку</a>`,
  ].join("\n");
}

function toPlainText({ title, rows, url }: Notification) {
  return [
    title,
    "",
    ...rows.map(([label, value]) => `${label}: ${value}`),
    "",
    `Открыть заявку: ${url}`,
    "",
    "Имя и телефон — в карточке заявки, в письмо они не попадают.",
  ].join("\n");
}
