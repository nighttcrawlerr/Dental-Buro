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
      { item: "ct-jaw", per: "case", bothJaws: "ct-both", note: "если нет свежего снимка" },
      { item: "surgical-guide", per: "case" },
      { item: "implant", per: "tooth" },
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
      { item: "xray", per: "tooth" },
      {
        item: "caries",
        per: "tooth",
        max: "canals-3",
        note: "от пломбы до лечения трёх каналов — скажет снимок",
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
      { item: "consult", per: "case" },
      { item: "xray", per: "tooth" },
      {
        item: "extraction",
        per: "tooth",
        max: "extraction-wisdom",
        note: "от простого удаления до сложного зуба мудрости",
      },
    ],
  },
  {
    id: "aesthetics",
    title: "Сделать улыбку красивее",
    text: "Форма и цвет зубов: виниры или коронки",
    service: "estetika",
    amount: "teeth",
    lines: [
      { item: "smile-design", per: "case" },
      {
        item: "veneer",
        per: "tooth",
        max: "ceramic-crown",
        note: "винир или коронка — зависит от того, сколько осталось своей эмали",
      },
    ],
  },
  {
    id: "ortho",
    title: "Выровнять зубы",
    text: "Брекеты или элайнеры",
    service: "ortodontiya",
    amount: "jaws",
    options: [
      {
        id: "braces-metal",
        title: "Металлические брекеты",
        text: "Самый быстрый и доступный способ",
        lines: [
          { item: "ortho-consult", per: "case" },
          { item: "ortho-setup", per: "case" },
          { item: "braces-metal", per: "jaw" },
          { item: "retainer", per: "jaw" },
        ],
      },
      {
        id: "braces-ceramic",
        title: "Керамические брекеты",
        text: "Почти незаметны на зубах",
        lines: [
          { item: "ortho-consult", per: "case" },
          { item: "ortho-setup", per: "case" },
          { item: "braces-ceramic", per: "jaw" },
          { item: "retainer", per: "jaw" },
        ],
      },
      {
        id: "aligners",
        title: "Элайнеры",
        text: "Прозрачные съёмные каппы",
        lines: [
          { item: "ortho-consult", per: "case" },
          { item: "ortho-setup", per: "case" },
          { item: "aligners", per: "case" },
          { item: "retainer", per: "jaw" },
        ],
      },
    ],
  },
  {
    id: "hygiene",
    title: "Чистка и отбеливание",
    text: "Профессиональная гигиена, светлее на несколько тонов",
    service: "gigiena",
    amount: "none",
    options: [
      {
        id: "hygiene",
        title: "Только чистка",
        text: "Снимаем камень и налёт, полируем",
        lines: [{ item: "hygiene", per: "case" }],
      },
      {
        id: "home",
        title: "Чистка и домашнее отбеливание",
        text: "Каппы по слепку, курс дома",
        lines: [
          { item: "hygiene", per: "case" },
          { item: "whitening-home", per: "case" },
        ],
      },
      {
        id: "zoom",
        title: "Чистка и отбеливание ZOOM",
        text: "За один визит в клинике",
        lines: [
          { item: "hygiene", per: "case" },
          { item: "whitening-zoom", per: "case" },
        ],
      },
    ],
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
    return {
      name: maxItem ? `${item.name} — ${maxItem.name.toLowerCase()}` : item.name,
      times,
      min: item.price * times,
      max: maxItem ? maxItem.price * times : undefined,
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
