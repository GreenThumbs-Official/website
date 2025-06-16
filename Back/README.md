
# Backend Setup Guide

## Prerequisites

- PHP (>=8.0)
- Composer
- Node.js & npm
- Docker & Docker Compose (optional)

## Setup (Without Docker)

1. Clone the repository:
   ```shell
    git clone git@github.com:GreenThumbs-Official/website.git
    cd website/Back
   ```

2. Install PHP dependencies:
   ```shell
    composer install
   ```

3. Install JavaScript dependencies:
   ```shell
    npm install
   ```

4. Copy and configure environment variables:
   ```shell
    cp .env.example .env
    # Edit .env as needed
   ```

5. Run database migrations (if applicable):
   ```shell
    php artisan migrate
   ```

6. Start the backend server:
   ```shell
    php artisan serve
   ```

## Setup (With Docker)

1. Build and start the containers:
   ```shell
    ./infra.sh start
   ```

2. The backend should now be running inside Docker.

## Accessible Domains

- Local development (without Docker):  
  - `http://localhost:8000`

- With Docker (default):  
  - [Laravel API](http://localhost:8080)
  - [PhpMyAdmin](http://localhost:8081)
  - (Check your `docker-compose.yml` for the exact port mapping.)

## Running Project Commands with Docker

- Run PHP commands:
  ```shell
    docker-compose exec app php artisan <command>
  ```

- Run Composer:
  ```shell
    docker-compose exec app composer <command>
  ```
  
## Additional Notes

- Make sure to configure your `.env` file for local or Docker usage.
