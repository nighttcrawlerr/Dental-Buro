// Применяет db/schema.sql к базе из DATABASE_URL.
// Запуск: npm run db:migrate (переменные берутся из .env.local).
import { readFile } from "node:fs/promises";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL не задан. Добавьте его в .env.local.");
  process.exit(1);
}

const sql = postgres(url, { max: 1 });
try {
  await sql.unsafe(await readFile(new URL("../db/schema.sql", import.meta.url), "utf8"));
  console.log("Схема применена.");
} finally {
  await sql.end();
}
