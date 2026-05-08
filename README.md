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
