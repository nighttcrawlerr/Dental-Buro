/** Склейка классов: отбрасывает false, null и undefined. */
export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}
