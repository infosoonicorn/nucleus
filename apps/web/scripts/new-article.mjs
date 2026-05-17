#!/usr/bin/env node
/**
 * Scaffold a new article entry. Prints a ready-to-paste TypeScript
 * object that the author drops into apps/web/src/content/articles.ts.
 *
 * Usage:
 *   pnpm new-article <slug>
 *   pnpm new-article first-board-meeting-after-fundraise
 *
 * The slug must be kebab-case (lower-case ASCII, words separated by
 * single hyphens). The script also checks that the slug is not already
 * used and prints a reminder to add the thumbnail JPG.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTICLES_PATH = path.resolve(__dirname, '..', 'src', 'content', 'articles.ts');
const THUMBS_DIR = path.resolve(__dirname, '..', 'public', 'article-thumbs');

const slugArg = process.argv[2];
if (!slugArg) {
  console.error('Usage: pnpm new-article <slug>');
  console.error('Example: pnpm new-article first-board-meeting-after-fundraise');
  process.exit(1);
}

const slug = slugArg.trim();
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug)) {
  console.error(`Invalid slug "${slug}". Use kebab-case (lower-case ASCII words separated by single hyphens).`);
  process.exit(1);
}

const src = fs.readFileSync(ARTICLES_PATH, 'utf8');
if (src.includes(`slug: '${slug}'`)) {
  console.error(`Slug "${slug}" is already used in articles.ts. Pick a different slug.`);
  process.exit(1);
}

const today = new Date().toISOString().slice(0, 10);
const thumbAbs = path.join(THUMBS_DIR, `${slug}.jpg`);
const thumbExists = fs.existsSync(thumbAbs);

const stub = `  {
    slug: '${slug}',
    title: 'TODO: title (60-100 chars, sentence case, no em-dashes)',
    excerpt:
      'TODO: one or two sentences. 140-260 characters. This shows on the card and as the article subhead.',
    body: [
      "TODO: lead paragraph. Open with the situation, not the conclusion. 2-3 sentences.",
      "TODO: second lead paragraph. Set up the structural argument the rest of the article makes.",

      "## TODO: first section header",
      "TODO: first paragraph of section 1. Concrete, named, specific.",
      "TODO: second paragraph if needed.",

      "### TODO: subsection header (optional)",
      "TODO: subsection body. Use **bold** sparingly for the term or moment that matters.",

      "## TODO: second section header",
      "TODO: paragraph.",

      "## TODO: third section header",
      "TODO: paragraph.",

      "## TODO: closing section header",
      "TODO: one-paragraph close. Don't restate the article. Land a specific commitment or observation.",
    ].join('\\n\\n'),
    authorSlug: 'vijay-singh-rathore', // TODO: change to the team.ts slug of the author
    publishedOn: '${today}',
    readMinutes: 8, // TODO: adjust if word count differs significantly from 1,500
    tag: 'TODO: short tag', // shows as chip on card
    serviceSlugs: ['TODO-service-slug'], // e.g. ['ma-advisory', 'investment-banking']
    thumbnailSrc: '/article-thumbs/${slug}.jpg',
    reviewerStatus: 'pending',
  },`;

console.log('━'.repeat(64));
console.log('Article stub for: ' + slug);
console.log('━'.repeat(64));
console.log('');
console.log('1. Paste the object below into the `articles` array in:');
console.log('   apps/web/src/content/articles.ts');
console.log('');
console.log('2. Fill in every TODO. See docs/article-template.md for the rules.');
console.log('');
console.log('3. Add the thumbnail JPG at:');
console.log('   ' + path.relative(process.cwd(), thumbAbs));
console.log('   ' + (thumbExists ? '(already exists ✓)' : '(missing — generate via ChatGPT per docs/article-thumbnails-spec.md)'));
console.log('');
console.log('4. Run the article lint:');
console.log('   pnpm lint:articles');
console.log('');
console.log('━'.repeat(64));
console.log('');
console.log(stub);
console.log('');
