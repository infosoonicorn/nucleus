#!/usr/bin/env node
/**
 * Validates that every article in apps/web/src/content/articles.ts has
 * an authorSlug that:
 *   1. Resolves to a real TeamMember in apps/web/src/content/team.ts.
 *   2. Is a leadership partner (group === 'leadership').
 *   3. Has the article's service (serviceSlugs[0]) in their serviceSlugs[].
 * And that every serviceSlugs[] entry on the article resolves to a real
 * service slug in apps/web/src/content/site.ts.
 *
 * Run via `pnpm lint:articles:authors` (and indirectly from `pnpm lint`).
 *
 * Loads data via `pnpm exec tsx --eval ...` so we get real TS types
 * instead of regex-parsing source files.
 */

import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');

function load() {
  const code = `
    import { articles } from './src/content/articles.ts';
    import { services } from './src/content/site.ts';
    import { team } from './src/content/team.ts';
    const payload = {
      articles: articles.map((a) => ({ slug: a.slug, authorSlug: a.authorSlug, serviceSlugs: a.serviceSlugs })),
      services: services.map((s) => s.slug),
      team: team.map((m) => ({ slug: m.slug, group: m.group, serviceSlugs: m.serviceSlugs })),
    };
    process.stdout.write(JSON.stringify(payload));
  `;
  const result = spawnSync(
    'pnpm',
    ['exec', 'tsx', '--eval', code],
    { cwd: repoRoot, encoding: 'utf8' },
  );
  if (result.status !== 0) {
    console.error(result.stderr || '(no stderr)');
    throw new Error('lint-article-authors: failed to load data via tsx');
  }
  return JSON.parse(result.stdout);
}

function main() {
  const { articles, services, team } = load();
  const errors = [];
  const teamBySlug = new Map(team.map((m) => [m.slug, m]));
  const serviceSlugSet = new Set(services);

  for (const a of articles) {
    // 4. Every serviceSlugs[] entry on the article resolves to a real service.
    for (const slug of a.serviceSlugs) {
      if (!serviceSlugSet.has(slug)) {
        errors.push(
          `Article "${a.slug}": serviceSlugs[] contains unknown service slug "${slug}".`,
        );
      }
    }

    const svc = a.serviceSlugs[0];

    // 1. authorSlug resolves.
    const m = teamBySlug.get(a.authorSlug);
    if (!m) {
      errors.push(
        `Article "${a.slug}": authorSlug "${a.authorSlug}" not found in team.ts.`,
      );
      continue;
    }

    // 2. Author is leadership.
    if (m.group !== 'leadership') {
      errors.push(
        `Article "${a.slug}" (service "${svc}"): author "${a.authorSlug}" is group "${m.group}", expected "leadership".`,
      );
    }

    // 3. Author serves the article's service.
    if (svc && !m.serviceSlugs.includes(svc)) {
      errors.push(
        `Article "${a.slug}" (service "${svc}"): author "${a.authorSlug}" does not have "${svc}" in serviceSlugs[].`,
      );
    }
  }

  if (errors.length) {
    console.log(`\n${errors.length} error(s):`);
    for (const e of errors) console.log(`  error ${e}`);
    console.log(`\nlint-article-authors: ${errors.length} error(s).`);
    process.exit(1);
  }

  console.log(
    `lint-article-authors: OK (${articles.length} articles, ${team.length} team members, ${services.length} services).`,
  );
}

main();
