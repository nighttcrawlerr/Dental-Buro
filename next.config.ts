import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // В домашней папке пользователя лежит посторонний package-lock.json, и Turbopack
  // принимал её за корень проекта. Фиксируем корень явно.
  turbopack: { root: path.resolve(__dirname) },

  // Сборка для хостинга: .next/standalone — готовый сервер (server.js) только с
  // теми node_modules, которые реально нужны. Образ получается в разы меньше.
  output: "standalone",
  // Корень трассировки — по той же причине, что и у Turbopack: иначе server.js
  // оказывается в .next/standalone/<путь от домашней папки>/.
  outputFileTracingRoot: path.resolve(__dirname),

  // В разделе заявок — имена и телефоны пациентов, а в адресе поиска они
  // бывают прямо в строке запроса. Не кешируем страницы нигде и не отдаём
  // адрес другим сайтам при переходе по ссылке.
  async headers() {
    return [
      {
        source: "/admin/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
    ];
  },
};

export default nextConfig;
