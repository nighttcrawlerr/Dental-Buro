"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Вкладка с заявками открыта на ресепшене весь день. Раз в 30 секунд, пока
 * она на экране, и сразу, когда на неё вернулись, данные перезапрашиваются
 * с сервера — новая заявка появляется без перезагрузки, а набранная заметка
 * и прокрутка остаются на месте. Вместе со страницей обновляется и число
 * новых в названии вкладки (generateMetadata в layout).
 */
export function LiveRefresh() {
  const router = useRouter();

  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === "visible") router.refresh();
    };
    const timer = setInterval(tick, 30_000);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [router]);

  return null;
}
