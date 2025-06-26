# GreenThumbs

niveaux. Que vous soyez débutant ou expérimenté, nous vous aidons à créer et entretenir un potager à domicile, que vous viviez en appartement ou en maison.

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

## Installation without docker

### 1. Setup Back-Side with local

```shell
  cd Back
  composer install
  cp .env.example .env
  php artisan key:generate
  php artisan migrate --seed
  php artisan serve
```

### 2. Setup Front-Side with local

```shell
  cd Front
  npm install
  npm run dev
```

## Tâches / Sous-tâches

### Features
- ✅ Suivre une plante - 2h
- ✅ Affichage des plantes - 2h
- ✅ Navigation entre les plantes - 0.5h
- ✅ Création d'une plante - 2h
- ✅ Suppression d'une plante - 0.5h
- ✅ Modification d'une plante - 0.5h
- ✅ Ajout d'un utilisateur - 2h
- ✅ Modification d'un utilisateur - 0.5h
- ✅ Suppression d'un utilisateur - 0.5h
- ✅ Ajout d'un rôle sur un utilisateur
- ✅ Dashboard admin - 8h
- ✅ Page d'authentification - 2h
- ✅ Affichage de la page 404 - 0.5h

### Développement du site - 4h

- ✅ Créer et lancer de projet - 2h
- ✅ Création de la BDD - 1h
- ✅ Création des tests - 1h

### Développement front - 23h

- ✅ UI - 8h
- 🟩 Vue mobile - 2h
- ✅ Vue tablette - 2h
- ✅ Vue PC - 4h
- ✅ Darkmode - 2h
- ✅ Affichage de la page des résultats - 1h
- ✅ Affichage de la page des résultats des utilisateur - 1h
- ✅ Page des plantes - 2h
- ✅ Affichage de la liste des plantes - 0.5h
- ✅ Affichage de la page 404 - 0.5h

### Développement back - 21h

- ✅ Créer les vues - 3h
- ✅ Créer les controllers - 4h
- ✅ Créer les modèles - 1h
- ✅ Authentification - 2h
- ✅ Admin Dashboard - 8h
- ✅ Fix des bugs - 2h
- ✅ Connexion sécurisée - 1h

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
