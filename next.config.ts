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
};

export default nextConfig;
