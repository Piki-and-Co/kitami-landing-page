/**
 * tarteaucitron.js — Configuration centralisée
 *
 * Ce fichier est importé par toutes les pages du site.
 * Il initialise tarteaucitron et déclare les services (Matomo, futurs Google/Meta).
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


// Service de mesure d'audience
tarteaucitron.services.matomoCustom = {
  "key":         "matomoCustom",
  "type":        "analytic",
  "name":        "Matomo (mesure d'audience)",
  "uri":         "https://piki-and-co.com/legal/cookies",
  "needConsent": true,
  "cookies":     ["_pk_id", "_pk_ses", "_pk_ref", "mtm_consent", "mtm_cookie_consent", "SRVGROUP"],

  "js": function () {
    "use strict";
    if (tarteaucitron.services.matomoCustom.added) return;
    tarteaucitron.services.matomoCustom.added = true;

    var _paq = window._paq = window._paq || [];
    var u = "https://an.kjbconseil.com/";
    _paq.push(["setTrackerUrl", u + "matomo.php"]);
    _paq.push(["setSiteId", "6"]);
    _paq.push(["setCookieDomain", "*.ki-tami.com"]);
    _paq.push(["setDomains", ["*.ki-tami.com"]]);
    _paq.push(["trackPageView"]);
    _paq.push(["enableLinkTracking"]);

    tarteaucitron.addScript(u + "matomo.js");
  },

  "fallback": function () {
    "use strict";
    /* Rien à faire en cas de refus */
  }
};
(tarteaucitron.job = tarteaucitron.job || []).push("matomoCustom");

// Services futurs possibles à ajouter ci-dessous comme Google Analytics / Facebook Pixel / etc.
