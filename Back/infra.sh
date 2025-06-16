#!/bin/bash

case "$1" in
  up)
    docker compose up -d
    docker compose exec app composer install
    docker compose exec cp ./.env.example ./.env
    docker compose exec app php artisan key:generate
    docker compose exec app php artisan migrate --seed
    ;;
  down)
    docker compose down
    ;;
  build)
    docker compose build
    ;;
  logs)
    docker compose logs -f
    ;;
  *)
    echo "Usage: $0 {up|down|build|logs}"
    exit 1
    ;;
esac
