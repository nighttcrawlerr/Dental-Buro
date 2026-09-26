import "server-only";
import type { Lead } from "./lead";
import { db } from "./db";

export const leadStatuses = [
  { value: "new", label: "Новая" },
  { value: "called", label: "Перезвонили" },
  { value: "booked", label: "Записан" },
  { value: "declined", label: "Отказ" },
  { value: "spam", label: "Спам" },
] as const;

export type LeadStatus = (typeof leadStatuses)[number]["value"];

export function isLeadStatus(v: unknown): v is LeadStatus {
  return leadStatuses.some((s) => s.value === v);
}

export type StoredLead = {
  id: number;
  createdAt: Date;
  name: string;
  phone: string;
  service: string;
  visitTime: string;
  comment: string;
  doctor: string | null;
  page: string | null;
  utm: Record<string, string>;
  status: LeadStatus;
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
  doctor: string | null;
  page: string | null;
  utm: Record<string, string>;
  status: LeadStatus;
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
    doctor: r.doctor,
    page: r.page,
    utm: r.utm,
    status: r.status,
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
    insert into leads (name, phone, service, visit_time, comment, doctor, page, utm)
    values (
      ${lead.name}, ${lead.phone}, ${lead.service}, ${lead.time}, ${lead.comment},
      ${meta.doctor ?? null}, ${meta.page ?? null}, ${db().json(utm)}
    )
    returning id
  `;
  return row.id;
}

const PAGE_SIZE = 50;

export async function listLeads({ status, page = 1 }: { status?: LeadStatus; page?: number }) {
  const sql = db();
  const offset = (Math.max(1, page) - 1) * PAGE_SIZE;
  const where = status ? sql`where status = ${status}` : sql``;

  const rows = await sql<Row[]>`
    select * from leads ${where}
    order by created_at desc
    limit ${PAGE_SIZE + 1} offset ${offset}
  `;
  return { leads: rows.slice(0, PAGE_SIZE).map(fromRow), hasMore: rows.length > PAGE_SIZE };
}

export async function countNewLeads() {
  const [row] = await db()<{ count: number }[]>`select count(*)::int as count from leads where status = 'new'`;
  return row.count;
}

export async function getLead(id: number) {
  const [row] = await db()<Row[]>`select * from leads where id = ${id}`;
  return row ? fromRow(row) : null;
}

export async function setLeadStatus(id: number, status: LeadStatus) {
  await db()`update leads set status = ${status}, updated_at = now() where id = ${id}`;
}

/**
 * Удалить заявку насовсем. Нужно не только для спама: по закону человек
 * вправе потребовать удалить свои данные, и клиника обязана это сделать.
 */
export async function deleteLead(id: number) {
  await db()`delete from leads where id = ${id}`;
}
