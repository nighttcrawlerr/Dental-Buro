"use client";

import { useLeadModal } from "@/components/lead/lead-modal";
import { Button } from "@/components/ui/button";
import type { Surface } from "@/components/ui/hairline";

type BookButtonProps = {
  surface?: Surface;
  variant?: "solid" | "ghost";
  className?: string;
  /** Вызывается перед открытием окна — мобильное меню так закрывается. */
  onClick?: () => void;
  children: React.ReactNode;
};

/**
 * Кнопка «Записаться» — открывает окно записи.
 *
 * Под капотом это ссылка на контакты, а не просто кнопка. Если скрипты не
 * загрузились, человек всё равно попадёт туда, где есть телефон и адрес.
 * Клик с Ctrl или Cmd тоже не перехватываем: так открывают вкладку, а не окно.
 */
export function BookButton({ onClick, ...props }: BookButtonProps) {
  const { open } = useLeadModal();

  return (
    <Button
      {...props}
      href="/contacts"
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        onClick?.();
        open();
      }}
    />
  );
}
