#!/usr/bin/env node
/**
 * Validates that every article in apps/web/src/content/articles.ts has
 * a `tag` field whose value is in the canonical vocabulary below.
 *
 * Run via `pnpm lint:articles:tags` (and indirectly from `pnpm lint`).
 *
 * Loads data via `pnpm exec tsx --eval ...` so we get real TS types
 * instead of regex-parsing source files.
 */

import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

// Canonical article tags. Locked vocabulary — 31 entries total.
// Adding a new tag requires an explicit edit here and a corresponding
// article reassignment commit.
const CANONICAL_TAGS = new Set([
  // Investment Banking
  'Term sheets', 'Cap table', 'Fundraise process', 'Capital strategy',
  // M&A Advisory
  'Deal process', 'Deal mechanics', 'Cross-border & integration', 'Special situations',
  // Valuations
  'Valuation methods', 'Reg & tax valuations', 'Complex situations',
  // Assurance
  'Audit execution', 'Audit reporting', 'Specialised audits',
  // Risk Advisory
  'Internal audit & ICFR', 'Fraud & forensics', 'Sector risk',
  // Tax & Regulatory
  'GST', 'Direct tax & TP', 'International tax', 'Special tax situations',
  // Corporate Secretarial
  'Filings & compliance', 'Board & governance', 'Corporate actions',
  // Finance Outsourcing
  'vCFO & controllership', 'FP&A', 'Close & reporting', 'Finance operations',
  // AIF & Fund Management
  'Fund structuring', 'Fund operations', 'AIF regs & tax',
]);

function load() {
  const code = `
    import { articles } from './src/content/articles.ts';
    const payload = { articles: articles.map((a) => ({ slug: a.slug, tag: a.tag })) };
    process.stdout.write(JSON.stringify(payload));
  `;
  const result = spawnSync(
    'pnpm',
    ['exec', 'tsx', '--eval', code],
    { cwd: repoRoot, encoding: 'utf8' },
  );
  if (result.status !== 0) {
    console.error(result.stderr || '(no stderr)');
    throw new Error('lint-article-tags: failed to load data via tsx');
  }
  return JSON.parse(result.stdout);
}

function main() {
  const { articles } = load();
  const errors = [];

  for (const a of articles) {
    if (!CANONICAL_TAGS.has(a.tag)) {
      errors.push(
        `Article "${a.slug}": tag "${a.tag}" is not in the canonical vocabulary.`,
      );
    }
  }

  if (errors.length) {
    console.log(`\n${errors.length} error(s):`);
    for (const e of errors) console.log(`  error ${e}`);
    console.log(`\nlint-article-tags: ${errors.length} error(s).`);
    process.exit(1);
  }

  console.log(
    `lint-article-tags: OK (${articles.length} articles, ${CANONICAL_TAGS.size} canonical tags).`,
  );
}

main();
