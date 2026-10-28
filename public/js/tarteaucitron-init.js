/**
 * tarteaucitron.js — Configuration centralisée
 *
 * Ce fichier est importé par toutes les pages du site.
 * Il initialise tarteaucitron (gestion des cookies) et déclare les services (futurs Google/Meta).
 *
 * Pré-requis : charger tarteaucitron.js AVANT ce fichier.
 * <script src="https://cdn.jsdelivr.net/npm/tarteaucitronjs@latest/tarteaucitron.js"></script>
 * <script src="/js/tarteaucitron-init.js"></script>
 */

tarteaucitron.init({
  "privacyUrl":        "https://piki-and-co.com/legal/cookies",    /* Lien vers la politique cookies */
  "bodyPosition":      "bottom",
  "hashtag":           "#cookies",
  "cookieName":        "tarteaucitron",
  "orientation":       "bottom",
  "groupServices":     false,
  "obligatoryTimer":   0,

  "showAlertSmall":    false,                   /* Pas de petit bandeau résiduel */
  "cookieslist":       false,
  "showIcon":          false,                   /* Pas d'icône flottante (on utilise un lien footer) */

  "adblocker":         false,
  "DenyAllCta":        true,                    /* CNIL : bouton "Tout refuser" obligatoire */
  "AcceptAllCta":      true,
  "highPrivacy":       true,                    /* CNIL : pas d'acceptation implicite */

  "removeCredit":      false,
  "moreInfoLink":      true,
  "handleBrowserDNTRequest": false,
  "useExternalCss":    false,                   /* Utiliser le CSS intégré à tarteaucitron */
  "useExternalJs":     false,

  "readmoreLink":      "https://piki-and-co.com/legal/cookies",    /* Lien "en savoir plus" */

  "mandatory":         true,                    /* Afficher la catégorie "cookies nécessaires" */
  "mandatoryCta":      true,

  /* Conservation du consentement : 6 mois (182 jours) */
  "cookieExpire":      182
});

// Services futurs possibles à ajouter ci-dessous comme Google Analytics / Facebook Pixel / etc.
