/**
 * Российский номер без кода страны: десять цифр, первая обычно 9.
 *
 * Код страны отбрасывается в любом написании — «+7», «7» или «8» в начале.
 * Так одинаково разбираются ручной ввод, вставка из заметок и автозаполнение
 * браузера, которое подставляет «+79…».
 */
export function nationalDigits(value: string) {
  let digits = value.replace(/\D/g, "");

  if (value.trimStart().startsWith("+7") || /^[78]/.test(digits)) {
    digits = digits.slice(1);
  }

  return digits.slice(0, 10);
}

/**
 * Маска `+7 (___) ___-__-__`, которая растёт по мере ввода.
 *
 * Разделители ставятся только перед следующей цифрой, а не после
 * предыдущей. Иначе Backspace в конце строки упирался бы в скобку или дефис:
 * символ стирается, маска тут же его возвращает, и курсор стоит на месте.
 */
export function formatPhone(value: string) {
  const d = nationalDigits(value);
  // Первым нажатием человек часто набирает код страны. Показываем, что он
  // принят, — иначе «8» бесследно исчезает и кажется, что поле сломано.
  if (!d) return /^[78+]$/.test(value) ? "+7 (" : "";

  let out = `+7 (${d.slice(0, 3)}`;
  if (d.length > 3) out += `) ${d.slice(3, 6)}`;
  if (d.length > 6) out += `-${d.slice(6, 8)}`;
  if (d.length > 8) out += `-${d.slice(8, 10)}`;
  return out;
}

export function isCompletePhone(value: string) {
  return nationalDigits(value).length === 10;
}
