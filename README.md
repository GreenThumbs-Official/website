# GreenThumbs

...

## Prerequisites

- PHP 7.4 +
- MySQL 5.7 +
- Composer
- Web server 
- Docker (optional)

## Installation

### 1. Clone the repository:

```shell
  git clone url-repository
  cd website
```

### 2. Setup Project with docker

```shell
  ./infra.sh up
```

### 3. Setup Back-Side with local

```shell
  cd Back
  composer install
  cp .env.example .env
  php artisan migrate --seed
```

### 4. Setup Front-Side with local

```shell
  cd Front
  npm install
  npm run dev
```


## Comment merge le main avec sa branche
*\<nouvelles info de ta branche> => \<main>*

```
# Aller sur main
git checkout main

# Récuperer les dernier changements
git pull

# Merge ta branche avec main
git merge ta-branche --no-edit
# Verifier s'il y a des conflits

# Push main avec les changement de sa branche
git push origin main
```

## Comment merge sa branche avec le main
*\<nouvelles info de main> => \<ta branche>*
```
# Aller sur main
git checkout ta-branche

# Récuperer les dernier changements
git pull

# Merge ta branche avec main
git merge main --no-edit
# Verifier s'il y a des conflits

# Push main avec les changement de sa branche
git push origin ta-branche
```