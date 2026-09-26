"use client";

import { clinic } from "@/content/site";

/**
 * Ошибка в самом корневом layout — случай редкий, но тогда не работает
 * ничего: ни шапка, ни стили, ни шрифты. Поэтому страница собрана из
 * встроенных стилей и системного шрифта и держит главное — телефон.
 */
export default function GlobalError({ retry }: { error: Error; retry: () => void }) {
  return (
    <html lang="ru">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          background: "#f3eee8",
          color: "#241e19",
          fontFamily: "Georgia, serif",
        }}
      >
        <title>Ошибка — Dental Buro Clinic</title>
        <main style={{ maxWidth: "36rem", margin: "0 auto", padding: "6rem 1.5rem" }}>
          <h1 style={{ fontWeight: 400, fontSize: "2.5rem", lineHeight: 1.1, margin: 0 }}>
            Что-то пошло не так.
          </h1>
          <p style={{ fontFamily: "system-ui, sans-serif", fontSize: "1.125rem", lineHeight: 1.55, color: "#6b5f53" }}>
            Сайт временно не загрузился. Попробуйте обновить страницу или позвоните нам.
          </p>
          <p style={{ fontFamily: "system-ui, sans-serif", display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => retry()}
              style={{
                minHeight: 44,
                padding: "0 1.25rem",
                border: 0,
                borderRadius: 8,
                background: "#241e19",
                color: "#f3eee8",
                font: "inherit",
                cursor: "pointer",
              }}
            >
              Обновить
            </button>
            <a href={clinic.phoneHref} style={{ color: "#241e19", alignSelf: "center" }}>
              {clinic.phone}
            </a>
          </p>
        </main>
      </body>
    </html>
  );
}
