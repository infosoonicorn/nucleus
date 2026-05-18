# About Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `/about` as a 9-section long-form firm narrative and shrink the homepage from 11 sections to 7 by migrating Lifecycle / Moments / Built-for to About and dropping Deliverables entirely.

**Architecture:** Three homepage components are renamed and moved to `components/firm/*` so the file paths reflect that they're firm-narrative blocks. One component (Deliverables) is deleted along with its 9 `home-*` resource entries; per-service `ResourceDeck` covers the same flow. About gains three new components (`AboutHero`, `Philosophy`, `OfficesMap`) and re-renders `TeamPageCard` for leadership so the visual language matches `/team`.

**Tech Stack:** Next.js 16 (Webpack dev), React 19, TypeScript, lucide-react icons, framer-motion (already used inside the migrated components), pnpm workspace. Verification via `curl` against the running dev server on port 3000 plus `pnpm --filter web exec tsc --noEmit`.

---

## File structure

### New files
- `apps/web/src/components/firm/lifecycle.tsx` — `FirmLifecycle` (renamed copy of `home/lifecycle.tsx`)
- `apps/web/src/components/firm/moments.tsx` — `FirmMoments` (renamed copy of `home/moments-marquee.tsx`)
- `apps/web/src/components/firm/who-we-serve.tsx` — `WhoWeServe` (renamed copy of `home/archetypes.tsx`)
- `apps/web/src/components/about/about-hero.tsx` — `AboutHero` (new editorial manifesto hero)
- `apps/web/src/components/about/philosophy.tsx` — `AboutPhilosophy` (new pull-quote section)
- `apps/web/src/components/about/offices-map.tsx` — `AboutOfficesMap` (inline India SVG path + city list — no external SVG file; the spec mentioned a separate `india-outline.svg` but the plan inlines the path inside the component for simpler rendering and one fewer file to maintain)

### Modified files
- `apps/web/src/app/page.tsx` — remove 4 imports + 4 render slots (lifecycle, moments, built-for, deliverables)
- `apps/web/src/app/about/page.tsx` — full rewrite using 9-section structure
- `apps/web/src/content/resources.ts` — delete the 9 `home-*` resource entries
- `apps/web/src/app/globals.css` — delete `.deliverables-grid` / `.deliverables-card-*` block; add `.about-hero-*`, `.about-philosophy-*`, `.about-offices-*` styles

### Deleted files
- `apps/web/src/components/home/lifecycle.tsx`
- `apps/web/src/components/home/moments-marquee.tsx`
- `apps/web/src/components/home/archetypes.tsx`
- `apps/web/src/components/home/deliverables.tsx`

### Shared classes that DO NOT change
The CSS class names inside the migrated components (`.home-v3-lifecycle-*`, `.home-v3-moments-*`, `.home-v3-builtfor`, `.builtfor-*`) stay as-is so the existing CSS continues to apply. Only file paths and React export names change.

---

## Task 1: Migrate Lifecycle to `components/firm/`

**Files:**
- Create: `apps/web/src/components/firm/lifecycle.tsx`
- Modify: `apps/web/src/app/page.tsx`
- Delete: `apps/web/src/components/home/lifecycle.tsx`

- [ ] **Step 1: Define acceptance check**

After this task, `curl -s http://localhost:3000/ | grep -c "home-v3-lifecycle"` must return `0` (lifecycle removed from Home). The component file moves to the new path and exports `FirmLifecycle`. No other rendered page changes.

- [ ] **Step 2: Create the `firm/` directory and copy the file**

Run from repo root:

```bash
mkdir -p apps/web/src/components/firm
cp apps/web/src/components/home/lifecycle.tsx apps/web/src/components/firm/lifecycle.tsx
```

- [ ] **Step 3: Rename the export in the new file**

Edit `apps/web/src/components/firm/lifecycle.tsx`:

```diff
-export function HomeLifecycle() {
+export function FirmLifecycle() {
```

No other changes to the file. All internal CSS class names and behavior stay identical.

- [ ] **Step 4: Drop the import + render slot from the homepage**

Edit `apps/web/src/app/page.tsx`:

```diff
-import { HomeLifecycle } from '@/components/home/lifecycle';
```

```diff
         <HomeProofStrip />
-        <HomeLifecycle />
         <HomeDeliverables />
```

- [ ] **Step 5: Delete the old file**

Run:

```bash
rm apps/web/src/components/home/lifecycle.tsx
```

- [ ] **Step 6: Verify**

```bash
pnpm --filter web exec tsc --noEmit
curl -sf http://localhost:3000/ -o /dev/null && echo "HTTP OK"
curl -s http://localhost:3000/ | grep -c "home-v3-lifecycle"
```

Expected: `tsc` returns no output (clean). `HTTP OK` prints. The `grep -c` returns `0`.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/components/firm/lifecycle.tsx apps/web/src/components/home/lifecycle.tsx apps/web/src/app/page.tsx
git commit -m "$(cat <<'EOF'
refactor(home,firm): migrate Lifecycle to components/firm/

Renames HomeLifecycle → FirmLifecycle and moves the file from
components/home/ to components/firm/. Removes the section from the
homepage; About will pick it up in a later task. CSS class names
unchanged so the existing styles continue to apply.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 2: Migrate Moments to `components/firm/`

**Files:**
- Create: `apps/web/src/components/firm/moments.tsx`
- Modify: `apps/web/src/app/page.tsx`
- Delete: `apps/web/src/components/home/moments-marquee.tsx`

- [ ] **Step 1: Define acceptance check**

After this task, `curl -s http://localhost:3000/ | grep -c "home-v3-moments"` must return `0`. The component file moves to the new path and exports `FirmMoments`.

- [ ] **Step 2: Copy the file**

```bash
cp apps/web/src/components/home/moments-marquee.tsx apps/web/src/components/firm/moments.tsx
```

- [ ] **Step 3: Rename the export**

Edit `apps/web/src/components/firm/moments.tsx`:

```diff
-export function HomeMomentsMarquee() {
+export function FirmMoments() {
```

- [ ] **Step 4: Drop the import + render slot from the homepage**

Edit `apps/web/src/app/page.tsx`:

```diff
-import { HomeMomentsMarquee } from '@/components/home/moments-marquee';
```

```diff
         <HomeDeliverables />
-        <HomeMomentsMarquee />
         <HomeDepth />
```

- [ ] **Step 5: Delete the old file**

```bash
rm apps/web/src/components/home/moments-marquee.tsx
```

- [ ] **Step 6: Verify**

```bash
pnpm --filter web exec tsc --noEmit
curl -sf http://localhost:3000/ -o /dev/null && echo "HTTP OK"
curl -s http://localhost:3000/ | grep -c "home-v3-moments"
```

Expected: `tsc` clean, `HTTP OK`, grep returns `0`.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/components/firm/moments.tsx apps/web/src/components/home/moments-marquee.tsx apps/web/src/app/page.tsx
git commit -m "$(cat <<'EOF'
refactor(home,firm): migrate Moments marquee to components/firm/

Renames HomeMomentsMarquee → FirmMoments and moves the file from
components/home/ to components/firm/. Removes the section from the
homepage; About will pick it up in a later task.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 3: Migrate Built-for / Who-we-serve to `components/firm/`

**Files:**
- Create: `apps/web/src/components/firm/who-we-serve.tsx`
- Modify: `apps/web/src/app/page.tsx`
- Delete: `apps/web/src/components/home/archetypes.tsx`

- [ ] **Step 1: Define acceptance check**

After this task, the homepage HTML no longer contains the `home-v3-builtfor` section — `curl -s http://localhost:3000/ | grep -c "home-v3-builtfor"` returns `0`. The About page still renders its inline `clientSegments` block (that gets replaced in Task 7).

- [ ] **Step 2: Copy the file**

```bash
cp apps/web/src/components/home/archetypes.tsx apps/web/src/components/firm/who-we-serve.tsx
```

- [ ] **Step 3: Rename the export**

Edit `apps/web/src/components/firm/who-we-serve.tsx`:

```diff
-export function HomeBuiltFor() {
+export function WhoWeServe() {
```

- [ ] **Step 4: Drop the import + render slot from the homepage**

Edit `apps/web/src/app/page.tsx`:

```diff
-import { HomeBuiltFor } from '@/components/home/archetypes';
```

```diff
         <HomeDepth />
-        <HomeBuiltFor />
         <HomeTeaserRow />
```

- [ ] **Step 5: Delete the old file**

```bash
rm apps/web/src/components/home/archetypes.tsx
```

- [ ] **Step 6: Verify**

```bash
pnpm --filter web exec tsc --noEmit
curl -sf http://localhost:3000/ -o /dev/null && echo "HTTP OK"
curl -s http://localhost:3000/ | grep -c "home-v3-builtfor"
```

Expected: `tsc` clean, `HTTP OK`, grep returns `0`.

- [ ] **Step 7: Commit**

```bash
git add apps/web/src/components/firm/who-we-serve.tsx apps/web/src/components/home/archetypes.tsx apps/web/src/app/page.tsx
git commit -m "$(cat <<'EOF'
refactor(home,firm): migrate Built-for/WhoWeServe to components/firm/

Renames HomeBuiltFor → WhoWeServe and moves the file from
components/home/archetypes.tsx to components/firm/who-we-serve.tsx.
Removes the section from the homepage; About will swap its inline
JSX for this component in a later task.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 4: Drop HomeDeliverables entirely

**Files:**
- Modify: `apps/web/src/app/page.tsx`
- Modify: `apps/web/src/content/resources.ts`
- Modify: `apps/web/src/app/globals.css`
- Delete: `apps/web/src/components/home/deliverables.tsx`

- [ ] **Step 1: Define acceptance check**

After this task: the homepage HTML contains zero `deliverables-card` or `deliverables-grid` markers. The 9 homepage-specific resource slugs (those starting with `home-`) are gone from `resources.ts`. Posting one of those slugs to `/api/resources/request` returns 404.

- [ ] **Step 2: Drop the import + render slot from the homepage**

Edit `apps/web/src/app/page.tsx`:

```diff
-import { HomeDeliverables } from '@/components/home/deliverables';
```

```diff
         <HomeProofStrip />
-        <HomeDeliverables />
         <HomeDepth />
```

- [ ] **Step 3: Delete the component file**

```bash
rm apps/web/src/components/home/deliverables.tsx
```

- [ ] **Step 4: Delete the 9 `home-*` resource entries**

Edit `apps/web/src/content/resources.ts`. Remove the block introduced earlier this session — the comment-led region that starts with `/* ── Homepage "What we leave behind" artifacts ──` and ends with the closing `},` of the `home-aif-setup-workplan` entry. Net effect: the file's `downloadables` array drops 9 entries.

- [ ] **Step 5: Delete the `.deliverables-*` CSS block**

Edit `apps/web/src/app/globals.css`. Remove the entire block starting at `.deliverables-grid {` and ending after the `@media (prefers-reduced-motion: reduce)` block that targets `.deliverables-card`. The block was introduced earlier this session, sits between the deliverables section header CSS and the `/* ---------- moments` marker, and is ~142 lines.

- [ ] **Step 6: Verify the homepage no longer renders Deliverables**

```bash
pnpm --filter web exec tsc --noEmit
curl -sf http://localhost:3000/ -o /dev/null && echo "HTTP OK"
curl -s http://localhost:3000/ | grep -c "deliverables-card\|deliverables-grid"
```

Expected: `tsc` clean, `HTTP OK`, grep returns `0`.

- [ ] **Step 7: Verify the API now 404s on the dropped slugs**

```bash
curl -s -X POST http://localhost:3000/api/resources/request \
  -H "content-type: application/json" \
  -d '{"resourceSlug":"home-fundraise-readiness-report","name":"Test","email":"t@x.com","company":"Acme"}'
```

Expected response (JSON):

```json
{"ok":false,"message":"Unknown resource."}
```

with HTTP status 404.

- [ ] **Step 8: Commit**

```bash
git add apps/web/src/app/page.tsx apps/web/src/components/home/deliverables.tsx apps/web/src/content/resources.ts apps/web/src/app/globals.css
git commit -m "$(cat <<'EOF'
refactor(home): drop HomeDeliverables section and home-* resources

Removes the homepage 3×3 "What we leave behind" grid and the 9 home-*
resource entries that backed it. Per-service ResourceDeck on each
service page already covers the same lead-capture flow with the same
modal pattern, so the homepage centralization isn't earning its space.
Also drops the .deliverables-grid / .deliverables-card-* CSS block
that became dead.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 5: Build the new `AboutHero` component

**Files:**
- Create: `apps/web/src/components/about/about-hero.tsx`
- Modify: `apps/web/src/app/globals.css` (append new `.about-hero-*` styles)

- [ ] **Step 1: Define acceptance check**

After this task, the component exists, type-checks clean, and the new CSS lives in `globals.css`. The component is not yet rendered anywhere (that happens in Task 8). The CSS bundle served from `/_next/static/css/app/layout.css?v=...` must contain `.about-hero` and `.about-hero-headline` rules.

- [ ] **Step 2: Create the component directory and file**

```bash
mkdir -p apps/web/src/components/about
```

Write `apps/web/src/components/about/about-hero.tsx`:

```tsx
import { Reveal } from '@/components/motion-primitives';

export function AboutHero() {
  return (
    <section className="about-hero" aria-label="About Nucleus Advisors">
      <Reveal>
        <div className="about-hero-inner">
          <p className="about-hero-eyebrow">About</p>
          <h1 className="about-hero-headline">
            We&rsquo;re built for the decisions that matter.
          </h1>
          <p className="about-hero-lede">
            Nucleus Advisors is a senior-led firm covering audit, tax,
            transactions and advisory. We work with founders before the
            round, with boards through the listing, and with families across
            generations — connecting transaction work, controls, compliance
            and reporting as one decision surface.
          </p>
          <p className="about-hero-proof">
            <span>8 partners</span>
            <span aria-hidden="true">·</span>
            <span>90+ team</span>
            <span aria-hidden="true">·</span>
            <span>130+ clients</span>
            <span aria-hidden="true">·</span>
            <span>50+ deals advised</span>
            <span aria-hidden="true">·</span>
            <span>5 offices across India</span>
          </p>
        </div>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 3: Append the new CSS to `globals.css`**

Append the following block at the end of `apps/web/src/app/globals.css`, just before the closing of the file (after the last existing rule, before any final blank lines):

```css
/* ============================================================
   About page — editorial manifesto hero + supporting sections
   ============================================================ */

.about-hero {
  background: var(--v3-paper, #f7f5ef);
  border-bottom: 1px solid var(--v3-line, #e1dbce);
  padding: clamp(4rem, 8vw, 7rem) clamp(1rem, 4vw, 3rem);
  position: relative;
}

.about-hero-inner {
  margin: 0 auto;
  max-width: 860px;
  text-align: center;
}

.about-hero-eyebrow {
  color: var(--v3-red, #dd1017);
  font-size: 0.78rem;
  font-weight: 860;
  letter-spacing: 0.16em;
  margin: 0 0 1.5rem;
  text-transform: uppercase;
}

.about-hero-headline {
  color: var(--v3-ink, #111827);
  font-family: var(--v3-serif, Georgia, 'Times New Roman', serif);
  font-size: clamp(2.2rem, 4.5vw, 3.4rem);
  font-weight: 720;
  letter-spacing: -0.018em;
  line-height: 1.1;
  margin: 0 auto 1.4rem;
  max-width: 720px;
}

.about-hero-lede {
  color: var(--v3-ink-muted, #5d6472);
  font-size: clamp(1.04rem, 1.6vw, 1.18rem);
  line-height: 1.6;
  margin: 0 auto 2rem;
  max-width: 680px;
}

.about-hero-proof {
  align-items: center;
  border-top: 1px solid var(--v3-line, #e1dbce);
  color: var(--v3-ink, #111827);
  display: inline-flex;
  flex-wrap: wrap;
  font-size: 0.86rem;
  font-weight: 760;
  gap: 0.75rem;
  justify-content: center;
  letter-spacing: 0.01em;
  margin: 0 auto;
  max-width: 720px;
  padding-top: 1.4rem;
}

.about-hero-proof span[aria-hidden='true'] {
  color: var(--v3-ink-muted, #5d6472);
  font-weight: 600;
  opacity: 0.6;
}

@media (max-width: 640px) {
  .about-hero-proof {
    gap: 0.5rem;
    font-size: 0.78rem;
  }
}
```

- [ ] **Step 4: Verify**

```bash
pnpm --filter web exec tsc --noEmit
curl -sf "$(curl -s http://localhost:3000/ | grep -oE '/_next/static/css/app/layout\.css\?v=[0-9]+' | head -1)" \
  --resolve localhost:3000:127.0.0.1 \
  --silent | grep -oE '\.about-hero\b|\.about-hero-headline\b' | sort -u
```

Expected: `tsc` clean. The final `grep -oE` lists both `.about-hero` and `.about-hero-headline`.

If the `curl --resolve` form is awkward, the simpler alternative is:

```bash
CSS_PATH=$(curl -s http://localhost:3000/ | grep -oE '/_next/static/css/app/layout\.css\?v=[0-9]+' | head -1)
curl -s "http://localhost:3000${CSS_PATH}" | grep -oE '\.about-hero\b|\.about-hero-headline\b' | sort -u
```

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/about/about-hero.tsx apps/web/src/app/globals.css
git commit -m "$(cat <<'EOF'
feat(about): add editorial manifesto hero component

Adds AboutHero — a centered editorial hero with serif headline, lede
paragraph, and a single proof line. Replaces the generic subpage-hero
shell that every other route uses. Includes the matching CSS block
(.about-hero-*). Not yet rendered on /about; wired in Task 8.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 6: Build the `AboutPhilosophy` component

**Files:**
- Create: `apps/web/src/components/about/philosophy.tsx`
- Modify: `apps/web/src/app/globals.css` (append `.about-philosophy-*` styles)

- [ ] **Step 1: Define acceptance check**

After this task, the component exists, type-checks clean, and the new CSS lives in `globals.css`. Not yet rendered.

- [ ] **Step 2: Create the file**

Write `apps/web/src/components/about/philosophy.tsx`:

```tsx
import { Reveal } from '@/components/motion-primitives';

export function AboutPhilosophy() {
  return (
    <section className="about-philosophy" aria-label="How Nucleus runs mandates">
      <Reveal>
        <div className="about-philosophy-inner">
          <span className="about-philosophy-rule" aria-hidden="true" />
          <p className="about-philosophy-eyebrow">Philosophy</p>
          <p className="about-philosophy-quote">
            We don&rsquo;t put a generalist on a specialist&rsquo;s work.
          </p>
          <p className="about-philosophy-body">
            Each discipline at Nucleus has its own partner. The audit partner
            runs your audit. The tax partner runs your tax. The deal partner
            runs your raise. What changes at Nucleus is that they coordinate
            — the audit partner reads the deal memo, the tax partner sits in
            the diligence call, the fundraise gets built on a clean
            compliance base. The right partner for the work, every time.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
```

- [ ] **Step 3: Append the CSS to `globals.css`**

Append to the existing `/* About page — editorial manifesto hero ... */` section in `globals.css` (after the `.about-hero` block from Task 5):

```css
.about-philosophy {
  background: #ffffff;
  padding: clamp(4rem, 7vw, 6rem) clamp(1rem, 4vw, 3rem);
}

.about-philosophy-inner {
  margin: 0 auto;
  max-width: 820px;
  position: relative;
  text-align: center;
}

.about-philosophy-rule {
  background: var(--v3-red, #dd1017);
  border-radius: 2px;
  display: block;
  height: 3px;
  margin: 0 auto 1.5rem;
  width: 48px;
}

.about-philosophy-eyebrow {
  color: var(--v3-red, #dd1017);
  font-size: 0.74rem;
  font-weight: 860;
  letter-spacing: 0.16em;
  margin: 0 0 1.2rem;
  text-transform: uppercase;
}

.about-philosophy-quote {
  color: var(--v3-ink, #111827);
  font-family: var(--v3-serif, Georgia, 'Times New Roman', serif);
  font-size: clamp(1.7rem, 3.2vw, 2.4rem);
  font-weight: 700;
  letter-spacing: -0.012em;
  line-height: 1.18;
  margin: 0 auto 1.6rem;
  max-width: 720px;
}

.about-philosophy-body {
  color: var(--v3-ink-muted, #5d6472);
  font-size: clamp(0.98rem, 1.4vw, 1.08rem);
  line-height: 1.7;
  margin: 0 auto;
  max-width: 680px;
}
```

- [ ] **Step 4: Verify**

```bash
pnpm --filter web exec tsc --noEmit
CSS_PATH=$(curl -s http://localhost:3000/ | grep -oE '/_next/static/css/app/layout\.css\?v=[0-9]+' | head -1)
curl -s "http://localhost:3000${CSS_PATH}" | grep -oE '\.about-philosophy\b|\.about-philosophy-quote\b' | sort -u
```

Expected: `tsc` clean. The grep lists both `.about-philosophy` and `.about-philosophy-quote`.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/about/philosophy.tsx apps/web/src/app/globals.css
git commit -m "$(cat <<'EOF'
feat(about): add Philosophy pull-quote section

Adds AboutPhilosophy — an editorial pull-quote framing Nucleus as
specialised partners coordinating across disciplines (not a single
generalist running everything). Quote in serif, supporting paragraph
in body type, small red rule above the eyebrow. Not yet rendered.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: Build the `AboutOfficesMap` component (with inline India SVG)

**Files:**
- Create: `apps/web/src/components/about/offices-map.tsx`
- Modify: `apps/web/src/app/globals.css` (append `.about-offices-*` styles)

The India outline is inlined as a single `<path>` inside the component's SVG — no separate file, no `<use>` or `<image>` indirection. Outline and dots share one SVG, one coordinate system, one fill currentColor chain.

- [ ] **Step 1: Define acceptance check**

After this task: the component renders one `<svg>` containing the India outline path + 5 `<circle>` dots, plus a sibling `<ul>` listing the 5 cities. Hovering a city pulses the matching dot via CSS `:has()`. `prefers-reduced-motion: reduce` disables the pulse. Not yet rendered on `/about` (wired in Task 8).

- [ ] **Step 2: Create the component**

Write `apps/web/src/components/about/offices-map.tsx`:

```tsx
import { Reveal } from '@/components/motion-primitives';

type Office = {
  slug: string;
  name: string;
  state: string;
  cx: number;
  cy: number;
};

const OFFICES: Office[] = [
  { slug: 'gurugram', name: 'Gurugram', state: 'Haryana', cx: 265, cy: 255 },
  { slug: 'faridabad', name: 'Faridabad', state: 'Haryana', cx: 285, cy: 275 },
  { slug: 'jaipur', name: 'Jaipur', state: 'Rajasthan', cx: 237, cy: 296 },
  { slug: 'bhatinda', name: 'Bhatinda', state: 'Punjab', cx: 217, cy: 217 },
  { slug: 'bangalore', name: 'Bangalore', state: 'Karnataka', cx: 280, cy: 631 },
];

// Hand-authored simplified India outline. Single closed path; inherits
// `currentColor` so the CSS controls the fill. Not topographic-grade
// — recognizable shape for the office-map context. Tune later if needed.
const INDIA_PATH =
  'M 235 175 L 270 155 L 305 165 L 335 180 L 365 195 L 395 200 L 415 215 L 440 235 L 465 260 L 485 290 L 500 320 L 510 355 L 515 395 L 510 435 L 495 470 L 478 500 L 455 525 L 425 545 L 400 560 L 370 575 L 345 595 L 320 615 L 295 640 L 280 670 L 270 700 L 262 730 L 258 760 L 245 740 L 232 710 L 218 675 L 205 640 L 192 605 L 180 568 L 170 532 L 165 495 L 162 458 L 165 420 L 173 385 L 183 350 L 195 318 L 205 285 L 215 250 L 222 215 L 228 190 Z';

export function AboutOfficesMap() {
  return (
    <section className="about-offices" aria-label="Nucleus offices across India">
      <Reveal>
        <div className="about-offices-header">
          <p className="about-offices-eyebrow">Offices</p>
          <h2 className="about-offices-heading">Five offices across India.</h2>
          <p className="about-offices-sub">
            Where Nucleus partners and their teams work — coordinated as one bench.
          </p>
        </div>
      </Reveal>

      <div className="about-offices-grid">
        <div className="about-offices-map" aria-hidden="true">
          <svg
            viewBox="0 0 800 800"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
          >
            <path className="about-offices-map-outline" d={INDIA_PATH} />
            {OFFICES.map((o) => (
              <circle
                key={o.slug}
                className="about-offices-dot"
                data-office={o.slug}
                cx={o.cx}
                cy={o.cy}
                r="8"
              />
            ))}
          </svg>
        </div>

        <ul className="about-offices-list">
          {OFFICES.map((o) => (
            <li key={o.slug} className="about-offices-city" data-office={o.slug}>
              <span className="about-offices-city-name">{o.name}</span>
              <span className="about-offices-city-state">{o.state}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Append the CSS to `globals.css`**

Append after the `.about-philosophy-*` block:

```css
.about-offices {
  background: var(--v3-paper, #f7f5ef);
  padding: clamp(4rem, 7vw, 6rem) clamp(1rem, 4vw, 3rem);
}

.about-offices-header {
  margin: 0 auto clamp(2rem, 4vw, 3rem);
  max-width: 760px;
  text-align: center;
}

.about-offices-eyebrow {
  color: var(--v3-red, #dd1017);
  font-size: 0.74rem;
  font-weight: 860;
  letter-spacing: 0.16em;
  margin: 0 0 0.8rem;
  text-transform: uppercase;
}

.about-offices-heading {
  color: var(--v3-ink, #111827);
  font-family: var(--v3-serif, Georgia, 'Times New Roman', serif);
  font-size: clamp(1.7rem, 3vw, 2.4rem);
  font-weight: 720;
  letter-spacing: -0.012em;
  margin: 0 0 0.7rem;
}

.about-offices-sub {
  color: var(--v3-ink-muted, #5d6472);
  font-size: 0.98rem;
  line-height: 1.6;
  margin: 0;
}

.about-offices-grid {
  align-items: center;
  display: grid;
  gap: clamp(1.5rem, 3vw, 3rem);
  grid-template-columns: minmax(260px, 1fr) minmax(220px, 0.6fr);
  margin: 0 auto;
  max-width: 1080px;
}

.about-offices-map {
  aspect-ratio: 1 / 1;
  width: 100%;
}

.about-offices-map svg {
  display: block;
  height: 100%;
  width: 100%;
}

.about-offices-map-outline {
  fill: var(--v3-line, #e1dbce);
  stroke: rgba(21, 34, 73, 0.08);
  stroke-width: 1.5;
}

.about-offices-dot {
  fill: var(--v3-red, #dd1017);
  fill-opacity: 0.85;
  transition: r 0.18s ease, fill-opacity 0.18s ease, transform 0.18s ease;
  transform-origin: center;
  transform-box: fill-box;
}

.about-offices-list {
  display: grid;
  gap: 0.4rem;
  list-style: none;
  margin: 0;
  padding: 0;
}

.about-offices-city {
  border-radius: 10px;
  cursor: default;
  display: flex;
  flex-direction: column;
  padding: 0.7rem 0.9rem;
  transition: background-color 0.18s ease;
}

.about-offices-city:hover {
  background: rgba(21, 34, 73, 0.05);
}

.about-offices-city-name {
  color: var(--v3-ink, #111827);
  font-size: 1.02rem;
  font-weight: 760;
  letter-spacing: -0.005em;
}

.about-offices-city-state {
  color: var(--v3-ink-muted, #5d6472);
  font-size: 0.84rem;
}

/* Hover-sync: hovering a city in the list pulses the matching dot.
   Uses :has() in the parent grid so we can target the dot by data-office. */
.about-offices-grid:has(.about-offices-city[data-office='gurugram']:hover)
  .about-offices-dot[data-office='gurugram'],
.about-offices-grid:has(.about-offices-city[data-office='faridabad']:hover)
  .about-offices-dot[data-office='faridabad'],
.about-offices-grid:has(.about-offices-city[data-office='jaipur']:hover)
  .about-offices-dot[data-office='jaipur'],
.about-offices-grid:has(.about-offices-city[data-office='bhatinda']:hover)
  .about-offices-dot[data-office='bhatinda'],
.about-offices-grid:has(.about-offices-city[data-office='bangalore']:hover)
  .about-offices-dot[data-office='bangalore'] {
  fill-opacity: 1;
  transform: scale(1.6);
}

@media (max-width: 760px) {
  .about-offices-grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .about-offices-dot,
  .about-offices-city {
    transition: none;
  }
}
```

- [ ] **Step 4: Verify**

```bash
pnpm --filter web exec tsc --noEmit
CSS_PATH=$(curl -s http://localhost:3000/ | grep -oE '/_next/static/css/app/layout\.css\?v=[0-9]+' | head -1)
curl -s "http://localhost:3000${CSS_PATH}" | grep -oE '\.about-offices-dot\b|\.about-offices-grid\b|\.about-offices-map-outline\b' | sort -u
```

Expected: `tsc` clean. The grep lists `.about-offices-dot`, `.about-offices-grid`, and `.about-offices-map-outline`.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/components/about/offices-map.tsx apps/web/src/app/globals.css
git commit -m "$(cat <<'EOF'
feat(about): add OfficesMap component with inline India outline

Adds the AboutOfficesMap component. India outline is inlined as a
single path inside the component's SVG — no external SVG file, no
<use>/<image> indirection. Five red dots mark Gurugram, Faridabad,
Jaipur, Bhatinda, and Bangalore; hovering a city in the right-hand
list pulses the matching dot via :has() selectors. No addresses on
the map (still partner-approved). Reduced-motion disables the pulse.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 8: Rewrite the About page with the 9-section structure

**Files:**
- Modify: `apps/web/src/app/about/page.tsx` (full rewrite)

- [ ] **Step 1: Define acceptance check**

After this task: `/about` renders exactly 9 sections in this order: AboutHero · ProofBar · AboutPhilosophy · FirmMoments · FirmLifecycle · Leadership (6 partners via TeamPageCard) · WhoWeServe · AboutOfficesMap · ContactBand. The `Meet the full team →` footer link points to `/team`. The old `subpage-hero`, `pill-grid`, `list-grid` blocks are gone.

- [ ] **Step 2: Rewrite the file**

Replace the entire contents of `apps/web/src/app/about/page.tsx` with:

```tsx
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { ContactBand, ProofBar } from '@/components/sections';
import { PageShell } from '@/components/site-chrome';
import { AboutHero } from '@/components/about/about-hero';
import { AboutPhilosophy } from '@/components/about/philosophy';
import { AboutOfficesMap } from '@/components/about/offices-map';
import { FirmMoments } from '@/components/firm/moments';
import { FirmLifecycle } from '@/components/firm/lifecycle';
import { WhoWeServe } from '@/components/firm/who-we-serve';
import { TeamPageCard } from '@/components/team/team-page-card';
import { getTeamGrouped } from '@/content/team';

export const metadata: Metadata = {
  title: 'About Nucleus Advisors | Senior-led advisory firm in India',
  description:
    'Nucleus Advisors is a senior-led firm covering audit, tax, transactions and advisory. 8 partners, 90+ team, 130+ clients, 50+ deals advised, 5 offices across India.',
};

export default function AboutPage() {
  const { leadership } = getTeamGrouped();

  return (
    <PageShell>
      <main className="home-v3">
        <AboutHero />
        <ProofBar />
        <AboutPhilosophy />
        <FirmMoments />
        <FirmLifecycle />

        <section className="team-page-section about-leadership" aria-labelledby="about-leadership-heading">
          <header className="team-page-section-head">
            <p className="team-page-section-eyebrow">●01 Leadership</p>
            <h2 id="about-leadership-heading" className="team-page-section-title">
              Partners who run the mandates end-to-end.
            </h2>
            <p className="team-page-section-sub">
              Each Nucleus engagement has a named partner accountable for it. These are theirs.
            </p>
          </header>
          <div className="team-page-grid">
            {leadership.map((m) => (
              <TeamPageCard key={m.slug} member={m} />
            ))}
          </div>
          <div className="about-leadership-foot">
            <Link className="about-leadership-more" href="/team">
              Meet the full team
              <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </section>

        <WhoWeServe />
        <AboutOfficesMap />
        <ContactBand />
      </main>
    </PageShell>
  );
}
```

- [ ] **Step 3: Append `.about-leadership-*` CSS to `globals.css`**

The leadership block reuses `team-page-*` classes from the existing `/team` page, but the bottom-of-section "Meet the full team →" link is new. Append after the `.about-offices-*` block:

```css
.about-leadership-foot {
  display: flex;
  justify-content: center;
  margin-top: clamp(1.5rem, 3vw, 2.5rem);
}

.about-leadership-more {
  align-items: center;
  background: var(--v3-navy, #152249);
  border-radius: 999px;
  color: #ffffff;
  display: inline-flex;
  font-size: 0.92rem;
  font-weight: 780;
  gap: 0.45rem;
  padding: 0.7rem 1.2rem;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
}

.about-leadership-more:hover,
.about-leadership-more:focus-visible {
  box-shadow: 0 12px 24px -16px rgba(21, 34, 73, 0.55);
  outline: none;
  transform: translateY(-1px);
}

@media (prefers-reduced-motion: reduce) {
  .about-leadership-more {
    transition: none;
  }
}
```

- [ ] **Step 4: Verify rendered structure**

```bash
pnpm --filter web exec tsc --noEmit
curl -sf -o /dev/null -w "/about: %{http_code}\n" http://localhost:3000/about
curl -s http://localhost:3000/about | python3 -c "
import sys, re
html = sys.stdin.read()
print('about-hero       :', html.count('about-hero-headline'))
print('proof-bar        :', html.count('proof-bar'))
print('about-philosophy :', html.count('about-philosophy-quote'))
print('firm moments     :', html.count('home-v3-moments'))
print('firm lifecycle   :', html.count('home-v3-lifecycle'))
print('team-page-card   :', html.count('team-page-card-trigger'))
print('who-we-serve     :', html.count('builtfor-columns'))
print('offices-map      :', html.count('about-offices-dot'))
print('contact-band     :', html.count('contact-band'))
print('Meet full team   :', '/team' in html and 'Meet the full team' in html)
print('Old subpage-hero :', html.count('subpage-hero'))
print('Old pill-grid    :', html.count('pill-grid'))
"
```

Expected counts:
- `about-hero-headline` ≥ 1
- `proof-bar` ≥ 1
- `about-philosophy-quote` ≥ 1
- `home-v3-moments` ≥ 1
- `home-v3-lifecycle` ≥ 1
- `team-page-card` triggers = 6 (one per leadership partner)
- `builtfor-columns` ≥ 1
- `about-offices-dot` ≥ 5
- `contact-band` ≥ 1
- `Meet full team` = `True`
- `subpage-hero` = `0`
- `pill-grid` = `0`

If any count is wrong, fix before committing.

- [ ] **Step 5: Mobile viewport spot-check (manual)**

Open `http://localhost:3000/about` in the browser, narrow the window to ≤640px, scroll the full page. Confirm:
- Hero text wraps cleanly, no horizontal scroll
- Philosophy quote scales down readably
- Lifecycle / moments behave as they did on Home before migration
- Leadership grid collapses to a single column
- Offices map stacks above the city list
- No section overlaps the page footer

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/app/about/page.tsx apps/web/src/app/globals.css
git commit -m "$(cat <<'EOF'
feat(about): rewrite /about as a 9-section firm narrative

New section order: AboutHero · ProofBar · AboutPhilosophy · FirmMoments
· FirmLifecycle · Leadership (6 partners via TeamPageCard) · WhoWeServe
· AboutOfficesMap · ContactBand. Removes the old subpage-hero shell,
pill-grid, and list-grid blocks. Leadership reuses TeamPageCard +
TeamProfileModal so the visual language matches /team; "Meet the full
team →" footer links to /team for the executive group.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Task 9: Final verification

**Files:** (no changes — pure verification)

- [ ] **Step 1: Type-check clean across the whole web app**

```bash
pnpm --filter web exec tsc --noEmit
```

Expected: no output (zero errors).

- [ ] **Step 2: Confirm homepage section count = 7**

```bash
curl -s http://localhost:3000/ | python3 -c "
import sys, re
html = sys.stdin.read()
# Each home section uses .home-v3-* as its root section class; count distinct ones
sections = set(re.findall(r'<section[^>]*class=\"([^\"]*home-v3-[a-z-]+)\"', html))
print('homepage sections:', sorted(sections))
print('count:', len(sections))
# These should be ABSENT
for cls in ['home-v3-lifecycle', 'home-v3-moments', 'home-v3-builtfor', 'home-v3-deliverables']:
    print(f'  {cls}:', cls in html)
"
```

Expected output:
- Homepage section count: **7**
- All four `home-v3-lifecycle`, `home-v3-moments`, `home-v3-builtfor`, `home-v3-deliverables` print `False`.

- [ ] **Step 3: Confirm About section count = 9**

```bash
curl -s http://localhost:3000/about | python3 -c "
import sys, re
html = sys.stdin.read()
required = [
  ('about-hero',        'about-hero-headline'),
  ('proof-bar',         'proof-bar'),
  ('about-philosophy',  'about-philosophy-quote'),
  ('firm-moments',      'home-v3-moments'),
  ('firm-lifecycle',    'home-v3-lifecycle'),
  ('leadership',        'team-page-card-trigger'),
  ('who-we-serve',      'builtfor-columns'),
  ('offices-map',       'about-offices-dot'),
  ('contact-band',      'contact-band'),
]
missing = [name for name, marker in required if marker not in html]
print('all 9 present:', not missing)
if missing:
    print('missing:', missing)
"
```

Expected: `all 9 present: True`.

- [ ] **Step 4: Confirm zero duplicate content between Home and About**

```bash
python3 <<'PY'
import urllib.request
home = urllib.request.urlopen('http://localhost:3000/').read().decode()
about = urllib.request.urlopen('http://localhost:3000/about').read().decode()
# Sections that should ONLY be on About, never on Home
about_only = [
    ('Philosophy block',  'about-philosophy-quote'),
    ('Offices map',       'about-offices-dot'),
    ('Editorial hero',    'about-hero-headline'),
    ('Lifecycle (firm)',  'home-v3-lifecycle'),
    ('Moments (firm)',    'home-v3-moments'),
    ('Built-for',         'builtfor-columns'),
]
ok = True
for label, marker in about_only:
    in_home = marker in home
    in_about = marker in about
    print(f'  {label:22s}  home={in_home}  about={in_about}')
    if in_home:
        ok = False
print('No duplication:', ok)
PY
```

Expected: each row should show `home=False  about=True`. Final line: `No duplication: True`.

- [ ] **Step 5: Confirm the 9 `home-*` resource slugs are gone**

```bash
for slug in home-fundraise-readiness-report home-information-memorandum home-risk-control-matrix home-compliance-calendar home-audit-readiness-checklist home-valuation-report home-monthly-mis-pack home-statutory-registers-roc home-aif-setup-workplan; do
  status=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/api/resources/request \
    -H "content-type: application/json" \
    -d "{\"resourceSlug\":\"$slug\",\"name\":\"Test\",\"email\":\"t@x.com\",\"company\":\"Acme\"}")
  echo "$slug: $status"
done
```

Expected: every line ends with `: 404`.

- [ ] **Step 6: Browser-side smoke test (manual)**

Hard-refresh `http://localhost:3000/` (Cmd-Shift-R) — confirm 7 sections, no Lifecycle / Moments / Built-for / Deliverables.
Hard-refresh `http://localhost:3000/about` — confirm 9 sections in order, the leadership grid shows 6 partner cards with real headshots, clicking a card opens `TeamProfileModal`, "Meet the full team →" navigates to `/team`, hovering a city pulses the map dot.
Resize to ≤640px on both pages — confirm clean mobile layout.

- [ ] **Step 7: Final commit (optional — only if anything was tweaked during verification)**

If no tweaks were made, skip this commit. Otherwise:

```bash
git add -u
git commit -m "$(cat <<'EOF'
fix(about): post-verification polish

Adjustments after end-to-end verification across desktop + mobile.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

## Out of scope (do not include in this implementation)

- Pushing to `origin/main` — gated on explicit partner consent per CLAUDE.md memory rule.
- Adding new partners or executive members to `team.ts`.
- Replacing `TeamProfileModal` with a dedicated `/team/[slug]` route (separate tracker task).
- Phase 1.5 backend wiring for contact forms or lead-capture persistence.
- Refining the India SVG outline beyond the simplified path provided in Task 7 — partner-edit later if desired.

## Open partner edits (flagged in the spec; not blocking implementation)

- Final hero copy ("We're built for the decisions that matter.")
- Final philosophy pull-quote copy ("We don't put a generalist on a specialist's work.")
- Final office addresses (omitted from the map by design; remain partner-approved).
