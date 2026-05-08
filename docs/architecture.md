# Nucleus Advisors Architecture

## Decision

Use the same ecosystem pattern as `svdeal-v2`, but keep Nucleus as a separate platform and Supabase project.

## Phase 1: Website

- Deploy `apps/web` to Vercel.
- Point `nucleusadvisors.in` and `www.nucleusadvisors.in` through Cloudflare.
- Keep the current vendor available until DNS cutover is verified.

## Phase 2: Web App Foundation

- Create a Supabase project in India/South Asia region.
- Add Auth, profiles, organizations, roles, clients, entities, engagements, tasks, attendance, billing, documents, and audit logs.
- Enable Row Level Security on every table from the first migration.
- Store private files in Supabase Storage with signed URLs.

## Phase 3: Client Portal

- Add client login.
- Expose only approved client-visible tasks, documents, invoices, updates, and requests.
- Keep internal notes, billing drafts, and staff assignments private.

## Phase 4: Mobile

- Add `apps/mobile` with Expo / React Native.
- Reuse `packages/core`, `packages/types`, and `packages/validation`.
- Keep business rules in shared packages and server-side routes, not in screen components.
