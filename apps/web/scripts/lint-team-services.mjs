#!/usr/bin/env node
/**
 * Validates that SERVICE_LEADS in apps/web/src/content/team.ts is
 * consistent with the Service list in apps/web/src/content/site.ts
 * and with every TeamMember.serviceSlugs[].
 *
 * Run via `pnpm lint:team` (and indirectly from `pnpm lint`).
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
    import { services } from './src/content/site.ts';
    import { team, SERVICE_LEADS } from './src/content/team.ts';
    const payload = {
      services: services.map((s) => ({ slug: s.slug, title: s.title })),
      team: team.map((m) => ({
        slug: m.slug,
        name: m.name,
        group: m.group,
        serviceSlugs: m.serviceSlugs,
      })),
      serviceLeads: SERVICE_LEADS,
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
    throw new Error('lint-team-services: failed to load data via tsx');
  }
  return JSON.parse(result.stdout);
}

function main() {
  const { services, team, serviceLeads } = load();
  const errors = [];
  const teamBySlug = new Map(team.map((m) => [m.slug, m]));
  const serviceSlugs = new Set(services.map((s) => s.slug));

  // 1. SERVICE_LEADS has an entry for every service, no extras.
  for (const s of services) {
    if (!serviceLeads[s.slug]) {
      errors.push(`Service "${s.slug}" has no entry in SERVICE_LEADS.`);
    }
  }
  for (const slug of Object.keys(serviceLeads)) {
    if (!serviceSlugs.has(slug)) {
      errors.push(`SERVICE_LEADS has entry for unknown service slug "${slug}".`);
    }
  }

  // 2–5. Per-service checks.
  for (const [svcSlug, entry] of Object.entries(serviceLeads)) {
    const { lead, coLeads = [] } = entry;
    const all = [lead, ...coLeads];

    // 2. Every slug resolves.
    for (const slug of all) {
      const m = teamBySlug.get(slug);
      if (!m) {
        errors.push(`Service "${svcSlug}": team slug "${slug}" not found in team.ts.`);
        continue;
      }
      // 3. Must be leadership.
      if (m.group !== 'leadership') {
        errors.push(
          `Service "${svcSlug}": "${slug}" has group "${m.group}", expected "leadership".`,
        );
      }
      // 5. Slug must include the service in their serviceSlugs[].
      if (!m.serviceSlugs.includes(svcSlug)) {
        errors.push(
          `Service "${svcSlug}": "${slug}" (lead or co-lead) is missing "${svcSlug}" from their serviceSlugs[].`,
        );
      }
    }

    // 4. No duplicate lead in coLeads; no duplicate coLeads.
    if (coLeads.includes(lead)) {
      errors.push(`Service "${svcSlug}": lead "${lead}" also appears in coLeads.`);
    }
    const seen = new Set();
    for (const c of coLeads) {
      if (seen.has(c)) {
        errors.push(`Service "${svcSlug}": "${c}" appears more than once in coLeads.`);
      }
      seen.add(c);
    }
  }

  // 6. Every team member's serviceSlugs[] only contains real service slugs.
  for (const m of team) {
    for (const slug of m.serviceSlugs) {
      if (!serviceSlugs.has(slug)) {
        errors.push(
          `Team member "${m.slug}" has unknown service slug "${slug}" in serviceSlugs[].`,
        );
      }
    }
  }

  // 7. Soft warning: any leadership partner with empty serviceSlugs[].
  const warnings = [];
  for (const m of team) {
    if (m.group === 'leadership' && m.serviceSlugs.length === 0) {
      warnings.push(`Leadership partner "${m.slug}" has empty serviceSlugs[].`);
    }
  }

  if (warnings.length) {
    console.log(`\n${warnings.length} warning(s):`);
    for (const w of warnings) console.log(`  warn  ${w}`);
  }

  if (errors.length) {
    console.log(`\n${errors.length} error(s):`);
    for (const e of errors) console.log(`  error ${e}`);
    console.log(`\nlint-team-services: ${errors.length} error(s).`);
    process.exit(1);
  }

  console.log(`lint-team-services: OK (${services.length} services, ${team.length} team members).`);
}

main();
