# website

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