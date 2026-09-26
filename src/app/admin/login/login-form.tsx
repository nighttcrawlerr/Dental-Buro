"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { login, type LoginState } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="label-mono text-graphite">
          Пароль
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          autoFocus
          aria-invalid={state.error ? true : undefined}
          aria-describedby={state.error ? "password-error" : undefined}
          className="block min-h-13 w-full rounded-button border border-smoke bg-paper px-4 text-body text-ink focus:border-ink"
        />
        {state.error ? (
          <p id="password-error" role="alert" className="text-caption text-alert">
            {state.error}
          </p>
        ) : null}
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Проверяем…" : "Войти"}
      </Button>
    </form>
  );
}
