# Nucleus Advisors Handoff

## Active Task

No active task.

## Last Action

Prepared sanitized Claude onboarding instructions in `docs/claude-onboarding.md`, added pointers in `CLAUDE.md` and `README.md`, and added `.claude/` to `.gitignore` so Claude local worktree/cache files do not pollute the repo.

## Next Step

Claude/Codex should read `CLAUDE.md`, `docs/claude-onboarding.md`, and `HANDOFF.md`, then begin Phase 1 static premium website build from `docs/content-master.md`.

## Changed Files In Current Work

- `CLAUDE.md`
- `HANDOFF.md`
- `docs/architecture.md`
- `docs/content-platform.md`
- `docs/content-master.md`
- `docs/claude-onboarding.md`

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

## In-flight Processes

Local dev server running via `pnpm --filter web dev` at `http://localhost:3000`.
