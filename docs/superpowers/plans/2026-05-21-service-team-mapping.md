# Service ↔ Team Mapping Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder `partnerLabel` string on every service line with a typed, validated `SERVICE_LEADS` table that drives both the rendered lead/co-leads block and the per-service team bench, while reconciling every team member's `serviceSlugs[]` to match the firm's approved assignment.

**Architecture:** Source of truth lives in `apps/web/src/content/team.ts` as an exported, typed `SERVICE_LEADS: Record<ServiceSlug, { lead: TeamSlug; coLeads?: readonly TeamSlug[] }>`. `getTeamForService(slug)` reads it to sort the bench (lead → co-leads → seniority) and filters to `group === 'leadership'`. A new build-time validator (`scripts/lint-team-services.mjs`) wired into `pnpm lint` catches any drift. The legacy `ProcessDossier.partnerLabel` string is removed; the render in `process.tsx` reads `SERVICE_LEADS` directly via a new `serviceSlug` prop.

**Tech Stack:** TypeScript, Next.js 16, Node.js (validator script), pnpm.

**Spec:** `docs/superpowers/specs/2026-05-21-service-team-mapping-design.md`

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `apps/web/src/content/team.ts` | modify | Add literal types, exported `SERVICE_LEADS`, updated `getTeamForService`. Remove `SERVICE_LEAD_PARTNER`. Update partner & executive `serviceSlugs[]`. |
| `apps/web/src/content/site.ts` | modify | Remove `partnerLabel` from `ProcessDossier` type. Remove 9 placeholder values. |
| `apps/web/src/components/services/process.tsx` | modify | Accept `serviceSlug` prop, render lead/co-leads via `SERVICE_LEADS` lookup instead of `dossier.partnerLabel`. |
| `apps/web/src/components/services/service-page-default.tsx` | modify | Pass `serviceSlug` prop to `<Process>`. |
| `apps/web/src/app/services/ma-advisory/page.tsx` | modify | Pass `serviceSlug` prop to `<Process>`. |
| `apps/web/src/app/services/investment-banking/page.tsx` | modify | Pass `serviceSlug` prop to `<Process>`. |
| `apps/web/scripts/lint-team-services.mjs` | create | Build-time validator for `SERVICE_LEADS` consistency. |
| `apps/web/package.json` | modify | Add `lint:team` script. Chain it from existing lint pre-flight. |

---

## Task 1: Add literal types and `SERVICE_LEADS` table (alongside legacy)

**Files:**
- Modify: `apps/web/src/content/team.ts` (add to top of file + near existing `SERVICE_LEAD_PARTNER`)
- Modify: `apps/web/src/content/team.ts` (cross-import from `site.ts`)

This task adds the new structure without removing the old one yet. Renderers still use the old map. Validator (next task) will use the new one.

- [ ] **Step 1: Add literal types and the new table**

Open `apps/web/src/content/team.ts`. Near the top of the file, after existing imports, add:

```ts
import type { Service } from './site';

export type ServiceSlug = Service['slug'];
```

Then after the existing `SERVICE_LEAD_PARTNER` declaration (around line 352–362), add:

```ts
// Literal-union of every team member's slug. Used to type-check SERVICE_LEADS.
export type TeamSlug = (typeof team)[number]['slug'];

export type ServiceLead = {
  lead: TeamSlug;
  coLeads?: readonly TeamSlug[];
};

/**
 * Single source of truth for who leads (and co-leads) each service line.
 * Consumed by `getTeamForService` for sort order and by `process.tsx` for
 * the rendered partner block. Validated at build time by
 * `scripts/lint-team-services.mjs`.
 */
export const SERVICE_LEADS: Record<ServiceSlug, ServiceLead> = {
  'investment-banking':    { lead: 'vijay-singh-rathore' },
  'ma-advisory':           { lead: 'pravesh-goel', coLeads: ['aakash-kalra'] },
  'valuations':            { lead: 'vijay-singh-rathore' },
  'assurance':             { lead: 'abhishek-gupta' },
  'risk-advisory':         { lead: 'ashish-gupta' },
  'tax-regulatory':        { lead: 'abhishek-gupta', coLeads: ['hemendra-chauhan', 'rajat-singla'] },
  'corporate-secretarial': { lead: 'neha-rathore' },
  'finance-outsourcing':   { lead: 'abhishek-gupta' },
  'aif-fund-management':   { lead: 'neha-rathore' },
};
```

- [ ] **Step 2: Verify typecheck still passes**

Run: `cd apps/web && pnpm typecheck`
Expected: PASS (no errors). If `tsc` complains about a slug value, you mistyped a team slug — match exactly: `pravesh-goel`, `vijay-singh-rathore`, `ashish-gupta`, `abhishek-gupta`, `aakash-kalra`, `hemendra-chauhan`, `neha-rathore`, `rajat-singla`.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/content/team.ts
git commit -m "$(cat <<'EOF'
feat(team): add typed SERVICE_LEADS table alongside legacy map

Introduces ServiceSlug + TeamSlug literal-union types and an exported
SERVICE_LEADS: Record<ServiceSlug, { lead; coLeads? }>. Legacy
SERVICE_LEAD_PARTNER untouched for now — gets removed once consumers
switch over.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Write the build-time validator

**Files:**
- Create: `apps/web/scripts/lint-team-services.mjs`

The validator is the test for this whole change. It runs against the live data files and fails the build on any drift.

- [ ] **Step 1: Create the validator script**

Create `apps/web/scripts/lint-team-services.mjs`:

```js
#!/usr/bin/env node
/**
 * Validates that SERVICE_LEADS in apps/web/src/content/team.ts is
 * consistent with the Service list in apps/web/src/content/site.ts
 * and with every TeamMember.serviceSlugs[].
 *
 * Run via `pnpm lint:team` (and indirectly from `pnpm lint`).
 *
 * Strategy: this file lives outside the Next.js build, so we cannot
 * `import` the TS modules. Instead we shell out to a tiny TS loader
 * that re-exports the data as JSON, OR (simpler) we parse the literal
 * arrays out of the source. We pick the loader approach via tsx —
 * already a transitive dep through next, but check before assuming.
 *
 * Fallback (chosen here for zero new deps): use Node's experimental
 * --import tsx loader if available; otherwise regex-parse. Pure regex
 * for an exported `services` array + `team` array + `SERVICE_LEADS`
 * is brittle, so we instead spawn `tsx` and `console.log(JSON.stringify(...))`
 * a one-liner. If tsx is unavailable, we fall back to a node:child_process
 * call into `pnpm exec tsx`.
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
      errors.push(\`Service "\${s.slug}" has no entry in SERVICE_LEADS.\`);
    }
  }
  for (const slug of Object.keys(serviceLeads)) {
    if (!serviceSlugs.has(slug)) {
      errors.push(\`SERVICE_LEADS has entry for unknown service slug "\${slug}".\`);
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
        errors.push(\`Service "\${svcSlug}": team slug "\${slug}" not found in team.ts.\`);
        continue;
      }
      // 3. Must be leadership.
      if (m.group !== 'leadership') {
        errors.push(
          \`Service "\${svcSlug}": "\${slug}" has group "\${m.group}", expected "leadership".\`,
        );
      }
      // 5. Slug must include the service in their serviceSlugs[].
      if (!m.serviceSlugs.includes(svcSlug)) {
        errors.push(
          \`Service "\${svcSlug}": "\${slug}" (lead or co-lead) is missing "\${svcSlug}" from their serviceSlugs[].\`,
        );
      }
    }

    // 4. No duplicate lead in coLeads; no duplicate coLeads.
    if (coLeads.includes(lead)) {
      errors.push(\`Service "\${svcSlug}": lead "\${lead}" also appears in coLeads.\`);
    }
    const seen = new Set();
    for (const c of coLeads) {
      if (seen.has(c)) {
        errors.push(\`Service "\${svcSlug}": "\${c}" appears more than once in coLeads.\`);
      }
      seen.add(c);
    }
  }

  // 6. Every team member's serviceSlugs[] only contains real service slugs.
  for (const m of team) {
    for (const slug of m.serviceSlugs) {
      if (!serviceSlugs.has(slug)) {
        errors.push(
          \`Team member "\${m.slug}" has unknown service slug "\${slug}" in serviceSlugs[].\`,
        );
      }
    }
  }

  // 7. Soft warning: any leadership partner with empty serviceSlugs[].
  const warnings = [];
  for (const m of team) {
    if (m.group === 'leadership' && m.serviceSlugs.length === 0) {
      warnings.push(\`Leadership partner "\${m.slug}" has empty serviceSlugs[].\`);
    }
  }

  for (const w of warnings) {
    console.warn(\`\\u001b[33mwarn\\u001b[0m  \${w}\`);
  }

  if (errors.length) {
    for (const e of errors) {
      console.error(\`\\u001b[31merror\\u001b[0m \${e}\`);
    }
    console.error(\`\\nlint-team-services: \${errors.length} error(s).\`);
    process.exit(1);
  }

  console.log(\`lint-team-services: OK (\${services.length} services, \${team.length} team members).\`);
}

main();
```

- [ ] **Step 2: Confirm `tsx` is available**

Run: `cd apps/web && pnpm exec tsx --version`
Expected: a version number prints. If "tsx: command not found", add it as a devDependency: `pnpm --filter web add -D tsx` and commit `pnpm-lock.yaml` in this task.

- [ ] **Step 3: Run the validator manually and confirm it shows the expected failure**

Run: `cd apps/web && node scripts/lint-team-services.mjs`
Expected: exit code 1, with one or more errors of the form `Service "finance-outsourcing": "abhishek-gupta" (lead or co-lead) is missing "finance-outsourcing" from their serviceSlugs[].`

(This is the "watch the test fail" step — proves the validator catches real drift before we fix the data.)

- [ ] **Step 4: Commit**

```bash
git add apps/web/scripts/lint-team-services.mjs
git add apps/web/package.json pnpm-lock.yaml   # only if tsx was added
git commit -m "$(cat <<'EOF'
chore(lint): add lint-team-services validator

Verifies SERVICE_LEADS in team.ts is consistent with site.ts services
and every TeamMember.serviceSlugs[]. Catches missing entries, unknown
slugs, executives leading services, leads not in their own bench, and
duplicate co-leads.

Currently failing on a known data drift (Abhishek missing
finance-outsourcing) — reconciliation lands in the next commits.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Wire validator into `pnpm lint`

**Files:**
- Modify: `apps/web/package.json`

- [ ] **Step 1: Add the `lint:team` script and chain it from `lint`**

Open `apps/web/package.json`. The current scripts block is:

```json
  "scripts": {
    "dev": "next dev --webpack",
    "dev:turbo": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --max-warnings=0",
    "lint:articles": "node scripts/lint-articles.mjs",
    "new-article": "node scripts/new-article.mjs",
    "typecheck": "tsc --noEmit"
  },
```

Change it to:

```json
  "scripts": {
    "dev": "next dev --webpack",
    "dev:turbo": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --max-warnings=0 && pnpm lint:articles && pnpm lint:team",
    "lint:articles": "node scripts/lint-articles.mjs",
    "lint:team": "node scripts/lint-team-services.mjs",
    "new-article": "node scripts/new-article.mjs",
    "typecheck": "tsc --noEmit"
  },
```

- [ ] **Step 2: Run `pnpm lint` and confirm it now fails on the data drift**

Run: `cd apps/web && pnpm lint`
Expected: eslint passes, lint:articles passes, lint:team fails with the Abhishek/finance-outsourcing error from Task 2 Step 3. Exit code non-zero.

- [ ] **Step 3: Commit**

```bash
git add apps/web/package.json
git commit -m "$(cat <<'EOF'
chore(lint): wire lint:team into pnpm lint pre-flight

`pnpm lint` now runs eslint, then lint:articles, then lint:team in
sequence. Any drift in the service/team mapping fails CI.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Reconcile leadership partner `serviceSlugs[]`

**Files:**
- Modify: `apps/web/src/content/team.ts` (three partner entries)

Per the approved table:

| Partner | New `serviceSlugs[]` | Δ |
|---|---|---|
| Abhishek Gupta | `['assurance', 'tax-regulatory', 'finance-outsourcing']` | + finance-outsourcing |
| Hemendra Chauhan | `['tax-regulatory']` | − finance-outsourcing |
| Rajat Singla | `['tax-regulatory']` | − finance-outsourcing |

The other five leadership partners (Pravesh, V. S. Rathore, Ashish, Aakash, Neha) stay unchanged.

- [ ] **Step 1: Update Abhishek Gupta's `serviceSlugs`**

Find the Abhishek Gupta block in `team.ts` (around line 177–197). Current:

```ts
    serviceSlugs: ['assurance', 'tax-regulatory'],
```

Change to:

```ts
    serviceSlugs: ['assurance', 'tax-regulatory', 'finance-outsourcing'],
```

- [ ] **Step 2: Update Hemendra Chauhan's `serviceSlugs`**

Find Hemendra's block (around line 224–240). Current:

```ts
    serviceSlugs: ['tax-regulatory', 'finance-outsourcing'],
```

Change to:

```ts
    serviceSlugs: ['tax-regulatory'],
```

- [ ] **Step 3: Update Rajat Singla's `serviceSlugs`**

Find Rajat's block (around line 262–272). Current:

```ts
    serviceSlugs: ['finance-outsourcing', 'tax-regulatory'],
```

Change to:

```ts
    serviceSlugs: ['tax-regulatory'],
```

- [ ] **Step 4: Run the validator**

Run: `cd apps/web && pnpm lint:team`
Expected: still failing — now on the 4 executives (Geetanjali, V. K. Choudhary, Samarth, Astha) having `serviceSlugs[]` that include slugs but they're not leads (not strictly a failure per current checks — re-read errors). The lead/co-lead-side errors should be gone.

If the validator now passes entirely (because the rule doesn't flag executives), proceed. The executive cleanup in Task 5 is a separate decision.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/content/team.ts
git commit -m "$(cat <<'EOF'
chore(team): align leadership serviceSlugs with approved leads

+ finance-outsourcing on Abhishek Gupta (now its lead)
- finance-outsourcing from Hemendra Chauhan and Rajat Singla
  (not on its lead/co-lead list per approved assignment)

Validator now passes on lead-consistency checks.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Strip executive `serviceSlugs[]`

**Files:**
- Modify: `apps/web/src/content/team.ts` (four executive entries)

Decision from spec: executives stay on `/team` only; their `serviceSlugs[]` is emptied so the data honestly says they don't appear on service pages.

- [ ] **Step 1: Update Geetanjali Virmani**

Find her block (around line 272–280). Current:

```ts
    serviceSlugs: ['finance-outsourcing', 'assurance'],
```

Change to:

```ts
    serviceSlugs: [],
```

- [ ] **Step 2: Update V. K. Choudhary**

Find his block (around line 288–302). Current:

```ts
    serviceSlugs: ['tax-regulatory'],
```

Change to:

```ts
    serviceSlugs: [],
```

- [ ] **Step 3: Update Samarth Pandey**

Find his block (around line 305–322). Current:

```ts
    serviceSlugs: ['investment-banking', 'aif-fund-management'],
```

Change to:

```ts
    serviceSlugs: [],
```

- [ ] **Step 4: Update Astha Kumar**

Find her block (around line 325–335). Current:

```ts
    serviceSlugs: ['ma-advisory', 'corporate-secretarial', 'aif-fund-management'],
```

Change to:

```ts
    serviceSlugs: [],
```

- [ ] **Step 5: Run the validator and full lint**

Run: `cd apps/web && pnpm lint`
Expected: PASS. Validator prints `lint-team-services: OK (9 services, 12 team members).`

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/content/team.ts
git commit -m "$(cat <<'EOF'
chore(team): clear executive serviceSlugs (service pages = leadership only)

Per the service ↔ team mapping spec, service pages render only
leadership partners. Executives stay on /team. Emptying their
serviceSlugs[] makes the data truthful; the render-layer filter
(next task) is the belt-and-braces.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Update `getTeamForService` (sort + leadership filter)

**Files:**
- Modify: `apps/web/src/content/team.ts` (replace `getTeamForService`)

Replaces the sort logic to read from `SERVICE_LEADS` (lead → co-leads in declared order → rest by seniority) and adds the leadership filter as a render-layer safety net.

- [ ] **Step 1: Replace `getTeamForService`**

Find the current `getTeamForService` (around line 364–377):

```ts
export function getTeamForService(slug: string): TeamMember[] {
  const leadSlug = SERVICE_LEAD_PARTNER[slug];
  return team
    .filter((m) => m.serviceSlugs.includes(slug))
    .sort((a, b) => {
      // Declared lead partner wins.
      if (leadSlug) {
        if (a.slug === leadSlug && b.slug !== leadSlug) return -1;
        if (b.slug === leadSlug && a.slug !== leadSlug) return 1;
      }
      // Then by seniority.
      return SENIORITY_ORDER[a.seniority] - SENIORITY_ORDER[b.seniority];
    });
}
```

Replace with:

```ts
export function getTeamForService(slug: ServiceSlug): TeamMember[] {
  const entry = SERVICE_LEADS[slug];
  const leadOrder: TeamSlug[] = entry ? [entry.lead, ...(entry.coLeads ?? [])] : [];
  return team
    .filter((m) => m.group === 'leadership' && m.serviceSlugs.includes(slug))
    .sort((a, b) => {
      const ai = leadOrder.indexOf(a.slug as TeamSlug);
      const bi = leadOrder.indexOf(b.slug as TeamSlug);
      if (ai !== -1 || bi !== -1) {
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      }
      return SENIORITY_ORDER[a.seniority] - SENIORITY_ORDER[b.seniority];
    });
}
```

- [ ] **Step 2: Typecheck**

Run: `cd apps/web && pnpm typecheck`
Expected: PASS. If a caller passes a non-literal `string` (e.g. from `params.slug`), narrow at the call site or accept `string` in the signature — but right now all callers (`service-page-default.tsx`, `orbital-services.tsx`, `ma-advisory/page.tsx`, `investment-banking/page.tsx`) pass `service.slug` which is `ServiceSlug` by inference. If `tsc` complains, fall back to `function getTeamForService(slug: string): TeamMember[]` and cast inside.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/content/team.ts
git commit -m "$(cat <<'EOF'
refactor(team): read SERVICE_LEADS for sort + add leadership filter

getTeamForService now sorts: lead → co-leads (declared order) → rest
by seniority. Filters to group === 'leadership' so executives never
surface on service pages even if their serviceSlugs[] is later re-populated.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Remove legacy `SERVICE_LEAD_PARTNER`

**Files:**
- Modify: `apps/web/src/content/team.ts` (delete the legacy const + its doc comment)

- [ ] **Step 1: Verify it's unused outside `team.ts`**

Run: `cd "/Users/vijay/Documents/Nucleus Advisors" && rg -n "SERVICE_LEAD_PARTNER" apps/web/src`
Expected: only `team.ts` lines appear. If any other file references it, stop and update those before deleting.

- [ ] **Step 2: Delete the legacy const and its JSDoc**

Find the block (around line 345–362):

```ts
/**
 * Lead partner per service line. The named partner here always appears
 * first on the corresponding service page's team sidebar, ahead of
 * other partners tagged for the same service. This matches the firm's
 * declared owner-of-practice mapping so the right face anchors each
 * service line; other tagged partners stack below by seniority.
 */
const SERVICE_LEAD_PARTNER: Record<string, string> = {
  'investment-banking':    'vijay-singh-rathore',
  // ...etc
};
```

Delete the whole block.

- [ ] **Step 3: Typecheck + lint**

Run: `cd apps/web && pnpm typecheck && pnpm lint`
Expected: both PASS.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/content/team.ts
git commit -m "$(cat <<'EOF'
chore(team): remove legacy SERVICE_LEAD_PARTNER const

Superseded by exported, typed SERVICE_LEADS with co-lead support.
No remaining consumers.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Remove `partnerLabel` from `ProcessDossier` type + 9 string values

**Files:**
- Modify: `apps/web/src/content/site.ts` (type definition + 9 service entries)

- [ ] **Step 1: Remove the field from the type**

Open `apps/web/src/content/site.ts`. Around line 55–65, find:

```ts
export type ProcessDossier = {
  // ...other fields
  partnerLabel: string;        // 'Lead: V. S. Rathore, Partner'
  // ...other fields
};
```

Delete the `partnerLabel: string;` line.

- [ ] **Step 2: Remove the 9 `partnerLabel` values**

Run: `cd "/Users/vijay/Documents/Nucleus Advisors" && grep -n "partnerLabel:" apps/web/src/content/site.ts`

For each of the 9 lines printed, delete the entire line. (They all read `      partnerLabel: 'Lead: V. S. Rathore, Partner',` and live inside `processDossier: { ... }` blocks.)

Fast path with `sed` (verify after):

```bash
cd "/Users/vijay/Documents/Nucleus Advisors" && sed -i '' "/partnerLabel: 'Lead: V. S. Rathore, Partner',/d" apps/web/src/content/site.ts
```

Then verify: `grep -c "partnerLabel" apps/web/src/content/site.ts` → should print `0`.

- [ ] **Step 3: Typecheck (will fail — that's expected)**

Run: `cd apps/web && pnpm typecheck`
Expected: FAIL with one error in `apps/web/src/components/services/process.tsx` about `partnerLabel` not existing on `ProcessDossier`. This is the next task's wedge.

- [ ] **Step 4: Commit (yes, with a known-broken typecheck — fixed in Task 9)**

```bash
git add apps/web/src/content/site.ts
git commit -m "$(cat <<'EOF'
refactor(content): remove ProcessDossier.partnerLabel field

Was a placeholder string ('Lead: V. S. Rathore, Partner') hardcoded
on all 9 services. The render swap to a SERVICE_LEADS lookup lands
in the next commit; typecheck temporarily fails until then.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Update `Process` component to read `SERVICE_LEADS`

**Files:**
- Modify: `apps/web/src/components/services/process.tsx`

Add a `serviceSlug` prop, look up the lead block, and render real names instead of the deleted `dossier.partnerLabel`.

- [ ] **Step 1: Add the import + update component props**

At the top of `process.tsx`, add (with the other imports):

```ts
import {
  SERVICE_LEADS,
  getTeamMemberBySlug,
  type ServiceSlug,
} from '@/content/team';
```

Find `type ProcessProps` (around line 10–15). Add `serviceSlug: ServiceSlug;` as a required field.

Find `export function Process({ ... })` (line 26). Add `serviceSlug` to the destructured params and pass it down to `DossierProcess`:

```ts
export function Process({ serviceTitle, ordinal, title, phases, dossier, serviceSlug }: ProcessProps) {
  if (dossier) {
    return (
      <DossierProcess
        serviceTitle={serviceTitle}
        ordinal={ordinal}
        title={title}
        dossier={dossier}
        serviceSlug={serviceSlug}
      />
    );
  }
  // ...existing non-dossier branch unchanged
}
```

Then update `DossierProcess`'s signature (around line 76):

```ts
function DossierProcess({
  serviceTitle,
  ordinal,
  title,
  dossier,
  serviceSlug,
}: Readonly<{
  ordinal: string;
  title: string;
  serviceTitle: string;
  dossier: ProcessDossier;
  serviceSlug: ServiceSlug;
}>) {
  // ...existing body
```

- [ ] **Step 2: Build the lead label inside `DossierProcess`**

Inside `DossierProcess`, after the existing `const stages = dossier.phases;` line (around line 81), add:

```ts
const leads = SERVICE_LEADS[serviceSlug];
const leadMember = getTeamMemberBySlug(leads.lead);
const coLeadMembers = (leads.coLeads ?? [])
  .map((slug) => getTeamMemberBySlug(slug))
  .filter((m): m is NonNullable<typeof m> => Boolean(m));
const leadLabel = leadMember
  ? coLeadMembers.length > 0
    ? \`Lead: \${leadMember.name} · with \${coLeadMembers.map((m) => m.name).join(', ')}\`
    : \`Lead: \${leadMember.name}\`
  : '';
```

- [ ] **Step 3: Replace the partnerLabel render**

Find line 149:

```tsx
            <span>{dossier.partnerLabel}</span>
```

Replace with:

```tsx
            <span>{leadLabel}</span>
```

- [ ] **Step 4: Typecheck (now passing locally, but Process callers still broken)**

Run: `cd apps/web && pnpm typecheck`
Expected: 3 errors, one per `<Process ... />` call site (default, ma-advisory, investment-banking), saying `serviceSlug` is missing. That's Task 10.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/services/process.tsx
git commit -m "$(cat <<'EOF'
refactor(services): render lead/co-leads from SERVICE_LEADS

Replaces the deleted dossier.partnerLabel string with a live lookup:
Process now requires a serviceSlug prop, resolves the lead (and any
co-leads) via SERVICE_LEADS + getTeamMemberBySlug, and renders
"Lead: Abhishek Gupta · with Hemendra Chauhan, Rajat Singla" in the
dossier card header.

Callers updated in the next commit.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 10: Wire `serviceSlug` prop at all `<Process>` call sites

**Files:**
- Modify: `apps/web/src/components/services/service-page-default.tsx`
- Modify: `apps/web/src/app/services/ma-advisory/page.tsx`
- Modify: `apps/web/src/app/services/investment-banking/page.tsx`

- [ ] **Step 1: Update `service-page-default.tsx`**

Find the `<Process>` JSX (around line 114–120):

```tsx
          <Process
            serviceTitle={service.title}
            ordinal={ord.process}
            title={service.processTitle}
            phases={service.process}
            dossier={service.processDossier}
          />
```

Add `serviceSlug={service.slug}`:

```tsx
          <Process
            serviceTitle={service.title}
            ordinal={ord.process}
            title={service.processTitle}
            phases={service.process}
            dossier={service.processDossier}
            serviceSlug={service.slug}
          />
```

- [ ] **Step 2: Update `ma-advisory/page.tsx`**

Find the `<Process>` JSX (around line 89). Add `serviceSlug={service.slug}` (or hardcode `serviceSlug="ma-advisory"` — match what existing props use; prefer `service.slug` if `service` is in scope).

- [ ] **Step 3: Update `investment-banking/page.tsx`**

Find the `<Process>` JSX (around line 97). Add `serviceSlug={service.slug}` (same notes as above).

- [ ] **Step 4: Typecheck**

Run: `cd apps/web && pnpm typecheck`
Expected: PASS, no errors.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/services/service-page-default.tsx \
        apps/web/src/app/services/ma-advisory/page.tsx \
        apps/web/src/app/services/investment-banking/page.tsx
git commit -m "$(cat <<'EOF'
refactor(services): pass serviceSlug to Process at all call sites

Required prop for the new SERVICE_LEADS-driven lead/co-leads render.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 11: Full local gate (typecheck + lint + build)

**Files:** none — verification only.

- [ ] **Step 1: Run all gates**

Run, from repo root:

```bash
cd "/Users/vijay/Documents/Nucleus Advisors/apps/web" && pnpm typecheck && pnpm lint && pnpm build
```

Expected: all three PASS.

If `pnpm build` fails on a generated page, check the error — most likely a missing `serviceSlug` prop on a `<Process>` you missed. Run `rg -n "<Process" apps/web/src` to confirm there are no other call sites.

- [ ] **Step 2: Smoke-test the rendered output**

Start the dev server in the background if not running:

```bash
cd "/Users/vijay/Documents/Nucleus Advisors" && nohup pnpm --filter web dev --hostname 127.0.0.1 > /tmp/nucleus-web.log 2>&1 &
disown
sleep 8
```

Then for each service, confirm the lead line renders correctly:

```bash
for slug in investment-banking ma-advisory valuations assurance risk-advisory tax-regulatory corporate-secretarial finance-outsourcing aif-fund-management; do
  echo "=== $slug ==="
  curl -s "http://localhost:3000/services/$slug" | grep -oE "Lead: [^<]{1,120}" | head -1
done
```

Expected output (exact names, one line each):

```
=== investment-banking ===
Lead: CA Vijay Singh Rathore
=== ma-advisory ===
Lead: CA Pravesh Goel · with CA Aakash Kalra
=== valuations ===
Lead: CA Vijay Singh Rathore
=== assurance ===
Lead: CA Abhishek Gupta
=== risk-advisory ===
Lead: CA Ashish Gupta
=== tax-regulatory ===
Lead: CA Abhishek Gupta · with CA Hemendra Chauhan, CA Rajat Singla
=== corporate-secretarial ===
Lead: CS Neha Rathore
=== finance-outsourcing ===
Lead: CA Abhishek Gupta
=== aif-fund-management ===
Lead: CS Neha Rathore
```

If any line is wrong, stop and fix the data in `SERVICE_LEADS` or the team's name string — DO NOT re-run later tasks on top of bad data.

- [ ] **Step 3: Update HANDOFF.md and docs/project-tracker.md**

Per the repo CLAUDE.md handoff rule. Add one entry to each describing what landed (schema, validator, 9 service-page lead-block swap, deferred article reauthoring as Phase 2).

- [ ] **Step 4: Final commit + ship**

```bash
git add HANDOFF.md docs/project-tracker.md
git commit -m "$(cat <<'EOF'
docs: record service ↔ team mapping landing in handoff + tracker

Phase 1 of the mapping spec is complete. Phase 2 (articles
reauthoring) and Phase 3 (/team enrichment) remain deferred.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Out of scope (do NOT touch in this PR)

- `apps/web/src/content/articles.ts` `authorSlug` values (all 140+).
- `apps/web/scripts/new-article.mjs` default `authorSlug`.
- `/team/<slug>` profile page leads-derivation.
- Visual upgrade of the lead/co-leads render in `process.tsx` (avatar, link, fancier styling).
- Re-enabling executive `serviceSlugs[]` for any service.

If any of these come up during execution, stop and add them to the Phase 2 / Phase 3 backlog in `docs/project-tracker.md` instead of doing them inline.

---

## Self-review checklist (run before handing off to executor)

- [x] Every spec section maps to a task: schema → 1, 6, 7; validator → 2, 3; data reconciliation → 4, 5; render swap → 8, 9, 10; verification → 11. ✓
- [x] No placeholders / TBDs / "implement appropriate X" / "similar to Task N". ✓
- [x] Types are consistent: `ServiceSlug`, `TeamSlug`, `SERVICE_LEADS`, `getTeamMemberBySlug` (already exists in team.ts, no need to create) used consistently across tasks. ✓
- [x] Each commit is self-contained except Task 8 (which deliberately leaves typecheck broken) — explicitly called out in that task's commit message and resolved in the very next task. ✓
