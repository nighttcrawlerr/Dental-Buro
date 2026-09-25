import { z } from "zod";
import { doctors, services } from "@/content/site";
import { leadSchema, visitTimes, type Lead } from "@/lib/lead";
import { createRateLimit } from "@/lib/rate-limit";
import { escapeHtml, sendTelegramMessage } from "@/lib/telegram";

/**
 * Приём заявок с сайта.
 *
 * Порядок проверок — от дешёвых к дорогим: сначала частота, потом ловушка
 * для ботов, потом разбор полей, и только потом запрос в Telegram.
 *
 * ⚠️ Имя и телефон сейчас уходят в Telegram, а его серверы не в РФ. Для
 * разработки это нормально, для запуска — нет: см. вопрос в этапе 5 плана.
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

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (!isAllowed(ip)) {
    return Response.json({ ok: false, error: "too_many_requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { ok: false, error: "invalid", fields: z.flattenError(parsed.error).fieldErrors },
      { status: 400 },
    );
  }

  const { page, utm, website, doctor, ...lead } = parsed.data;

  // Боту отвечаем успехом: получив ошибку, он начнёт подбирать, что не так.
  if (website) return Response.json({ ok: true });

  try {
    await sendTelegramMessage(formatLead(lead, { page, utm, doctor }));
  } catch (error) {
    // В лог — только причина, без имени и телефона.
    console.error("[lead] Не удалось отправить заявку в Telegram:", error);
    return Response.json({ ok: false, error: "delivery_failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}

function formatLead(
  lead: Lead,
  {
    page,
    utm,
    doctor,
  }: { page?: string; utm?: Partial<Record<string, string>>; doctor?: string },
) {
  const service = services.find((s) => s.slug === lead.service)?.title ?? "Консультация, услуга не выбрана";
  const time = visitTimes.find((t) => t.value === lead.time)?.label ?? lead.time;

  const lines = [
    "<b>Новая заявка с сайта</b>",
    "",
    `<b>Имя:</b> ${escapeHtml(lead.name)}`,
    // Номер без скобок и пробелов: так Telegram делает его ссылкой для звонка.
    `<b>Телефон:</b> ${lead.phone}`,
    `<b>Услуга:</b> ${escapeHtml(service)}`,
    `<b>Удобное время:</b> ${escapeHtml(time)}`,
  ];

  // Имя врача берём из своих данных по slug, а не из запроса: так в чат не
  // попадёт произвольный текст под видом врача.
  const doctorName = doctors.find((d) => d.slug === doctor)?.name;
  if (doctorName) lines.push(`<b>Врач:</b> ${escapeHtml(doctorName)}`);

  if (lead.comment) lines.push(`<b>Комментарий:</b> ${escapeHtml(lead.comment)}`);

  // Страницу показываем без домена и параметров. Адрес присылает браузер, и
  // полная ссылка позволила бы спамеру положить в чат клиники любую ссылку.
  if (page) lines.push("", `<b>Страница:</b> ${escapeHtml(new URL(page).pathname)}`);

  const utmEntries = Object.entries(utm ?? {}).filter((e): e is [string, string] => Boolean(e[1]));
  if (utmEntries.length) {
    lines.push(...utmEntries.map(([k, v]) => `<b>${escapeHtml(k)}:</b> ${escapeHtml(v)}`));
  }

  return lines.join("\n");
}
