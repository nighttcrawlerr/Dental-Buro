"use client";

import { useRef, useState } from "react";
import { leadStatuses, type LeadStatus } from "@/lib/lead-statuses";
import { updateStatus } from "../actions";

/**
 * Смена статуса прямо в строке списка. Мышью — выбрал, и сохранилось.
 * С клавиатуры иначе: на Windows стрелки в закрытом списке сразу меняют
 * значение, и автосохранение записало бы каждый промежуточный статус.
 * Поэтому стрелками выбирают, а сохраняет Enter или уход с поля.
 */
export function StatusSelect({ id, status }: { id: number; status: LeadStatus }) {
  const [value, setValue] = useState<LeadStatus>(status);
  const byKeyboard = useRef(false);

  const save = (select: HTMLSelectElement) => {
    if (select.value !== status) select.form?.requestSubmit();
  };

  return (
    <form action={updateStatus}>
      <input type="hidden" name="id" value={id} />
      <select
        name="status"
        value={value}
        aria-label={`Статус заявки №${id}`}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            save(e.currentTarget);
          } else {
            byKeyboard.current = true;
          }
        }}
        onChange={(e) => {
          setValue(e.currentTarget.value as LeadStatus);
          if (!byKeyboard.current) save(e.currentTarget);
        }}
        onBlur={(e) => {
          if (byKeyboard.current) save(e.currentTarget);
          byKeyboard.current = false;
        }}
        className="min-h-9 cursor-pointer rounded-button border border-smoke bg-paper px-2 text-[15px] text-ink hover:border-graphite focus:border-ink"
      >
        {leadStatuses.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>
    </form>
  );
}
