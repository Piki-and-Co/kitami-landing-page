/**
 * Builds the blog search index (Pagefind) after every `astro build`.
 *
 * Runs inside the build itself, so `npm run build` and the CI's `npx astro build` both
 * produce dist/pagefind/ with no extra step. Only content inside an element carrying
 * `data-pagefind-body` is indexed (the body of each blog post, see BlogPostLayout).
 *
 * `astro dev` has no index: the search box shows a notice instead.
 * Test search with `npm run build && npm run preview`.
 */
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export default function pagefind() {
	return {
		name: 'kitami:pagefind',
		hooks: {
			'astro:build:done': async ({ dir, logger }) => {
				const { createIndex, close } = await import('pagefind');
				const site = fileURLToPath(dir);
				const { index, errors } = await createIndex({ forceLanguage: 'fr' });
				if (!index) throw new Error(`Pagefind: ${errors.join(', ')}`);
				const added = await index.addDirectory({ path: site });
				if (added.errors.length) throw new Error(`Pagefind: ${added.errors.join(', ')}`);
				const written = await index.writeFiles({ outputPath: path.join(site, 'pagefind') });
				if (written.errors.length) throw new Error(`Pagefind: ${written.errors.join(', ')}`);
				await close();
				logger.info(`${added.page_count} page(s) indexed into dist/pagefind/`);
			},
		},
	};
}
