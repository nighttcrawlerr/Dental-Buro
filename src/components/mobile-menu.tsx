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
 * Построено на нативном <dialog>, как и окно записи: showModal() делает
 * страницу под меню инертной, так что фокус не проваливается под него,
 * Escape закрывает, а фокус после закрытия браузер возвращает на бургер.
 * Раньше это был div с role="dialog", и всё это приходилось делать руками —
 * кроме ловушки фокуса, которой так и не было.
 */
export function MobileMenu() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Состояние живёт в React, а открывает и закрывает браузер: showModal()
  // нельзя заменить атрибутом open — без него страница не станет инертной.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // На широком экране меню скрыто через lg:hidden. Если оставить его
  // открытым при повороте планшета, страница так и останется инертной —
  // невидимое окно будет держать весь сайт.
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const onChange = () => wide.matches && setOpen(false);
    wide.addEventListener("change", onChange);
    return () => wide.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <button
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

      <dialog
        ref={dialogRef}
        aria-label="Меню сайта"
        // Escape закрывает dialog сам — синхронизируем состояние.
        onClose={() => setOpen(false)}
        data-lenis-prevent
        className="site-dialog m-0 h-dvh max-h-none w-full max-w-none flex-col bg-cream open:flex lg:hidden"
      >
        <div className="flex items-center justify-between px-4 py-4 sm:px-6">
          <Logo variant="compact" />
          <button
            type="button"
            onClick={() => setOpen(false)}
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
      </dialog>
    </>
  );
}
