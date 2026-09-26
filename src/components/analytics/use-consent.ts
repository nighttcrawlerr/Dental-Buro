"use client";

import { useSyncExternalStore } from "react";
import { CONSENT_CHANGED_EVENT, readConsent, type Consent } from "@/lib/analytics";

function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_CHANGED_EVENT, onChange);
  // Выбор, сделанный в соседней вкладке, тоже подхватываем.
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_CHANGED_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/**
 * Текущий выбор по cookie. На сервере — «ещё не известно» (undefined):
 * плашка и счётчик решают, что делать, только в браузере.
 */
export function useConsent(): Consent | null | undefined {
  return useSyncExternalStore(subscribe, readConsent, () => undefined);
}
