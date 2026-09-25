const rubles = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  maximumFractionDigits: 0,
});

/**
 * Цена «от». Копейки в прайсе стоматологии не бывают значимыми, поэтому
 * дробная часть отбрасывается, а неразрывные пробелы формата сохраняются —
 * они не дают числу переноситься посреди разрядов.
 */
export function formatPriceFrom(value: number) {
  return `от ${rubles.format(value)}`;
}

/** Цена строки прайса. Ноль — это «бесплатно», а не «0 ₽». */
export function formatPrice(value: number) {
  return value === 0 ? "Бесплатно" : rubles.format(value);
}

/** Строка прайса: «от» — если сумма зависит от случая. */
export function formatPriceItem(item: { price: number; from?: boolean }) {
  return item.from ? formatPriceFrom(item.price) : formatPrice(item.price);
}

/**
 * Число со словом в нужной форме: plural(3, ["позиция", "позиции", "позиций"])
 * → «3 позиции».
 */
export function plural(n: number, [one, few, many]: [string, string, string]) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} ${one}`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${n} ${few}`;
  return `${n} ${many}`;
}
