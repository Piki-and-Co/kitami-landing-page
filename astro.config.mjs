import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Pages kept out of the sitemap: any page whose last path segment starts with
// "confirmation-" (e.g. /inscription/confirmation-email/).
const isExcludedFromSitemap = (page) =>
	/\/confirmation-[^/]*\/?$/.test(new URL(page).pathname);

export default defineConfig({
	site: 'https://ki-tami.com',
	output: 'static',
	compressHTML: true,
	integrations: [
		sitemap({
			filter: (page) => !isExcludedFromSitemap(page),
		}),
	],
});
