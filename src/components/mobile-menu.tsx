"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { BookButton } from "@/components/lead/book-button";
import { clinic, mainNav } from "@/content/site";
import { cn } from "@/lib/cn";

/**
 * Мобильное меню на весь экран.
 *
 * Единственный клиентский кусок шапки — остальное рендерится на сервере.
 *
 * Доступность здесь не украшение: меню перекрывает страницу целиком, поэтому
 * оно закрывается по Escape, возвращает фокус на кнопку-бургер и запирает
 * прокрутку под собой. Без этого пользователь клавиатуры проваливается в
 * страницу под меню и не может выбраться.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-label="Открыть меню"
        className="flex size-11 items-center justify-center rounded-button text-ink lg:hidden"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden="true"
          className="size-6"
        >
          <path d="M3 7h18M3 12h18M3 17h18" />
        </svg>
      </button>

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Меню сайта"
        hidden={!open}
        className="fixed inset-0 z-50 flex flex-col bg-cream lg:hidden"
      >
        <div className="flex items-center justify-between px-4 py-4 sm:px-6">
          <Logo variant="compact" />
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              triggerRef.current?.focus();
            }}
            aria-label="Закрыть меню"
            className="flex size-11 items-center justify-center rounded-button text-ink"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
              className="size-6"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-4 pt-6 sm:px-6">
          {mainNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "font-display text-heading-sm py-3",
                  active ? "text-sky" : "text-ink",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col gap-4 border-t border-hairline px-4 py-6 sm:px-6">
          <a
            href={clinic.phoneHref}
            onClick={() => setOpen(false)}
            className="font-display text-heading-sm text-ink"
          >
            {clinic.phone}
          </a>
          <p className="label-mono text-graphite">{clinic.schedule}</p>
          <BookButton onClick={() => setOpen(false)} className="w-full">
            Записаться на приём
          </BookButton>
        </div>
      </div>
    </>
  );
}
