# Nucleus Advisors Platform

Website and future operating platform for Nucleus Advisors.

## Stack

| Layer | Choice |
| --- | --- |
| Web | Next.js App Router |
| Styling | Tailwind CSS |
| Backend, later | Supabase Postgres, Auth, Storage, Edge Functions |
| Hosting | Vercel for web, Supabase Cloud for backend |
| DNS/Security | Cloudflare |
| Mobile, later | Expo / React Native using the same Supabase-backed APIs |

## Repo Layout

```text
apps/web              Public website now, web app later
packages/core        Shared business logic
packages/types       Shared TypeScript types
packages/validation  Shared Zod schemas
supabase/migrations  Versioned database migrations
tools/ai-image-lab   Existing internal image generation utility
docs                 Architecture and deployment notes
```

## Local Development

```bash
pnpm install
pnpm dev
```

The web app runs at `http://localhost:3000`.

## Browser Verification

```bash
pnpm test:e2e
```

Playwright starts the web app automatically and checks the homepage in real browsers. For a Vercel preview or production URL:

```bash
PLAYWRIGHT_BASE_URL=https://nucleus-bay.vercel.app pnpm test:e2e
```

See `docs/testing.md` for the verification workflow we will use before marking visible changes as complete.

## Agent Workflow

Claude, Codex, and future agents should read `CLAUDE.md` before working. Claude should then read `docs/claude-onboarding.md` for the current sanitized project brief. Keep `HANDOFF.md` current during non-trivial tasks so another agent can resume cleanly.
