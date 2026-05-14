# Services — Investment Banking page redesign

**Status:** Draft, pending user review
**Date:** 2026-05-14
**Owner:** Vijay Singh Rathore
**Drafted by:** Claude (brainstorm + CEO-style review)
**Branch:** main
**Related docs:** `docs/content-master.md`, `docs/project-tracker.md`, `docs/claude-onboarding.md`

---

## 1. Context

The home page was redesigned to a premium `home-v3` design system (dark hero with atmospheric layers, framer-motion primitives, Lenis smooth scroll, scoped typography). The 9 service pages still render through `apps/web/src/components/service-detail.tsx`, a single 173-line shared component using the older `subpage-hero` / `check-list` / `timeline` visual language. The visual cliff between `/` and `/services/[slug]` undermines the firm's positioning.

`docs/project-tracker.md` has the active task queued as: *"Apply motion / spacing language to remaining public pages."* This spec covers the first slice — Investment Banking — and establishes the component primitives the other 8 service pages (and About / Careers / Insights / Contact) will reuse.

## 2. Goals

- Close the visual cliff between the home page and `/services/investment-banking`.
- Establish reusable service-page section primitives that make subsequent service pages cheap to elevate.
- Give Investment Banking one signature bespoke moment (the fundraise stages strip) and one secondary craft moment (the artefact stack) so the page reads as the firm's flagship offering.
- Add a curated regulatory-updates panel to the page so the "insights" position is real, not a placeholder.
- Add a Soonicorn Ventures cross-link to the page as in-house-capital proof, with compliance-safe copy and reviewer gating.

## 3. Non-goals

- Bespoke centerpieces for the other 8 service pages. Each gets its own brainstorm before build.
- Phase 1.5 backend (Supabase form storage). Lead-magnet and "notify me" capture stay inert with friendly stub responses, never silently swallowing input.
- Authoring our own articles or reports. The "Planned knowledge bank" sub-section stays in coming-soon state until Phase 2 CMS.
- Deep-linkable stages (`?stage=outreach`), sector strip, service-tinted hero atmosphere — explicitly considered as cherry-picks and deferred to the tracker.
- Renaming the `.home-v3` CSS scope to a more neutral name. Considered but deferred; see §9.

## 4. Decisions log

| # | Decision | Rationale |
|---|---|---|
| D1 | Scope option **B**: shared spine + one bespoke centerpiece per service. | Recommended path from the brainstorm. Avoids forking 9 pages (option C) while letting each service breathe (option A under-delivers). |
| D2 | Implementation approach **B**: decompose `ServiceDetail` into composable section primitives. Each service `page.tsx` composes its own ordering. | Right-sized rewrite. `ServiceDetail` as-is is one-size-fits-all; bolting per-service flavor onto it creates next-quarter cleanup work. Primitives also unblock About / Careers / Insights / Contact at the same baseline. |
| D3 | Review mode **SELECTIVE EXPANSION**. | Hold the agreed baseline; surface expansions as cherry-picks for user opt-in. |
| D4 | IB centerpiece: **Fundraise stages strip** (six stages: Readiness · Modelling · Storytelling · Outreach · Diligence · Close). Scroll-pinned, active stage highlights red. | Most legible to founders. Reuses `§NN` numbering vocabulary from home. |
| D5 | Cherry-pick E1 **in**: Artefact stack as secondary moment (Model · Deck · IM · Diligence pack · Term-sheet support). | Biggest craft moment beyond the centerpiece. Pairs with the existing Deliverables list. |
| D6 | Cherry-picks E2 (deep-linkable stages), E3 (sector strip), E4 (service-tinted hero atmosphere) **out** of this PR. | Each captured in tracker as deferred follow-up. |
| D7 | Insights section content path **D**: hybrid empty-state for our own pieces + curated official-source links. | Honest content posture given no real articles exist yet. The regulatory updates panel delivers substance on day one without violating Rule 4 (no fake content). |
| D8 | Soonicorn Ventures callout **in** on IB page only. Reviewer-gated component, draft copy approved by user, logo from `Soonicorn_Logo_01.png`, external link `https://soonicornventures.com/`. | Cross-sell + proof of serious fund-operations capability. Constrained by SEBI AIF marketing rules — see §13. |

## 5. Architecture & file layout

```
apps/web/src/
├─ app/services/
│  ├─ [slug]/page.tsx                   ← unchanged route; now renders new <ServicePage> composition
│  └─ investment-banking/page.tsx       ← NEW: bespoke composition that overrides [slug] for IB
├─ components/services/
│  ├─ service-hero.tsx                  ← shared primitive
│  ├─ when-to-engage.tsx                ← shared primitive
│  ├─ how-we-help.tsx                   ← shared primitive
│  ├─ process.tsx                       ← shared primitive
│  ├─ deliverables.tsx                  ← shared primitive
│  ├─ proof.tsx                         ← shared primitive (renders null if service.proof absent)
│  ├─ knowledge-bank.tsx                ← shared primitive
│  ├─ faq.tsx                           ← shared primitive
│  ├─ lead-magnet.tsx                   ← shared primitive (inert stub)
│  ├─ related-services.tsx              ← shared primitive
│  ├─ contact-band.tsx                  ← shared primitive
│  ├─ service-insights.tsx              ← NEW shared primitive (hybrid empty-state + official sources)
│  ├─ service-page-default.tsx          ← shared default composition used by [slug] route
│  └─ investment-banking/
│     ├─ fundraise-stages.tsx           ← BESPOKE centerpiece
│     ├─ artefact-stack.tsx             ← BESPOKE secondary moment
│     └─ soonicorn-callout.tsx          ← BESPOKE cross-link
├─ content/
│  ├─ site.ts                           ← MODIFIED: Service type gains optional fields
│  └─ insights-sources.ts               ← NEW: ServiceInsightSource[] data + planned categories
└─ public/brand/
   └─ soonicorn-ventures.png            ← NEW: copied from Vijay's reference folder
```

`apps/web/src/components/service-detail.tsx` is **deleted** at the end of this PR (after `[slug]/page.tsx` is switched to render `<ServicePageDefault service={service} />`).

### Routing precedence

Next.js App Router matches `app/services/investment-banking/page.tsx` before `app/services/[slug]/page.tsx`. The IB slug therefore hits the bespoke composition; the other 8 service slugs continue to hit the default composition via the dynamic `[slug]` segment.

## 6. Component contracts

Every primitive accepts a `service: Service` prop (typed from `content/site.ts`) and is otherwise self-contained — no global stores, no hidden context. All motion uses `framer-motion` primitives already in the bundle. All primitives respect `useReducedMotion` (degraded paths described per component).

### `<ServiceHero service>`

Reuses home-v3 hero language at subpage scale (not full-viewport).

- Eyebrow: `§NN / {service.title}` where NN is a stable per-service ordinal from `site.ts` (Investment Banking = `01`).
- Headline: `<WordReveal>` rendering a punchier 3-word version per service. **IB headline: "Prepare. Position. Close."** (added to `Service` type as `displayHeadline`.)
- Lede: `service.promise`.
- CTAs: primary `Magnetic` button → `/contact?intent={service.slug}`; ghost button → `/services`.
- Background: subtle dotted-grid atmosphere reused from home-v3 (no aurora, no particles — those stay home-only).
- Reduced motion: WordReveal degrades to static text; Magnetic degrades to non-magnetic button.

### `<WhenToEngage service>`

Four bullets from a new optional `service.whenToEngage: string[]` field. Falls back to the four generic bullets currently in `service-detail.tsx` if the field is absent. Each bullet has a `FadeIn` on scroll.

### `<HowWeHelp service>`

Renders `service.howWeHelp` as a list-grid. Uses the home-v3 typography rhythm.

### `<Deliverables service>`

Renders `service.deliverables` as a list-grid. Visually quieter than the artefact stack so the stack reads as "what these documents *feel like* in practice."

### `<Process service>`

Renders the four shared phases (Diagnose · Structure · Execute · Report). Reused from existing data.

### `<Proof service>`

Renders `service.proof` if present, otherwise null. IB has no proof block today.

### `<KnowledgeBank service>`

Renders `service.experts` + a sample-documents teaser. Same content as today, new visual treatment.

### `<Faq service>`

Renders four questions from a new optional `service.faq: { q: string; a: string }[]` field. **If the field is absent or any answer is empty, the component renders the question with a small "Updating soon" eyebrow on the answer slot** — never lorem ipsum, never an empty `<p>`. This is the safe placeholder treatment required by Rule 4.

### `<LeadMagnet service>`

Renders `service.leadMagnet` (which is a string title) as a card with a single-field email form. **Form action:** the form posts to a stub route (`/api/lead-magnet-stub` returning a friendly "We'll be in touch" JSON) — does not silently swallow the email and does not pretend to send a PDF. Once Phase 1.5 backend lands, the stub is replaced with the real Supabase endpoint and the same UI works unchanged.

### `<RelatedServices service>`

Renders three other services as cards. Same logic as today.

### `<ContactBand service>`

Renders a "Talk to Nucleus about {service.title}" card. Same logic as today, new typography.

### `<ServiceInsights service>`

**New shared primitive.** Two-column layout:

- **Left column — Planned knowledge bank.** Reads `plannedCategories.filter(c => c.serviceSlug === service.slug)` from `content/insights-sources.ts`. Renders up to four cards: each shows category title, one-line description, and an "Updating soon" eyebrow. Cards are non-interactive (no `<Link>`, no `onClick`) — they communicate the editorial structure without dead clicks. Below: a single "Notify me when new pieces drop" inline capture that posts to the same `/api/lead-magnet-stub` route with `kind=insights-subscribe`.

- **Right column — Regulatory updates we're tracking.** Reads `insightSources.filter(s => s.serviceSlugs.includes(service.slug) && s.reviewerStatus === 'approved')` from `content/insights-sources.ts`, then sorts by `publishedOn` descending and **caps at the six most recent items**. Renders each as: source badge (SEBI / RBI / MCA / IT / DPIIT / IBBI / ICAI / CBIC), title, published date, one-line `whyItMatters`, and an external link icon. Items with `reviewerStatus: 'pending'` are kept out of render by a discriminated-union narrowing predicate (TypeScript compile-time guarantee). An earlier draft of this spec called for a runtime assertion as well; that was redundant with the narrowing and was removed in commit `3a26ce8`.

If both columns are empty (no approved items, no planned categories), the entire section returns null — no skeletal placeholder ships.

### `<FundraiseStages>` (IB-bespoke)

The centerpiece. Six stages, scroll-pinned on desktop, accordion on mobile.

- **Stages and data** (lives in `apps/web/src/components/services/investment-banking/fundraise-stages.tsx` as a module-local constant, not in `site.ts`, because the data is bespoke):
  1. Readiness — *Nucleus does:* readiness assessment, data room scoping. *Deliverable:* Fundraise readiness report.
  2. Modelling — *Nucleus does:* 3-statement model, sensitivity tabs, base/bull/bear. *Deliverable:* Financial model.
  3. Storytelling — *Nucleus does:* narrative-first deck, IM, sector framing. *Deliverable:* Investor deck + IM.
  4. Outreach — *Nucleus does:* investor mapping, target list, intro coordination. *Deliverable:* Investor target list.
  5. Diligence — *Nucleus does:* DD pack, Q&A management, issue tracker. *Deliverable:* Diligence checklist.
  6. Close — *Nucleus does:* term sheet review, transaction workplan. *Deliverable:* Transaction workplan.

- **Desktop behavior:** Section wrapper has `position: sticky; top: 0; height: 100vh` for the duration of a scroll segment (~6× viewport-height tall internal scroller). Active stage index is derived from `useScroll` + `useTransform`: scroll progress `[0, 1]` divides into six equal bands, so band `n` maps to active stage `n` (e.g., `[0, 0.166]` → stage 0, `[0.166, 0.333]` → stage 1, etc.). Horizontal strip of six tabs at the top of the sticky pane; large side panel below shows the active stage's "what Nucleus does" + "deliverable that exits this stage."

- **Mobile behavior** (`< 640px`): no scroll-pinning. Renders as a stack of six expandable cards; the first card is open by default. Tap to expand others. This avoids iOS Safari sticky-positioning bugs and battery cost.

- **Keyboard navigation:** ARIA `tablist` with six `tab` elements and one `tabpanel`. Arrow keys cycle active stage. Focus ring is visible.

- **Reduced motion:** Strip renders as a six-column grid (no pinning, no scroll-driven highlight). All stages' content visible at once. No JavaScript scroll listener registered.

### `<ArtefactStack>` (IB-bespoke)

Secondary moment. Renders below `<HowWeHelp>`, before `<SoonicornCallout>`.

- **Cards:** five fanned cards labelled Model · Deck · IM · Diligence pack · Term sheet support, in that left-to-right order. Each card carries a 1-line "what this is" line and a small icon (lucide).
- **Desktop interaction:** mouse-over a card brings it to the front with a `framer-motion` spring; siblings shift to make room. Default active card is **Deck (index 1)** — it reads more visually as "the artefact we hand over" than IM, and brings the visually richest card forward by default. Active card on first scroll-into-view: same.
- **Mobile (`< 640px`):** flat vertical list of five cards (no fan, no overlap).
- **Reduced motion:** flat vertical list on all viewports.

### `<SoonicornCallout>` (IB-bespoke)

Cross-link panel. Reviewer-gated component.

- **Render guard:** component returns null in production when `service.crossLink` is undefined OR when `service.crossLink.reviewerStatus !== 'approved'`. In development, it renders with a yellow "DEV ONLY — copy pending reviewer approval" banner.

- **Layout:** two-column compact card inside an `alt-section` band. Left column: Soonicorn wordmark image (`/brand/soonicorn-ventures.png`, 220px wide) + eyebrow + title. Right column: body + CTA button + disclaimer.

- **Copy (approved 2026-05-14):**
  - Eyebrow: `§ In-house capital alongside advisory`
  - Title: `Soonicorn Ventures`
  - Body: `Nucleus is Investment Manager to Soonicorn Angel Trust-I, an early-stage fund focused on seed and pre-Series A startups raising up to US $1M. If your round fits the fund's mandate, you can also explore Soonicorn Ventures directly.`
  - CTA: `Visit Soonicorn Ventures →` linking to `https://soonicornventures.com/` with `target="_blank" rel="noopener noreferrer"`.
  - Disclaimer (always-visible, muted small text): `This is not an offer or solicitation to invest in or raise from any fund or security. Any engagement with Soonicorn Ventures is subject to its fund mandate, stage and sector fit, and independent diligence.`

- **Tracking hook:** outbound `<a>` element carries `data-cross-link="soonicorn"` for future click-through analytics. No analytics fires until Phase 1.5 consent infrastructure exists.

## 7. The IB page composition (final order)

`apps/web/src/app/services/investment-banking/page.tsx`:

```tsx
export default async function InvestmentBankingPage() {
  const service = services.find((s) => s.slug === 'investment-banking');
  if (!service) notFound();

  return (
    <PageShell>
      <main className="home-v3 service-v1">
        <ServiceHero service={service} />
        <WhenToEngage service={service} />
        <FundraiseStages service={service} />
        <HowWeHelp service={service} />
        <ArtefactStack service={service} />
        <SoonicornCallout service={service} />
        <Deliverables service={service} />
        <ServiceInsights service={service} />
        <Process service={service} />
        <Proof service={service} />
        <KnowledgeBank service={service} />
        <Faq service={service} />
        <LeadMagnet service={service} />
        <RelatedServices service={service} />
        <ContactBand service={service} />
      </main>
    </PageShell>
  );
}
```

For the other 8 services, `[slug]/page.tsx` renders `<ServicePageDefault service={service} />` which composes the same primitives **minus** `<FundraiseStages>`, `<ArtefactStack>`, and `<SoonicornCallout>` (those three are IB-only).

## 8. Data model changes

`apps/web/src/content/site.ts`:

```ts
// Existing Service type gains:
export type Service = {
  // ... existing fields
  displayHeadline?: string;          // 3-word punchier hero headline. Falls back to service.title.
  ordinal: string;                   // '01' for IB, '02' for M&A, etc. Powers §NN eyebrows.
  whenToEngage?: string[];           // 4 bullets. Falls back to generic four if absent.
  faq?: { q: string; a: string }[];  // 4 questions. Missing answers render 'Updating soon'.
  crossLink?: ServiceCrossLink;      // Optional cross-link to in-house fund / partner.
};

export type ServiceCrossLink = {
  kind: 'in-house-fund' | 'partner' | 'related-firm';
  brand: string;
  logoPath: string;
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  href: string;
  disclaimer: string;
  reviewerStatus: 'pending' | 'approved';
  reviewerApprovedAt?: string;       // ISO date stamped when status flips to 'approved'.
};
```

The IB entry in `services` gains:
- `displayHeadline: 'Prepare. Position. Close.'`
- `ordinal: '01'`
- `crossLink: { kind: 'in-house-fund', brand: 'Soonicorn Ventures', ... reviewerStatus: 'approved', reviewerApprovedAt: '2026-05-14' }` (approved in chat 2026-05-14).

Other 8 services gain only `ordinal` (`02` through `09`) at this PR's scope. `whenToEngage` and `faq` stay unfilled until partner content lands.

`apps/web/src/content/insights-sources.ts` (new):

```ts
export type ServiceInsightSource = {
  id: string;
  source: 'SEBI' | 'RBI' | 'MCA' | 'IncomeTax' | 'DPIIT' | 'IBBI' | 'ICAI' | 'CBIC';
  title: string;
  publishedOn: string;     // ISO date.
  url: string;             // External.
  whyItMatters: string;
  serviceSlugs: string[];
  reviewerStatus: 'pending' | 'approved';
  reviewerApprovedAt?: string;
};

export type PlannedKnowledgeCategory = {
  serviceSlug: string;
  title: string;
  text: string;
};

export const insightSources: ServiceInsightSource[] = [
  // Seeded with 4 'pending' items for IB. Vijay or a partner flips to 'approved'
  // before merge. See §14.
];

export const plannedCategories: PlannedKnowledgeCategory[] = [
  { serviceSlug: 'investment-banking', title: 'Fundraise readiness',   text: 'Checklists and prep notes for first-time and repeat raisers.' },
  { serviceSlug: 'investment-banking', title: 'Investor mapping',      text: 'How we segment angels, VCs, family offices and strategic capital by stage.' },
  { serviceSlug: 'investment-banking', title: 'Term sheets & structures', text: 'Reading the headline numbers and the clauses founders miss.' },
  { serviceSlug: 'investment-banking', title: 'Sector deep dives',     text: 'What changes when fundraising in fintech, SaaS, consumer, manufacturing.' },
];
```

## 9. CSS scoping strategy

The home-v3 design system is currently scoped to `.home-v3` in `globals.css` (lines 1791–end). Service pages need 80% of those styles (eyebrows, buttons, section headers, typography, motion utility classes) plus a few service-specific overrides (hero scale, section band variants).

**Decision:** the IB page (and the default `<ServicePageDefault>`) wraps `<main>` in `className="home-v3 service-v1"`. This:

- Inherits the entire home-v3 typography and primitive set from `.home-v3` rules.
- Adds a `.service-v1` scope for service-specific overrides (smaller hero, different section rhythm, the new section-primitive layouts).
- Avoids a 5,000+ line CSS refactor in this PR.

The semantic naming smell (`.home-v3` applied to a non-home page) is real. **Deferred follow-up tracker item:** rename `.home-v3` → `.np-base` (or similar neutral name) once all pages are on the new system. Mechanical find-replace across `globals.css` and all home components.

**`.service-v1` CSS additions** (new section at the bottom of `globals.css`):

- `.service-v1` — root container styles (typography baseline override if needed).
- `.service-v1-hero` — subpage hero scale (smaller than full-viewport home hero).
- `.service-v1-stages` — fundraise-stages strip layout (sticky pane, side panel, tab rail).
- `.service-v1-artefact-stack` — fanned card layout.
- `.service-v1-soonicorn` — cross-link panel.
- `.service-v1-insights` — two-column insights layout.
- Mobile breakpoints for all of the above.

Estimated CSS addition: ~400 lines. Old `subpage-hero`, `service-hero`, `check-list`, `timeline`, `list-grid`, `mini-panel`, `linked-panel`, `pill-grid`, `people-grid`, `split-section`, `alt-section` rules **stay in place** for this PR (the About / Careers / Insights / Contact pages still use them). They get deleted in a follow-up PR once all pages are on `.service-v1` or `.about-v1` equivalents.

## 10. Motion & accessibility

- All custom motion uses `framer-motion` primitives already in the dependency tree (`FadeIn`, `WordReveal`, `Magnetic` from `apps/web/src/components/motion-primitives.tsx`). No new motion library.
- All motion respects `useReducedMotion`. Degraded paths described per component.
- All interactive elements (tabs, cards, links) have visible focus rings and meet WCAG 2.1 AA contrast against their backgrounds.
- `<FundraiseStages>` uses ARIA `tablist`/`tab`/`tabpanel` semantics. Arrow keys cycle stages. Active stage is announced via `aria-selected`.
- `<ArtefactStack>` cards are decorative on desktop (fan animation is visual flavor) — actual deliverable content lives in the adjacent `<Deliverables>` list. No focus traps.
- `<SoonicornCallout>` outbound link has a visible focus ring and `aria-label` that includes the destination domain.
- `<ServiceInsights>` external links carry the same `aria-label` pattern.
- Images (Soonicorn logo) have `alt` text. `<Image>` from `next/image` for automatic optimization.

## 11. Responsive design

| Element | Desktop ≥1024px | Tablet 640–1023px | Mobile <640px |
|---|---|---|---|
| ServiceHero | Two-column eyebrow + headline | Stacked | Stacked, smaller headline |
| FundraiseStages | Sticky scroll-pinned, six-tab strip | Horizontal scrollable strip, no pinning | Vertical accordion, no pinning |
| ArtefactStack | Fanned cards, hover-to-front | Stacked with subtle offset | Flat vertical list |
| SoonicornCallout | Two-column | Two-column (tighter) | Stacked |
| ServiceInsights | Two-column | Two-column | Stacked (planned categories first, then sources) |
| All list-grids | 3-column | 2-column | 1-column |

## 12. Migration plan

**Blast radius note:** this PR changes the rendered output of **all 9 service pages**, not only IB. IB picks up the bespoke composition; the other 8 pick up the elevated default composition built from the same primitives. The other 8 are not getting bespoke centerpieces or cross-links — they keep current content, served through the new primitives. Playwright coverage in §15 verifies all 9 still render correctly.

PR sequence (one PR for the whole IB redesign):

1. Add new `Service` type fields and ordinals in `site.ts`. Add new `content/insights-sources.ts`. Update `services[]` entries.
2. Create `apps/web/src/components/services/` directory with the 13 primitive components.
3. Create `apps/web/src/components/services/investment-banking/` with the three bespoke components.
4. Create `apps/web/src/app/services/investment-banking/page.tsx` bespoke composition.
5. Switch `apps/web/src/app/services/[slug]/page.tsx` to render `<ServicePageDefault service={service} />` instead of `<ServiceDetail service={service} />`.
6. Delete `apps/web/src/components/service-detail.tsx`.
7. Copy `Soonicorn_Logo_01.png` (from `/Users/vijay/Desktop/Files/Soonicorn/Soonicorn Logo/`) to `apps/web/public/brand/soonicorn-ventures.png`. **Note:** copy is a manual asset move, not a tracked file commit by the AI; commit log will reference the source.
8. Append `.service-v1-*` CSS scope to `globals.css`.
9. Update `docs/project-tracker.md`: mark service-page primitive task in progress; add deferred follow-ups (E2, E3, E4, `.home-v3` rename); add new tasks for the other 8 service pages.
10. Update `HANDOFF.md` with current state.

All 9 service pages render after the migration. IB picks up the bespoke composition; the other 8 pick up the elevated default. Old visual classes (`subpage-hero` etc.) keep working for non-service pages until those are migrated in follow-up PRs.

## 13. Compliance guardrails

### Soonicorn Ventures callout

- Component refuses to render in production when `reviewerStatus !== 'approved'`. The reviewer in this case is Vijay; approval recorded in this spec dated 2026-05-14 and reflected by `reviewerApprovedAt: '2026-05-14'` in the data.
- Copy contains zero performance claims, zero fund-size claims, zero "we'll fund you" language. Validated against the approved copy in §6.
- Disclaimer is always rendered, non-collapsible, present in the DOM regardless of CSS state.
- Outbound link uses `rel="noopener noreferrer" target="_blank"` to prevent reverse-tabnabbing and to clearly signal the navigation leaves the Nucleus property.
- Component is IB-only. The `Service.crossLink` field stays absent on the other 8 services. Adding cross-links elsewhere requires re-running this approval flow.
- **Tracker item:** "Set up a documented Soonicorn copy review cycle (re-approve quarterly or on regulatory changes)" — added to `docs/project-tracker.md` as a recurring governance task.

### Insights sources

- `insightSources` items with `reviewerStatus: 'pending'` are filtered out of production rendering at the component level **and** at the data layer (an assertion runs in `process.env.NODE_ENV === 'production'` builds that no pending items reach the rendered output).
- Source citations include real publication dates and real URLs. No fabricated SEBI/RBI/MCA notification numbers.
- "Why it matters" lines are factual and reviewer-approved; no editorial commentary that could be construed as legal or tax advice.

### Lead capture (inert stubs)

- Lead-magnet email field posts to `/api/lead-magnet-stub` (new Next.js Route Handler). Stub returns `{ ok: true, message: "We'll be in touch when this content is published." }` and does not write to any store, does not send any email, does not invoke any third party. The user receives a friendly confirmation modal.
- `/api/lead-magnet-stub` writes a structured log line to `console.warn` so the team can see how many submissions happened during the inert window, but **never** writes to a real backend until Phase 1.5 lands.
- "Notify me" capture in `<ServiceInsights>` uses the same stub.

### Content honesty

- No fake client names, no fake testimonials, no fake activity, no fake live regulatory updates.
- `<Proof>` renders null when `service.proof` is empty (IB).
- `<Faq>` shows "Updating soon" in answer slots when partner content is pending — never lorem.

## 14. Open content TBDs (block merge)

- [ ] At least three reviewer-approved entries in `insightSources` tagged with `serviceSlugs: ['investment-banking']`. Without these the right column of `<ServiceInsights>` will be empty in production (component returns null cleanly, no broken layout — but the page would lack the substance promised in this spec).
- [ ] Final IB-specific FAQ content (four Q+A pairs). Acceptable to ship with `service.faq` absent — `<Faq>` falls back to "Updating soon" answer slots — but lands without partner sign-off feels thin.
- [ ] Soonicorn logo file physically copied to `apps/web/public/brand/soonicorn-ventures.png` (the copy itself is an implementation step, but the *source file at the recorded path* must still exist when implementation begins).
- [ ] Soonicorn copy is approved by Vijay as of 2026-05-14 (recorded in this spec). No further sign-off needed at merge time.

## 15. Testing strategy

### Local quality gate (must pass before merge)

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm test:e2e
```

### Playwright additions (`apps/web/tests/`)

- `services-ib.spec.ts` — visits `/services/investment-banking`, asserts:
  - hero headline renders;
  - all six fundraise stages are present in the DOM;
  - artefact stack is present;
  - Soonicorn callout renders and outbound link href === `https://soonicornventures.com/`;
  - Soonicorn disclaimer is in the DOM;
  - lead-magnet form posts to `/api/lead-magnet-stub` and shows friendly confirmation;
  - all internal nav links resolve (no 404s);
  - mobile viewport (375px) renders without horizontal scroll.
- `services-default.spec.ts` — visits each of the other 8 service slugs, asserts the default composition renders (no FundraiseStages, no ArtefactStack, no SoonicornCallout).
- `service-insights-reviewer-gate.spec.ts` — confirms that an item with `reviewerStatus: 'pending'` does not appear in the production-built page output.

### Visual QA

- Desktop, tablet, mobile screenshots of `/services/investment-banking`.
- Reduced-motion screenshot.
- Side-by-side with the home page (visual cliff check).

### Deployed gate

```bash
PLAYWRIGHT_BASE_URL=https://nucleus-bay.vercel.app pnpm test:e2e
```

## 16. NOT in scope (explicit)

| Item | Why not | Where it lives |
|---|---|---|
| Deep-linkable stages (`?stage=outreach`) | Cherry-pick E2, deferred. | `docs/project-tracker.md` new task |
| Sector strip below hero | Cherry-pick E3, deferred. Needs approved sector list. | `docs/project-tracker.md` new task |
| Service-tinted hero atmosphere per service | Cherry-pick E4, deferred. | `docs/project-tracker.md` new task |
| Bespoke centerpieces for the other 8 services | Each gets its own brainstorm + spec. | `docs/project-tracker.md` new task per service |
| Authoring our own articles or reports | Phase 2 CMS work. | Existing tracker phase 2 |
| Real backend for lead-magnet / notify-me | Phase 1.5 backend work. | Existing tracker phase 1.5 |
| Renaming `.home-v3` to a neutral name | Mechanical refactor; not blocking. | `docs/project-tracker.md` new task |
| About / Careers / Insights / Contact elevation | Next slice. Will reuse the same primitives. | Existing tracker active task |

## 17. Tracker & handoff updates

`docs/project-tracker.md`:

- Update Phase 1 → Visual And Asset Tasks: mark "Apply motion / spacing language to remaining public pages" still `[~]` with a note that the services slice is being executed.
- Add new tasks under Phase 1:
  - `[ ]` IB service page bespoke centerpieces — Investment Banking (this PR).
  - `[ ]` Service-page bespoke centerpieces — remaining 8 services (one per service).
  - `[ ]` Rename `.home-v3` CSS scope to a neutral name (mechanical refactor).
  - `[ ]` Deep-linkable stages on IB centerpiece (E2 follow-up).
  - `[ ]` Sector strip on service pages (E3 follow-up, needs approved sector list).
  - `[ ]` Service-tinted hero atmosphere per service (E4 follow-up).
  - `[ ]` Source SVG of Soonicorn Ventures wordmark (currently PNG).
  - `[ ]` IB-specific FAQ content (4 Q+A pairs, needs partner sign-off).
  - `[ ]` Insights sources data: maintain quarterly review of approved items.
  - `[ ]` Recurring governance: Soonicorn callout copy re-approval cycle.
- Update Open Inputs Needed From Vijay/Team:
  - Add: `[!]` Three reviewer-approved insightSources entries for IB (blocks shipping the right column of `<ServiceInsights>` as substantive).

`HANDOFF.md`:

- Replace the "active task" block with: services slice — IB first. Reference this spec path. Note that scope/approach/centerpiece/cherry-picks are locked.

## 18. Acceptance criteria

This PR is done when:

1. `/services/investment-banking` renders the bespoke composition with all 15 sections in §7 order, on desktop, tablet, and mobile.
2. The other 8 service slugs render the default composition with the elevated typography and motion — visibly aligned with the home page, no `subpage-hero` styling left.
3. `<FundraiseStages>` works on desktop (scroll-pinned), tablet (horizontal scroll), and mobile (accordion).
4. `<ArtefactStack>` works on desktop (fanned, hover) and mobile (flat list).
5. `<SoonicornCallout>` renders on IB only, with approved copy, working outbound link, and the disclaimer always present.
6. `<ServiceInsights>` renders the planned-categories column always (4 cards for IB) and the regulatory-sources column only when ≥1 approved item exists.
7. Lead-magnet and notify-me forms post to `/api/lead-magnet-stub` and surface a friendly confirmation. No silent swallowing.
8. `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test:e2e` all pass.
9. Vercel preview tested in browser (desktop + mobile responsive emulation).
10. `docs/project-tracker.md` and `HANDOFF.md` updated.
11. Reduced-motion path verified manually (Mac System Settings → Accessibility → Display → Reduce motion).
12. Old `apps/web/src/components/service-detail.tsx` deleted.
13. Tracker captures all deferred items from §16.

## 19. Self-review results (2026-05-14)

Ran the four spec-review checks (placeholder scan, internal consistency, scope, ambiguity) before handing the spec for user approval. Findings fixed inline:

1. **Ambiguity — fundraise-stages scroll mapping.** Original draft said "active stage index is derived from useScroll + useTransform" without specifying the mapping. Tightened in §6 to: six equal scroll-progress bands, band `n` → stage `n`.
2. **Inconsistency — artefact-stack default active card.** Original draft said "middle one (Deck)" but the list of five cards (Model · Deck · IM · Diligence pack · Term sheet support) puts Deck at index 1, not middle. Resolved in §6 by stating explicitly: default active card is Deck (index 1), with the rationale that Deck reads more visually than IM and brings the richest card forward.
3. **Ambiguity — insights right-column cap.** Original draft said "renders up to six items" without specifying ordering or what happens if more than six approved items exist. Tightened in §6 to: sort by `publishedOn` descending, cap at six.
4. **Scope clarity — blast radius.** The original migration plan switched `[slug]/page.tsx` to render `<ServicePageDefault>` without flagging that this changes all 9 service pages. Added an explicit "Blast radius note" at the top of §12, with reference to the Playwright coverage in §15 that protects the other 8.

No remaining placeholders, no contradictions, scope holds. Spec is ready for user review.
