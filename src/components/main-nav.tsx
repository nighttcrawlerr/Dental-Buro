"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * Горизонтальное меню для широких экранов.
 *
 * Клиентский компонент только ради подсветки текущего раздела — она читает
 * адрес страницы. Активный пункт заливается акцентом, как пилюля в
 * дизайн-системе, и получает aria-current: подсветка цветом одна, без
 * атрибута, для скринридера не существует.
 */
export function MainNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Основное меню" className="hidden items-center gap-1 lg:flex">
      {mainNav.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "label-mono rounded-nav px-3 py-2 transition-colors duration-200",
              active ? "bg-sky text-cream" : "text-graphite hover:text-ink",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
