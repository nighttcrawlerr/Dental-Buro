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

create index if not exists leads_created_at_idx on leads (created_at desc);
create index if not exists leads_status_idx on leads (status);
