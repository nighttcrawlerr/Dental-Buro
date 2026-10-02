/**
 * Прейскурант — единственный источник цен на сайте.
 *
 * ЗАГЛУШКА. Позиции и суммы выдуманы и заменяются прайсом клиники целиком.
 * Публикация прейскуранта для медицинской организации обязательна.
 *
 * Страница услуги показывает не весь раздел, а позиции с featured: самые
 * частые вопросы «сколько стоит». Отдельного списка цен у услуг нет
 * намеренно — две копии одной цены рано или поздно разойдутся.
 */

export type PriceItem = {
  /**
   * Постоянный ключ позиции для расчёта стоимости (src/content/estimate.ts).
   * Есть только у позиций, которые участвуют в расчёте. Когда прайс
   * заменяется настоящим, ключи переносятся на соответствующие позиции —
   * иначе расчёт сообщит, какой позиции не хватает, ещё при сборке.
   */
  id?: string;
  name: string;
  price: number;
  /** «от» — когда сумма зависит от случая. */
  from?: boolean;
  /** Показывать на странице услуги. */
  featured?: boolean;
};

export type PriceSection = {
  /** slug услуги или отдельный раздел без страницы, как диагностика. */
  id: string;
  title: string;
  /** Ссылка на страницу услуги, если она есть. */
  service?: string;
  items: PriceItem[];
};

/** Дата, на которую прайс актуален. Обновлять вместе с ценами. */
export const pricesUpdatedAt = "00.00.0000";

export const priceSections: PriceSection[] = [
  {
    id: "diagnostika",
    title: "Консультации и диагностика",
    items: [
      { id: "consult", name: "Первичная консультация стоматолога", price: 1500 },
      { name: "Консультация с составлением плана лечения", price: 2500 },
      { id: "xray", name: "Прицельный рентгеновский снимок", price: 500 },
      { name: "Панорамный снимок (ОПТГ)", price: 1500 },
      { id: "ct-jaw", name: "Компьютерная томография одной челюсти", price: 3000 },
      { id: "ct-both", name: "Компьютерная томография обеих челюстей", price: 4000 },
    ],
  },
  {
    id: "implantaciya",
    title: "Имплантация",
    service: "implantaciya",
    items: [
      { id: "implant-consult", name: "Консультация имплантолога", price: 2500, featured: true },
      { name: "Компьютерная томография челюсти", price: 4000, featured: true },
      { id: "surgical-guide", name: "Хирургический шаблон", price: 12000 },
      { id: "implant", name: "Установка импланта, без коронки", price: 45000, from: true, featured: true },
      { id: "healing-cap", name: "Формирователь десны", price: 5000 },
      { name: "Временная коронка на имплант", price: 12000 },
      { id: "implant-crown", name: "Коронка на имплант из диоксида циркония", price: 35000, featured: true },
    ],
  },
  {
    id: "ortodontiya",
    title: "Ортодонтия и элайнеры",
    service: "ortodontiya",
    items: [
      { id: "ortho-consult", name: "Консультация ортодонта", price: 2500, featured: true },
      { id: "ortho-setup", name: "Диагностика и 3D-сетап", price: 15000, featured: true },
      { id: "braces-metal", name: "Брекет-система металлическая, одна челюсть", price: 120000, from: true, featured: true },
      { id: "braces-ceramic", name: "Брекет-система керамическая, одна челюсть", price: 150000, from: true },
      { id: "aligners", name: "Элайнеры, полный курс", price: 250000, from: true, featured: true },
      { name: "Контрольный визит", price: 3000 },
      { id: "retainer", name: "Несъёмный ретейнер, одна челюсть", price: 8000, featured: true },
      { name: "Съёмная каппа-ретейнер", price: 10000 },
    ],
  },
  {
    id: "estetika",
    title: "Эстетическая реставрация",
    service: "estetika",
    items: [
      { id: "smile-design", name: "Цифровой дизайн улыбки с макетом", price: 15000, featured: true },
      { id: "veneer", name: "Керамический винир", price: 38000, featured: true },
      { name: "Керамическая накладка", price: 40000, featured: true },
      { name: "Керамическая вкладка", price: 30000 },
      { id: "ceramic-crown", name: "Цельнокерамическая коронка", price: 42000 },
    ],
  },
  {
    id: "hirurgiya",
    title: "Хирургия",
    service: "hirurgiya",
    items: [
      { id: "extraction", name: "Удаление зуба, простое", price: 6000, featured: true },
      { name: "Удаление зуба, сложное", price: 10000 },
      { id: "extraction-wisdom", name: "Удаление зуба мудрости, сложное", price: 15000, featured: true },
      { name: "Седация, один визит", price: 15000, featured: true },
      { name: "Костная пластика", price: 35000, from: true },
      { name: "Открытый синус-лифтинг", price: 60000, featured: true },
      { name: "Закрытый синус-лифтинг", price: 25000 },
    ],
  },
  {
    id: "terapiya",
    title: "Терапия и эндодонтия",
    service: "terapiya",
    items: [
      { id: "caries", name: "Лечение кариеса с пломбой", price: 7500, featured: true },
      { name: "Лечение глубокого кариеса", price: 9500 },
      { name: "Лечение каналов, одноканальный зуб", price: 15000, featured: true },
      { name: "Лечение каналов, двухканальный зуб", price: 21000 },
      { id: "canals-3", name: "Лечение каналов, трёхканальный зуб", price: 28000, featured: true },
      { name: "Перелечивание, за один канал", price: 10000, featured: true },
      { name: "Изоляция коффердамом", price: 1000 },
    ],
  },
  {
    id: "gigiena",
    title: "Гигиена и отбеливание",
    service: "gigiena",
    items: [
      { id: "hygiene", name: "Профессиональная гигиена полости рта", price: 7000, featured: true },
      { name: "Профессиональная гигиена при брекетах", price: 8000 },
      { name: "Реминерализующая терапия", price: 2500 },
      { id: "whitening-home", name: "Домашнее каповое отбеливание", price: 18000, featured: true },
      { id: "whitening-zoom", name: "Отбеливание ZOOM в клинике", price: 30000, featured: true },
    ],
  },
  {
    id: "detskaya",
    title: "Детская стоматология",
    service: "detskaya",
    items: [
      { name: "Адаптационный визит", price: 0, featured: true },
      { id: "kids-consult", name: "Осмотр и консультация детского стоматолога", price: 1500 },
      { id: "kids-caries", name: "Лечение кариеса молочного зуба", price: 4500, featured: true },
      { name: "Лечение пульпита молочного зуба", price: 7000 },
      { name: "Удаление молочного зуба", price: 3000 },
      { name: "Герметизация фиссур, один зуб", price: 4500, featured: true },
      { id: "kids-hygiene", name: "Профессиональная гигиена, ребёнок", price: 4000 },
    ],
  },
];

/** Позиция по ключу. Без неё расчёт стоимости не может работать — бросаем. */
export function getPriceItem(id: string) {
  for (const section of priceSections) {
    const item = section.items.find((i) => i.id === id);
    if (item) return item;
  }
  throw new Error(`В прайсе нет позиции с id «${id}» — её использует расчёт стоимости`);
}

/** Позиции для страницы услуги. */
export function getFeaturedPrices(serviceSlug: string) {
  const section = priceSections.find((s) => s.service === serviceSlug);
  return section?.items.filter((i) => i.featured) ?? [];
}
