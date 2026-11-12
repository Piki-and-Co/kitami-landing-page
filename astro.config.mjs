import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tarteaucitron from './integrations/tarteaucitron.mjs';

// Pages kept out of the sitemap: any page whose last path segment starts with
// "confirmation-" (e.g. /inscription/confirmation-email/).
const isExcludedFromSitemap = (page) =>
	/\/confirmation-[^/]*\/?$/.test(new URL(page).pathname);

export default defineConfig({
	site: 'https://ki-tami.com',
	output: 'static',
	compressHTML: true,
	integrations: [
		tarteaucitron(),
		sitemap({
			filter: (page) => !isExcludedFromSitemap(page),
		}),
	],
});
