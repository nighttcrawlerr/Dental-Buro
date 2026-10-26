import "server-only";
import type { Lead } from "./lead";
import { db } from "./db";
import { leadStatuses, type LeadStatus } from "./lead-statuses";

export { isLeadStatus, leadStatuses, type LeadStatus } from "./lead-statuses";

export type StoredLead = {
  id: number;
  createdAt: Date;
  name: string;
  phone: string;
  service: string;
  visitTime: string;
  comment: string;
  comfort: string[];
  doctor: string | null;
  page: string | null;
  utm: Record<string, string>;
  status: LeadStatus;
  callbackAt: Date | null;
  appointmentAt: Date | null;
  updatedAt: Date;
};

type Row = {
  id: number;
  created_at: Date;
  name: string;
  phone: string;
  service: string;
  visit_time: string;
  comment: string;
  comfort: string[];
  doctor: string | null;
  page: string | null;
  utm: Record<string, string>;
  status: LeadStatus;
  callback_at: Date | null;
  appointment_at: Date | null;
  updated_at: Date;
};

function fromRow(r: Row): StoredLead {
  return {
    id: r.id,
    createdAt: r.created_at,
    name: r.name,
    phone: r.phone,
    service: r.service,
    visitTime: r.visit_time,
    comment: r.comment,
    comfort: r.comfort,
    doctor: r.doctor,
    page: r.page,
    utm: r.utm,
    status: r.status,
    callbackAt: r.callback_at,
    appointmentAt: r.appointment_at,
    updatedAt: r.updated_at,
  };
}

/** Сохранить заявку. Возвращает её номер — он уходит в уведомление. */
export async function saveLead(
  lead: Lead,
  meta: { doctor?: string; page?: string; utm?: Record<string, string | undefined> },
) {
  const utm = Object.fromEntries(Object.entries(meta.utm ?? {}).filter(([, v]) => v));
  const [row] = await db()<{ id: number }[]>`
    insert into leads (name, phone, service, visit_time, comment, comfort, doctor, page, utm)
    values (
      ${lead.name}, ${lead.phone}, ${lead.service}, ${lead.time}, ${lead.comment},
      ${lead.comfort}, ${meta.doctor ?? null}, ${meta.page ?? null}, ${db().json(utm)}
    )
    returning id
  `;
  return row.id;
}

const PAGE_SIZE = 50;

export const periods = [
  { value: "today", label: "Сегодня" },
  { value: "7d", label: "7 дней" },
  { value: "30d", label: "30 дней" },
  { value: "all", label: "Всё время" },
] as const;

export type Period = (typeof periods)[number]["value"];

export function isPeriod(v: unknown): v is Period {
  return periods.some((p) => p.value === v);
}

/** Сколько календарных дней назад начинается период, считая сегодняшний. */
const periodBack = { today: 0, "7d": 6, "30d": 29 } as const;

/**
 * Полночь по Москве `back` дней назад (−1 — завтрашняя). Считается в базе:
 * сервер и сессия Postgres могут жить в UTC, и «сегодня» без явной зоны
 * начиналось бы в три часа ночи.
 */
function dayStart(back = 0) {
  return db()`((date_trunc('day', now() at time zone 'Europe/Moscow') - make_interval(days => ${back}::int)) at time zone 'Europe/Moscow')`;
}

export type LeadFilter = { status?: LeadStatus; period?: Period; q?: string };

/** Условие отбора. Все значения уходят параметрами, текст запроса не склеивается. */
function where({ status, period = "all", q }: LeadFilter, withStatus = true) {
  const sql = db();
  const parts = [sql`true`];
  if (withStatus && status) parts.push(sql`status = ${status}`);
  if (period !== "all") parts.push(sql`created_at >= ${dayStart(periodBack[period])}`);

  const text = q?.trim().slice(0, 80);
  if (text) {
    // % и _ в запросе — обычные символы, а не шаблон.
    const like = `%${text.replace(/[\\%_]/g, "\\$&")}%`;
    // Телефон хранится как +7XXXXXXXXXX. Ищут его как угодно: 912-34, +7 912…,
    // 8 912… — сравниваем цифры, а ведущую 8 или 7 считаем кодом страны.
    const digits = text.replace(/\D/g, "");
    const phone =
      digits.length < 4
        ? sql`false`
        : /^[78]/.test(digits)
          ? sql`(phone like ${`%${digits}%`} or phone like ${`+7${digits.slice(1)}%`})`
          : sql`phone like ${`%${digits}%`}`;
    parts.push(sql`(name ilike ${like} or comment ilike ${like} or ${phone})`);
  }
  return parts.reduce((a, b) => sql`${a} and ${b}`);
}

export async function listLeads({ page = 1, ...filter }: LeadFilter & { page?: number }) {
  const offset = (Math.max(1, page) - 1) * PAGE_SIZE;
  const rows = await db()<Row[]>`
    select * from leads where ${where(filter)}
    order by created_at desc, id desc
    limit ${PAGE_SIZE + 1} offset ${offset}
  `;
  return { leads: rows.slice(0, PAGE_SIZE).map(fromRow), hasMore: rows.length > PAGE_SIZE };
}

/** Счётчики на вкладках статусов — с учётом поиска и периода, но не статуса. */
export async function statusCounts(filter: LeadFilter) {
  const rows = await db()<{ status: LeadStatus; n: number }[]>`
    select status, count(*)::int as n from leads where ${where(filter, false)} group by status
  `;
  const counts = Object.fromEntries(leadStatuses.map((s) => [s.value, 0])) as Record<LeadStatus, number>;
  for (const r of rows) counts[r.status] = r.n;
  return { ...counts, all: rows.reduce((sum, r) => sum + r.n, 0) };
}

export async function countNewLeads() {
  const [row] = await db()<{ count: number }[]>`select count(*)::int as count from leads where status = 'new'`;
  return row.count;
}

export async function getLead(id: number) {
  const [row] = await db()<Row[]>`select * from leads where id = ${id}`;
  return row ? fromRow(row) : null;
}

export type LeadEventKind = "status" | "note" | "callback" | "appointment";
export type LeadEvent = { id: number; createdAt: Date; kind: LeadEventKind; body: string };

export async function getLeadEvents(id: number) {
  const rows = await db()<{ id: number; created_at: Date; kind: LeadEventKind; body: string }[]>`
    select id, created_at, kind, body from lead_events
    where lead_id = ${id} order by created_at desc, id desc
  `;
  return rows.map((r): LeadEvent => ({ id: r.id, createdAt: r.created_at, kind: r.kind, body: r.body }));
}

/** Другие заявки с того же номера: повторный пациент или человек отправил форму дважды. */
export async function getSamePhoneLeads(id: number, phone: string) {
  const rows = await db()<Pick<Row, "id" | "created_at" | "service" | "status">[]>`
    select id, created_at, service, status from leads
    where phone = ${phone} and id <> ${id}
    order by created_at desc limit 20
  `;
  return rows.map((r) => ({ id: r.id, createdAt: r.created_at, service: r.service, status: r.status }));
}

/** Соседние заявки в порядке списка (новые сверху), без учёта фильтров. */
export async function getNeighbors(id: number) {
  const sql = db();
  const [[newer], [older]] = await Promise.all([
    sql<{ id: number }[]>`
      select id from leads
      where (created_at, id) > (select created_at, id from leads where id = ${id})
      order by created_at, id limit 1
    `,
    sql<{ id: number }[]>`
      select id from leads
      where (created_at, id) < (select created_at, id from leads where id = ${id})
      order by created_at desc, id desc limit 1
    `,
  ]);
  return { newer: newer?.id ?? null, older: older?.id ?? null };
}

/** Смена статуса и запись в историю — одним запросом, и только если статус правда сменился. */
export async function setLeadStatus(id: number, status: LeadStatus) {
  await db()`
    with upd as (
      update leads set status = ${status}, updated_at = now()
      where id = ${id} and status <> ${status}
      returning id
    )
    insert into lead_events (lead_id, kind, body) select id, 'status', ${status} from upd
  `;
}

export async function addLeadNote(id: number, text: string) {
  await db()`
    with upd as (update leads set updated_at = now() where id = ${id} returning id)
    insert into lead_events (lead_id, kind, body) select id, 'note', ${text} from upd
  `;
}

/**
 * Назначить или снять время перезвона или приёма. `local` — время по Москве
 * из поля datetime-local («2026-10-27T14:30»), null — снять.
 */
export async function setLeadSchedule(id: number, field: "callback" | "appointment", local: string | null) {
  const sql = db();
  // Имя колонки — только из этой таблицы, не из формы.
  const column = { callback: sql`callback_at`, appointment: sql`appointment_at` }[field];
  // ::text обязателен: с типом timestamp postgres.js сам разбирает строку как
  // время в поясе сервера и переводит в UTC — время съезжало на 3 часа.
  const value = local ? sql`${local}::text::timestamp at time zone 'Europe/Moscow'` : null;
  await sql`
    with upd as (
      update leads set ${column} = ${value}, updated_at = now()
      where id = ${id} and ${column} is distinct from ${value}
      returning id, ${column} as at
    )
    insert into lead_events (lead_id, kind, body)
    select id, ${field}, coalesce(to_char(at at time zone 'Europe/Moscow', 'DD.MM.YYYY HH24:MI'), '') from upd
  `;
}

/* ---- Сводка ---------------------------------------------------------- */

/** Заявки за сегодня, 7 и 30 дней и сколько из них записалось. Спам не считается. */
export async function dashboardStats() {
  const [row] = await db()<{ today: number; d7: number; d30: number; booked30: number }[]>`
    select
      count(*) filter (where created_at >= ${dayStart(0)})::int as today,
      count(*) filter (where created_at >= ${dayStart(6)})::int as d7,
      count(*) filter (where created_at >= ${dayStart(29)})::int as d30,
      count(*) filter (where created_at >= ${dayStart(29)} and status = 'booked')::int as booked30
    from leads where status <> 'spam'
  `;
  return row;
}

export type Breakdown = { key: string; n: number }[];

/** Разбивка заявок за 30 дней: по статусу, услуге и источнику. */
export async function breakdowns() {
  const sql = db();
  const since = dayStart(29);
  const [byStatus, byService, bySource] = await Promise.all([
    sql<Breakdown>`
      select status as key, count(*)::int as n from leads
      where created_at >= ${since} group by 1 order by n desc
    `,
    sql<Breakdown>`
      select service as key, count(*)::int as n from leads
      where created_at >= ${since} and status <> 'spam' group by 1 order by n desc
    `,
    // Источник — utm_source, а без него страница, с которой отправили форму.
    sql<Breakdown>`
      select coalesce(
        nullif(utm->>'utm_source', ''),
        nullif(regexp_replace(coalesce(page, ''), '^https?://[^/]+|[?#].*$', '', 'g'), ''),
        'неизвестно'
      ) as key, count(*)::int as n
      from leads where created_at >= ${since} and status <> 'spam'
      group by 1 order by n desc limit 10
    `,
  ]);
  return { byStatus, byService, bySource };
}

/** Перезвоны на сегодня, которые ещё впереди. */
export async function callbacksToday() {
  const rows = await db()<Row[]>`
    select * from leads
    where callback_at >= now() and callback_at < ${dayStart(-1)}
      and status in ('new', 'called')
    order by callback_at limit 50
  `;
  return rows.map(fromRow);
}

/** Перезвоны, время которых прошло, а заявка всё ещё не закрыта. */
export async function overdueCallbacks() {
  const rows = await db()<Row[]>`
    select * from leads
    where callback_at < now() and status in ('new', 'called')
    order by callback_at limit 50
  `;
  return rows.map(fromRow);
}

/** Новые заявки, которые ждут ответа дольше `minutes` минут. */
export async function staleNewLeads(minutes = 15) {
  const rows = await db()<Row[]>`
    select * from leads
    where status = 'new' and created_at < now() - make_interval(mins => ${minutes}::int)
    order by created_at limit 50
  `;
  return rows.map(fromRow);
}

/**
 * Удалить заявку насовсем. Нужно не только для спама: по закону человек
 * вправе потребовать удалить свои данные, и клиника обязана это сделать.
 */
export async function deleteLead(id: number) {
  await db()`delete from leads where id = ${id}`;
}
