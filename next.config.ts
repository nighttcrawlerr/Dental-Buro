import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // В домашней папке пользователя лежит посторонний package-lock.json, и Turbopack
  // принимал её за корень проекта. Фиксируем корень явно.
  turbopack: { root: path.resolve(__dirname) },
};

export default nextConfig;
