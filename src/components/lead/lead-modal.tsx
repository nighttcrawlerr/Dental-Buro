"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { SiteLeadForm } from "@/components/lead/site-lead-form";
import { captureUtm } from "@/lib/utm";

type LeadModal = { open: () => void };

const LeadModalContext = createContext<LeadModal | null>(null);

export function useLeadModal() {
  const ctx = useContext(LeadModalContext);
  if (!ctx) throw new Error("useLeadModal вызван вне LeadModalProvider");
  return ctx;
}

/**
 * Окно записи — одно на весь сайт.
 *
 * Построено на нативном <dialog> с showModal(). Браузер сам делает всё, что
 * в самодельной модалке пришлось бы писать руками и где обычно ошибаются:
 * страница под окном становится инертной, так что фокус не может из него
 * выпасть; Escape закрывает; окно лежит в верхнем слое и не спорит с
 * z-index липкой шапки.
 *
 * Форма внутри не размонтируется при закрытии. Если человек случайно закрыл
 * окно, набранное остаётся на месте до следующего открытия.
 */
export function LeadModalProvider({ children }: { children: React.ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const pressStartedOnBackdrop = useRef(false);

  const open = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    returnFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.showModal();
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  // Фокус возвращается на кнопку, которой окно открыли. Браузеры делают это
  // и сами, но не все и не всегда. Если кнопка успела пропасть — например,
  // она была в мобильном меню, которое закрылось, — фокус не трогаем,
  // иначе он уйдёт на невидимый элемент.
  const handleClose = useCallback(() => {
    const target = returnFocusRef.current;
    returnFocusRef.current = null;
    if (target?.isConnected && target.checkVisibility?.() !== false) target.focus();
  }, []);

  const value = useMemo(() => ({ open }), [open]);

  // Провайдер живёт в корневом layout и монтируется один раз — на странице
  // входа. Это как раз тот момент, когда UTM-метки ещё в адресе.
  useEffect(() => captureUtm(), []);

  return (
    <LeadModalContext.Provider value={value}>
      {children}

      <dialog
        ref={dialogRef}
        aria-labelledby="lead-modal-title"
        onClose={handleClose}
        // Клик по затемнению закрывает окно, но только если и нажатие, и
        // отпускание были на нём. Иначе выделение текста в поле, которое
        // закончилось за краем окна, закрывало бы его вместе с набранным.
        onPointerDown={(e) => {
          pressStartedOnBackdrop.current = e.target === e.currentTarget;
        }}
        onClick={(e) => {
          if (pressStartedOnBackdrop.current && e.target === e.currentTarget) close();
        }}
        // Lenis перехватывает колесо мыши и прокручивал бы страницу под окном.
        data-lenis-prevent
        className="site-dialog m-0 h-dvh max-h-none w-full max-w-none overscroll-contain bg-cream text-ink backdrop:bg-ink/60 backdrop:backdrop-blur-sm md:m-auto md:h-auto md:max-h-[calc(100dvh-4rem)] md:max-w-3xl md:rounded-card"
      >
        <div className="flex flex-col gap-8 px-4 pt-4 pb-10 sm:px-6 md:px-10 md:pt-8">
          <div className="flex items-start justify-between gap-6">
            <div className="flex flex-col gap-3 pt-2">
              <h2 id="lead-modal-title" className="font-display text-heading-lg text-ink">
                Запись на приём
              </h2>
              <p className="max-w-md text-graphite">
                Оставьте телефон — администратор перезвонит, ответит на вопросы и подберёт время.
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              aria-label="Закрыть окно записи"
              className="flex size-11 shrink-0 items-center justify-center rounded-button text-ink transition-colors hover:bg-sand"
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

          <SiteLeadForm onSent={close} />
        </div>
      </dialog>
    </LeadModalContext.Provider>
  );
}
