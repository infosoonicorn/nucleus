# Nucleus Advisors — Working Agreements

These rules apply to Claude, Codex, and any other coding agent working on this repo. Re-read before starting meaningful work.

Claude-specific start point: read `docs/claude-onboarding.md` after this file and before making edits. It summarizes what is already decided, what is completed, and what boundaries must be respected.

Project tracking: `docs/project-tracker.md` is the living checklist for what is built and what remains. Update it whenever meaningful work is completed, blocked, or deferred.

## 1. Cross-reference every change

Before changing a component, route, text string, schema, environment variable, API contract, or shared package:

1. Search the whole repo for related references with `rg`.
2. Check callsites, imports, tests, docs, and deployment notes.
3. Update dependent pieces in the same change so nothing is left stale.

Examples:

- Route changes must update navigation links, redirects, sitemap, tests, and docs.
- Shared type/schema changes must update `packages/types`, `packages/validation`, callers, and tests.
- UI wording changes should be checked across the homepage, empty states, metadata, and future portal screens for consistent tone.
- Backend changes must update Supabase migrations, RLS expectations, API consumers, and verification tests.

## 2. Impact analysis for delete, move, and rename requests

When the user asks to delete, move, rename, repurpose, or remove an element, do not edit only the visible page where the request was made.

Before editing:

1. Search for the element name, component name, route, copy, icon, prop, table field, and related test selectors.
2. Identify every place it appears: UI, navigation, API routes, server actions, shared packages, tests, sitemap, metadata, docs, and deployment notes.
3. Decide whether each reference should be removed, moved, replaced, or intentionally preserved.
4. Update every affected area in the same change.
5. Add or update tests proving the old path/element is gone and the new behavior works.

Deletion is complete only when:

- no stale UI entry points remain;
- no dead imports, unused components, or orphan routes remain;
- no backend/API/schema references still assume the deleted concept exists;
- tests and docs reflect the new product shape.

Move/repurpose work is complete only when:

- old links and routes redirect or disappear intentionally;
- new placement works across desktop and mobile;
- permissions and backend behavior still match the new location;
- dependent screens and tests are updated.

## 3. No UI-only feature completion

A feature is not complete just because a button, screen, or visual control exists. Unless the user explicitly asks for a prototype/mockup, build the full vertical slice.

For every feature, define and implement:

- user story and visible success criteria;
- data model or storage behavior;
- backend/server action/API behavior;
- permissions and access control;
- UI states: empty, loading, success, already-exists, error, and reversal/undo where relevant;
- cross-surface impact across lists, profiles, dashboards, notifications, search, reports, and related views;
- tests proving the behavior works and persists after refresh.

Examples:

- Follow/following is not just a button. It needs persistent follow records, follow/unfollow logic, profile/list integration, duplicate prevention, permission checks, refresh persistence, and tests.
- Block user is not just a button. It needs real block records, unblock logic, hidden/filtered content where required, messaging/notification/search implications, permission checks, and tests.
- Assign task is not just a form. It needs task records, assignee visibility, status changes, audit trail expectations, permissions, notifications if in scope, and tests.

If a feature cannot be completed end to end yet because the backend is not ready, mark it clearly as a prototype or placeholder and do not present it as complete.

## 4. No fake live content

This will become a real firm website and operating platform. Do not ship:

- fake client names, fake invoices, fake team members, fake testimonials, or fake activity;
- non-interactive controls that look usable;
- placeholder dashboard screens that look like live data;
- demo/seed content rendered in production.

Correct pattern:

- If real data is absent, hide the section or show a clearly marked empty state.
- Every button or link that appears actionable must have a real destination or action.
- Demo data may exist only in local tests or fixtures and must never render unconditionally in production.

## 5. Shared work safety

Multiple agents may work in this repo. Before starting edits:

```bash
git status --short --branch
```

If unrelated user/agent changes exist, do not overwrite or revert them. Work around them or ask before touching the same files.

Do not push reference material:

- `Nucleus_Data For Reference/` is for local reference only and must stay out of git.
- `.env*`, local uploads, generated reports, and Playwright artifacts must stay out of git.

## 6. Verification before “done”

Visible work is not complete until it is proven in a browser.

Minimum local gate:

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm test:e2e
```

For deployed work, also test the Vercel URL:

```bash
PLAYWRIGHT_BASE_URL=https://nucleus-bay.vercel.app pnpm test:e2e
```

When Vercel preview URLs are available, test the preview URL before claiming the deployed result is ready.

## 7. Editable website and AI content logic

Nucleus must evolve into an editable website plus portal. Avoid architectural choices that trap public content inside hardcoded React files.

For public website and content work:

- prefer structured content models that can later be managed from the backend editor;
- include SEO metadata, slugs, navigation, publish states, and audit history in the design;
- support article/newsletter/tool/lead-magnet content types;
- keep AI-generated articles draft-only until human review;
- store source URLs/notes for AI-assisted drafts;
- never publish AI tax/legal/compliance advice without reviewer approval;
- do not use fake client stories, fake testimonials, or copied competitor text.

## 8. Continuous handoff

Keep `HANDOFF.md` updated during non-trivial work so another agent can resume without guesswork.

`docs/project-tracker.md` is mandatory. Every agent must read it before starting work and update it when a meaningful task is completed, blocked, newly discovered, or intentionally deferred.

At task start, record:

- goal;
- current plan;
- what “done” means.

During work, record:

- changed files;
- commands run and whether they passed;
- any running servers or deployment status;
- next step.

During tracker updates:

- mark tasks complete only when their acceptance criteria are satisfied;
- add blockers with `[!]` when work cannot proceed without user/team input;
- add new tasks when a gap is discovered instead of keeping it only in chat;
- keep the visual tracker route `/project-tracker` aligned by updating the Markdown source;
- update `HANDOFF.md` in the same change for non-trivial tracker updates.

When the task is fully done, clear the active task section back to “No active task.”

## 9. Production services

Current setup:

- Website hosting: Vercel
- DNS/security: Cloudflare
- Email: Microsoft 365 DNS records must not be changed unless the user explicitly asks
- Backend later: Supabase
- Mobile later: Expo / React Native, sharing Supabase-backed APIs

Cloudflare/Vercel DNS rule:

- Web records can change for Vercel.
- Microsoft MX, SPF, DKIM, DMARC, and Microsoft verification TXT records must be preserved.

## 10. Autonomy boundaries

Agents may run routine local checks, browser verification, builds, and non-destructive repo inspection without asking.

Ask before:

- deleting DNS records;
- changing Microsoft email DNS;
- rotating secrets or modifying production environment variables;
- destructive git operations;
- sending emails, newsletters, invoices, or client-visible notifications;
- deploying backend/database migrations that affect live data.
