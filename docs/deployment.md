# Deployment Setup

## Recommended Accounts

- **Cloudflare:** DNS, SSL, WAF, caching, email security records.
- **Vercel:** deploy `apps/web`.
- **Supabase:** backend later, separate project from SV Deal.
- **Email provider:** Resend, Postmark, Brevo, or Amazon SES for transactional emails later.

## Domain Plan

- `nucleusadvisors.in` -> public website.
- `www.nucleusadvisors.in` -> redirect to apex or serve the same site.
- `app.nucleusadvisors.in` -> logged-in web app later.
- `api.nucleusadvisors.in` is optional; avoid it until there is a real need.

## Vercel Settings

- Framework preset: Next.js.
- Root directory: `apps/web`.
- Build command: `pnpm build`.
- Install command: `pnpm install --frozen-lockfile`.
- Output directory: `.next`.

## Cutover Steps

1. Deploy Vercel preview.
2. Review desktop and mobile pages.
3. Add production domain in Vercel.
4. Move DNS to Cloudflare or update records at the current registrar.
5. Set Cloudflare records to point to Vercel.
6. Verify SSL and redirects.
7. Keep old hosting available for 48 hours after cutover.
