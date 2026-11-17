# Blog — ajouter ou modifier un article

Le blog vit dans `/blog/`. Un article = un fichier Markdown dans `src/content/blog/`.
Aucun autre fichier n'est à modifier : liste, pages de tags, flux RSS, sitemap,
recherche et données structurées sont régénérés à chaque build.

## 1. Créer le fichier

`src/content/blog/mon-article.md` — le nom du fichier devient l'URL, en minuscules :
`/blog/mon-article/` (`MonArticle.md` → `/blog/monarticle/`).

```markdown
---
title: "Titre de l'article"
description: "Résumé court (160 car. max), affiché dans la liste et utilisé pour le SEO."
pubDate: 2026-06-08
author: "L'équipe Piki & Co"
tags: ["compétences psychosociales", "jeu vidéo"]
draft: false
image: "./mon-article-cover.webp"
---

Contenu de l'article en Markdown.

![Texte alternatif décrivant l'image](./mon-article-cover.webp)

## Section

Un paragraphe…
```

| Champ | Requis | Description |
|-------|--------|-------------|
| `title` | oui | Titre affiché et utilisé dans le `<title>` |
| `description` | oui | Résumé SEO, affiché dans les cartes du blog |
| `pubDate` | oui | Date de publication (`AAAA-MM-JJ`) |
| `author` | non | Par défaut : `"Piki & Co"` |
| `tags` | non | Liste de thèmes ; chacun a sa page `/blog/tags/<thème>/` |
| `draft` | non | `true` = article exclu du site et du RSS |
| `image` | non | Image de couverture (partages sur les réseaux, données structurées). Chemin **relatif au fichier `.md`**, commençant par `./` |

### Tags

Écrivez-les naturellement. L'adresse de la page est dérivée automatiquement :
minuscules, sans accents, mots reliés par `-` (« compétences psychosociales » →
`/blog/tags/competences-psychosociales/`). « Jeu » et « jeu » renvoient donc à la même
page ; l'orthographe affichée est celle la plus utilisée dans les articles.

### Images

Déposez les images **à côté du fichier `.md`**, dans `src/content/blog/`, et
référencez-les avec `./nom-du-fichier`.

Règle : **WebP, 1920×1080 maximum**. Si vous ajoutez un `.png`/`.jpg` ou une grande
image, lancez :

```bash
npm run blog:images
```

La commande convertit en WebP, redimensionne (proportions conservées, jamais
agrandie), met à jour les références dans les `.md` et supprime l'original converti.
Tant que ce n'est pas fait, `npm run dev` / `npm run build` affichent un avertissement
listant les images concernées.

## 2. Vérifier en local

```bash
npm run build && npm run preview
```

Puis ouvrir `http://localhost:4321/blog/mon-article/`, vérifier que `/blog/` liste
l'article et que la recherche le trouve. La recherche ne fonctionne **pas** sous
`npm run dev` (l'index n'existe qu'après un build).

## 3. Publier

```bash
git add src/content/blog/
git commit -m "content: article « Titre de l'article »"
git push
```

Le déploiement suit le circuit habituel du site (GitHub Pages depuis `main`).

## Ce qui est automatique

| Élément | Mécanisme |
|---------|-----------|
| URL de l'article | nom du fichier → `/blog/<nom>/` (`src/pages/blog/[slug].astro`) |
| Pages de tags | `src/pages/blog/tags/[tag].astro` |
| Flux RSS | `src/pages/rss.xml.ts` → `/rss.xml` |
| Sitemap | `@astrojs/sitemap` |
| Recherche | Pagefind, index construit en fin de build (`integrations/pagefind.mjs`) ; seul le corps des articles est indexé |
| Données structurées `BlogPosting` | `src/layouts/BlogPostLayout.astro` |
| Balises Open Graph / Twitter | `src/layouts/KitamiLayout.astro`, à partir du frontmatter |
| Contrôle des images | `integrations/blog-images.mjs` |

Le schéma du frontmatter est défini dans `src/content.config.ts` : un champ manquant ou
mal typé fait échouer le build avec un message explicite.
