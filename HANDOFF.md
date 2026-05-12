# Nucleus Advisors Handoff

## Active Task

No active task.

## Last Action

Redesigned the homepage end-to-end with a motion-driven design system. The rest of the site (services, about, careers, insights, contact) is intentionally untouched — that pass is queued next.

Completed in this pass:

- Installed `framer-motion`, `lenis`, `lottie-react`, `clsx`, `tailwind-merge`, `tailwindcss-animate`.
- Wired Tailwind v4 brand tokens and the animate plugin in `apps/web/src/app/globals.css` (`@theme`, `@plugin "tailwindcss-animate"`).
- Added the `cn()` helper at `apps/web/src/lib/utils.ts`.
- Added a Lenis smooth-scroll provider (`apps/web/src/components/lenis-provider.tsx`) and mounted it at the root layout. Respects `prefers-reduced-motion`.
- Built reusable motion primitives at `apps/web/src/components/motion-primitives.tsx`: `Reveal`, `Stagger`, `CountUp`, `WordReveal`, `Magnetic`, `FadeIn`.
- Built a `LottieSlot` (`apps/web/src/components/lottie-slot.tsx`) that lazily loads a JSON file from `/lottie/...` and silently no-ops when the file is missing. Hero already references `/lottie/nucleus-hero.json`; see `docs/home-hero-lottie-spec.md` for the asset spec.
- Composed the homepage from focused client islands under `apps/web/src/components/home/`: `hero`, `proof-strip`, `lifecycle`, `services-universe`, `moments-marquee`, `depth`, `industries`, `teaser-row`, `closing-cta`.
- Rebuilt the homepage at `apps/web/src/app/page.tsx` as a thin server component composing those islands.
- Added a scoped `.home-v3` design system to `globals.css` (warm paper background, dark navy services section, dark closing CTA, marquee for decisive moments, count-up proof grid). Removed the now-orphaned `.home-hero-v2`, `.hero-v2-*`, `.hero-advisory-board`, `.board-*`, `.home-proof-strip`, `.home-section`, `softRise`, `pulseStep` rules.
- Updated `tests/e2e/home.spec.ts` for the new lifecycle heading ("The moments where outside judgement matters.").
- Stripped `html { scroll-behavior: smooth }` (Lenis handles it) and added `position: relative` to body so framer-motion scroll utilities are happy.

## Next Step

1. Source the hero Lottie per `docs/home-hero-lottie-spec.md` and drop it at `apps/web/public/lottie/nucleus-hero.json`.
2. Apply the new motion / spacing language to About, Services, Service Detail, Careers, Insights, Contact in a follow-up pass — without redesigning each from scratch.
3. Push the branch and run the deployed quality gate (`PLAYWRIGHT_BASE_URL=https://nucleus-bay.vercel.app pnpm test:e2e`).

## Changed Files In Current Work

Homepage redesign pass:

- `HANDOFF.md`
- `docs/home-hero-lottie-spec.md` (new)
- `apps/web/package.json`, `pnpm-lock.yaml`
- `apps/web/src/app/layout.tsx`
- `apps/web/src/app/page.tsx`
- `apps/web/src/app/globals.css`
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

Previous verification setup also changed:

- `.gitignore`
- `README.md`
- `apps/web/package.json`
- `apps/web/src/app/globals.css`
- `apps/web/src/app/layout.tsx`
- `apps/web/src/app/page.tsx`
- `apps/web/public/brand/nucleus-logo.png`
- `docs/testing.md`
- `eslint.config.mjs`
- `package.json`
- `playwright.config.ts`
- `pnpm-lock.yaml`
- `tests/e2e/home.spec.ts`
- `outputs/nucleus-profile-2026-extracted.txt`

## Verification

- `pnpm lint` passed
- `pnpm typecheck` passed
- `pnpm build` passed
- `pnpm test:e2e` passed locally
- `PLAYWRIGHT_BASE_URL=https://nucleus-bay.vercel.app pnpm test:e2e` passed against Vercel
- Latest local gate after animated hero revision: `pnpm lint && pnpm typecheck && pnpm build && pnpm test:e2e` passed.
- Latest local gate after Investment Banking/Risk Advisory revision: `pnpm lint && pnpm typecheck && pnpm build && pnpm test:e2e` passed.
- Screenshots captured locally: `outputs/nucleus-home-desktop-v2.png`, `outputs/nucleus-home-mobile-v2.png`.
- Latest local gate after clean-slate existing-site-inspired revision: `pnpm lint && pnpm typecheck && pnpm build && pnpm test:e2e` passed.
- Screenshots captured locally: `outputs/nucleus-clean-desktop.png`, `outputs/nucleus-clean-mobile.png`.
- Latest local gate after hero section upgrade: `pnpm lint && pnpm typecheck && pnpm build && pnpm test:e2e` passed.
- Screenshots captured locally: `outputs/nucleus-hero-desktop.png`, `outputs/nucleus-hero-mobile.png`.
- Latest local gate after Avendus-inspired revision: `pnpm lint && pnpm typecheck && pnpm build && pnpm test:e2e` passed.
- Screenshots captured locally: `outputs/nucleus-avendus-inspired-desktop.png`, `outputs/nucleus-avendus-inspired-mobile.png`.
- Latest local gate after full Avendus-style expansion: `pnpm lint && pnpm typecheck && pnpm build && pnpm test:e2e` passed.
- Full-page screenshots captured locally: `outputs/nucleus-avendus-full-desktop.png`, `outputs/nucleus-avendus-full-mobile.png`.
- Latest local gate after animation pass: `pnpm lint && pnpm typecheck && pnpm build && pnpm test:e2e` passed.
- Animation QA screenshots captured locally: `outputs/nucleus-cinematic-opening.png`, `outputs/nucleus-cinematic-settled-desktop.png`, `outputs/nucleus-cinematic-settled-mobile.png`.
- Content-layer update was documentation only; no lint/build/e2e run needed for this step.
- Latest local gate after Phase 1 static site build: `pnpm lint && pnpm typecheck && pnpm build && PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 pnpm test:e2e` passed.
- Latest local gate after project tracker dashboard redesign: `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 pnpm test:e2e` passed.
- Latest checks after hero and page-depth pass: `pnpm lint`, `pnpm typecheck`, and `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 pnpm test:e2e` passed. `pnpm build` also passed during this pass before the final smoke-test assertion update.
- Browser plugin could not open localhost in the in-app browser due `ERR_BLOCKED_BY_CLIENT`; Playwright local verification was used instead.
- Screenshots captured locally: `outputs/phase1-home-desktop-final.png`, `outputs/phase1-home-mobile-tight.png`, `outputs/phase1-service-desktop.png`, `outputs/phase1-contact-mobile.png`.
- Tracker screenshot captured locally: `outputs/project-tracker-html-dashboard-v3.png`.
- New screenshots captured locally: `outputs/home-hero-decision-desk-desktop.png`, `outputs/home-hero-decision-desk-mobile.png`, `outputs/about-expanded-desktop.png`, `outputs/careers-expanded-desktop.png`, `outputs/insights-expanded-mobile.png`.
- Latest calmer homepage screenshots captured locally: `outputs/home-reordered-calm-desktop.png`, `outputs/home-reordered-calm-mobile-v2.png`.
- Latest polished homepage gate: `pnpm lint && pnpm typecheck`, `pnpm build`, and `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3000 pnpm test:e2e` passed.
- Latest polished homepage screenshots captured locally: `outputs/home-polished-v3-desktop-final.png`, `outputs/home-polished-v3-mobile-final.png`.
- Latest gate after motion redesign: `pnpm --filter web lint`, `pnpm --filter web typecheck`, `pnpm --filter web build`, and `pnpm test:e2e` all passed.
- Motion redesign screenshots captured locally: `outputs/home-v3-desktop-fold.png`, `outputs/home-v3-desktop-full.png`, `outputs/home-v3-mobile-fold.png`, `outputs/home-v3-mobile-full.png`, plus per-section shots `outputs/section-*.png`.

## In-flight Processes

None. Dev server was stopped after capture.
