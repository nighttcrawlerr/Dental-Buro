# Образ сайта для любого хостинга с Docker (Timeweb Cloud, Selectel, Yandex Cloud).
#
# Сборка:  docker build --build-arg SITE_URL=https://домен --build-arg NEXT_PUBLIC_YM_ID=123 -t dental-buro .
# Запуск:  docker run -p 3000:3000 --env-file .env.production dental-buro
#
# SITE_URL и NEXT_PUBLIC_YM_ID нужны именно при сборке: страницы, robots.txt и
# sitemap.xml собираются заранее, и адрес сайта и номер счётчика вшиваются в
# них в этот момент. Остальные переменные — при запуске, см. .env.example.

# ---- Зависимости -----------------------------------------------------------
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- Сборка ----------------------------------------------------------------
FROM node:24-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG SITE_URL
ARG NEXT_PUBLIC_YM_ID
ARG SITE_INDEXING
ENV SITE_URL=$SITE_URL \
    NEXT_PUBLIC_YM_ID=$NEXT_PUBLIC_YM_ID \
    SITE_INDEXING=$SITE_INDEXING \
    NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- Запуск ----------------------------------------------------------------
# В итоговом образе только собранный сервер: без исходников, без dev-зависимостей
# и без npm. Запускается не от root.
FROM node:24-alpine AS run
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -S app && adduser -S app -G app

COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
# Схема базы и скрипт миграции: применяются при каждом старте, они идемпотентны.
COPY --from=build --chown=app:app /app/db ./db
COPY --from=build --chown=app:app /app/scripts/migrate.mjs ./scripts/migrate.mjs
# Сервер встраивает драйвер базы в свой код, а скрипту миграции он нужен как
# пакет. Зависимостей у него нет — копируем одну папку.
COPY --from=build --chown=app:app /app/node_modules/postgres ./node_modules/postgres

USER app
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s \
  CMD wget -qO- http://127.0.0.1:3000/api/health || exit 1

CMD ["sh", "-c", "node scripts/migrate.mjs && exec node server.js"]
