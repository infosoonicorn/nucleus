# Life at Nucleus — Gallery Hero Design

Date: 2026-05-13
Status: Approved (design); awaiting implementation plan
Surface: `/careers/life-at-nucleus`

## Goal

Replace the static subpage hero on `/careers/life-at-nucleus` with a full-bleed, scroll-linked WebGL image gallery sitting behind the existing headline and lede. Ship behind an environment flag so the live site keeps rendering the current real shell until approved Nucleus photography is available.

## Non-goals

- No changes to `/careers` landing.
- No changes to the homepage Careers teaser.
- No changes to navigation, sitemap, or other routes.
- No shipping of stock or placeholder imagery in production.
- No generation of fake culture content, testimonials, or people photos.

## Constraints (must hold)

- CLAUDE.md rule 4 — no fake live content. Placeholders never reach production.
- CLAUDE.md rule 6 — `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test:e2e` must pass before claiming done.
- Vijay rule 1 — no dead clicks, no mocked data in production routes.
- Vijay rule 4 — user-facing errors must be plain English, never raw API codes (the gallery has a fallback path; if WebGL is unavailable we fall back to the existing static hero with no error surface).
- The existing static hero must remain the production fallback with zero layout shift when the flag is off.

## Source component

Provided by user from 21st.dev: a React-Three-Fiber infinite-depth image gallery with cloth-shader curving, per-plane fade and blur, autoplay, and wheel/key scroll capture. The shared file is the basis for the new component but is materially modified below.

## Decisions (approved during brainstorming)

1. Surface: `/careers/life-at-nucleus`.
2. Image situation: ship behind a feature flag; production stays on the existing static shell until approved Nucleus photography arrives.
3. Scroll behavior: scroll-linked while in viewport. No wheel hijack. No autoplay drift. Page scroll always wins.
4. Page role: hero — gallery sits behind/under the headline.

## Architecture

### File layout

New:

- `apps/web/src/components/careers/life-gallery-hero.tsx` (`"use client"`) — composite that owns the scroll-linked driver, reduced-motion gate, scrim, and headline overlay. Dynamically imports the gallery with `next/dynamic({ ssr: false })`.
- `apps/web/src/components/careers/infinite-gallery.tsx` (`"use client"`) — trimmed port of the 21st.dev component.
- `apps/web/src/components/careers/static-hero.tsx` — extraction of the existing `subpage-hero` markup so both branches reuse one component.
- `apps/web/src/content/life-gallery.ts` — exported `lifeGalleryImages: { src: string; alt: string }[]`. Single edit point when real images arrive.
- `apps/web/src/lib/flags.ts` — central place for `LIFE_GALLERY_ENABLED = process.env.NEXT_PUBLIC_LIFE_GALLERY_ENABLED === '1'`.
- `apps/web/public/life-placeholders/` (gitignored except `README.md`) — local dev images. Folder is ignored at the git level; `README.md` is the only tracked file and documents expected filenames, dimensions, licensing, and the "replace before prod flag-on" rule.

Edited:

- `apps/web/src/app/careers/life-at-nucleus/page.tsx` — server component, single ternary on `LIFE_GALLERY_ENABLED` selecting `<LifeGalleryHero>` or `<StaticHero>`. All other sections of the page unchanged.
- `apps/web/src/app/globals.css` — one new `.life-hero` block following the same naming style as existing `subpage-hero` rules. Scoped to this hero; nothing global redefined.
- `apps/web/.gitignore` — entry for `public/life-placeholders/*` excluding `README.md`.
- `apps/web/package.json` — add `three`, `@react-three/fiber`, `@react-three/drei` as dependencies. Add matching `@types/three` as a dev dependency.

### Module boundaries

- `LifeGalleryHero` is the only consumer of `InfiniteGallery`. The hero passes images, scroll progress, and reduced-motion state in; the gallery returns a `<Canvas>` tree. No other coupling.
- The gallery does not read globals, does not bind to `document`, does not listen on `window`. All inputs are props.
- `flags.ts` is the only place that reads `process.env.NEXT_PUBLIC_LIFE_GALLERY_ENABLED`.

## Behavior

### Scroll-linked driver

- `LifeGalleryHero` registers an `IntersectionObserver` (threshold 0) on its root.
- While the hero intersects the viewport, a single `requestAnimationFrame` loop runs. While off-screen the loop is cancelled.
- Each frame:
  - Read `rect = root.getBoundingClientRect()`.
  - Compute raw progress: `(viewportHeight - rect.top) / (viewportHeight + rect.height)`, clamped to `[0, 1]`. Progress is 0 when the hero is just entering from below and 1 when it has just left the top.
  - Smooth into a `progressRef.current` with a lerp factor of 0.1.
  - Write `progressRef.current` into a mutable ref shared with the gallery (no React state, no per-frame re-renders).
- Reduced motion: when `prefers-reduced-motion: reduce` matches, the rAF loop never starts. `progressRef.current` is pinned to `0.5`.

### Gallery changes vs. the source component

Remove:

- `handleWheel`, `handleKeyDown`, the canvas `wheel` listener, the document `keydown` listener.
- `autoPlay`, `lastInteraction`, the 3-second idle interval, and the autoplay velocity nudge in `useFrame`.
- `scrollVelocity` React state. `setScrollVelocity` inside `useFrame` triggers a React re-render every frame in the original — this is replaced by a ref read.
- Hover state on `ImagePlane` (`isHovered`, the flag-wave shader branch). It re-renders React on every enter/leave and reads as gimmicky in this brand context.
- The `document.querySelector('canvas')` listener attachment.

Replace:

- `scrollForce` uniform: each frame, read `progressRef.current` from the prop and compute a "force" for the cloth ripple (a small smoothed delta from the previous frame). Subtle motion only.
- Plane Z derivation: instead of integrating velocity, compute deterministically per plane:
  - `baseZ[i] = (depthRange / visibleCount) * i`
  - `plane.z = mod(baseZ[i] + progress * depthRange * loops, depthRange)` with `loops = 1.5` (tunable constant in the component).
- Image index wrap math from the source is preserved, but recomputed from `(baseZ + progress*loops*depthRange)` divided by `depthRange` to determine how many wraps have occurred since mount, so the image carousel still advances as planes cycle through the depth range.

Keep:

- Per-plane fade in/out based on normalized Z position. Defaults tightened: `fadeIn { start: 0.05, end: 0.2 }`, `fadeOut { start: 0.7, end: 0.95 }`.
- Per-plane blur in/out shader, `maxBlur: 6.0`. Lowered from the source's 8.0 so mid-field images stay readable.
- Spatial X/Y offsets via the golden-angle pattern in the source.
- `FallbackGallery` is reused only as a no-WebGL safety net; in this hero context, if `webglSupported` is false the wrapper renders the `StaticHero` instead of the grid fallback (less visual noise on the careers page).

Starting tunables (to be refined during implementation against the placeholder set):

- `visibleCount: 6` — lowered from the source's 8 to reduce overdraw on low-end mobile.
- `depthRange: 50` — unchanged from the source.
- `loops: 1.5` — number of full carousel passes across the hero's scroll arc.
- `lerpFactor: 0.1` — smoothing on the progress ref.

### Headline overlay

- Hero root: `min-height: clamp(560px, 78vh, 760px)`, full-bleed via negative margins to escape the page container, `overflow: hidden`, `position: relative`.
- Layer stack, bottom-up:
  1. `<canvas>` (the gallery), `position: absolute; inset: 0`, `aria-hidden="true"`.
  2. Scrim: `position: absolute; inset: 0`, `background: linear-gradient(180deg, rgba(20,20,20,0.55) 0%, rgba(20,20,20,0.2) 60%, rgba(20,20,20,0) 100%)` — top-weighted so the headline at the bottom-left reads against a darker upper field and a softer lower one. Final values to be tuned in implementation against real palette.
  3. Content: `position: relative`, aligned bottom-left, `max-width: 60ch`, padding matching existing `subpage-hero` rhythm. Reuses `.eyebrow` and `h1` classes; text color forced to the cream/white token used elsewhere in the brand.
- A 1px sage hairline separator at the bottom edge of the hero, matching the rest of the site's section transitions.

### Accessibility

- `<canvas>` is `aria-hidden="true"`. The accessible content of the hero is the headline + lede text, which is identical to the flag-off shell — no AT-visible change between states.
- Reduced motion as above: no animation, static tableau.
- Keyboard: nothing in the hero is focusable beyond what already exists (the page has no in-hero links today). No keyboard trap.
- Touch / mobile: no special handling. Page scrolls normally; scroll-link still drives depth.
- No WebGL: the wrapper renders `<StaticHero>` instead of the gallery. Same visual fallback as flag-off.

## Feature flag mechanics

- Variable: `NEXT_PUBLIC_LIFE_GALLERY_ENABLED`. Read once at module scope in `apps/web/src/lib/flags.ts`. Default off.
- Vercel: absent in Production by default; presence on Preview is opt-in per deployment.
- Page branch:

```tsx
import { LIFE_GALLERY_ENABLED } from '@/lib/flags';
// ...
{LIFE_GALLERY_ENABLED ? <LifeGalleryHero /> : <StaticHero />}
```

- Because flag-off does not import the client gallery, `next/dynamic` is never invoked and `three` does not enter the client chunk for production visitors. Verified in the test plan via build chunk inspection.

## Image strategy

- The gallery accepts images via prop only — no hardcoded paths inside the component.
- `apps/web/src/content/life-gallery.ts` exports `lifeGalleryImages`. This file is the single edit point for swapping placeholders for real photography.
- Placeholder dev set (6–8 images) lives in `apps/web/public/life-placeholders/`. Folder gitignored. `README.md` inside lists:
  - Expected filenames (e.g., `01-workspace.jpg` through `08-skyline.jpg`).
  - Dimensions: 1600×1000, JPEG, ≤200KB each.
  - Subject rules: no identifiable people, no Nucleus branding, abstract workspace/document/cityscape only.
  - Licensing rule: placeholders only, never committed, replaced before flag-on in production.
- When approved Nucleus photography arrives, those files replace the placeholder folder under a new committed path (e.g., `apps/web/public/life/`) and `lifeGalleryImages` is updated to point at the committed paths. At that point the flag can be turned on in Production.

## CSS strategy

Default: extend `apps/web/src/app/globals.css` with one new scoped block:

```css
.life-hero { /* ... */ }
.life-hero__canvas { /* ... */ }
.life-hero__scrim { /* ... */ }
.life-hero__content { /* ... */ }
```

Naming follows the same convention as the existing `subpage-hero` and `home-v3-*` classes. If a future pass migrates this area to CSS modules, the same selectors port cleanly. The implementation plan should default to `globals.css` unless the user requests otherwise.

## Testing and verification

Local gate (CLAUDE.md rule 6):

- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- `pnpm test:e2e`

New tests:

- Playwright spec covering `/careers/life-at-nucleus` with the flag off. Asserts the eyebrow text "Careers", the h1 text "Life at Nucleus.", and the lede paragraph are present. Acts as a regression guard so the flag-off path is never silently broken.

Bundle assertion:

- After `pnpm build`, inspect the `.next` chunk manifest for the `careers/life-at-nucleus` route. The flag-off prod build must not include `three`, `@react-three/fiber`, or `@react-three/drei` in the route's client chunks. Can be a small script in the test plan or a manual verification step recorded in `HANDOFF.md`.

Manual browser checks (flag on, Preview env):

- Hero renders at the full-bleed size on desktop and on iPhone-sized viewports.
- Page scrolls past the hero into the next section without trapping or jank.
- Headline remains legible at every point in the scroll arc.
- OS-level reduced-motion setting produces a still hero with no animation.
- Chrome DevTools 4× CPU throttle keeps scroll above 30fps through the hero.
- Mobile Safari renders without console errors.
- Vercel Preview URL: same checks with `PLAYWRIGHT_BASE_URL` pointed at the Preview URL.

Documentation:

- `docs/project-tracker.md` updated with the new task entries and completion state per CLAUDE.md rule 8.
- `HANDOFF.md` updated with changed files, commands run, and next step on each non-trivial save point.

## Risks and mitigations

- **Bundle bloat on the careers route.** Mitigated by dynamic import with `ssr: false` and by the flag — three.js never ships when the flag is off, and only loads on this one route when on.
- **Brand mismatch (3D carousel on a CA firm site).** Mitigated by removing the flag-wave hover, lowering blur intensity, top-weighted dark scrim, and the static fallback path for reduced motion.
- **Performance on low-end mobile.** Mitigated by `visibleCount` defaulting to 6 (not 8), `maxBlur` lowered, ripple amplitude unchanged but driven by a small delta rather than free-running velocity. Verification step covers throttled CPU.
- **Layout shift between flag states.** Mitigated by both branches rendering the same outer container and the same headline text; only the visual backdrop differs.
- **Accidental placeholder leak to production.** Mitigated by the gitignore on the placeholder folder plus the flag default. A third backstop: the build-chunk assertion proves three.js is absent.

## Open items (to resolve in the implementation plan or later)

- Final scrim opacity values and the precise cream/white token for hero text — pin during implementation against the live palette.
- Exact `visibleCount`, `depthRange`, `loops`, and shader fade/blur stops — start with the values pinned in "Starting tunables"; tune visually once the placeholder set is in place.
- Whether to add a small "Replace placeholders before enabling in production" check to the build (a script that fails the build if `NEXT_PUBLIC_LIFE_GALLERY_ENABLED=1` and any image path in `lifeGalleryImages` points under `/life-placeholders/`). Recommended but optional; flag in the plan.

## Out of scope (deferred, not silently dropped)

- Captions, narrative per image, or any text-paired variant of the gallery. Deferred until real photography exists; revisit after content arrives.
- Backdrop spanning the whole page or sticky-layer treatment. Hero-only for now.
- Reuse of this gallery on the homepage Careers teaser. Not pursued; the homepage teaser-row is intentionally restrained.

## Acceptance criteria

The work is done when:

- With `NEXT_PUBLIC_LIFE_GALLERY_ENABLED` unset, `/careers/life-at-nucleus` renders exactly the current shell (verified by the new Playwright spec and a visual diff against `main`).
- With the flag set and a placeholder set present, the page renders a full-bleed scroll-linked gallery hero, the headline stays legible, and page scroll is never trapped.
- `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test:e2e` all pass on `main`.
- The flag-off production client chunk for the careers route contains no `three`, `@react-three/fiber`, or `@react-three/drei` references.
- `docs/project-tracker.md` and `HANDOFF.md` reflect the change.
