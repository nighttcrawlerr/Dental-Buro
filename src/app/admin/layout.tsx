import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/content/site";
import { isAdmin } from "@/lib/admin-auth";
import { countNewLeads } from "@/lib/leads-repo";
import { logout } from "./actions";
import { AdminNav } from "./admin-nav";
import { LiveRefresh } from "./live-refresh";

/**
 * Число новых заявок — в названии вкладки, чтобы его было видно, даже когда
 * открыта другая. Считается на сервере: автообновление перезапрашивает и
 * метаданные, так что число меняется само.
 */
export async function generateMetadata(): Promise<Metadata> {
  const newCount = (await isAdmin()) ? await countNewLeads() : 0;
  return {
    title: {
      template: newCount ? `(${newCount}) %s` : "%s",
      default: "Заявки",
    },
    robots: { index: false, follow: false },
  };
}

/**
 * Закрытый раздел для администратора клиники.
 *
 * Без шапки, подвала и — главное — без Метрики: Вебвизор записывал бы
 * экран со списком имён и телефонов. Поэтому раздел вне группы (site).
 *
 * Колонка шире, чем у сайта: здесь таблица на компьютере ресепшена, а не
 * текст для чтения.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const signedIn = await isAdmin();
  const newCount = signedIn ? await countNewLeads() : 0;

  return (
    <div className="flex min-h-full flex-1 flex-col bg-cream text-[15px]">
      <header className="border-b border-hairline bg-paper">
        <div className="mx-auto flex h-16 w-full max-w-[1440px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="label-mono text-ink">
              {brand.name}
            </Link>
            {signedIn ? <AdminNav newCount={newCount} /> : null}
          </div>
          {signedIn ? (
            <form action={logout}>
              <button
                type="submit"
                className="label-mono min-h-10 cursor-pointer text-graphite hover:text-ink"
              >
                Выйти
              </button>
            </form>
          ) : null}
        </div>
      </header>
      {signedIn ? <LiveRefresh /> : null}
      <main className="flex-1">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">{children}</div>
      </main>
    </div>
  );
}
