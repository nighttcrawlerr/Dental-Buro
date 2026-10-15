// Применяет db/schema.sql к базе из DATABASE_URL.
// Запуск: npm run db:migrate (переменные берутся из .env.local).
import { readFile } from "node:fs/promises";
import postgres from "postgres";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL не задан. Добавьте его в .env.local.");
  process.exit(1);
}

// Скрипт запускается перед сервером при каждом старте контейнера, и его лог —
// единственное, что видно в панели хостинга, когда сайт не поднялся. Поэтому
// он говорит, куда подключается, не ждёт недоступную базу дольше 10 секунд и
// при ошибке печатает причину, но не строку подключения: в ней пароль.
//
// onnotice: Postgres сообщает «таблица уже есть» на каждый повторный запуск —
// это нормально для идемпотентной схемы и только засоряет лог.
let sql;
try {
  sql = postgres(url, { max: 1, connect_timeout: 10, onnotice: () => {} });
} catch (error) {
  console.error(
    `DATABASE_URL не разбирается как адрес (${error.code ?? error.message}). ` +
      "Спецсимволы пароля нужно закодировать или вынести пароль в PGPASSWORD.",
  );
  process.exit(1);
}

const { host, port, database, user } = sql.options;
console.log(`Подключение к базе ${database} на ${host}:${port} как ${user}…`);
try {
  await sql.unsafe(await readFile(new URL("../db/schema.sql", import.meta.url), "utf8"));
  console.log("Схема применена.");
} catch (error) {
  console.error(`Схема не применена: ${error.code ?? ""} ${error.message}`);
  process.exitCode = 1;
} finally {
  await sql.end({ timeout: 5 });
}
