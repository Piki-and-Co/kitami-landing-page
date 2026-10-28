import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
	site: 'https://ki-tami.com',
	output: 'static',
	integrations: [sitemap()],

	markdown: {
		gfm: true,
	},
});
