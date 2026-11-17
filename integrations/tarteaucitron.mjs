/**
 * Self-hosts tarteaucitron (cookie consent) instead of loading it from a CDN.
 *
 * Copies the minified files of the tarteaucitronjs package (exact version pinned in
 * package.json) to public/vendor/tarteaucitron/ on every `astro dev` / `astro build`,
 * so the site never requests a third party before consent and updates only happen
 * through a package.json change.
 *
 * tarteaucitron resolves its own folder from its script URL and, when that URL contains
 * ".min.", loads the .min variants of: tarteaucitron.services, lang/tarteaucitron.<browser
 * language>, css/tarteaucitron and advertising. All of them are copied, plus the licence.
 *
 * public/vendor/tarteaucitron/ is generated: it is git-ignored, never edit it by hand.
 */
import { cp, rm } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);

export default function tarteaucitron() {
	return {
		name: 'kitami:tarteaucitron',
		hooks: {
			'astro:config:setup': async ({ config, logger }) => {
				const pkgDir = path.dirname(require.resolve('tarteaucitronjs/package.json'));
				const { version } = require('tarteaucitronjs/package.json');
				const dest = fileURLToPath(new URL('vendor/tarteaucitron/', config.publicDir));

				await rm(dest, { recursive: true, force: true });
				await cp(pkgDir, dest, {
					recursive: true,
					filter: (src) => {
						const rel = path.relative(pkgDir, src);
						if (rel === '' || rel === 'css' || rel === 'lang') return true; // directories to walk
						return rel === 'LICENSE' || /\.min\.(js|css)$/.test(rel);
					},
				});
				logger.info(`tarteaucitron ${version} copied to public/vendor/tarteaucitron/`);
			},
		},
	};
}
