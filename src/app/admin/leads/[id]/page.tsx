import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import {
  comfortLabels,
  doctorName,
  formatLeadDate,
  prettyPhone,
  serviceTitle,
  toMoscowLocal,
  visitTimeLabel,
  waitingFor,
} from "@/lib/admin-format";
import { cn } from "@/lib/cn";
import {
  getLead,
  getLeadEvents,
  getNeighbors,
  getSamePhoneLeads,
  leadStatuses,
  type LeadEvent,
} from "@/lib/leads-repo";
import { addNote, removeLead, setAppointment, setCallback, updateStatus } from "../../actions";
import { buttonClass, cardClass, fieldClass, ghostButtonClass, StatusBadge, statusLabel } from "../../ui";
import { CopyPhone } from "./copy-phone";
import { DeleteButton } from "./delete-button";

// В заголовке номер, а не имя: название вкладки остаётся в истории браузера.
export async function generateMetadata({ params }: PageProps<"/admin/leads/[id]">) {
  return { title: `Заявка №${(await params).id}` };
}

/**
 * Карточка заявки. Слева — что прислал человек и история работы с ним,
 * справа — всё, что администратор делает после звонка: статус, когда
 * перезвонить, на когда записан, заметка.
 */
export default async function LeadPage({ params }: PageProps<"/admin/leads/[id]">) {
  await requireAdmin();

  const { id } = await params;
  const lead = /^\d+$/.test(id) ? await getLead(Number(id)) : null;
  if (!lead) notFound();

  const [events, samePhone, neighbors] = await Promise.all([
    getLeadEvents(lead.id),
    getSamePhoneLeads(lead.id, lead.phone),
    getNeighbors(lead.id),
  ]);

  const now = new Date();
  const doctor = doctorName(lead.doctor);
  const utm = Object.entries(lead.utm);
  const comfort = comfortLabels(lead.comfort);
  const open = lead.status === "new" || lead.status === "called";
  const callbackOverdue = open && lead.callbackAt !== null && lead.callbackAt < now;

  // Быстрые варианты перезвона. Считаются при показе страницы — она и так
  // обновляется раз в 30 секунд.
  const inHour = toMoscowLocal(new Date(now.getTime() + 60 * 60 * 1000));
  const tomorrow10 = `${toMoscowLocal(new Date(now.getTime() + 24 * 60 * 60 * 1000)).slice(0, 10)}T10:00`;

  const rows: [string, React.ReactNode][] = [
    ["Услуга", serviceTitle(lead.service)],
    ["Удобное время", visitTimeLabel(lead.visitTime)],
    ...(doctor ? [["Врач", doctor] as [string, string]] : []),
    ...(lead.comment ? [["Комментарий", lead.comment] as [string, string]] : []),
    ...(comfort.length ? [["Пожелания", comfort.join("\n")] as [string, string]] : []),
    ...(lead.page ? [["Страница", new URL(lead.page).pathname] as [string, string]] : []),
    ...(utm.length ? [["UTM", utm.map(([k, v]) => `${k}: ${v}`).join("\n")] as [string, string]] : []),
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/admin/leads" className="label-mono text-graphite hover:text-ink">
          ← Все заявки
        </Link>
        <nav aria-label="Соседние заявки" className="flex gap-2">
          {neighbors.newer ? (
            <Link href={`/admin/leads/${neighbors.newer}`} className={ghostButtonClass}>
              ← Новее
            </Link>
          ) : null}
          {neighbors.older ? (
            <Link href={`/admin/leads/${neighbors.older}`} className={ghostButtonClass}>
              Старее →
            </Link>
          ) : null}
        </nav>
      </div>

      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-heading-lg text-ink">{lead.name}</h1>
          <StatusBadge status={lead.status} />
        </div>
        <p className="label-mono text-graphite">
          Заявка №{lead.id} · {formatLeadDate(lead.createdAt)}
          {lead.status === "new" ? (
            <span className="text-sky"> · ждёт {waitingFor(lead.createdAt, now)}</span>
          ) : null}
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`tel:${lead.phone}`}
            className={cn(buttonClass, "text-[15px] tracking-normal normal-case")}
          >
            Позвонить {prettyPhone(lead.phone)}
          </a>
          <CopyPhone phone={lead.phone} />
        </div>
      </header>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="flex flex-col gap-8">
          <dl className={cn(cardClass, "flex flex-col px-6")}>
            {rows.map(([term, value]) => (
              <div
                key={term}
                className="grid gap-1 border-b border-hairline py-3.5 last:border-b-0 sm:grid-cols-[10rem_1fr] sm:gap-6"
              >
                <dt className="label-mono pt-0.5 text-graphite">{term}</dt>
                <dd className="whitespace-pre-wrap text-ink">{value}</dd>
              </div>
            ))}
          </dl>

          <section aria-labelledby="history" className="flex flex-col gap-4">
            <h2 id="history" className="label-mono text-graphite">
              История
            </h2>
            <ol className="flex flex-col border-l border-hairline pl-6">
              {events.map((event) => (
                <li key={event.id} className="relative pb-5">
                  <span
                    aria-hidden="true"
                    className="absolute top-2 -left-[1.6rem] size-2 rounded-full bg-graphite"
                  />
                  <p className="label-mono text-graphite">{formatLeadDate(event.createdAt)}</p>
                  <p className="whitespace-pre-wrap text-ink">{eventText(event)}</p>
                </li>
              ))}
              <li className="relative">
                <span
                  aria-hidden="true"
                  className="absolute top-2 -left-[1.6rem] size-2 rounded-full bg-sky"
                />
                <p className="label-mono text-graphite">{formatLeadDate(lead.createdAt)}</p>
                <p className="text-ink">Заявка пришла с сайта</p>
              </li>
            </ol>
          </section>

          {samePhone.length ? (
            <section aria-labelledby="same-phone" className="flex flex-col gap-3">
              <h2 id="same-phone" className="label-mono text-graphite">
                Ещё заявки с этого номера
              </h2>
              <ul className={cn(cardClass, "flex flex-col px-6")}>
                {samePhone.map((other) => (
                  <li
                    key={other.id}
                    className="flex flex-wrap items-center justify-between gap-3 border-b border-hairline py-3 last:border-b-0"
                  >
                    <Link href={`/admin/leads/${other.id}`} className="text-sky underline underline-offset-2">
                      №{other.id} · {formatLeadDate(other.createdAt)} · {serviceTitle(other.service)}
                    </Link>
                    <StatusBadge status={other.status} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <aside className="flex flex-col gap-6">
          <section aria-labelledby="status" className={cn(cardClass, "flex flex-col gap-3 p-5")}>
            <h2 id="status" className="label-mono text-graphite">
              Статус
            </h2>
            <div className="flex flex-wrap gap-2">
              {leadStatuses.map((s) => {
                const active = s.value === lead.status;
                return (
                  <form key={s.value} action={updateStatus}>
                    <input type="hidden" name="id" value={lead.id} />
                    <input type="hidden" name="status" value={s.value} />
                    <button
                      type="submit"
                      aria-pressed={active}
                      className={cn(
                        "label-mono min-h-10 cursor-pointer rounded-full border px-3.5",
                        active
                          ? "border-ink bg-ink text-cream"
                          : "border-hairline text-graphite hover:border-graphite hover:text-ink",
                      )}
                    >
                      {s.label}
                    </button>
                  </form>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="callback" className={cn(cardClass, "flex flex-col gap-3 p-5")}>
            <h2 id="callback" className="label-mono text-graphite">
              Перезвонить
            </h2>
            {lead.callbackAt ? (
              <p className={callbackOverdue ? "text-alert" : "text-ink"}>
                {callbackOverdue ? "Просрочено: " : ""}
                {formatLeadDate(lead.callbackAt)}
              </p>
            ) : null}
            <ScheduleForm
              action={setCallback}
              id={lead.id}
              name="callback"
              value={toMoscowLocal(lead.callbackAt)}
              label="Когда перезвонить"
            >
              <button type="submit" name="at" value={inHour} formNoValidate className={ghostButtonClass}>
                Через час
              </button>
              <button type="submit" name="at" value={tomorrow10} formNoValidate className={ghostButtonClass}>
                Завтра в 10:00
              </button>
            </ScheduleForm>
          </section>

          <section aria-labelledby="appointment" className={cn(cardClass, "flex flex-col gap-3 p-5")}>
            <h2 id="appointment" className="label-mono text-graphite">
              Записан на приём
            </h2>
            {lead.appointmentAt ? <p className="text-ink">{formatLeadDate(lead.appointmentAt)}</p> : null}
            <ScheduleForm
              action={setAppointment}
              id={lead.id}
              name="appointment"
              value={toMoscowLocal(lead.appointmentAt)}
              label="Дата и время приёма"
            />
            <p className="text-caption leading-normal tracking-normal text-graphite">
              Статус сам станет «{statusLabel("booked")}».
            </p>
          </section>

          <section aria-labelledby="note" className={cn(cardClass, "flex flex-col gap-3 p-5")}>
            <h2 id="note" className="label-mono text-graphite">
              Заметка
            </h2>
            <form action={addNote} className="flex flex-col gap-3">
              <input type="hidden" name="id" value={lead.id} />
              <label htmlFor="note-body" className="sr-only">
                Текст заметки
              </label>
              <textarea
                id="note-body"
                name="body"
                rows={3}
                maxLength={2000}
                required
                placeholder="Например: не дозвонились, просил набрать после 18:00"
                className={cn(fieldClass, "resize-y py-2.5")}
              />
              <p className="text-caption leading-normal tracking-normal text-graphite">
                Без диагнозов и данных о здоровье — им место в медицинской карте.
              </p>
              <button type="submit" className={cn(buttonClass, "self-start")}>
                Добавить
              </button>
            </form>
          </section>

          <section className="flex flex-col gap-3 pt-2">
            <p className="text-caption leading-normal tracking-normal text-graphite">
              Удаляйте заявку, если человек попросил удалить свои данные или это спам. По закону о
              персональных данных на просьбу об удалении нужно ответить в течение 10 рабочих дней.
            </p>
            <form action={removeLead}>
              <input type="hidden" name="id" value={lead.id} />
              <DeleteButton />
            </form>
          </section>
        </aside>
      </div>
    </div>
  );
}

/** Форма времени: поле, «Сохранить», «Снять» и, если переданы, быстрые кнопки. */
function ScheduleForm({
  action,
  id,
  name,
  value,
  label,
  children,
}: {
  action: (formData: FormData) => Promise<void>;
  id: number;
  name: string;
  value: string;
  label: string;
  children?: React.ReactNode;
}) {
  const inputId = `${name}-${id}`;
  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="id" value={id} />
      <label htmlFor={inputId} className="sr-only">
        {label}
      </label>
      {/* key — чтобы после сохранения поле показало новое значение. */}
      <input
        key={value}
        id={inputId}
        name="at"
        type="datetime-local"
        defaultValue={value}
        required
        className={cn(fieldClass, "[color-scheme:light]")}
      />
      <div className="flex flex-wrap gap-2">
        <button type="submit" className={buttonClass}>
          Сохранить
        </button>
        {children}
        {value ? (
          <button type="submit" name="at" value="" formNoValidate className={ghostButtonClass}>
            Снять
          </button>
        ) : null}
      </div>
    </form>
  );
}

function eventText(event: LeadEvent) {
  switch (event.kind) {
    case "status":
      return `Статус: ${statusLabel(event.body)}`;
    case "note":
      return event.body;
    case "callback":
      return event.body ? `Перезвонить: ${event.body}` : "Перезвон снят";
    case "appointment":
      return event.body ? `Записан на приём: ${event.body}` : "Запись на приём снята";
  }
}
