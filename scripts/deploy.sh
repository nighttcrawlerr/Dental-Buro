#!/bin/sh
# Обновить сайт на сервере: свежий код из main, пересборка, перезапуск.
# Запускать на сервере из папки репозитория: ./scripts/deploy.sh
#
# Пока собирается новый образ, работает старый; простой — несколько секунд
# на перезапуск контейнера.
set -eu

cd "$(dirname "$0")/.."

git pull --ff-only
docker compose --env-file .env.production up -d --build
docker image prune -f >/dev/null

docker compose ps
