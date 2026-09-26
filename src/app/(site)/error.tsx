"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { clinic } from "@/content/site";

/**
 * Ошибка на странице. Шапка и подвал остаются — ломается только
 * содержимое, поэтому навигация и телефон в подвале по-прежнему работают.
 * Технических подробностей не показываем: пациенту они ничего не скажут.
 */
export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="bg-cream">
      <Container className="flex flex-col gap-10 py-24 lg:py-32">
        <div className="flex max-w-3xl flex-col gap-6">
          <p className="label-mono text-sky">Ошибка</p>
          <h1 className="font-display text-display text-balance text-ink">
            Что-то пошло не так.
          </h1>
          <p className="max-w-xl text-body-lg text-graphite">
            Страница не загрузилась. Попробуйте ещё раз — обычно это помогает. Если нужно
            записаться, проще всего позвонить.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => retry()}>Попробовать ещё раз</Button>
          <Button variant="ghost" href={clinic.phoneHref}>
            {clinic.phone}
          </Button>
        </div>
      </Container>
    </section>
  );
}
