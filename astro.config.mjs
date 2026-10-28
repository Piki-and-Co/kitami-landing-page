import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
	site: 'https://ki-tami.com',
	output: 'static',
	compressHTML: true,
	integrations: [sitemap()],

});
