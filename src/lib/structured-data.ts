/**
 * Structured data (schema.org JSON-LD) shared by every page.
 *
 * Each page outputs one @graph: the organisation, the website, the product, the page
 * itself and its breadcrumb. Nodes point at each other by "@id", so pages that add their
 * own data (FAQ, blog post) reference the organisation instead of repeating it.
 *
 * Only facts the site itself states belong here. Sources are noted next to each value.
 */

export const SITE = 'https://ki-tami.com/';

export const ids = {
  organization: `${SITE}#organization`,
  website: `${SITE}#website`,
  product: `${SITE}#kitami`,
  blog: `${SITE}blog/#blog`,
  cps: `${SITE}cps/#topic`,
};

/** Accepted spellings besides the canonical "Ki-tämi" (accents and hyphens get lost in URLs and typing). */
const brandAlternateNames = ['Ki-tami', 'Kitami'];

/** Piki & Co's accounts, as linked from the site footer (KitamiLayout.astro). */
export const socialProfiles = [
  'https://www.linkedin.com/company/piki-and-co',
  'https://www.tiktok.com/@piki.and.co',
  'https://www.instagram.com/piki.and.co/',
  'https://www.facebook.com/61588273838732',
  'https://www.youtube.com/@PikiAndCo',
];

export type PageType = 'WebPage' | 'AboutPage' | 'CollectionPage';

/** A node reference, e.g. { '@id': ids.product }. */
export type Ref = { '@id': string };

interface GraphOptions {
  url: string;
  title: string;
  description?: string;
  pageType: PageType;
  logoUrl: string;
  imageUrl?: string;
  /** Image of the product (the Ki-tämi logo, as used for social sharing). */
  productImageUrl: string;
  breadcrumbs: Array<{ name: string; href: string }>;
  /** What the page is about: references to nodes of this graph or of `nodes`. */
  about?: Ref[];
  /** Page-specific nodes added to the graph (e.g. the Observatoire research project). */
  nodes?: Record<string, unknown>[];
}

export function siteGraph({
  url, title, description, pageType, logoUrl, imageUrl, productImageUrl, breadcrumbs, about = [], nodes = [],
}: GraphOptions) {
  const pageId = `${url}#webpage`;
  const breadcrumbId = `${url}#breadcrumb`;

  const organization = {
    '@type': 'Organization',
    '@id': ids.organization,
    name: 'Piki & Co',
    url: `${SITE}piki-and-co/`,
    logo: { '@type': 'ImageObject', url: logoUrl },
    // Source: src/pages/piki-and-co.astro meta description.
    description:
      "Studio de développement de Ki-tämi, fondé dans le cadre de la valorisation des recherches menées avec le CNRS et l'Université de Strasbourg.",
    sameAs: socialProfiles,
    // Source: src/pages/legal/mention.astro.
    email: 'contact@piki-and-co.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '12 rue Chopin',
      postalCode: '67450',
      addressLocality: 'Mundolsheim',
      addressCountry: 'FR',
    },
    // Source: the maintainer (SIREN; ISO 6523 scheme 0002 is the French SIRENE register).
    foundingDate: '2025-02',
    identifier: { '@type': 'PropertyValue', propertyID: 'SIREN', value: '940848724' },
    iso6523Code: '0002:940848724',
    // Source: src/pages/piki-and-co.astro (team).
    founder: [
      { '@type': 'Person', name: 'Amandine Piguel', jobTitle: 'Présidente (CEO) & Fondatrice' },
      { '@type': 'Person', name: 'Laurence Schmoll', jobTitle: 'Chercheuse & Fondatrice' },
    ],
    // A label of recognition, not an award. Source: the maintainer, home FAQ (label Deeptech).
    hasCredential: {
      '@type': 'EducationalOccupationalCredential',
      name: 'Label Deeptech',
      credentialCategory: 'label',
      recognizedBy: { '@type': 'Organization', name: 'France Deeptech', url: 'https://www.francedeeptech.org/' },
    },
  };

  const website = {
    '@type': 'WebSite',
    '@id': ids.website,
    url: SITE,
    name: 'Ki-tämi',
    alternateName: brandAlternateNames,
    inLanguage: 'fr-FR',
    publisher: { '@id': ids.organization },
    about: { '@id': ids.product },
  };

  // Source: src/pages/cps.astro and the CPS FAQ.
  const cps = {
    '@type': 'Thing',
    '@id': ids.cps,
    name: 'Compétences psychosociales',
    alternateName: 'CPS',
    url: `${SITE}cps/`,
    // Reference definition (source: the maintainer; also linked from the CPS FAQ).
    sameAs: 'https://www.santepubliquefrance.fr/competences-psychosociales',
  };

  // TODO: once the app is available, describe the video game part
  // (VideoGame / MobileApplication: store URL in sameAs, operatingSystem, offers).
  const product = {
    '@type': 'Game',
    '@id': ids.product,
    name: 'Ki-tämi',
    alternateName: brandAlternateNames,
    url: SITE,
    image: productImageUrl,
    description:
      "Jeu multi-support des 4-10 ans : jeu vidéo, jeu de plateau et livret de l'adulte pour renforcer les compétences humaines des enfants par leur éveil à l'anglais.",
    audience: { '@type': 'PeopleAudience', suggestedMinAge: 4, suggestedMaxAge: 10 },
    // The game is in French and teaches English (source: the maintainer, home FAQ question 1).
    inLanguage: 'fr-FR',
    teaches: [{ '@id': ids.cps }, 'Communication en anglais'],
    about: { '@id': ids.cps },
    publisher: { '@id': ids.organization },
    creator: { '@id': ids.organization },
  };

  const page: Record<string, unknown> = {
    '@type': pageType,
    '@id': pageId,
    url,
    name: title,
    inLanguage: 'fr-FR',
    isPartOf: { '@id': ids.website },
  };
  if (description) page.description = description;
  if (imageUrl) page.primaryImageOfPage = { '@type': 'ImageObject', url: imageUrl };
  if (pageType === 'AboutPage') about = [{ '@id': ids.organization }, ...about];
  if (about.length > 0) page.about = about.length === 1 ? about[0] : about;

  const graph: Record<string, unknown>[] = [organization, website, product, cps, page, ...nodes];

  if (breadcrumbs.length > 0) {
    page.breadcrumb = { '@id': breadcrumbId };
    graph.push({
      '@type': 'BreadcrumbList',
      '@id': breadcrumbId,
      itemListElement: [{ name: 'Accueil', href: '/' }, ...breadcrumbs].map((crumb, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: crumb.name,
        item: new URL(crumb.href, SITE).href,
      })),
    });
  }

  return { '@context': 'https://schema.org', '@graph': graph };
}
