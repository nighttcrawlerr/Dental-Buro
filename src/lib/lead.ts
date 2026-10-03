import { z } from "zod";
import { services } from "@/content/site";
import { isCompletePhone, nationalDigits } from "./phone";

/**
 * Заявка на приём. Одна схема на браузер и на сервер: форма проверяет ей
 * поля до отправки, а серверный роут — всё, что пришло, потому что запрос
 * можно отправить и мимо формы.
 */

export const visitTimes = [
  { value: "any", label: "Любое время" },
  { value: "morning", label: "Утро, 9–12" },
  { value: "day", label: "День, 12–17" },
  { value: "evening", label: "Вечер, 17–21" },
] as const;

export type VisitTime = (typeof visitTimes)[number]["value"];

/**
 * Пожелания к приёму. Сформулированы как пожелания к ходу визита, а не как
 * сведения о здоровье: «я очень боюсь» или «у меня аллергия» в заявке —
 * медицинские данные, а их через сайт не собираем. Седация — услуга из
 * прайса, интерес к ней — то же, что выбор услуги.
 *
 * Только то, что зависит от поведения врача. Наушники, плед, сериал в
 * кресле добавятся, когда клиника подтвердит, что они у неё есть.
 */
export const comfortOptions = [
  { value: "explain", label: "Объясняйте каждый шаг заранее" },
  { value: "stop", label: "Договоримся о сигнале «стоп»" },
  { value: "breaks", label: "Нужны перерывы во время приёма" },
  { value: "sedation", label: "Хочу обсудить седацию" },
] as const;

export type ComfortOption = (typeof comfortOptions)[number]["value"];

/** Пустое значение — «не знаю, что нужно». Это самый частый ответ, и он законный. */
export const serviceOptions = [
  { value: "", label: "Пока не знаю — нужна консультация" },
  ...services.map((s) => ({ value: s.slug, label: s.title })),
];

const serviceSlugs = new Set(services.map((s) => s.slug));

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Напишите, как к вам обращаться")
    .max(80, "Слишком длинное имя"),
  phone: z
    .string()
    .refine(isCompletePhone, "Нужен номер из 10 цифр после +7")
    .transform((v) => `+7${nationalDigits(v)}`),
  service: z.string().refine((v) => v === "" || serviceSlugs.has(v), "Выберите услугу из списка"),
  time: z.enum(visitTimes.map((t) => t.value) as [VisitTime, ...VisitTime[]], "Выберите время из списка"),
  comment: z.string().trim().max(1000, "Не больше 1000 символов"),
  comfort: z
    .array(
      z.enum(
        comfortOptions.map((c) => c.value) as [ComfortOption, ...ComfortOption[]],
        "Выберите пожелания из списка",
      ),
    )
    .max(comfortOptions.length),
  consent: z.boolean().refine(Boolean, "Без согласия мы не можем принять заявку"),
});

/** То, что вводит человек. */
export type LeadInput = z.input<typeof leadSchema>;
/** То, что уходит дальше: телефон уже приведён к виду +79001234567. */
export type Lead = z.output<typeof leadSchema>;

export type LeadField = keyof LeadInput;
export type LeadErrors = Partial<Record<LeadField, string>>;

export const emptyLead: LeadInput = {
  name: "",
  phone: "",
  service: "",
  time: "any",
  comment: "",
  comfort: [],
  consent: false,
};

/** Ошибки по полям: по одной на поле, первая из найденных. */
export function validateLead(input: LeadInput) {
  const result = leadSchema.safeParse(input);
  if (result.success) return { data: result.data, errors: {} as LeadErrors };

  const errors: LeadErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as LeadField;
    errors[field] ??= issue.message;
  }
  return { data: null, errors };
}
