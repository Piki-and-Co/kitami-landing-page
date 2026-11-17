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
};

/** Piki & Co's accounts, as linked from the site footer (KitamiLayout.astro). */
export const socialProfiles = [
  'https://www.linkedin.com/company/piki-and-co',
  'https://www.tiktok.com/@piki.and.co',
  'https://www.instagram.com/piki.and.co/',
  'https://www.facebook.com/61588273838732',
  'https://www.youtube.com/@PikiAndCo',
];

export type PageType = 'WebPage' | 'AboutPage' | 'CollectionPage';

interface GraphOptions {
  url: string;
  title: string;
  description?: string;
  pageType: PageType;
  logoUrl: string;
  imageUrl?: string;
  breadcrumbs: Array<{ name: string; href: string }>;
}

export function siteGraph({ url, title, description, pageType, logoUrl, imageUrl, breadcrumbs }: GraphOptions) {
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
  };

  const website = {
    '@type': 'WebSite',
    '@id': ids.website,
    url: SITE,
    name: 'Ki-tämi',
    inLanguage: 'fr-FR',
    publisher: { '@id': ids.organization },
    about: { '@id': ids.product },
  };

  const product = {
    '@type': 'Game',
    '@id': ids.product,
    name: 'Ki-tämi',
    url: SITE,
    description:
      "Jeu multi-support des 4-10 ans : jeu vidéo, jeu de plateau et livret de l'adulte pour renforcer les compétences humaines des enfants par leur éveil à l'anglais.",
    audience: { '@type': 'PeopleAudience', suggestedMinAge: 4, suggestedMaxAge: 10 },
    inLanguage: 'fr-FR',
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
  if (pageType === 'AboutPage') page.about = { '@id': ids.organization };

  const graph: Record<string, unknown>[] = [organization, website, product, page];

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
