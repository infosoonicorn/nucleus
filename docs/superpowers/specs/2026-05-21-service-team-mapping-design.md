# Service ↔ team mapping — design

**Date:** 2026-05-21
**Status:** Approved for implementation (Phase 1 only)
**Author:** Vijay (assisted)

## Problem

Every service line in `apps/web/src/content/site.ts` carries a `partnerLabel: string` that currently reads `"Lead: V. S. Rathore, Partner"` for all nine services. This is a placeholder — it appears in production on every service page via `apps/web/src/components/services/process.tsx:149`.

A parallel, partial mapping exists privately inside `apps/web/src/content/team.ts` as `SERVICE_LEAD_PARTNER` and is consumed by `getTeamForService(slug)` to sort the team sidebar on each service page. Its values disagree with the firm's actual lead assignments (e.g. it names `rajat-singla` for `finance-outsourcing`).

Additionally, `TeamMember.serviceSlugs[]` was populated from a mix of expertise tags and historical defaults, so the bench shown on each service page does not strictly match the firm's stated lead/co-lead assignments.

We want one source of truth for "who leads / co-leads / appears on each service line," surfaced consistently to all consumers.

## Decisions (locked during brainstorm)

1. **One lead per service. A partner may lead multiple service lines.** No co-lead promotion to lead; multiple co-leads allowed.
2. **Source of truth lives in `team.ts`** (works with existing `serviceSlugs[]` + `SERVICE_LEAD_PARTNER` plumbing rather than against it). The hidden const is promoted to an exported, typed structure with co-lead support.
3. **Schema for the lead structure is explicit:** `{ lead: TeamSlug; coLeads?: TeamSlug[] }` per service. Required `lead` enforced at the type level.
4. **Service pages render only leadership partners** for the lead / co-lead block AND for the bench. Executives stay on `/team` only — their `serviceSlugs[]` is stripped.
5. **`serviceSlugs[]` on each partner is derived strictly from the lead / co-lead assignment.** A partner's `serviceSlugs[]` is exactly the set of services where they are lead or co-lead. No expertise-tag-based extras.
6. **Articles reauthoring is out of scope for Phase 1.** A separate PR (Phase 2) will reassign `authorSlug` on the ~140 articles and update `new-article.mjs` defaults.

## Final lead / co-lead assignment (Vijay-approved)

| # | Service | Lead | Co-leads |
|---|---|---|---|
| 1 | Investment Banking | V. S. Rathore (`vijay-singh-rathore`) | — |
| 2 | M&A Advisory | Pravesh Goel (`pravesh-goel`) | Aakash Kalra (`aakash-kalra`) |
| 3 | Valuations | V. S. Rathore (`vijay-singh-rathore`) | — |
| 4 | Assurance | Abhishek Gupta (`abhishek-gupta`) | — |
| 5 | Risk Advisory | Ashish Gupta (`ashish-gupta`) | — |
| 6 | Tax & Regulatory | Abhishek Gupta (`abhishek-gupta`) | Hemendra Chauhan (`hemendra-chauhan`), Rajat Singla (`rajat-singla`) |
| 7 | Corporate Secretarial | Neha Rathore (`neha-rathore`) | — |
| 8 | Finance Outsourcing | Abhishek Gupta (`abhishek-gupta`) | — |
| 9 | AIF & Fund Management | Neha Rathore (`neha-rathore`) | — |

**Lead-load:** Abhishek Gupta leads 3 (Assurance, Tax & Regulatory, Finance Outsourcing). V. S. Rathore and Neha Rathore lead 2 each. Pravesh Goel and Ashish Gupta lead 1 each. Aakash Kalra, Hemendra Chauhan, and Rajat Singla are co-leads only. All 8 leadership partners appear at least once.

## Final `serviceSlugs[]` per team member (Vijay-approved)

Derived strictly from the assignment table above.

### Leadership partners

| Partner | New `serviceSlugs[]` | Δ vs current |
|---|---|---|
| Pravesh Goel | `[ma-advisory]` | unchanged |
| V. S. Rathore | `[investment-banking, valuations]` | unchanged |
| Ashish Gupta | `[risk-advisory]` | unchanged |
| Abhishek Gupta | `[assurance, tax-regulatory, finance-outsourcing]` | **+ finance-outsourcing** |
| Aakash Kalra | `[ma-advisory]` | unchanged |
| Hemendra Chauhan | `[tax-regulatory]` | **− finance-outsourcing** |
| Neha Rathore | `[corporate-secretarial, aif-fund-management]` | unchanged |
| Rajat Singla | `[tax-regulatory]` | **− finance-outsourcing** |

### Executives (all stripped)

| Executive | New `serviceSlugs[]` | Δ vs current |
|---|---|---|
| Geetanjali Virmani | `[]` | strip `[finance-outsourcing, assurance]` |
| V. K. Choudhary | `[]` | strip `[tax-regulatory]` |
| Samarth Pandey | `[]` | strip `[investment-banking, aif-fund-management]` |
| Astha Kumar | `[]` | strip `[ma-advisory, corporate-secretarial, aif-fund-management]` |

### Resulting bench per service (post-clean)

| Service | Bench (lead in **bold**) | Count |
|---|---|---|
| Investment Banking | **V. S. Rathore** | 1 |
| M&A Advisory | **Pravesh Goel**, Aakash Kalra | 2 |
| Valuations | **V. S. Rathore** | 1 |
| Assurance | **Abhishek Gupta** | 1 |
| Risk Advisory | **Ashish Gupta** | 1 |
| Tax & Regulatory | **Abhishek Gupta**, Hemendra Chauhan, Rajat Singla | 3 |
| Corporate Secretarial | **Neha Rathore** | 1 |
| Finance Outsourcing | **Abhishek Gupta** | 1 |
| AIF & Fund Management | **Neha Rathore** | 1 |

Several services have a single-partner bench. This is honest and matches the firm's stated structure; expanding benches happens via Phase 3 (optional) or by formally promoting new partners later.

## Schema changes

### `apps/web/src/content/team.ts`

```ts
// 1. Add a service-slug literal type derived from site.ts.
import type { Service } from './site';
export type ServiceSlug = Service['slug'];

// 2. Add a team-slug literal type so leads must reference a real member.
export type TeamSlug = (typeof team)[number]['slug'];

// 3. Promote SERVICE_LEAD_PARTNER → exported SERVICE_LEADS with co-lead support.
//    Replaces the legacy Record<string,string> with a strict typed shape.
export type ServiceLead = {
  lead: TeamSlug;
  coLeads?: readonly TeamSlug[];
};

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

// 4. Remove the old SERVICE_LEAD_PARTNER constant entirely.
```

### `apps/web/src/content/team.ts` — `getTeamForService`

Update sort order to: **lead → co-leads (in declared order) → rest by seniority**. Filter to `group === 'leadership'` so executives never appear on service pages even if a later edit accidentally re-tags them.

```ts
export function getTeamForService(slug: ServiceSlug): TeamMember[] {
  const entry = SERVICE_LEADS[slug];
  const leadOrder = entry ? [entry.lead, ...(entry.coLeads ?? [])] : [];
  return team
    .filter((m) => m.group === 'leadership' && m.serviceSlugs.includes(slug))
    .sort((a, b) => {
      const ai = leadOrder.indexOf(a.slug);
      const bi = leadOrder.indexOf(b.slug);
      if (ai !== -1 || bi !== -1) {
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      }
      return SENIORITY_ORDER[a.seniority] - SENIORITY_ORDER[b.seniority];
    });
}
```

### `apps/web/src/content/site.ts`

```ts
// Service type: remove partnerLabel
type Service = {
  // ...existing fields
  // partnerLabel: REMOVED
};

// Remove the 9 partnerLabel: 'Lead: V. S. Rathore, Partner' strings.
```

### `apps/web/src/components/services/process.tsx`

Replace the `partnerLabel`-string render at line 149 with a real partner block. New small component (or inline JSX) reads `SERVICE_LEADS[service.slug]`, resolves names + roles via `getTeamMemberBySlug`, and renders:

> **Lead: Abhishek Gupta** · Partner
> *With Hemendra Chauhan and Rajat Singla*

(plain text variant; styling inherits from the existing process band — visual upgrade is out of scope for this PR.)

## Validation (build-time)

New script `apps/web/scripts/lint-team-services.mjs`. Wire into `package.json` as a new `lint:team` script, and call it from the existing `lint` script so it runs in CI and pre-flight. Fails the build on any violation.

Checks:

1. `SERVICE_LEADS` has an entry for every `Service.slug` in `site.ts` (and no extras).
2. Every `lead` and `coLead` resolves to a real team member.
3. Every `lead` and `coLead` has `group === 'leadership'`.
4. `lead` is not duplicated in `coLeads`; no co-lead duplicates.
5. Every `lead` and `coLead` has the service slug present in their `serviceSlugs[]`.
6. Every team member's `serviceSlugs[]` only contains real service slugs (typo guard).
7. (Soft warning, not failure) Any leadership partner with empty `serviceSlugs[]` after this change — should be zero, but useful canary if someone later edits team.ts.

Type-system contribution: with `ServiceSlug` and `TeamSlug` as literal-union types, `SERVICE_LEADS` is `Record<ServiceSlug, ...>` so a missing or unknown service slug fails `tsc`, not the runtime validator.

## Impact map and migration

| # | Surface | Action |
|---|---|---|
| 1 | `Service` type in `site.ts` | Remove `partnerLabel` |
| 2 | 9 `partnerLabel` strings | Delete |
| 3 | `process.tsx:149` | Swap to lead/co-leads block reading from `SERVICE_LEADS` |
| 4 | `team.ts` — `SERVICE_LEAD_PARTNER` | Replace with `SERVICE_LEADS` (typed, exported, with co-leads) |
| 5 | `team.ts` — `getTeamForService` | New sort + leadership filter |
| 6 | `team.ts` — every member's `serviceSlugs[]` | Updated per the approved tables above |
| 7 | New script | `apps/web/scripts/lint-team-services.mjs` + wire into lint command |
| 8 | `package.json` lint script | Append the new check |
| 9 | Service page team sidebar | Auto-correct via #5 + #6, no code change |
| 10 | `orbital-services.tsx` `experts` count | Auto-recalculates from new `serviceSlugs[]`. Numbers will shrink. Acceptable. |
| 11 | Custom service pages (`ma-advisory`, `investment-banking`) | Use `getTeamForService` — auto-corrects |
| 12 | Articles / `authorSlug` | **Not touched in this PR.** Phase 2. |
| 13 | `new-article.mjs` default `authorSlug` | **Not touched in this PR.** Phase 2. |
| 14 | `/team` profile / listing | No surfacing of leads today. Optional Phase 3. |
| 15 | `lint-articles.mjs` | Unchanged. Article author validation continues as-is. |

## Verification

After implementation:

1. `pnpm typecheck` — TS literal types catch unknown slugs.
2. New `lint-team-services.mjs` passes.
3. `pnpm lint` clean.
4. `pnpm build` clean.
5. `pnpm test:e2e` clean (no test currently asserts `partnerLabel` text — confirmed via grep).
6. Visual check on each of the 9 service pages:
   - The lead/co-leads block in the process band shows the right names.
   - The team sidebar lists exactly the partners whose `serviceSlugs[]` includes that slug.
7. Visual check on homepage orbital: `experts` count per service matches the new bench counts (mostly 1 — this is expected and matches reality).
8. Visual check on `/team` page: no regression; executives still listed in their section.

## Out of scope (Phase 2 follow-up PR)

- Re-author all articles in `articles.ts` whose current `authorSlug` is placeholder (`vijay-singh-rathore` where the article's `serviceSlugs[0]` is not actually V.S.R.'s service).
- Make `new-article.mjs` default `authorSlug` smart: look up the lead from `SERVICE_LEADS[serviceSlugs[0]]`.
- Sanity-check JSON-LD `author`, OG metadata, RSS feed, `MoreFromAuthor`, `ArticleAuthorBio` after the reauthoring.

## Out of scope (Phase 3, optional polish)

- `/team/<slug>` profile page: derive and render "Leads: …" / "Co-leads on: …" by scanning `SERVICE_LEADS`.
- `/team` listing: badge each partner with the services they lead.
- Visual treatment of the lead/co-leads block in `process.tsx`: avatar + linked card instead of plain text.
- Decide whether to re-tag executives onto specific services in a separate "support" channel surfaced lower on service pages.

## Risks and how they're mitigated

| Risk | Mitigation |
|---|---|
| Validator misses an edge case → stale data ships | Type-system gate (literal unions) catches structural drift before runtime. Validator catches semantic drift (lead not in `serviceSlugs[]`, group mismatch). |
| Removing `partnerLabel` breaks a hidden render | grep covered all consumers (`process.tsx` is the sole one); typecheck will surface any I missed. |
| Bench shrinks too much on Investment Banking / Valuations / etc. (count = 1) | Honest reflection of staffing. Service pages should still read sensibly with one partner. Phase 3 visual tweak if needed. |
| Article authors now mismatch service leads (e.g. all Finance Outsourcing articles still authored by V.S.R.) | Explicitly deferred to Phase 2. Phase 1 PR description will call this out as known-temporary. |
