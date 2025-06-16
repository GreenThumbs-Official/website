#!/bin/bash

case "$1" in
  setup)
    docker compose exec app php artisan migrate --seed
    ;;
  rollback)
    docker compose exec app php artisan migrate:rollback
    ;;
  reset)
    docker compose exec app php artisan migrate:reset
    ;;
  *)
    echo "Usage: $0 {setup|rollback|reset}"
    exit 1
    ;;
esac
