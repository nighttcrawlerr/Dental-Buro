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
