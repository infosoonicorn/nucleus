# Claude Onboarding Brief

This is the sanitized starting brief for Claude or any design/build agent joining the Nucleus Advisors project.

Read in this order:

1. `CLAUDE.md`
2. `HANDOFF.md`
3. `docs/architecture.md`
4. `docs/project-tracker.md`
5. `docs/content-master.md`
6. `docs/content-platform.md`
7. `docs/testing.md`

## Project Goal

Build a premium public website and future operating platform for Nucleus Advisors.

The public website should position Nucleus as a full-spectrum consulting firm supporting clients from incorporation to fundraising, controls, compliance, transactions, AIF/fund structures, and listing readiness.

The platform roadmap includes:

- website and service pages;
- careers and talent engine;
- insights, reports, newsletters, lead magnets, and live updates;
- lead repository;
- CMS and AI-assisted advisory desk;
- client portal;
- M&A partner deal room;
- future mobile capability.

## What Is Already Decided

Stack:

- Next.js App Router for the web app.
- Tailwind CSS.
- Vercel for hosting.
- Cloudflare for DNS/security.
- Supabase later for CMS, Auth, database, storage, lead repository, candidate system, and portal.
- Expo / React Native later for mobile.

Deployment context:

- GitHub repo: `infosoonicorn/nucleus`.
- Vercel project is already connected.
- Current deployed URL: `https://nucleus-bay.vercel.app`.
- Production domain is `nucleusadvisors.in`.
- Microsoft 365 email DNS must not be changed unless Vijay explicitly asks.

Content strategy:

- `docs/content-master.md` is the canonical content blueprint.
- `docs/content-platform.md` is the CMS/content/lead/AI platform blueprint.
- `docs/architecture.md` is the phased architecture plan.
- `docs/project-tracker.md` is the mandatory live checklist for what is built, blocked, pending, and complete.
- `outputs/nucleus-strategy-one-pager.pdf` is the internal one-page summary for team feedback, but `outputs/` is ignored and not source of truth.

## Phase Plan

Phase 1: static premium website

- Home
- About
- Services overview
- Core service pages
- Careers
- Insights shell
- Contact
- Basic forms/CTA structure
- Website-to-LinkedIn manual workflow

Phase 1.5: lightweight backend

- contact and lead form storage;
- newsletter subscriptions;
- job applications;
- gated download capture.

Phase 2: CMS and content engine

- editable pages;
- articles and live updates;
- lead magnets;
- service-wise knowledge banks;
- AI-assisted drafts with human review;
- website-to-LinkedIn draft generation.

Phase 3: portal and deal workflows

- client login;
- tasks, documents, billing, attendance, assignments, client updates;
- M&A partner deal room for approved external partners.

Phase 4: mobile

- Expo / React Native app using shared backend APIs.

## Service Lines

Build and design around these service lines:

- Investment Banking
- M&A Advisory
- Risk Advisory
- Tax & Regulatory
- Assurance
- Valuations
- Finance Outsourcing
- Corporate Secretarial
- AIF & Fund Management

AIF & Fund Management is a distinct service line headed by CS Neha Rathore. Nucleus Advisors is Investment Manager to Soonicorn Angel Trust-I. Soonicorn Ventures can be shown as flagship/pioneer proof of Nucleus' AIF/fund operations capability, but avoid fund solicitation and performance claims on the Nucleus advisory website.

## Careers and Talent

Careers is a major website pillar, not a small job page.

It should support:

- CA articleship;
- CA, MBA, graduate, analyst, and experienced roles;
- Life at Nucleus;
- approved offsite/team images;
- alumni hero wall;
- HR-managed job posts;
- candidate capture and talent community.

## Content and Lead Engine

The website is not just a brochure. It should become:

- brand platform;
- service knowledge bank;
- lead engine;
- recruiting engine;
- future client portal foundation;
- future M&A partner deal room foundation.

Every service page should eventually include:

- positioning;
- buyer questions;
- engagement process;
- service-specific counters/proof;
- sector experience;
- anonymised case studies;
- sample documents;
- knowledge bank;
- FAQs;
- lead magnet;
- CTA.

Homepage counters should remain firm-wide. Service pages should carry service-specific proof.

## AI-Assisted Advisory Desk

Future blog/insights automation should monitor official sources such as:

- Income Tax Department;
- MCA;
- GST/CBIC;
- RBI;
- SEBI;
- IBBI;
- ICAI;
- DPIIT/MSME/government schemes.

AI may draft summaries, explainers, FAQs, checklists, and live updates, but must never auto-publish tax/legal/regulatory content.

Use:

- `Prepared by Nucleus Editorial Desk; reviewed by [Partner]`

when AI/editorial drafting is reviewed by a partner.

Every article/update should map to:

- service line;
- partner/reviewer;
- official source URL;
- retrieval date;
- related service page;
- related lead magnet;
- newsletter/social distribution draft.

## M&A Partner Deal Room

Phase 3 should include a controlled deal room:

- internal M&A team posts approved opportunities;
- external partners log in;
- users see only permitted deals;
- teaser can be visible before NDA when appropriate;
- CIM/data room/sensitive documents require NDA or explicit approval;
- partner interest, Q&A, document access, follow-ups, and access changes are audit logged.

Do not mix this with the public website. It is a private portal module.

## Strict Boundaries

Do not commit or push:

- `Nucleus_Data For Reference/`
- `outputs/`
- `uploads/`
- `.env*`
- `.codex/`
- `.claude/`
- Playwright reports or test results.

`Nucleus_Data For Reference/` contains local reference material only. Use it carefully for context/assets when Vijay explicitly asks, but never push it to Git.

Do not change:

- Microsoft 365 email DNS records;
- production environment variables;
- secrets;
- live database migrations;
- destructive Git state.

Ask before any externally visible action such as sending emails, publishing newsletters, changing DNS, or deploying backend changes that affect live data.

## How To Work Without Stepping On Existing Work

Before edits:

```bash
git status --short --branch
```

Before route/content/component/schema changes:

```bash
rg "term-or-component-name"
```

During work:

- keep edits scoped;
- do not revert unrelated changes;
- update `HANDOFF.md` for non-trivial work;
- update `docs/project-tracker.md` whenever a meaningful task is completed, blocked, newly discovered, or intentionally deferred;
- prefer structured content/data files over scattered hardcoded JSX;
- avoid fake testimonials, fake clients, fake team members, fake live data;
- make every visible action real or clearly marked as future/placeholder.

Tracker protocol:

- read `docs/project-tracker.md` before choosing work;
- do not mark a task `[x]` until its acceptance criteria are satisfied;
- use `[!]` when user/team input is required;
- add discovered gaps as new tasks instead of leaving them only in conversation;
- remember the visual dashboard at `/project-tracker` renders from this Markdown file.

Before saying done for visible work:

```bash
pnpm lint
pnpm typecheck
pnpm build
pnpm test:e2e
```

Also verify in browser. If deployed, test the Vercel URL:

```bash
PLAYWRIGHT_BASE_URL=https://nucleus-bay.vercel.app pnpm test:e2e
```

## Best Next Build Task

Start building the Phase 1 static premium website from `docs/content-master.md`.

Recommended first implementation slice:

1. Create structured content source for services and site sections.
2. Build service overview and service detail routes.
3. Build homepage around lifecycle positioning and firm-wide proof.
4. Build careers shell and insights shell.
5. Keep forms as real UI with safe placeholder handling until backend is added.
6. Verify desktop/mobile browser rendering.

Do not restart strategy from scratch unless Vijay explicitly asks. The current strategy is already approved enough to begin build.
