# Nucleus Advisors Architecture

## Decision

Use the same ecosystem pattern as `svdeal-v2`, but keep Nucleus as a separate platform and Supabase project.

## Phase 1: Website

- Deploy `apps/web` to Vercel.
- Point `nucleusadvisors.in` and `www.nucleusadvisors.in` through Cloudflare.
- Keep the current vendor available until DNS cutover is verified.
- Keep the first site structured so content can later move into a CMS-backed editor without redesigning the frontend.
- Use `docs/content-master.md` as the canonical content layer before further visual/design implementation.

## Phase 1.5: Editable Website and Content Backend

- Add a Supabase-backed CMS/editor for pages, sections, services, articles, newsletters, lead magnets, public tools, and SEO metadata.
- Add admin/editor/reviewer roles before publishing workflows.
- Store edit history and publish state for every public content item.
- Add AI-assisted article drafting, but keep human approval mandatory before publication.
- See `docs/content-platform.md` for content model, AI workflow, and SEO/lead-magnet plan.
- See `docs/content-master.md` for homepage copy, service pages, industries, team positioning, lead magnets, and CMS-ready page fields.

## Phase 2: Web App Foundation

- Create a Supabase project in India/South Asia region.
- Add Auth, profiles, organizations, roles, clients, entities, engagements, tasks, attendance, billing, documents, and audit logs.
- Enable Row Level Security on every table from the first migration.
- Store private files in Supabase Storage with signed URLs.

## Phase 3: Client Portal

- Add client login.
- Expose only approved client-visible tasks, documents, invoices, updates, and requests.
- Keep internal notes, billing drafts, and staff assignments private.
- Add an M&A partner deal room where the M&A team can publish approved deal opportunities and external partners can log in to view only permitted deals.
- Include NDA/consent gates, partner access groups, deal status, teaser/CIM permissions, interest tracking, Q&A, document access logs, and audit trails.

## Phase 4: Mobile

- Add `apps/mobile` with Expo / React Native.
- Reuse `packages/core`, `packages/types`, and `packages/validation`.
- Keep business rules in shared packages and server-side routes, not in screen components.
