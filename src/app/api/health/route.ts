import { db } from "@/lib/db";

/**
 * Проверка здоровья для хостинга: жив ли сервер и отвечает ли база.
 * Хостинг дёргает этот адрес и перезапускает приложение, если ответ не 200.
 * Никаких данных наружу — только да или нет.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await db()`select 1`;
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 503 });
  }
}
