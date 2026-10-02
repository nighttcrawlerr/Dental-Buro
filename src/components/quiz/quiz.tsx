"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SiteLeadForm } from "@/components/lead/site-lead-form";
import { ToothChart } from "@/components/quiz/tooth-chart";
import { Button } from "@/components/ui/button";
import { estimate, goals, type Estimate, type Goal } from "@/content/estimate";
import { services } from "@/content/site";
import { goals as analyticsGoals, reachGoal } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import { formatPrice, plural } from "@/lib/format";

/**
 * Квиз «Сколько будет стоить»: цель → детали → расчёт и запись.
 *
 * Всё считается в браузере. В заявку уходит только услуга и строка с
 * итогом в комментарии — человек видит её в форме и может стереть. Какие
 * зубы отмечены, не уходит никуда: это медицинские данные, а для записи
 * администратору достаточно услуги.
 *
 * Шаги — не отдельные страницы: ответы живут в состоянии, и «назад» не
 * теряет отмеченные зубы. При смене шага фокус переходит на его заголовок,
 * чтобы клавиатура и скринридер не остались на исчезнувшей кнопке.
 */

type Step = "goal" | "details" | "result";

const stepNumber: Record<Step, number> = { goal: 1, details: 2, result: 3 };

const amount = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });

/** «от 85 000 ₽», «9 500 – 30 000 ₽» или точная сумма. */
function totalText({ min, max, open }: Estimate) {
  if (open) return `от ${formatPrice(min)}`;
  if (max !== null && max !== min) return `${amount.format(min)} – ${formatPrice(max)}`;
  return formatPrice(min);
}

/** Карточка-выбор: цель или вариант лечения. */
function Choice({
  title,
  text,
  selected,
  onClick,
}: {
  title: string;
  text: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "flex h-full flex-col gap-2 rounded-card border p-6 text-left transition-colors duration-200",
        selected
          ? "border-ink bg-ink text-cream"
          : "border-hairline bg-paper text-ink hover:border-graphite",
      )}
    >
      <span className="font-display text-subheading">{title}</span>
      <span className={selected ? "text-stone" : "text-graphite"}>{text}</span>
    </button>
  );
}

export function Quiz() {
  const [step, setStep] = useState<Step>("goal");
  const [goal, setGoal] = useState<Goal | null>(null);
  const [optionId, setOptionId] = useState<string | null>(null);
  const [teeth, setTeeth] = useState<Set<number>>(new Set());
  const [unknownCount, setUnknownCount] = useState(false);
  const [jaws, setJaws] = useState<1 | 2>(2);
  const [error, setError] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const started = useRef(false);
  const firstRender = useRef(true);

  // Фокус на заголовок нового шага — но не при первой отрисовке страницы.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
  }, [step]);

  const option = goal?.options?.find((o) => o.id === optionId) ?? null;
  const lines = option?.lines ?? goal?.lines ?? [];
  const toothCount = unknownCount ? 1 : teeth.size;
  // Зубы сверху (четверти 1, 2) и снизу (3, 4) — снимок нужен обеих челюстей.
  const bothJaws = [...teeth].some((t) => t < 30) && [...teeth].some((t) => t > 30);
  const result = goal ? estimate(lines, { teeth: toothCount, jaws, bothJaws }) : null;
  const service = goal ? services.find((s) => s.slug === goal.service) : undefined;

  function chooseGoal(next: Goal) {
    if (!started.current) {
      started.current = true;
      reachGoal(analyticsGoals.quizStarted);
    }
    if (next.id !== goal?.id) {
      setGoal(next);
      setOptionId(null);
      setTeeth(new Set());
      setUnknownCount(false);
    }
    setError(null);
    setStep("details");
  }

  function toggleTooth(tooth: number) {
    setUnknownCount(false);
    setError(null);
    setTeeth((prev) => {
      const next = new Set(prev);
      if (next.has(tooth)) next.delete(tooth);
      else next.add(tooth);
      return next;
    });
  }

  function showResult() {
    if (!goal) return;
    if (goal.options && !option) {
      setError("Выберите один из вариантов");
      return;
    }
    if (goal.amount === "teeth" && teeth.size === 0 && !unknownCount) {
      setError("Отметьте хотя бы один зуб — или нажмите «Не знаю, сколько»");
      return;
    }
    setError(null);
    setStep("result");
    reachGoal(analyticsGoals.quizCompleted);
  }

  /** Строка для комментария в заявке: что выбрано и итог, без зубов. */
  function leadNote() {
    if (!goal || !result) return "";
    const parts = [goal.title];
    if (option) parts.push(option.title.toLowerCase());
    if (goal.amount === "jaws") parts.push(jaws === 2 ? "обе челюсти" : "одна челюсть");
    return `Расчёт на сайте: ${parts.join(", ")}. Ориентир: ${totalText(result)}.`;
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Прогресс. Для скринридера — словами, полоса декоративная. */}
      <div className="flex flex-col gap-3">
        <p className="label-mono text-graphite">Шаг {stepNumber[step]} из 3</p>
        <div aria-hidden="true" className="h-px w-full bg-hairline">
          <div
            className="h-px origin-left bg-ink transition-transform duration-500 ease-out"
            style={{ transform: `scaleX(${stepNumber[step] / 3})` }}
          />
        </div>
      </div>

      {step === "goal" ? (
        <div key="goal" className="quiz-step flex flex-col gap-8">
          <h2 ref={headingRef} tabIndex={-1} className="font-display text-heading-lg text-ink outline-none">
            Что хотите решить?
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {goals.map((g) => (
              <Choice
                key={g.id}
                title={g.title}
                text={g.text}
                selected={goal?.id === g.id}
                onClick={() => chooseGoal(g)}
              />
            ))}
          </div>
        </div>
      ) : null}

      {step === "details" && goal ? (
        <div key="details" className="quiz-step flex flex-col gap-8">
          <h2 ref={headingRef} tabIndex={-1} className="font-display text-heading-lg text-ink outline-none">
            {goal.amount === "teeth" ? "Какие зубы?" : "Уточним детали"}
          </h2>

          {goal.options ? (
            <div role="group" aria-label="Вариант лечения" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {goal.options.map((o) => (
                <Choice
                  key={o.id}
                  title={o.title}
                  text={o.text}
                  selected={optionId === o.id}
                  onClick={() => {
                    setOptionId(o.id);
                    setError(null);
                  }}
                />
              ))}
            </div>
          ) : null}

          {goal.amount === "jaws" ? (
            <div role="group" aria-label="Сколько челюстей" className="flex flex-wrap gap-2">
              {([1, 2] as const).map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-pressed={jaws === n}
                  onClick={() => setJaws(n)}
                  className={cn(
                    "label-mono inline-flex min-h-11 items-center rounded-full border px-5 transition-colors duration-200",
                    jaws === n
                      ? "border-ink bg-ink text-cream"
                      : "border-hairline text-graphite hover:border-graphite hover:text-ink",
                  )}
                >
                  {n === 1 ? "Одна челюсть" : "Обе челюсти"}
                </button>
              ))}
            </div>
          ) : null}

          {goal.amount === "teeth" ? (
            <div className="flex flex-col gap-6">
              <p className="max-w-2xl text-graphite">
                Нажмите на зубы, которые нужно лечить. Схема — как у врача: правая сторона рта
                слева на экране. Отмеченные зубы остаются у вас в браузере и никуда не
                отправляются.
              </p>
              <ToothChart selected={teeth} onToggle={toggleTooth} />
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <p className="label-mono text-ink" aria-live="polite">
                  {unknownCount
                    ? "Посчитаем для одного зуба"
                    : teeth.size
                      ? `Отмечено: ${plural(teeth.size, ["зуб", "зуба", "зубов"])}`
                      : "Ничего не отмечено"}
                </p>
                <button
                  type="button"
                  aria-pressed={unknownCount}
                  onClick={() => {
                    setUnknownCount(true);
                    setTeeth(new Set());
                    setError(null);
                  }}
                  className="label-mono text-graphite underline underline-offset-4 hover:text-ink"
                >
                  Не знаю, сколько
                </button>
                {teeth.size ? (
                  <button
                    type="button"
                    onClick={() => setTeeth(new Set())}
                    className="label-mono text-graphite underline underline-offset-4 hover:text-ink"
                  >
                    Сбросить
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          {error ? (
            <p role="alert" className="text-alert">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button onClick={showResult}>Показать расчёт</Button>
            <Button variant="ghost" onClick={() => setStep("goal")}>
              Назад
            </Button>
          </div>
        </div>
      ) : null}

      {step === "result" && goal && result ? (
        <div key="result" className="quiz-step grid gap-12 lg:grid-cols-[1fr_minmax(0,32rem)] lg:gap-16">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <h2 ref={headingRef} tabIndex={-1} className="label-mono text-graphite outline-none">
                Ориентир по прайсу
              </h2>
              <p className="font-display text-display text-ink">{totalText(result)}</p>
              <p className="max-w-xl text-graphite">
                {goal.title}
                {option ? `, ${option.title.toLowerCase()}` : ""}
                {goal.amount === "teeth"
                  ? `, ${unknownCount ? "расчёт на один зуб" : plural(toothCount, ["зуб", "зуба", "зубов"])}`
                  : ""}
                {goal.amount === "jaws" ? `, ${jaws === 2 ? "обе челюсти" : "одна челюсть"}` : ""}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="label-mono text-graphite">Что входит</h3>
              <ul className="flex flex-col">
                {result.rows.map((row) => (
                  <li
                    key={row.name}
                    className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 border-t border-hairline py-4 last:border-b"
                  >
                    <span className="text-ink">
                      {row.name}
                      {row.times > 1 ? <span className="text-graphite"> × {row.times}</span> : null}
                    </span>
                    <span className="label-mono text-right whitespace-nowrap text-ink">
                      {row.from ? "от " : ""}
                      {row.max !== undefined
                        ? `${amount.format(row.min)} – ${formatPrice(row.max)}`
                        : formatPrice(row.min)}
                    </span>
                    {row.note ? <span className="col-span-2 text-graphite">{row.note}</span> : null}
                  </li>
                ))}
              </ul>
            </div>

            <p className="max-w-xl text-graphite">
              Это ориентир по нашему прайсу, а не окончательная цена. Точную сумму врач назовёт
              после осмотра и снимка и зафиксирует в плане лечения — дальше она без вашего
              согласия не меняется. Имеются противопоказания, необходима консультация
              специалиста.
            </p>

            <div className="flex flex-wrap gap-3">
              <Button variant="ghost" onClick={() => setStep("details")}>
                Изменить ответы
              </Button>
              {service ? (
                <Link
                  href={`/services/${service.slug}`}
                  className="label-mono inline-flex min-h-11 items-center px-2 text-ink underline underline-offset-4 hover:text-sky"
                >
                  Подробнее: {service.title.toLowerCase()}
                </Link>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-6 rounded-card bg-paper p-6 lg:self-start lg:p-8">
            <div className="flex flex-col gap-2">
              <h3 className="font-display text-heading-sm text-ink">Записаться на консультацию</h3>
              <p className="text-graphite">
                Расчёт уже в комментарии — администратор увидит его в заявке. Если не хотите его
                передавать, просто сотрите.
              </p>
            </div>
            <SiteLeadForm defaultService={goal.service} defaultComment={leadNote()} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
