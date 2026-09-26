import "server-only";
import postgres from "postgres";

/**
 * Подключение к базе заявок.
 *
 * Одно на процесс. В разработке Next перезагружает модули при каждой
 * правке, и без кэша на globalThis каждая правка открывала бы новый пул
 * соединений — через полчаса работы база упёрлась бы в лимит подключений.
 */
const globalForDb = globalThis as unknown as { sql?: postgres.Sql };

function connect() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL не задан — заявки некуда сохранить");
  return postgres(url, { max: 5, idle_timeout: 30 });
}

export function db() {
  globalForDb.sql ??= connect();
  return globalForDb.sql;
}
