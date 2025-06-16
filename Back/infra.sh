#!/bin/bash

case "$1" in
  up)
    docker compose up -d
    docker compose exec app composer install
    docker compose exec app cp ./.env.example ./.env
    docker compose exec app php artisan key:generate
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
  destroy)
    docker compose exec app rm -rf ./vendor
    docker compose exec app rm ./composer.lock
    docker compose exec app rm ./.env
    docker compose down --volumes
    ;;
  *)
    echo "Usage: $0 {up|down|build|logs|destroy}"
    exit 1
    ;;
esac
