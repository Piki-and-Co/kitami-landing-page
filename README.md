## Lancer le projet en local

```bash
npm install
npm run dev
```

> **Windows** : si npm échoue sur le cache, utiliser `npm install --cache "C:\Users\<toi>\.npm-cache"`

Le site est disponible sur `http://localhost:4321`.

### Dev Container (VS Code / Cursor)

Le dossier `.devcontainer/` définit un environnement Node 22. Ouvrir le projet, puis **Reopen in Container** (commande `Dev Containers: Reopen in Container`). Les dépendances sont installées automatiquement (`npm ci`). Le serveur de développement démarre ensuite à l’ouverture du workspace (`postAttachCommand`, déjà lié à `0.0.0.0:4321`).

Le serveur Astro est exposé sur le port `4321`.

Un `Dockerfile` multi-étapes (même version de Node) est aussi disponible : `docker build --target dev` pour le serveur de développement.

La recherche Pagefind nécessite d'avoir lancé `npm run build` au moins une fois (l'index est écrit dans `public/pagefind/` et persiste). Après ce premier build, la recherche fonctionne aussi bien en `dev` qu'en `preview`.

```bash
npm run build   # génère dist/ + l'index Pagefind dans public/pagefind/
npm run dev     # la recherche est désormais disponible
```
