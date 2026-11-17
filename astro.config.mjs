import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { readdirSync, readFileSync } from 'node:fs';
import tarteaucitron from './integrations/tarteaucitron.mjs';
import pagefind from './integrations/pagefind.mjs';
import blogImages from './integrations/blog-images.mjs';

// Pages kept out of the sitemap:
// - any page whose last path segment starts with "confirmation-" (e.g. /inscription/confirmation-email/);
// - blog tag pages (/blog/tags/…): short lists, marked noindex.
const isExcludedFromSitemap = (page) => {
	const { pathname } = new URL(page);
	return /\/confirmation-[^/]*\/?$/.test(pathname) || pathname.startsWith('/blog/tags/');
};

// Sitemap <lastmod> for blog posts: their pubDate. /blog/ gets the latest one.
// Read from the front matter directly (the content API is not available in this file).
// A post's URL is its file name in lowercase, as Astro's glob loader builds it.
const blogDates = (() => {
	const dir = new URL('./src/content/blog/', import.meta.url);
	const dates = {};
	for (const file of readdirSync(dir).filter((f) => f.endsWith('.md'))) {
		const fm = readFileSync(new URL(file, dir), 'utf8').match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
		if (/^draft:\s*true\s*$/m.test(fm)) continue;
		const date = fm.match(/^pubDate:\s*["']?([0-9-]+)/m)?.[1];
		if (date) dates[`/blog/${file.replace(/\.md$/, '').toLowerCase()}/`] = date;
	}
	const latest = Object.values(dates).sort().at(-1);
	if (latest) dates['/blog/'] = latest;
	return dates;
})();

export default defineConfig({
	site: 'https://ki-tami.com',
	output: 'static',
	compressHTML: true,
	integrations: [
		tarteaucitron(),
		blogImages(),
		sitemap({
			filter: (page) => !isExcludedFromSitemap(page),
			serialize: (item) => {
				const date = blogDates[new URL(item.url).pathname];
				return date ? { ...item, lastmod: new Date(date).toISOString() } : item;
			},
		}),
		pagefind(),
	],
});
