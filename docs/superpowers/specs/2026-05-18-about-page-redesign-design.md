# About Us page redesign

Date: 2026-05-18
Status: Design — awaiting partner approval
Author: Design brainstorm with Vijay

## Goal

Rebuild `/about` as a long-form firm narrative that reads top-to-bottom as one story:
**credibility → philosophy → voice → scope → people → segments → reach → CTA.**

This is the page partners will present in pitches, prospects will read before
clicking Contact, and candidates will scan when evaluating fit. Today the
page is a flat list of factual blocks with no personality and several blocks
that duplicate the homepage. After the redesign the homepage gets shorter
(11 sections → 8) and the About page becomes the firm's premium narrative
surface (8 flat blocks → 9 purposeful blocks).

## Audience and tone

- **Audience**: senior prospects, partners running pitches, candidates,
  journalists.
- **Tone**: editorial, partner-led, quietly confident. No clever marketing
  voice. No spotlight effects, gradient borders, or "Featured" hero cards
  (deliberately removed earlier in the session — same aesthetic discipline
  applies here).
- **No fake content** (CLAUDE.md Rule 4): only real partners, real numbers,
  real offices. No stock imagery. Final office addresses remain partner-
  approved before they go live.

## Migrations summary

Three components move from Home to About (renamed to neutral `firm/*`
paths). One additional component is **dropped from Home entirely** with no
About migration — its lead-capture flow is duplicated by the per-service
`ResourceDeck` already on every service page.

| Component (today) | Becomes | Used on |
|---|---|---|
| `components/home/lifecycle.tsx` → `HomeLifecycle` | `components/firm/lifecycle.tsx` → `FirmLifecycle` | About only |
| `components/home/moments-marquee.tsx` → `HomeMomentsMarquee` | `components/firm/moments.tsx` → `FirmMoments` | About only |
| `components/home/archetypes.tsx` → `HomeBuiltFor` | `components/firm/who-we-serve.tsx` → `WhoWeServe` | About only (was duplicated on both) |
| `components/home/deliverables.tsx` → `HomeDeliverables` | **Deleted** | Neither — per-service `ResourceDeck` covers the same flow |

The 9 homepage-specific resource entries created earlier in
`apps/web/src/content/resources.ts` (slugs prefixed `home-`) are deleted
in the same change. The per-service `ib-stage-*` samples and industry
reports remain.

The homepage drops the four import + render pairs and goes from 11 sections
to **7**:

```
HomeHero · HomeOrbitalServices · HomeProofStrip · HomeDepth ·
HomeTeaserRow · HomeTestimonials · HomeClosingCta
```

The About page goes from 8 sections to **9**, every one purposeful.

## About page section structure

```
1. Hero                          (rebuilt — editorial manifesto)
2. Proof bar                     (existing — kept)
3. Philosophy                    (evolved from "Firm overview")
4. Moments                       (migrated — FirmMoments)
5. Lifecycle                     (migrated — FirmLifecycle)
6. Leadership                    (centerpiece — reuses TeamPageCard)
7. Who we serve                  (existing — now via WhoWeServe component)
8. Offices                       (rebuilt — India map with office dots)
9. Contact band                  (existing — kept)
```

The current "Advisory universe" block (6-item list) is **dropped** —
Lifecycle (#5) covers the same ground with more narrative.

### 1. Hero — editorial manifesto

Big serif headline, one supporting paragraph, one thin proof line.

Replaces the current `subpage-hero` ("Specialised advisory for critical
business decisions"). The current copy is bland and the layout is the same
generic subpage hero used on every other route.

**Proposed copy** (partner-edit before launch):
- Eyebrow: `About`
- Headline (serif, `clamp(2.2rem, 4.5vw, 3.4rem)`): `We're built for the decisions that matter.`
- Supporting paragraph: `Nucleus Advisors is a senior-led firm covering audit, tax, transactions and advisory. We work with founders before the round, with boards through the listing, and with families across generations — connecting transaction work, controls, compliance and reporting as one decision surface.`
- Thin proof line: `8 partners · 90+ team · 130+ clients · 50+ deals advised · 5 offices across India.`

Layout: centered, max-width ~860px, generous vertical padding (`clamp(4rem, 8vw, 7rem)` top/bottom). No background image — typography carries the moment. The thin proof line uses the same hairline-divider treatment as the `home-v3` section dividers.

### 2. Proof bar

Reuses the existing `<ProofBar />` component unchanged. Sits immediately
below the hero. Numbers: 8 partners · 90+ team · 130+ clients · 50+ deals
· 5 offices · 100+ years combined experience.

### 3. Philosophy

Evolves the current "Firm overview" block. Today it reads as a generic
paragraph; the redesign frames it as an editorial pull-quote.

The framing is **specialised partners, coordinated across disciplines** —
not a single generalist running everything. Each Nucleus discipline has
its own partner; the firm's value is the coordination layer between them.

**Proposed copy** (partner-edit before launch):
- Eyebrow: `Philosophy`
- Pull-quote (serif, large): `We don't put a generalist on a specialist's work.`
- Supporting paragraph: `Each discipline at Nucleus has its own partner. The audit partner runs your audit. The tax partner runs your tax. The deal partner runs your raise. What changes at Nucleus is that they coordinate — the audit partner reads the deal memo, the tax partner sits in the diligence call, the fundraise gets built on a clean compliance base. The right partner for the work, every time.`

Visual: a wide quote block centered on the page, no card chrome, with a
small red rule above the eyebrow. No card backgrounds — the typography is
the design. The pull-quote line uses a `clamp(1.7rem, 3.2vw, 2.4rem)`
serif scale; the supporting paragraph uses the standard body type.

### 4. Moments — FirmMoments

Migrated kinetic-typography rotator. Original eyebrow / headline are kept:
- Eyebrow: `When clients engage`
- Headline: `The decision moments where Nucleus becomes useful.`

Sits between credibility (#2-3) and scope (#5) as a deliberate mood break.
No behavior changes from the current `HomeMomentsMarquee` — just a file
rename and re-import.

### 5. Lifecycle — FirmLifecycle

Migrated. Original eyebrow / headline are kept:
- Eyebrow: `Business lifecycle`
- Headline: `The moments where outside judgement matters.`

Shows the incorporation → first finance stack → fundraising → growth →
transactions → listing arc. No behavior changes — file rename and re-import
only.

### 6. Leadership — page centerpiece

**Reuses the existing `TeamPageCard` + `TeamProfileModal` components** from
`apps/web/src/components/team/` so the visual language is consistent
across `/about` and `/team`. Cards render `headshotSrc` (real partner
photos already on disk in `apps/web/public/team/`), expertise pills,
LinkedIn + Email actions, and open the profile modal on click.

**Scope**: leadership group only — the 6 partners where `group === 'leadership'`.
The executive team (9 senior practitioners) stays on `/team`.

**Layout**:
- Eyebrow: `●01 Leadership` (matches the `/team` section convention)
- Heading: `Partners who run the mandates end-to-end.`
- Sub: `Each Nucleus engagement has a named partner accountable for it. These are theirs.`
- Grid: same `team-page-grid` class used on `/team` — three columns on
  desktop, two on tablet, single column on mobile.
- Footer: small CTA — `Meet the full team →` linking to `/team` (where
  the executive team and deeper bios live).

### 7. Who we serve — WhoWeServe

Replaces the inline `clientSegments` JSX block on About with the renamed
component. Behavior identical to today's two-column "Operating businesses
| Financial institutions" layout we just shipped. Includes the hairline
divider, the 9 segments, and the subtle hover-tint on each item.

Reason for the rename + extract: the homepage version is being removed,
so the component should live in `components/firm/` rather than
`components/home/`.

### 8. Offices — India map with office dots

Replaces the current 5-city flat list. Stylized SVG outline of India with
five small red dots marking office cities. To the right (or below on
mobile, ≤760px), the city names list with subtle hover — hovering a city
pulses the matching dot on the map.

**Implementation notes**:
- SVG outline of India. Hand-authored, ~50 path commands, single fill
  using `var(--site-line)` so it blends with the page. Target < 8KB to keep
  the bundle lean. No third-party country-data library.
- Five dot positions hard-coded by approximate lat/long offsets (Gurugram,
  Bangalore, Jaipur, Faridabad, Bhatinda).
- No addresses on the map — final addresses remain pending partner
  confirmation (project tracker open input #6).
- Hover interaction is CSS-only via sibling selectors: `.office-city:hover
  ~ svg #dot-{slug}` adjusts the dot's `r` and `fill` opacity.
- Reduced-motion: dot pulse animation is removed under
  `prefers-reduced-motion: reduce`.

**Layout** at ≥960px:
```
┌──────────────────────────────┬──────────────────────┐
│                              │  Gurugram            │
│       [India SVG map]        │  Bangalore           │
│       with five red dots     │  Jaipur              │
│                              │  Faridabad           │
│                              │  Bhatinda            │
└──────────────────────────────┴──────────────────────┘
```

At ≤760px, the city list stacks below the map.

### 9. Contact band

Reuses the existing `<ContactBand />` component unchanged.

## File changes summary

### New files
- `apps/web/src/components/firm/lifecycle.tsx` (renamed from `home/lifecycle.tsx`)
- `apps/web/src/components/firm/moments.tsx` (renamed from `home/moments-marquee.tsx`)
- `apps/web/src/components/firm/who-we-serve.tsx` (renamed from `home/archetypes.tsx`)
- `apps/web/src/components/about/about-hero.tsx`
- `apps/web/src/components/about/philosophy.tsx`
- `apps/web/src/components/about/offices-map.tsx`
- `apps/web/public/brand/india-outline.svg`

### Modified files
- `apps/web/src/app/about/page.tsx` — full rewrite using the 9-section structure
- `apps/web/src/app/page.tsx` — remove 4 imports + 4 render slots (lifecycle, moments, who-we-serve, deliverables)
- `apps/web/src/content/resources.ts` — delete the 9 `home-*` resource entries added earlier this session
- `apps/web/src/app/globals.css` — add `.about-hero-*`, `.about-philosophy-*`, `.about-offices-*` styles; delete the `.deliverables-grid` / `.deliverables-card*` block that is no longer used after Deliverables is removed. **Existing CSS class names for migrated components are not renamed** — only file paths and React component exports change. Classes like `.home-v3-builtfor`, `.builtfor-columns`, `.home-v3-lifecycle-*`, `.home-v3-moments-*` stay as-is so the existing CSS continues to apply.

### Deleted files
- `apps/web/src/components/home/lifecycle.tsx` (renamed to `firm/lifecycle.tsx`)
- `apps/web/src/components/home/moments-marquee.tsx` (renamed to `firm/moments.tsx`)
- `apps/web/src/components/home/archetypes.tsx` (renamed to `firm/who-we-serve.tsx`)
- `apps/web/src/components/home/deliverables.tsx` (dropped — no replacement; service-page ResourceDeck handles the flow)

The CSS classes inside the moved components keep their existing names so
shared visual rhythm is preserved. We are renaming the **file paths and
the exported React component**, not the CSS namespace.

## Dependencies and open inputs

- **Final About hero copy** — proposed in §1. Partner edit before push to origin.
- **Final philosophy copy** — proposed in §3. Partner edit before push to origin.
- **Office addresses** — already an open input on the project tracker; the
  map design intentionally omits them to avoid fake content.
- **Vercel push** — gated on Vijay's explicit consent per the memory rule
  (origin/main is "coming soon").

## Out of scope

- Adding new partners or executive team members (`team.ts` stays as-is).
- New office photos or city skyline imagery.
- A standalone `/team/[slug]` route (project tracker lists this as a
  separate task; the modal stays for now).
- Phase 1.5 backend wiring for contact forms.

## Acceptance criteria

- `/about` renders the 9-section structure in the order above.
- The hero is no longer the generic `subpage-hero` shell — it has its own
  dedicated component with editorial typography.
- Leadership shows exactly 6 partner cards using the existing
  `TeamPageCard` component; clicking any card opens `TeamProfileModal`
  with the partner's full bio.
- The `Meet the full team →` footer links to `/team`.
- The India map renders 5 dots; hovering a city in the list highlights
  the matching dot on the map.
- The homepage (`/`) renders 7 sections, with Lifecycle, MomentsMarquee,
  BuiltFor and Deliverables removed.
- The 9 `home-*` resource entries are gone from `resources.ts`; posting
  one of those slugs to `/api/resources/request` returns a 404.
- `pnpm --filter web exec tsc --noEmit` returns clean.
- Visiting `/` and `/about` produces no console errors and no duplicate
  content between the two pages.
- Mobile viewport (≤640px) renders cleanly for every new About section.
