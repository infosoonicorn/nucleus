# Nucleus Advisors Handoff

## Active task

**Client-logo asset audit — 118 logos extracted from Nucleus Profile 2026.pdf and staged under `apps/web/public/brand/clients/<service-line>/` on 2026-05-21.**

- Source: `Nucleus_Data For Reference/Profile/Nucleus Profile 2026.pdf` (pp.18–23).
- Inventory + 5 unknowns flagged in `apps/web/public/brand/clients/README.md`.
- Coverage: Automobiles/Tools (5), Other Mfg (5), QSR/Hospitality (5), Energy/Power (5), Non-Profits (3), Healthcare (1), Infrastructure (5), Telecom (2), BFSI (10), Publishing (2), Agriculture (6), Pharmaceutical (2), E-Commerce (1), IT (5), Fashion (4), Transaction Advisory (8); plus Fundraising (52) bucketed by sub-sector.
- Next: Vijay reviews and reassigns any miscategorized logos by moving files between folders; then wire per-service marquees to read from these folders.

## Previous task

**Investment Banking page — section-by-section visual polish landed on top of the IB slice.**

- Slice spec: `docs/superpowers/specs/2026-05-14-services-ib-design.md`
- Slice plan: `docs/superpowers/plans/2026-05-14-services-ib.md`
- Status: full IB page is shippable. ~16 follow-up commits added on top of the IB slice between 2026-05-14 and 2026-05-15 reworked individual sections based on Vijay's live feedback. Awaiting deploy decision.

**What's on the IB page right now** (12 sections, top to bottom):

1. `<ServiceHero>` — eyebrow + WordReveal headline ("Prepare. Position. Close.") + magnetic CTA.
2. `<WhenToEngage>` — 6 IF/THEN scenario cards in a 3-row × 2-column desktop grid, single column on mobile. Click any card to reveal the THEN response inline. All 9 services have content; IB shows "Raising your next round → We pressure-test the model…" etc.
3. `<FundraiseStages>` — bespoke editorial centerpiece. §01 / FUNDRAISE eyebrow + "From idea to *closed round,* in *six deliberate steps*." headline. Horizontal scroll-pinned track with 6 dots and a red fill rail (Readiness → Modelling → Storytelling → Outreach → Diligence → Close). Two-column active panel with "What Nucleus does" + "Deliverable →" text plus a paper-document mockup on the right (Confidential header, title swapping per stage, signature line). All Inter, no Newsreader.
4. `<HowWeHelp>` — asymmetric bento. Left flagship card (dark navy, cream text, with badge + ordinal + serif-italic title + body + bullets) and 6 cream tile cards in a 2-column grid. Click any tile and it flies into the flagship slot with a 0.55s cubic ease, the previous flagship returns to the click position. Layout managed via CSS grid + framer-motion `layout` prop.
5. `<SoonicornCallout>` — orbital portfolio constellation. Dark navy plate on the left with the real Soonicorn unicorn icon at the center, 5-satellite inner ring (24s clockwise) + 7-satellite outer ring (38s counter-clockwise) using real portfolio logos (Burger Singh, Kredily, Limechat, Cusmat, Wherehouse, Zypp Electric, Geekster, Adiabatic, Zingbus, TSAW, Pickmywork, Skyeair). 3 of 12 highlighted with red glow as "live commitment." Plate foot shows portfolio breadth (60+ companies / 18+ sectors). Right paper panel: §04 eyebrow, "Capital that moves *with the advice*" headline, body from approved `service.crossLink`, 3-column spec strip (Stage: Seed to Series A · Cheque: Up to $1M · Geography: India-first), dark-pill CTA with red-sweep hover, persistent disclaimer.
6. `<ServiceInsights>` — two-column. Left: 4 planned-knowledge categories (Fundraise readiness, Investor mapping, Term sheets, Sector deep dives) marked "Updating soon." Right: 4 reviewer-approved regulatory updates (SEBI AIF Master Circular, RBI FEMA Master Direction, DPIIT Startup India, CBDT angel tax).
7. `<Process>` — generic 4-phase block (Diagnose → Structure → Execute → Report).
8. `<Proof>` — hidden for IB (no `service.proof`).
9. `<KnowledgeBank>` — experts list.
10. `<Faq>` — 4 generic placeholders ("Updating soon" answer slots). **TBD content.**
11. `<LeadMagnet>` — inert form → `/api/lead-magnet-stub`.
12. `<RelatedServices>` + `<ContactBand>`.

**Sections removed from IB page** (still in codebase, used by other 8 services or other pages):

- `<ArtefactStack>` cut — FundraiseStages' per-stage doc preview made it redundant.
- `<Deliverables>` cut — same reason (FundraiseStages lists each deliverable inline with its stage).

**Other 8 service pages** (M&A, Risk, Tax, Assurance, Valuations, Finance Outsourcing, Corp Sec, AIF) continue to render via `[slug]/page.tsx` → `<ServicePageDefault>`. They get the new `WhenToEngage` IF/THEN treatment (all have content), plus the `HowWeHelp` falls back to the legacy list-grid (only IB has `howWeHelpDetailed`). No regressions on those pages.

**Compliance gates intact:**

- `<SoonicornCallout>` still gated on `crossLink.reviewerStatus === 'approved'` (production gate).
- `<ServiceInsights>` still gated on `insightSources` items having `reviewerStatus: 'approved'` (compile-time discriminated union).
- Disclaimer copy unchanged from Vijay's 2026-05-14 approval.
- Lead-magnet stub still writes only to `console.warn` — no third-party calls, no DB writes.

**Origin not pushed.** `origin/main` is wired to Vercel production at `nucleusadvisors.in` (currently "coming soon"); pushing waits for Vijay's explicit go-ahead.

**Open dependencies before merge to production:**

- IB-specific FAQ content (4 Q+A pairs). Currently renders "Updating soon" placeholders. Optional but feels thin.
- Pre-existing `home.spec.ts` "Services nav" test flake. Separate investigation already underway (spawned task earlier).
- Soonicorn wordmark PNG → SVG (currently `apps/web/public/brand/soonicorn-ventures.png` at 62KB). Tracker item; non-blocking.

**Next slice (queued):** apply the same primitives to About / Careers / Insights / Contact via separate brainstorm + spec.

## Last Action

**Service ↔ team mapping — Phase 2 landed (2026-05-21).** Reauthored all 135 articles per `SERVICE_LEADS`. New distribution (final): Abhishek 35 (Assurance 15 + Finance Outsourcing 15 + Tax 5), V. S. Rathore 30 (IB 15 + Valuations 15), Neha Rathore 30 (Corp Sec 15 + AIF 15), Ashish 15 (Risk), Pravesh 12 (M&A — kept his existing 12 per Vijay), Aakash 3 (M&A — Astha's 1 moved), Hemendra 5 + Rajat 5 (Tax — V. K. Choudhary's 3 distributed across lead + co-leads). All 4 executives (Astha, Samarth, Geetanjali, V. K. Choudhary) removed as authors — they're not on service pages so their bylines would orphan. Also realigned leadership `expertise` tags so the `/team` cards no longer surface mismatched signals (Pravesh, Ashish, Abhishek, Aakash, Hemendra, Neha, Rajat — 7 partners updated; V. S. Rathore unchanged). Added new build-time validator `lint:articles:authors` wired into `pnpm lint` chain — checks every article's `authorSlug` is a real leadership team member whose `serviceSlugs[]` includes the article's service. 9 atomic commits, one per service line, plus 1 validator commit + 1 expertise commit. Phase 3 (`/team` profile enrichment, lead/co-lead avatar/link upgrade in dossier band) still deferred.

**Service ↔ team mapping — Phase 1 landed (2026-05-21).** Promoted the hidden `SERVICE_LEAD_PARTNER` const in `team.ts` to an exported, typed `SERVICE_LEADS: Record<ServiceSlug, { lead; coLeads? }>` covering all 9 service lines per the firm's confirmed assignment (Abhishek Gupta leads Assurance + Tax & Regulatory + Finance Outsourcing; V. S. Rathore leads Investment Banking + Valuations; Pravesh Goel leads M&A with Aakash Kalra co-lead; Ashish Gupta leads Risk Advisory; Neha Rathore leads Corporate Secretarial + AIF; Hemendra Chauhan and Rajat Singla co-lead Tax & Regulatory). Deleted the 9 placeholder `partnerLabel: 'Lead: V. S. Rathore, Partner'` strings from `ProcessDossier` and the `Service` entries that previously wallpapered every service page. Service-page dossier band now resolves the lead/co-leads live and renders "Lead: CA Abhishek Gupta · with CA Hemendra Chauhan, CA Rajat Singla" style labels. Reconciled `serviceSlugs[]` on 3 leadership partners (+Abhishek finance-outsourcing; −Hemendra and −Rajat finance-outsourcing) and stripped `serviceSlugs[]` on all 4 executives so service pages are leadership-only. Added build-time validator `apps/web/scripts/lint-team-services.mjs` wired into `pnpm lint` (runs before `lint:articles` so the team gate isn't shadowed by pre-existing article-corpus debt). `getTeamForService` now sorts lead → co-leads → seniority and filters to `group === 'leadership'`. Spec + plan at `docs/superpowers/specs/2026-05-21-service-team-mapping-design.md` and `docs/superpowers/plans/2026-05-21-service-team-mapping.md`. Phase 2 (reassign `authorSlug` on ~140 articles whose current placeholder is `vijay-singh-rathore`) and Phase 3 (`/team` profile enrichment, lead/co-lead avatar/link upgrade in dossier band) explicitly deferred.

Previously:

Approved all 4 IB `insightSources` entries (SEBI AIF, RBI FEMA, DPIIT, CBDT angel tax) — flipped from `reviewerStatus: 'pending'` to `'approved'` with `reviewerApprovedAt: '2026-05-14'`. Replaced the RBI URL from the generic master-directions listing page to the specific FEMA notification (`https://www.rbi.org.in/commonman/english/scripts/Notification.aspx?Id=856`) per Vijay's correction. The right column of the IB Insights section now shows all 4 regulatory citations with source badges, publication dates, and "why it matters" lines. Single commit `d0bbc11`. Closes the "≥3 reviewer-approved entries" open dependency from the earlier handoff.

Previous (in reverse chronological order, all 2026-05-14 and 2026-05-15):

- **Soonicorn callout content fix.** Swapped 3 portfolio logos that read poorly at satellite scale (Brainwired → Burger Singh, Sheru → Zingbus, DaveAI → Wherehouse). Plate foot stopped duplicating the right-side spec strip (Stage / Cheque) — now shows portfolio breadth (60+ companies / 18+ sectors) sourced from soonicornventures.com. Stage corrected from "Seed · pre-A" to "Seed to Series A." Commit `cd16699`.
- **Soonicorn callout redesigned with orbital portfolio constellation.** Replaced the earlier static logo + text panel with the design from the Claude Design handoff bundle (`Soonicorn Block.html`). Real Soonicorn icon at the orbital core, 12 real portfolio logos as satellites on two counter-rotating rings, 4s core-breathe glow, livedot pulse, hover sweep on CTA. Inter font throughout (no Newsreader). Compliance copy + reviewer-gated render preserved from the existing `service.crossLink` contract. Commit `09ffab4`.
- **HowWeHelp asymmetric bento — final motion fix.** Unified all 7 cards under a single `motion.button` element type with stable `key={item.title}` so framer-motion's `layout` prop animates the position swap properly. Replaced the spring (which felt like bouncing in place) with a 0.55s cubic-bezier ease. Clicked tile now glides into the flagship slot; the old flagship glides into the freed grid position. Commits `126b451` (initial bento) + `add78e2` (motion fix).
- **IB page composition trimmed.** Cut `<ArtefactStack>` and `<Deliverables>` from the IB route — both duplicated what FundraiseStages already shows with more visual care. Process kept as the meta 4-phase abstraction. Components stay in codebase for default composition. Commit `771ccdc`.
- **FundraiseStages — typography + sizing fixes.** Newsreader serif font wasn't actually loaded; replaced with Inter at weight 680 (matching `.home-v3-headline-display`). Doc card dimensions reduced (240×240, 4 mock-content lines, tighter padding) so the full document including the "Prepared by Nucleus" signature line fits within the 100vh sticky pane on standard laptop viewports. Commits `da7b5c2` + `5a4f509`.
- **FundraiseStages — editorial track redesign.** Replaced the earlier pill-tablist + plain panel with the design from the Claude Design handoff bundle (`A — Horizontal track + deliverable mock`). Big serif-style headline, horizontal track with bullseye dots and red fill rail, scroll-pinned active panel with two-column text + paper-document mockup. Scroll-pin and ARIA tablist semantics preserved from the earlier version; keyboard arrow nav still moves focus. Commit `3f4d1fb`.
- **WhenToEngage — final structure.** 6 IF/THEN cards in a 3×2 desktop grid (single column on mobile). Click any card to reveal the THEN answer inline via framer-motion height animation. Chevron rotates 180° when open. All 9 services have content; the section reads as a service-specific FAQ rather than a generic list. Series of commits: `5ca2407` (initial IF/THEN for IB), `600bf33` (content for 8 services), `5b63ed0` (2-col 6 scenarios), `e6b2351` (single-column click-to-reveal), `9190e97` (final 2-col 3-row card grid).
- Task 13 — project cleanup. Legacy `apps/web/src/components/service-detail.tsx` deleted. `docs/project-tracker.md` updated with the slice landing + deferred follow-ups. Spec + plan committed for historical reference.

Previous: Home page polish pass — six fixes from a section-by-section audit (desktop + mobile + seam screenshots, see `outputs/sec-*.png` and `outputs/seam2-*.png`).

Changes in prior passes:

- **Sticky nav now has backdrop blur.** `.site-header` in `apps/web/src/app/globals.css` dropped to `background: rgba(247,245,239,0.78)` plus `backdrop-filter: blur(14px) saturate(1.05)` (with a `@supports` fallback to 0.96 opacity for browsers without backdrop-filter). Fixes content (e.g., proof-strip headings) faintly bleeding under the nav.
- **Moments decision rail wraps evenly.** `.home-v3-moments-rail` switched from `flex-wrap` to `grid-template-columns: repeat(auto-fit, minmax(13.5rem, 1fr))`. Seven pills now lay out 4+3 instead of 3+3+1 with an orphan.
- **Hero "Live across N offices · M service lines" derives from data.** `apps/web/src/components/home/hero.tsx` now imports `site` and `services` from `@/content/site` instead of hard-coding `5` and `9`.
- **`proof` array is now a single source of truth.** Reshaped `proof` in `apps/web/src/content/site.ts` to `{ value: number, suffix: string, label: string }` and added `proofAsOf`. `proof-strip.tsx` imports both; the local duplicate is gone. `ProofBar` in `apps/web/src/components/sections.tsx` (used on About) updated to render `value + suffix` and lowercase the label inline.
- **`AS_AT` no longer hard-coded.** Pulled from `proofAsOf` in `site.ts` so the date has a single owner.
- **Lifecycle scroll height trimmed.** `.home-v3-lifecycle-scroll` `min-height: 280vh → 220vh`. Cut ~540px of trailing cream after the cards finish stacking without breaking the journey pacing.
- Added an inline comment in `teaser-row.tsx` noting that its 4 insight tracks are a condensed view of the 8-entry `insightCategories` in `site.ts`.

Skipped (intentional, not bugs):

- Section heading alignment mix (left for content-dense sections, centered for stage sections) — pattern reads as intentional rhythm.
- Orbital → proof hard seam — design choice (dark navy → cream cut, not a defect).
- Testimonials hidden in production — correct per CLAUDE.md ("no fake live content"); shows EmptyState in dev only.

## Next Step

1. Optional but recommended: write 4 IB-specific FAQ pairs and add them to `services[0].faq` in `apps/web/src/content/site.ts`. Once present the `<Faq>` component renders real Q+A instead of "Updating soon" placeholders.
2. Begin next slice: About / Careers / Insights / Contact elevated via the same `service-v1` primitives. Each gets its own brainstorm + bespoke moments where warranted.
3. Push to origin when Vijay gives explicit go-ahead — origin is wired to live production. Run deployed quality gate (`PLAYWRIGHT_BASE_URL=https://nucleus-bay.vercel.app pnpm test:e2e`) on the preview before flipping the production switch.
4. Source the hero Lottie per `docs/home-hero-lottie-spec.md` and drop it at `apps/web/public/lottie/nucleus-hero.json`.
5. Bump `proofAsOf` in `apps/web/src/content/site.ts` when partners re-validate the headcount/clients/deals figures.
6. Source SVG of the Soonicorn Ventures wordmark (currently PNG at `apps/web/public/brand/soonicorn-ventures.png`).
7. Resolve the pre-existing `home.spec.ts` "Services nav" Playwright flake (separate investigation task already spawned).

## Changed Files In Current Work (IB Slice + Post-Slice Iteration)

**IB slice — initial 13-task delivery:**

- `HANDOFF.md`, `docs/project-tracker.md`
- `docs/superpowers/specs/2026-05-14-services-ib-design.md` (new)
- `docs/superpowers/plans/2026-05-14-services-ib.md` (new)
- `apps/web/src/content/site.ts` (Service type extended)
- `apps/web/src/content/insights-sources.ts` (new)
- `apps/web/src/app/globals.css` (`.service-v1` scope added)
- `apps/web/src/app/services/investment-banking/page.tsx` (new bespoke route)
- `apps/web/src/app/services/[slug]/page.tsx` (elevated default composition)
- `apps/web/src/app/api/lead-magnet-stub/route.ts` (new stub)
- `apps/web/src/components/services/` (13 section primitives, new directory)
- `apps/web/src/components/services/investment-banking/` (3 bespoke modules, new directory)
- `apps/web/public/brand/soonicorn-ventures.png` (new asset)
- `tests/e2e/services-data.spec.ts`, `tests/e2e/services-ib.spec.ts`, `tests/e2e/service-insights.spec.ts`, `tests/e2e/lead-magnet-stub.spec.ts` (new)
- `apps/web/src/components/service-detail.tsx` (deleted — legacy, was unreferenced)

**Post-slice iteration (2026-05-14 → 2026-05-15, ~16 commits):**

- `apps/web/src/content/site.ts` (`HelpItem` type + `howWeHelpDetailed` for IB; per-service `whenToEngage` IF/THEN content for all 9 services; IB `whenToEngage` expanded to 6 scenarios)
- `apps/web/src/content/insights-sources.ts` (all 4 IB entries flipped to `'approved'` with `reviewerApprovedAt`; RBI URL corrected)
- `apps/web/src/components/services/when-to-engage.tsx` (full rewrite — IF/THEN bento with click-to-reveal disclosure)
- `apps/web/src/components/services/how-we-help.tsx` (full rewrite — asymmetric bento with click-to-swap flagship)
- `apps/web/src/components/services/investment-banking/fundraise-stages.tsx` (full rewrite — editorial track with paper-document mockup)
- `apps/web/src/components/services/investment-banking/soonicorn-callout.tsx` (full rewrite — orbital portfolio constellation)
- `apps/web/src/components/services/service-page-default.tsx` (prop-shape updates for the new client components)
- `apps/web/src/app/services/investment-banking/page.tsx` (ArtefactStack + Deliverables removed from composition; prop-shape updates)
- `apps/web/src/app/globals.css` (extensive — replaced `.service-v1-stages-*` with `.service-v1-fundraise-*`; added `.service-v1-when-*`, `.service-v1-help-*`; rebuilt `.service-v1-soonicorn-*` with orbital system)
- `apps/web/public/brand/soonicorn-icon.png` (new — Soonicorn unicorn icon for the orbital core)
- `apps/web/public/brand/portfolio/` (new directory — 12 portfolio logos: Adiabatic, Burger Singh, Cusmat, Geekster, Kredily, Limechat, Pickmywork, Skyeair, TSAW, Wherehouse, Zingbus, Zypp)
- `.claude/launch.json` (new — Claude Preview launch config, gitignored)

Previous homepage redesign pass also changed:

- `apps/web/package.json`, `pnpm-lock.yaml`
- `apps/web/src/app/layout.tsx`
- `apps/web/src/app/page.tsx`
- `apps/web/src/lib/utils.ts` (new)
- `apps/web/src/components/lenis-provider.tsx` (new)
- `apps/web/src/components/motion-primitives.tsx` (new)
- `apps/web/src/components/lottie-slot.tsx` (new)
- `apps/web/src/components/home/hero.tsx` (new)
- `apps/web/src/components/home/proof-strip.tsx` (new)
- `apps/web/src/components/home/lifecycle.tsx` (new)
- `apps/web/src/components/home/services-universe.tsx` (new)
- `apps/web/src/components/home/moments-marquee.tsx` (new)
- `apps/web/src/components/home/depth.tsx` (new)
- `apps/web/src/components/home/industries.tsx` (new)
- `apps/web/src/components/home/teaser-row.tsx` (new)
- `apps/web/src/components/home/closing-cta.tsx` (new)
- `tests/e2e/home.spec.ts`
- `tests/screenshots-home-v3.mjs` (new helper)
- `tests/screenshots-home-sections.mjs` (new helper)

## Verification

- Latest local gate after insight-source approvals (2026-05-15, commit `d0bbc11`): `pnpm lint`, `pnpm typecheck`, `pnpm build` all pass. `pnpm test:e2e tests/e2e/services-ib.spec.ts` — 8 passed.
- Local gate after Soonicorn redesign + content fixes (commits `09ffab4` + `cd16699`): all four gates pass; e2e IB tests 8/8 pass.
- Local gate after HowWeHelp + WhenToEngage rework (commits `add78e2`, `e6b2351`, `9190e97`): all four gates pass.
- Local gate after FundraiseStages redesign (commit `3f4d1fb`): all four gates pass; 26 IB + services-data tests pass.
- Latest local gate after IB slice Task 13: `pnpm lint && pnpm typecheck && pnpm build && pnpm test:e2e` passes (except the documented intermittent `home.spec.ts` "Services nav" flake — separate investigation underway).
- `pnpm lint` passed
- `pnpm typecheck` passed
- `pnpm build` passed
- `pnpm test:e2e` passed locally
- `PLAYWRIGHT_BASE_URL=https://nucleus-bay.vercel.app pnpm test:e2e` passed against Vercel (pre-IB slice).
- Latest local gate after animated hero revision: `pnpm lint && pnpm typecheck && pnpm build && pnpm test:e2e` passed.
- Latest local gate after Investment Banking/Risk Advisory revision: `pnpm lint && pnpm typecheck && pnpm build && pnpm test:e2e` passed.
- Latest local gate after clean-slate existing-site-inspired revision: `pnpm lint && pnpm typecheck && pnpm build && pnpm test:e2e` passed.
- Latest local gate after hero section upgrade: `pnpm lint && pnpm typecheck && pnpm build && pnpm test:e2e` passed.
- Latest local gate after Avendus-inspired revision: `pnpm lint && pnpm typecheck && pnpm build && pnpm test:e2e` passed.
- Latest local gate after full Avendus-style expansion: `pnpm lint && pnpm typecheck && pnpm build && pnpm test:e2e` passed.
- Latest local gate after animation pass: `pnpm lint && pnpm typecheck && pnpm build && pnpm test:e2e` passed.
- Content-layer update was documentation only; no lint/build/e2e run needed for this step.
- Latest local gate after Phase 1 static site build: `pnpm lint && pnpm typecheck && pnpm build && PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 pnpm test:e2e` passed.
- Latest local gate after project tracker dashboard redesign: `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 pnpm test:e2e` passed.
- Latest checks after hero and page-depth pass: `pnpm lint`, `pnpm typecheck`, and `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 pnpm test:e2e` passed. `pnpm build` also passed during this pass before the final smoke-test assertion update.
- Browser plugin could not open localhost in the in-app browser due `ERR_BLOCKED_BY_CLIENT`; Playwright local verification was used instead.
- Screenshots captured locally: `outputs/nucleus-home-desktop-v2.png`, `outputs/nucleus-home-mobile-v2.png`.
- Screenshots captured locally: `outputs/nucleus-clean-desktop.png`, `outputs/nucleus-clean-mobile.png`.
- Screenshots captured locally: `outputs/nucleus-hero-desktop.png`, `outputs/nucleus-hero-mobile.png`.
- Screenshots captured locally: `outputs/nucleus-avendus-inspired-desktop.png`, `outputs/nucleus-avendus-inspired-mobile.png`.
- Full-page screenshots captured locally: `outputs/nucleus-avendus-full-desktop.png`, `outputs/nucleus-avendus-full-mobile.png`.
- Animation QA screenshots captured locally: `outputs/nucleus-cinematic-opening.png`, `outputs/nucleus-cinematic-settled-desktop.png`, `outputs/nucleus-cinematic-settled-mobile.png`.
- Latest polished homepage screenshots captured locally: `outputs/home-polished-v3-desktop-final.png`, `outputs/home-polished-v3-mobile-final.png`.
- Latest gate after motion redesign: `pnpm --filter web lint`, `pnpm --filter web typecheck`, `pnpm --filter web build`, and `pnpm test:e2e` all passed.
- Motion redesign screenshots captured locally: `outputs/home-v3-desktop-fold.png`, `outputs/home-v3-desktop-full.png`, `outputs/home-v3-mobile-fold.png`, `outputs/home-v3-mobile-full.png`, plus per-section shots `outputs/section-*.png`.

## In-flight Processes

None. Dev server was stopped after capture.
