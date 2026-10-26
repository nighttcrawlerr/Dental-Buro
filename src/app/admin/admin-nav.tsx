"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

/** Разделы админки. Клиентский только ради подсветки текущего. */
export function AdminNav({ newCount }: { newCount: number }) {
  const pathname = usePathname();
  const items = [
    { href: "/admin", label: "Сводка", active: pathname === "/admin" },
    {
      href: "/admin/leads",
      label: "Заявки",
      active: pathname.startsWith("/admin/leads"),
      count: newCount,
    },
  ];

  return (
    <nav aria-label="Разделы" className="flex items-center gap-1">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={item.active ? "page" : undefined}
          className={cn(
            "label-mono inline-flex min-h-10 items-center gap-2 rounded-button px-3",
            item.active ? "bg-cream text-ink underline underline-offset-4" : "text-graphite hover:text-ink",
          )}
        >
          {item.label}
          {item.count ? (
            <span className="rounded-full bg-sky px-2 text-cream">
              <span className="sr-only">новых: </span>
              {item.count}
            </span>
          ) : null}
        </Link>
      ))}
    </nav>
  );
}
