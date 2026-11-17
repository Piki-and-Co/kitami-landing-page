/**
 * Blog images: WebP only, at most 1920x1080 (aspect ratio kept, never enlarged).
 *
 * Astro converts images in posts to WebP but keeps their original size, so a large photo
 * dropped in src/content/blog/ would ship at full size. Two tools keep the folder in line:
 *
 *   npm run blog:images
 *     Converts every .png/.jpg/.jpeg in src/content/blog/ to .webp (resized to fit
 *     1920x1080), shrinks any .webp over that size, rewrites the references in the .md
 *     files, and deletes the converted originals.
 *
 *   Build check (this file's default export, registered in astro.config.mjs)
 *     Every `astro dev` / `astro build` warns about images that still need the command.
 */
import { readdir, readFile, writeFile, rm, rename } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const MAX_WIDTH = 1920;
export const MAX_HEIGHT = 1080;
const BLOG_DIR = fileURLToPath(new URL('../src/content/blog/', import.meta.url));
const IMAGE = /\.(png|jpe?g|webp)$/i;

async function loadSharp() {
	return (await import('sharp')).default;
}

async function listFiles(dir) {
	const entries = await readdir(dir, { recursive: true, withFileTypes: true });
	return entries.filter((e) => e.isFile()).map((e) => path.join(e.parentPath, e.name));
}

/** Images in the blog folder that are not WebP, or are larger than the limit. */
export async function findImageProblems() {
	const sharp = await loadSharp();
	const problems = [];
	for (const file of (await listFiles(BLOG_DIR)).filter((f) => IMAGE.test(f))) {
		const rel = path.relative(BLOG_DIR, file);
		const { width = 0, height = 0 } = await sharp(file).metadata();
		if (!/\.webp$/i.test(file)) problems.push(`${rel}: not WebP`);
		else if (width > MAX_WIDTH || height > MAX_HEIGHT) problems.push(`${rel}: ${width}x${height}`);
	}
	return problems;
}

async function fix() {
	const sharp = await loadSharp();
	const files = await listFiles(BLOG_DIR);
	const markdown = files.filter((f) => /\.md$/i.test(f));
	let changed = 0;

	for (const file of files.filter((f) => IMAGE.test(f))) {
		const isWebp = /\.webp$/i.test(file);
		const { width = 0, height = 0 } = await sharp(file).metadata();
		if (isWebp && width <= MAX_WIDTH && height <= MAX_HEIGHT) continue;

		const out = file.replace(IMAGE, '.webp');
		if (!isWebp && files.some((f) => f.toLowerCase() === out.toLowerCase())) {
			throw new Error(`${path.relative(BLOG_DIR, out)} already exists: rename one of the two images first.`);
		}
		const tmp = `${out}.tmp`;
		const info = await sharp(file)
			.rotate() // apply the camera's orientation before dropping metadata
			.resize({ width: MAX_WIDTH, height: MAX_HEIGHT, fit: 'inside', withoutEnlargement: true })
			.webp({ quality: 80 })
			.toFile(tmp);
		await rename(tmp, out);

		if (!isWebp) {
			const from = path.basename(file);
			const to = path.basename(out);
			for (const md of markdown) {
				const text = await readFile(md, 'utf8');
				const next = text.split(from).join(to);
				if (next !== text) await writeFile(md, next);
			}
			await rm(file);
		}
		console.log(`${path.relative(BLOG_DIR, file)} (${width}x${height}) -> ${path.basename(out)} (${info.width}x${info.height})`);
		changed++;
	}
	console.log(changed ? `${changed} image(s) updated in src/content/blog/.` : 'All blog images are already WebP and within 1920x1080.');
}

export default function blogImages() {
	return {
		name: 'kitami:blog-images',
		hooks: {
			'astro:config:setup': async ({ logger }) => {
				const problems = await findImageProblems();
				if (problems.length) {
					logger.warn(
						`Blog images to convert (WebP, max ${MAX_WIDTH}x${MAX_HEIGHT}). Run \`npm run blog:images\`:\n  ` +
							problems.join('\n  '),
					);
				}
			},
		},
	};
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
	await fix();
}
