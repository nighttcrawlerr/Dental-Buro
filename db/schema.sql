-- Схема базы заявок. Применяется командой `npm run db:migrate`.
-- Все команды идемпотентны: запускать повторно безопасно.

create table if not exists leads (
  id          serial primary key,
  created_at  timestamptz not null default now(),

  -- Что ввёл человек. Персональные данные — хранятся только здесь,
  -- в базе на территории РФ (152-ФЗ, ст. 18, ч. 5).
  name        text not null,
  phone       text not null,
  service     text not null default '',
  visit_time  text not null,
  comment     text not null default '',

  -- Откуда пришла заявка.
  doctor      text,
  page        text,
  utm         jsonb not null default '{}',

  -- Работа администратора с заявкой.
  status      text not null default 'new'
              check (status in ('new', 'called', 'booked', 'declined', 'spam')),
  updated_at  timestamptz not null default now()
);

-- Пожелания к приёму (comfortOptions в src/lib/lead.ts). Добавлено после
-- первого запуска, поэтому отдельной командой: на существующей базе таблица
-- уже есть, и create table выше её не тронет.
alter table leads add column if not exists comfort text[] not null default '{}';

create index if not exists leads_created_at_idx on leads (created_at desc);
create index if not exists leads_status_idx on leads (status);

-- Работа администратора: когда перезвонить, на когда записан и история —
-- смены статуса, заметки, переносы. Время храним с зоной, показываем и
-- вводим по Москве.
alter table leads add column if not exists callback_at    timestamptz;
alter table leads add column if not exists appointment_at timestamptz;

create table if not exists lead_events (
  id         serial primary key,
  -- Удаление заявки по просьбе человека должно унести и историю: в заметках
  -- тоже могут быть его данные.
  lead_id    integer not null references leads(id) on delete cascade,
  created_at timestamptz not null default now(),
  kind       text not null check (kind in ('status', 'note', 'callback', 'appointment')),
  -- status — новый статус; note — текст; callback/appointment — время по
  -- Москве строкой для показа или '' (снято).
  body       text not null default ''
);

create index if not exists lead_events_lead_idx on lead_events (lead_id, created_at desc);
create index if not exists leads_phone_idx      on leads (phone);
create index if not exists leads_callback_idx   on leads (callback_at) where callback_at is not null;
