# FAQ — ajouter ou modifier une question

Chaque FAQ du site est un dossier de `src/content/faq/` (aujourd'hui : `accueil/`, la FAQ de
la page d'accueil). Une question = un fichier Markdown. La même source produit :

- l'affichage sur la page (questions repliées, « + » pour ouvrir) ;
- les données structurées `FAQPage` pour les moteurs de recherche et assistants IA.

Les deux ne peuvent donc pas diverger.

## Ajouter une question

Créer `src/content/faq/accueil/11-ma-question.md` :

```markdown
---
question: "La question telle qu'affichée sur la page ?"
variant: "Une formulation alternative pour le SEO/GEO ?"
---

La réponse, en Markdown : **gras**, listes, [liens](/inscription/)…
```

| Champ | Requis | Rôle |
|-------|--------|------|
| `question` | oui | Texte affiché sur la page |
| `variant` | non | Formulation alternative, lue uniquement par les moteurs et assistants IA (jamais affichée) |

- **Ordre** : celui des noms de fichiers (`01-…`, `02-…`). Pour déplacer une question, renommer le fichier.
- **Supprimer** une question : supprimer son fichier.
- **Point à compléter** : `<mark class="todo">TODO(maintainer) : …</mark>` dans la réponse. Il est
  visible sur la page (encadré jaune) et retiré des données structurées.

## Ajouter une FAQ sur une autre page

1. Créer le dossier, par exemple `src/content/faq/cps/`, et ses fichiers.
2. Dans la page : `import Faq from '@/components/Faq.astro';` puis `<Faq group="cps" />`.

## Vérifier

```bash
npm run build && npm run preview
```
