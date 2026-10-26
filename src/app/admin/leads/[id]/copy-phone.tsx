"use client";

import { useState } from "react";
import { ghostButtonClass } from "../../ui";

/** Скопировать номер — чтобы вставить в МИС или мессенджер без перепечатки. */
export function CopyPhone({ phone }: { phone: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={async () => {
          // Буфер обмена есть только на https; не вышло — номер виден рядом.
          try {
            await navigator.clipboard.writeText(phone);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch {}
        }}
        className={ghostButtonClass}
      >
        {copied ? "Скопировано" : "Копировать"}
      </button>
      <span role="status" className="sr-only">
        {copied ? "Номер скопирован" : ""}
      </span>
    </>
  );
}
