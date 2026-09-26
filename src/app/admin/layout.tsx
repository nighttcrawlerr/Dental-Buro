import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { isAdmin } from "@/lib/admin-auth";
import { logout } from "./actions";

export const metadata: Metadata = {
  title: "Заявки",
  robots: { index: false, follow: false },
};

/**
 * Закрытый раздел для администратора клиники.
 *
 * Без шапки, подвала и — главное — без Метрики: Вебвизор записывал бы
 * экран со списком имён и телефонов. Поэтому раздел вне группы (site).
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const signedIn = await isAdmin();

  return (
    <div className="flex min-h-full flex-1 flex-col bg-cream">
      <header className="border-b border-hairline bg-paper">
        <Container className="flex h-16 items-center justify-between gap-6">
          <Link href="/admin/leads" className="label-mono text-ink">
            Dental Buro · Заявки
          </Link>
          {signedIn ? (
            <form action={logout}>
              <button type="submit" className="label-mono cursor-pointer text-graphite hover:text-ink">
                Выйти
              </button>
            </form>
          ) : null}
        </Container>
      </header>
      <main className="flex-1">
        <Container className="py-10 lg:py-14">{children}</Container>
      </main>
    </div>
  );
}
