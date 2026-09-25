"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  emptyLead,
  serviceOptions,
  validateLead,
  visitTimes,
  type Lead,
  type LeadErrors,
  type LeadField,
  type LeadInput,
} from "@/lib/lead";
import { clinic } from "@/content/site";
import { cn } from "@/lib/cn";
import { formatPhone } from "@/lib/phone";
import { LeadSubmitError, type LeadSubmitErrorKind } from "@/lib/submit-lead";

type FormSurface = "light" | "dark";

/**
 * Поле на светлой канве — белая карточка с линией, на тёмной — прозрачное
 * с линией эспрессо. Тени и заливки акцентом система не использует, поэтому
 * фокус и ошибка держатся на цвете рамки.
 */
const toneBySurface: Record<
  FormSurface,
  { label: string; field: string; invalid: string; error: string; note: string; link: string; check: string }
> = {
  light: {
    label: "text-graphite",
    field: "border-hairline bg-paper text-ink placeholder:text-smoke hover:border-smoke focus:border-ink",
    invalid: "border-alert hover:border-alert focus:border-alert",
    error: "text-alert",
    note: "text-graphite",
    link: "text-ink underline underline-offset-2 hover:text-sky",
    check: "accent-sky",
  },
  dark: {
    label: "text-stone",
    field:
      "border-hairline-dark bg-ink/25 text-cream placeholder:text-stone/60 hover:border-stone/60 focus:border-cream [&_option]:text-ink",
    invalid: "border-alert-soft hover:border-alert-soft focus:border-alert-soft",
    error: "text-alert-soft",
    note: "text-stone",
    link: "text-cream underline underline-offset-2 hover:text-sky-pale",
    check: "accent-sky-pale",
  },
};

/**
 * Что сказать, если заявка не ушла. Телефон клиники выводится под каждым
 * сообщением: человек, который хотел записаться, должен уйти с формы
 * записанным, даже если сломались мы.
 */
const submitErrorText: Record<LeadSubmitErrorKind, string> = {
  network: "Не получилось отправить — похоже, пропало соединение. Проверьте интернет и попробуйте ещё раз.",
  invalid: "Сервер не принял заявку. Проверьте поля формы и отправьте ещё раз.",
  rate: "С этого устройства уже пришло несколько заявок подряд. Если нужно что-то уточнить, позвоните нам.",
  server: "Заявка не дошла — это сбой на нашей стороне. Попробуйте через минуту или позвоните нам.",
};

/** Порядок, в котором проверяются поля: фокус уходит на первое с ошибкой. */
const fieldOrder: LeadField[] = ["name", "phone", "service", "time", "comment", "consent"];

type LeadFormProps = {
  surface?: FormSurface;
  /**
   * Что делать с проверенной заявкой. Пока промис не завершится, кнопка
   * заблокирована. website — содержимое поля-ловушки для ботов.
   */
  onSubmit: (lead: Lead, meta: { website: string }) => Promise<void>;
  submitLabel?: string;
  /** Услуга, выбранная заранее, — на странице услуги спрашивать её незачем. */
  defaultService?: string;
  className?: string;
};

/**
 * Форма записи на приём.
 *
 * Ошибки не показываются, пока человек печатает: поле проверяется, когда из
 * него ушли, а пустые поля — только при отправке. Красная рамка на имени после
 * первой же буквы раздражает и ничего не сообщает. После первой попытки
 * отправки проверка становится живой, чтобы ошибка исчезала сразу, как её
 * исправили.
 *
 * Кнопка без согласия не отключается, а при нажатии показывает, чего не
 * хватает. Отключённая кнопка молчит: на неё нельзя попасть табом, и человек
 * не понимает, почему форма не отправляется.
 */
export function LeadForm({
  surface = "light",
  onSubmit,
  submitLabel = "Записаться",
  defaultService = "",
  className,
}: LeadFormProps) {
  const tone = toneBySurface[surface];
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);

  const initial = { ...emptyLead, service: defaultService };
  const [values, setValues] = useState<LeadInput>(initial);
  const [errors, setErrors] = useState<LeadErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [pending, setPending] = useState(false);
  const [submitError, setSubmitError] = useState<LeadSubmitErrorKind | null>(null);

  const idFor = (field: LeadField) => `${uid}-${field}`;
  const errorIdFor = (field: LeadField) => `${uid}-${field}-error`;

  function checkField(field: LeadField, next: LeadInput) {
    const message = validateLead(next).errors[field];
    setErrors((prev) => ({ ...prev, [field]: message }));
  }

  function update<K extends LeadField>(field: K, value: LeadInput[K]) {
    const next = { ...values, [field]: value };
    setValues(next);
    if (attempted || errors[field]) checkField(field, next);
  }

  function handleBlur(field: LeadField) {
    const value = values[field];
    if (typeof value === "string" && value.trim() === "") return;
    checkField(field, values);
  }

  function focusFirstInvalid(found: LeadErrors) {
    const first = fieldOrder.find((f) => found[f]);
    const el = first && formRef.current?.elements.namedItem(first);
    if (el instanceof HTMLElement) el.focus();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;

    setAttempted(true);
    const { data, errors: found } = validateLead(values);
    setErrors(found);

    if (!data) {
      focusFirstInvalid(found);
      return;
    }

    setPending(true);
    setSubmitError(null);
    try {
      const trap = formRef.current?.elements.namedItem("website");
      await onSubmit(data, { website: trap instanceof HTMLInputElement ? trap.value : "" });
      // Очищаем только после успеха: если отправка упала, человек не должен
      // набирать всё заново.
      setValues(initial);
      setErrors({});
      setAttempted(false);
    } catch (error) {
      const kind = error instanceof LeadSubmitError ? error.kind : "server";
      setSubmitError(kind);
      if (error instanceof LeadSubmitError && Object.keys(error.fields).length) {
        setErrors(error.fields);
        focusFirstInvalid(error.fields);
      }
    } finally {
      setPending(false);
    }
  }

  const fieldClasses = (field: LeadField) =>
    cn(
      "block min-h-13 w-full rounded-button border px-4 text-body transition-colors duration-200 outline-offset-2",
      tone.field,
      errors[field] && tone.invalid,
    );

  const a11y = (field: LeadField) => ({
    id: idFor(field),
    name: field,
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": errors[field] ? errorIdFor(field) : undefined,
  });

  // Обычные функции, а не компоненты: компонент, объявленный внутри другого,
  // пересоздаётся на каждый рендер, и React перемонтирует его заново.
  function label(field: LeadField, text: string, optional?: boolean) {
    return (
      <label htmlFor={idFor(field)} className={cn("label-mono", tone.label)}>
        {text}
        {optional ? <span className="opacity-70"> · необязательно</span> : null}
      </label>
    );
  }

  function errorText(field: LeadField) {
    if (!errors[field]) return null;
    return (
      <p id={errorIdFor(field)} className={cn("text-caption", tone.error)}>
        {errors[field]}
      </p>
    );
  }

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={handleSubmit}
      aria-busy={pending || undefined}
      className={cn("grid gap-x-4 gap-y-6 md:grid-cols-2", className)}
    >
      {/* Ловушка для ботов. Людям не видна и недоступна с клавиатуры, а бот
          заполняет все поля подряд — по заполненному поле сервер его и узнаёт.
          Название правдоподобное нарочно: поле «trap» бот бы пропустил. */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label>
          Сайт
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      <div className="flex flex-col gap-2">
        {label("name", "Имя")}
        <input
          {...a11y("name")}
          type="text"
          autoComplete="name"
          maxLength={80}
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          onBlur={() => handleBlur("name")}
          className={fieldClasses("name")}
        />
        {errorText("name")}
      </div>

      <div className="flex flex-col gap-2">
        {label("phone", "Телефон")}
        <input
          {...a11y("phone")}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+7 (___) ___-__-__"
          value={values.phone}
          onChange={(e) => update("phone", formatPhone(e.target.value))}
          onBlur={() => handleBlur("phone")}
          className={fieldClasses("phone")}
        />
        {errorText("phone")}
      </div>

      <div className="flex flex-col gap-2">
        {label("service", "Услуга")}
        <Select
          {...a11y("service")}
          value={values.service}
          onChange={(v) => update("service", v)}
          options={serviceOptions}
          className={fieldClasses("service")}
        />
        {errorText("service")}
      </div>

      <div className="flex flex-col gap-2">
        {label("time", "Когда удобно прийти")}
        <Select
          {...a11y("time")}
          value={values.time}
          onChange={(v) => update("time", v as LeadInput["time"])}
          options={visitTimes}
          className={fieldClasses("time")}
        />
        {errorText("time")}
      </div>

      <div className="flex flex-col gap-2 md:col-span-2">
        {label("comment", "Комментарий", true)}
        <textarea
          {...a11y("comment")}
          rows={3}
          maxLength={1000}
          placeholder="Что беспокоит, удобный день, вопросы к врачу"
          value={values.comment}
          onChange={(e) => update("comment", e.target.value)}
          onBlur={() => handleBlur("comment")}
          className={cn(fieldClasses("comment"), "resize-y py-3")}
        />
        {errorText("comment")}
      </div>

      <div className="flex flex-col gap-2 md:col-span-2">
        <div className="flex items-start gap-3">
          <input
            {...a11y("consent")}
            type="checkbox"
            checked={values.consent}
            onChange={(e) => update("consent", e.target.checked)}
            className={cn("mt-0.5 size-5 shrink-0 cursor-pointer", tone.check)}
          />
          <label htmlFor={idFor("consent")} className={cn("cursor-pointer text-caption leading-normal tracking-normal", tone.note)}>
            Даю{" "}
            <Link href="/legal/consent" target="_blank" className={tone.link}>
              согласие на обработку персональных данных
            </Link>{" "}
            в соответствии с{" "}
            <Link href="/legal/privacy" target="_blank" className={tone.link}>
              политикой обработки персональных данных
            </Link>
          </label>
        </div>
        {errorText("consent")}
      </div>

      {/* role="alert" — чтобы скринридер зачитал ошибку сразу, фокус при этом
          остаётся на кнопке и повторная отправка — одно нажатие. Контейнер
          есть всегда, даже пустой: живую область, которая появилась в DOM
          вместе с текстом, скринридеры часто не зачитывают. Пустой он
          схлопывается отрицательным отступом, чтобы не добавлять лишний
          зазор сетки. */}
      <div role="alert" className="md:col-span-2 empty:-mb-6">
        {submitError ? (
          <div
            className={cn(
              "flex flex-col gap-2 rounded-button border px-4 py-3",
              surface === "dark" ? "border-alert-soft/60" : "border-alert/40 bg-paper",
            )}
          >
            <p className={cn("text-body", tone.error)}>{submitErrorText[submitError]}</p>
            <p className={cn("text-caption tracking-normal", tone.note)}>
              Телефон клиники:{" "}
              <a href={clinic.phoneHref} className={tone.link}>
                {clinic.phone}
              </a>
              , {clinic.schedule.toLowerCase()}
            </p>
          </div>
        ) : null}
      </div>

      <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center">
        {/* Кнопка на время отправки не отключается: отключённая кнопка теряет
            фокус, и клавиатурный пользователь оказывается в начале страницы.
            Повторное нажатие отсекает проверка pending в handleSubmit. */}
        <Button
          type="submit"
          surface={surface}
          className={cn("md:min-w-56", pending && "cursor-wait opacity-70")}
        >
          {pending ? "Отправляем…" : submitLabel}
        </Button>
        <p className={cn("text-caption tracking-normal", tone.note)}>
          Администратор перезвонит и подберёт время приёма.
        </p>
      </div>
    </form>
  );
}

type SelectProps = {
  id: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: readonly { value: string; label: string }[];
  className: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
};

/** Нативный список: на телефоне он открывает системное колесо, которое удобнее любого самодельного. */
function Select({ onChange, options, className, ...rest }: SelectProps) {
  return (
    <div className="relative">
      <select
        {...rest}
        onChange={(e) => onChange(e.target.value)}
        className={cn(className, "cursor-pointer appearance-none pr-12")}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 opacity-60"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}
