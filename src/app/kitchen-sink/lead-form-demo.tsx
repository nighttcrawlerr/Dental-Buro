"use client";

import { useState } from "react";
import { LeadForm } from "@/components/lead/lead-form";
import type { Lead } from "@/lib/lead";

/**
 * Форма без отправки: вместо сервера показывает, что ушло бы дальше.
 * Живёт только на витрине, пока нет роута /api/lead.
 */
export function LeadFormDemo({ surface }: { surface: "light" | "dark" }) {
  const [sent, setSent] = useState<Lead | null>(null);

  async function fakeSubmit(lead: Lead) {
    await new Promise((r) => setTimeout(r, 800));
    setSent(lead);
  }

  return (
    <div className="flex flex-col gap-6">
      <LeadForm surface={surface} onSubmit={fakeSubmit} />
      {sent ? (
        <pre
          className={`overflow-x-auto rounded-button p-4 text-caption ${
            surface === "dark" ? "bg-ink/40 text-stone" : "bg-cream text-graphite"
          }`}
        >
          {JSON.stringify(sent, null, 2)}
        </pre>
      ) : null}
    </div>
  );
}
