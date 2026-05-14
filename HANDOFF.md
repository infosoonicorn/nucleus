# Nucleus Advisors Handoff

## Active task

**Services elevation slice — Investment Banking landed.**

- Spec: `docs/superpowers/specs/2026-05-14-services-ib-design.md`
- Plan: `docs/superpowers/plans/2026-05-14-services-ib.md`
- Status: implementation complete locally. All 13 plan tasks landed across ~17 commits between 2026-05-14 and 2026-05-14. Awaiting Vijay's review and deploy decision.
- Implementation summary:
  - `apps/web/src/components/services/` now contains 13 section primitives (12 shared + ServiceHero) plus the three IB-bespoke modules under `investment-banking/` (FundraiseStages, ArtefactStack, SoonicornCallout).
  - `apps/web/src/app/services/investment-banking/page.tsx` is the bespoke IB route. `app/services/[slug]/page.tsx` renders the elevated default composition for the other 8 services.
  - `apps/web/src/content/insights-sources.ts` carries reviewer-gated official-source data (currently 4 pending entries for IB).
  - `apps/web/src/app/api/lead-magnet-stub/route.ts` is an inert stub that returns a friendly confirmation; will be replaced by Supabase writes in Phase 1.5.
  - `apps/web/public/brand/soonicorn-ventures.png` is the Soonicorn wordmark used by the IB cross-link callout.
  - `apps/web/src/app/globals.css` now carries a `.service-v1` design scope appended to the existing `.home-v3` styles (~441 lines added).
  - Service type extended in `site.ts` with `ordinal`, `displayHeadline?`, `whenToEngage?`, `faq?`, `crossLink?`. `crossLink` and the insights-source types are discriminated unions on `reviewerStatus`.
- Tests added: `tests/e2e/services-data.spec.ts`, `tests/e2e/services-ib.spec.ts`, `tests/e2e/service-insights.spec.ts`, `tests/e2e/lead-magnet-stub.spec.ts`.
- Local quality gate: `pnpm lint && pnpm typecheck && pnpm build && pnpm test:e2e` passes on the IB and services-data specs. The `home.spec.ts` "Services nav" test is intermittently flaky — separate investigation underway.
- Origin not pushed. `origin/main` is wired to production at `nucleusadvisors.in` (currently "coming soon"); pushing waits for Vijay's explicit go-ahead.
- Open dependencies before merge to production:
  - At least 3 `insightSources` entries flipped from `pending` to `approved` for Investment Banking (the IB page's regulatory-updates panel currently renders an empty-state message).
  - Optional: IB-specific FAQ content (4 Q+A pairs).
  - Pre-existing `home.spec.ts` flake resolved before public launch.

**Next slice (queued):** apply the same primitives to About / Careers / Insights / Contact via separate brainstorm + spec.

## Last Action

Task 13 — project cleanup and docs update. Legacy `apps/web/src/components/service-detail.tsx` (no longer imported anywhere) deleted. `docs/project-tracker.md` updated to reflect the IB slice landing, deferred follow-ups, and open inputs. `docs/superpowers/specs/2026-05-14-services-ib-design.md` and `docs/superpowers/plans/2026-05-14-services-ib.md` committed for historical reference. Final quality gate passed (except the documented `home.spec.ts` nav flake).

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

1. Vijay reviews `/services/investment-banking` in browser and approves or requests changes.
2. Flip at least 3 `insightSources` entries for IB from `pending` to `approved` — the regulatory-updates panel will then show real content.
3. Push to origin when Vijay gives explicit go-ahead, then run deployed quality gate (`PLAYWRIGHT_BASE_URL=https://nucleus-bay.vercel.app pnpm test:e2e`).
4. Begin next slice: About / Careers / Insights / Contact elevated via same primitives.
5. Source the hero Lottie per `docs/home-hero-lottie-spec.md` and drop it at `apps/web/public/lottie/nucleus-hero.json`.
6. Bump `proofAsOf` in `apps/web/src/content/site.ts` when partners re-validate the headcount/clients/deals figures.

## Changed Files In Current Work (IB Slice)

- `HANDOFF.md`
- `docs/project-tracker.md`
- `docs/superpowers/specs/2026-05-14-services-ib-design.md` (new)
- `docs/superpowers/plans/2026-05-14-services-ib.md` (new)
- `apps/web/src/content/site.ts` (service type extended)
- `apps/web/src/content/insights-sources.ts` (new)
- `apps/web/src/app/globals.css` (`.service-v1` scope added)
- `apps/web/src/app/services/investment-banking/page.tsx` (new bespoke route)
- `apps/web/src/app/services/[slug]/page.tsx` (elevated default composition)
- `apps/web/src/app/api/lead-magnet-stub/route.ts` (new stub)
- `apps/web/src/components/services/` (13 section primitives, new directory)
- `apps/web/src/components/services/investment-banking/` (3 bespoke modules, new directory)
- `apps/web/public/brand/soonicorn-ventures.png` (new asset)
- `tests/e2e/services-data.spec.ts` (new)
- `tests/e2e/services-ib.spec.ts` (new)
- `tests/e2e/service-insights.spec.ts` (new)
- `tests/e2e/lead-magnet-stub.spec.ts` (new)
- `apps/web/src/components/service-detail.tsx` (deleted — legacy, was unreferenced)

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
