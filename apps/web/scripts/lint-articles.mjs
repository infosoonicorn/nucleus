#!/usr/bin/env node
/**
 * Article lint check. Enforces editorial conventions documented in
 * docs/article-template.md. Run via:
 *
 *   pnpm lint:articles
 *
 * Exits non-zero on any error. Warnings (length out of band, missing
 * thumbnail JPG) report but do not fail the check, so a partner can
 * commit a draft and follow up with the asset.
 *
 * The check parses articles.ts as text rather than importing it, so it
 * works without a TypeScript compile step and stays cheap to run in CI.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARTICLES_PATH = path.resolve(__dirname, '..', 'src', 'content', 'articles.ts');
const TEAM_PATH = path.resolve(__dirname, '..', 'src', 'content', 'team.ts');
const THUMBS_DIR = path.resolve(__dirname, '..', 'public', 'article-thumbs');

const MIN_WORDS = 1200;
const MAX_WORDS = 1800;
const MIN_H2 = 3;

// Pull every team-member slug out of team.ts. The article authorSlug
// field must match one of these — that keeps article ↔ team in sync
// without import-resolving TS at lint time.
function loadTeamSlugs() {
  const src = fs.readFileSync(TEAM_PATH, 'utf8');
  const slugs = new Set();
  for (const m of src.matchAll(/\bslug:\s*'([a-z0-9-]+)'/g)) slugs.add(m[1]);
  return slugs;
}
const KNOWN_AUTHOR_SLUGS = loadTeamSlugs();

const src = fs.readFileSync(ARTICLES_PATH, 'utf8');

/** Parse one article object out of articles.ts.
 *  Returns: { slug, title, body (raw concatenated), authorKey, thumbnailSrc, raw }
 */
function parseArticles(source) {
  // Find each article object by its slug line, then extract the surrounding
  // {...} block. The TS file is hand-written and consistent in shape, so this
  // bounded-regex walk is reliable without a real parser.
  const articles = [];
  const slugRe = /\{\s*slug:\s*'([^']+)'/g;
  let m;
  while ((m = slugRe.exec(source))) {
    const start = m.index;
    let depth = 0;
    let end = -1;
    for (let i = start; i < source.length; i++) {
      const c = source[i];
      if (c === '{') depth++;
      else if (c === '}') {
        depth--;
        if (depth === 0) { end = i + 1; break; }
      }
    }
    if (end < 0) continue;
    const raw = source.slice(start, end);
    const slug = m[1];
    const titleMatch = raw.match(/title:\s*'((?:\\'|[^'])*)'/);
    const title = titleMatch ? titleMatch[1].replace(/\\'/g, "'") : '';
    const authorMatch = raw.match(/authorSlug:\s*'([a-z0-9-]+)'/);
    const authorSlug = authorMatch ? authorMatch[1] : null;
    const thumbMatch = raw.match(/thumbnailSrc:\s*'([^']+)'/);
    const thumbnailSrc = thumbMatch ? thumbMatch[1] : null;

    // Pull body string literals out of the array.
    const bodyMatch = raw.match(/body:\s*\[([\s\S]*?)\]\.join/);
    let body = '';
    if (bodyMatch) {
      const strings = [...bodyMatch[1].matchAll(/"((?:\\.|[^"\\])*)"/g)];
      body = strings.map(s => s[1].replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\\\/g, '\\')).join('\n\n');
    }

    articles.push({ slug, title, body, authorSlug, thumbnailSrc, raw });
  }
  return articles;
}

const articles = parseArticles(src);
if (articles.length === 0) {
  console.error('lint-articles: no articles found in articles.ts (parser regression?). Aborting.');
  process.exit(2);
}

const errors = [];
const warnings = [];
const seenSlugs = new Set();

for (const a of articles) {
  const prefix = `  [${a.slug}]`;

  // Slug uniqueness
  if (seenSlugs.has(a.slug)) errors.push(`${prefix} duplicate slug`);
  seenSlugs.add(a.slug);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(a.slug)) {
    errors.push(`${prefix} slug must be kebab-case (lower-case ASCII, single hyphens)`);
  }

  // Author slug must resolve to a team.ts entry
  if (!a.authorSlug || !KNOWN_AUTHOR_SLUGS.has(a.authorSlug)) {
    errors.push(
      `${prefix} unknown authorSlug "${a.authorSlug ?? '(missing)'}" — must match a slug in team.ts (known: ${[...KNOWN_AUTHOR_SLUGS].join(', ')})`,
    );
  }

  // No em-dash in title
  if (/—/.test(a.title)) errors.push(`${prefix} title contains an em-dash (—). Rewrite with comma, colon, or period.`);

  // Body checks
  const body = a.body;
  // Strip TODO articles from word-count enforcement so a freshly scaffolded
  // article doesn't fail this check until it has real content.
  const isStub = /^TODO:/m.test(body) || body.includes('TODO: lead paragraph');
  if (isStub) {
    warnings.push(`${prefix} stub TODOs present — finish the draft before publishing`);
  } else {
    const words = body
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/^#+\s*/gm, '')
      .split(/\s+/)
      .filter(Boolean).length;
    if (words < MIN_WORDS || words > MAX_WORDS) {
      warnings.push(`${prefix} word count ${words} outside ${MIN_WORDS}-${MAX_WORDS} band`);
    }

    // Em-dash in body
    if (/—/.test(body)) errors.push(`${prefix} body contains an em-dash (—). Rewrite with comma, colon, or period.`);

    // Heading count
    const h2Count = (body.match(/^## /gm) || []).length;
    if (h2Count < MIN_H2) {
      errors.push(`${prefix} only ${h2Count} \`##\` section header(s) — need at least ${MIN_H2}`);
    }

    // No raw HTML
    if (/<[a-z][\s>]/.test(body)) {
      errors.push(`${prefix} body contains raw HTML — author writes structure, CSS provides style`);
    }
  }

  // Thumbnail
  if (!a.thumbnailSrc) {
    errors.push(`${prefix} missing thumbnailSrc field`);
  } else {
    const expected = `/article-thumbs/${a.slug}.jpg`;
    if (a.thumbnailSrc !== expected) {
      errors.push(`${prefix} thumbnailSrc should be "${expected}" (got "${a.thumbnailSrc}")`);
    }
    const abs = path.join(THUMBS_DIR, `${a.slug}.jpg`);
    if (!fs.existsSync(abs)) {
      warnings.push(`${prefix} thumbnail file missing at ${path.relative(process.cwd(), abs)} — generate via ChatGPT per docs/article-thumbnails-spec.md`);
    }
  }
}

console.log(`lint-articles: checked ${articles.length} article(s)`);
if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const w of warnings) console.log(w);
}
if (errors.length) {
  console.log(`\n${errors.length} error(s):`);
  for (const e of errors) console.log(e);
  process.exit(1);
} else {
  console.log('\nno errors. ✓');
}
