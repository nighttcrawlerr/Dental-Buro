import { getPriceItem } from "@/content/prices";

/**
 * Расчёт стоимости для квиза на /raschet.
 *
 * Суммы не задаются здесь — только состав: какие позиции прайса входят в
 * лечение и сколько раз. Цены берутся из src/content/prices.ts по ключу
 * позиции, поэтому квиз и прайс не могут разойтись.
 *
 * Верхняя граница показывается, только когда её даёт сам прайс: у лечения
 * зуба это «кариес» против «три канала». Там, где в прайсе цена «от»,
 * итог тоже «от» — придумывать потолок за клинику нельзя.
 */

/** Сколько раз позиция входит в лечение. */
type Per = "case" | "tooth" | "jaw";

/**
 * Строка расчёта. Если у строки есть max — это развилка «в лучшем случае /
 * в худшем», и она даёт верхнюю границу итога.
 */
type Line = {
  item: string;
  per: Per;
  max?: string;
  /** Чем заменить позицию, если отмечены зубы обеих челюстей, — снимок обеих. */
  bothJaws?: string;
  note?: string;
};

export type Goal = {
  id: string;
  title: string;
  text: string;
  /** slug услуги — уходит в заявку и даёт ссылку на страницу услуги. */
  service: string;
  /**
   * Как уточняем объём. teeth — схема зубов; jaws — одна или обе челюсти;
   * none — объём не нужен.
   */
  amount: "teeth" | "jaws" | "none";
  /** Варианты лечения внутри цели — как вид брекетов. */
  options?: { id: string; title: string; text: string; lines: Line[] }[];
  /** Состав, если вариантов нет. */
  lines?: Line[];
};

export const goals: Goal[] = [
  {
    id: "implant",
    title: "Восстановить отсутствующие зубы",
    text: "Имплант с коронкой вместо потерянного зуба",
    service: "implantaciya",
    amount: "teeth",
    lines: [
      { item: "implant-consult", per: "case" },
      {
        item: "implant",
        per: "tooth",
        max: "implant-premium",
        note: "от Biotem до Nobel — систему подберёт врач",
      },
      { item: "healing-cap", per: "tooth" },
      { item: "implant-crown", per: "tooth" },
    ],
  },
  {
    id: "treat",
    title: "Вылечить зуб",
    text: "Кариес, боль, лечение каналов",
    service: "terapiya",
    amount: "teeth",
    lines: [
      { item: "consult", per: "case" },
      {
        item: "caries",
        per: "tooth",
        max: "canals-molar",
        note: "от пломбы до лечения каналов — скажет осмотр",
      },
    ],
  },
  {
    id: "extract",
    title: "Удалить зуб",
    text: "В том числе зуб мудрости",
    service: "hirurgiya",
    amount: "teeth",
    lines: [
      {
        item: "extraction",
        per: "tooth",
        max: "extraction-impacted",
        note: "от простого удаления до сложного зуба мудрости",
      },
    ],
  },
  {
    id: "aesthetics",
    title: "Сделать улыбку красивее",
    text: "Форма и цвет зубов: виниры",
    service: "estetika",
    amount: "teeth",
    lines: [
      {
        item: "veneer-composite",
        per: "tooth",
        max: "veneer",
        note: "композитный или керамический винир — зависит от задачи",
      },
    ],
  },
  {
    id: "ortho",
    title: "Выровнять зубы",
    text: "Брекеты или элайнеры",
    service: "ortodontiya",
    // Брекеты в прайсе — сразу на обе челюсти, поэтому объём не уточняем.
    amount: "none",
    options: [
      {
        id: "braces-ligature",
        title: "Лигатурные брекеты",
        text: "Классическая система, самый доступный вариант",
        lines: [
          { item: "ortho-consult", per: "case" },
          { item: "braces-ligature", per: "case", note: "обе челюсти" },
        ],
      },
      {
        id: "braces-self",
        title: "Самолигирующие брекеты",
        text: "Меньше трения — реже визиты на коррекцию",
        lines: [
          { item: "ortho-consult", per: "case" },
          { item: "braces-self", per: "case", note: "обе челюсти" },
        ],
      },
      {
        id: "aligners",
        title: "Элайнеры",
        text: "Прозрачные съёмные каппы — почти незаметны",
        lines: [
          { item: "ortho-consult", per: "case" },
          // Самый частый случай; точное число капп — после цифрового плана.
          { item: "aligners", per: "case", note: "обе челюсти, 13–26 элайнеров" },
        ],
      },
    ],
  },
  {
    id: "hygiene",
    title: "Профессиональная чистка",
    text: "Снимаем камень и налёт, полируем",
    service: "gigiena",
    amount: "none",
    lines: [{ item: "hygiene", per: "case" }],
  },
  {
    id: "kids",
    title: "Для ребёнка",
    text: "Осмотр, профилактика, лечение молочных зубов",
    service: "detskaya",
    amount: "none",
    options: [
      {
        id: "checkup",
        title: "Осмотр и профилактика",
        text: "Знакомство, чистка, советы родителям",
        lines: [
          { item: "kids-consult", per: "case" },
          { item: "kids-hygiene", per: "case" },
        ],
      },
      {
        id: "treat",
        title: "Лечение зуба",
        text: "Кариес молочного зуба",
        lines: [
          { item: "kids-consult", per: "case" },
          { item: "kids-caries", per: "case" },
        ],
      },
    ],
  },
];

export type EstimateRow = {
  name: string;
  /** Сколько раз: 1 для «на случай», число зубов или челюстей. */
  times: number;
  min: number;
  /** Есть, только если строка — развилка. */
  max?: number;
  /** Цена в прайсе «от». */
  from: boolean;
  note?: string;
};

export type Estimate = {
  rows: EstimateRow[];
  min: number;
  /** Есть, если в расчёте есть развилка и нет цен «от». */
  max: number | null;
  /** В расчёте есть цена «от» — итог тоже «от», без верхней границы. */
  open: boolean;
};

/**
 * Посчитать лечение. teeth — сколько зубов отмечено, jaws — 1 или 2,
 * bothJaws — отмечены зубы и сверху, и снизу. Позиции «на зуб» без
 * отмеченных зубов считаются за один.
 */
export function estimate(
  lines: Line[],
  { teeth = 1, jaws = 1, bothJaws = false }: { teeth?: number; jaws?: number; bothJaws?: boolean },
) {
  const timesFor = (per: Per) => (per === "tooth" ? Math.max(teeth, 1) : per === "jaw" ? jaws : 1);

  const rows: EstimateRow[] = lines.map((line) => {
    const item = getPriceItem(bothJaws && line.bothJaws ? line.bothJaws : line.item);
    const times = timesFor(line.per);
    const maxItem = line.max ? getPriceItem(line.max) : null;
    // Верх вилки — из второй позиции или из вилки самой позиции (элайнеры).
    const maxPrice = maxItem?.price ?? item.priceTo;
    return {
      // Строчная только первая буква: названия систем (Nobel) остаются как есть.
      name: maxItem ? `${item.name} — ${maxItem.name[0].toLowerCase()}${maxItem.name.slice(1)}` : item.name,
      times,
      min: item.price * times,
      max: maxPrice ? maxPrice * times : undefined,
      from: Boolean(item.from || maxItem?.from),
      note: line.note,
    };
  });

  const min = rows.reduce((sum, r) => sum + r.min, 0);
  const open = rows.some((r) => r.from);
  const hasRange = rows.some((r) => r.max !== undefined);
  const max = open || !hasRange ? null : rows.reduce((sum, r) => sum + (r.max ?? r.min), 0);

  return { rows, min, max, open } satisfies Estimate;
}

/**
 * Проверить, что все позиции расчёта есть в прайсе. Вызывается со страницы
 * квиза при сборке: если при замене прайса потеряли ключ, сборка падает с
 * понятной ошибкой, а не квиз у пациента.
 */
export function assertEstimateItems() {
  for (const goal of goals) {
    const lines = [...(goal.lines ?? []), ...(goal.options ?? []).flatMap((o) => o.lines)];
    estimate(lines, {});
    estimate(lines, { bothJaws: true });
  }
}
