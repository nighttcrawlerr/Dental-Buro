"use client";

import { useRouter } from "next/navigation";
import { LeadForm } from "@/components/lead/lead-form";
import { goals, reachGoal } from "@/lib/analytics";
import { submitLead } from "@/lib/submit-lead";

/**
 * Форма записи, подключённая к отправке: шлёт заявку на сервер и после
 * успеха уводит на /thanks. Одна на окно записи и на формы в страницах.
 *
 * Благодарность — отдельной страницей, а не текстом на месте формы: на её
 * адрес вешается цель в аналитике.
 */
export function SiteLeadForm({
  surface,
  defaultService,
  doctor,
  onSent,
}: {
  surface?: "light" | "dark";
  defaultService?: string;
  /** slug врача — уходит в заявку, чтобы администратор записал именно к нему. */
  doctor?: string;
  /** Вызывается после успешной отправки, до перехода — окно так закрывается. */
  onSent?: () => void;
}) {
  const router = useRouter();

  return (
    <LeadForm
      surface={surface}
      defaultService={defaultService}
      onSubmit={async (lead, meta) => {
        await submitLead(lead, meta, { doctor });
        reachGoal(goals.leadSent);
        onSent?.();
        router.push("/thanks");
      }}
    />
  );
}
