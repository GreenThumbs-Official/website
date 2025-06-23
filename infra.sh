#!/bin/bash

case "$1" in
  up)
    cd ./Front && npm install
    cd ..
    docker compose up -d --build
    docker compose exec backend composer install --no-optimize-autoloader
    docker compose exec backend cp ./.env.example ./.env
    docker compose exec backend php artisan key:generate
    ./migrate.sh setup
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
    docker compose exec backend rm -rf ./vendor
    docker compose exec backend rm ./composer.lock
    docker compose exec backend rm ./.env
    docker compose down --volumes
    ;;
  *)
    echo "Usage: $0 {up|down|build|logs|destroy}"
    exit 1
    ;;
esac
