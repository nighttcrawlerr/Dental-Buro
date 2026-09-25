import "server-only";

/**
 * Ограничение частоты по ключу (у нас — по IP) в памяти процесса.
 *
 * Скользящее окно: помним время каждого запроса за последние windowMs.
 * Хранилище в памяти годится, пока сервер один: после перезапуска счётчики
 * обнуляются, а на нескольких экземплярах у каждого свои. Против человека,
 * который жмёт «Отправить» двадцать раз, и простого бота этого хватает.
 * Если клиника начнёт получать спам потоком — переносим в Redis.
 */
export function createRateLimit({ limit, windowMs }: { limit: number; windowMs: number }) {
  const hits = new Map<string, number[]>();

  return function isAllowed(key: string) {
    const now = Date.now();
    const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

    if (recent.length >= limit) {
      hits.set(key, recent);
      return false;
    }

    recent.push(now);
    hits.set(key, recent);

    // Чистим протухшие ключи, чтобы карта не росла бесконечно.
    if (hits.size > 5000) {
      for (const [k, times] of hits) {
        if (times.every((t) => now - t >= windowMs)) hits.delete(k);
      }
    }
    return true;
  };
}
