#!/bin/bash

case "$1" in
  setup)
    docker compose exec backend php artisan migrate --seed
    ;;
  rollback)
    docker compose exec backend php artisan migrate:rollback
    ;;
  reset)
    docker compose exec backend php artisan migrate:reset
    ;;
  refresh)
    docker compose exec backend php artisan migrate:fresh --seed
    ;;
  *)
    echo "Usage: $0 {setup|rollback|reset}"
    exit 1
    ;;
esac
