import { getCollection, type CollectionEntry } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** Published posts (draft: false), newest first. */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/**
 * URL segment for a tag: lowercase, no accents, words joined by "-".
 * "Jeu" and "jeu" share one page; "compétences psychosociales" → "competences-psychosociales".
 */
export function tagSlug(tag: string): string {
  return tag
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function tagHref(tag: string): string {
  return `/blog/tags/${tagSlug(tag)}/`;
}

export interface Tag {
  slug: string;
  /** Spelling shown on the site: the most used one across posts. */
  label: string;
  posts: Post[];
}

/** Every tag used by the given posts, merged by slug, sorted by label. */
export function collectTags(posts: Post[]): Tag[] {
  type TagEntry = { spellings: Map<string, number>; posts: Post[] };
  const bySlug = new Map<string, TagEntry>();
  for (const post of posts) {
    const seen = new Set<string>();
    for (const tag of post.data.tags) {
      const slug = tagSlug(tag);
      if (!slug) continue;
      // Explicit type: otherwise the fallback's empty array is typed never[] and push() rejects Post
      const entry: TagEntry = bySlug.get(slug) ?? { spellings: new Map(), posts: [] };
      entry.spellings.set(tag, (entry.spellings.get(tag) ?? 0) + 1);
      if (!seen.has(slug)) entry.posts.push(post);
      seen.add(slug);
      bySlug.set(slug, entry);
    }
  }
  return [...bySlug].map(([slug, { spellings, posts }]) => {
    const label = [...spellings].sort(
      ([a, na], [b, nb]) => nb - na || a.localeCompare(b, 'fr'),
    )[0][0];
    return { slug, label, posts };
  }).sort((a, b) => a.label.localeCompare(b.label, 'fr'));
}

/** Tags of one post, deduplicated by slug and shown with their site-wide label. */
export function postTags(post: Post, allTags: Tag[]): Tag[] {
  const slugs = [...new Set(post.data.tags.map(tagSlug).filter(Boolean))];
  return slugs.map((slug) => allTags.find((t) => t.slug === slug)!).filter(Boolean);
}

/**
 * French typography for display: the space before ? ! : ; and inside « » becomes
 * non-breaking, so the sign never wraps alone onto the next line. Text is unchanged.
 */
export function frenchSpacing(text: string): string {
  return text
    .replace(/ ([?!:;»])/g, ' $1')
    .replace(/« /g, '« ');
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
}
