# Nucleus Advisors — Build Tracker

The live status of what we're building, in plain English. Renders on the
internal dashboard at `/project-tracker`. Update this file whenever a
meaningful milestone ships — partners read this to see where we are.

## Current Snapshot

Last updated: 2026-05-18.

We've built the foundation of a premium public website — a homepage,
nine service pages (Investment Banking is the bespoke flagship; the other
eight share an elevated default), a careers section, and an insights hub
with 135 partner-authored articles filterable by service line. A bento
navigation with submenus on About, Services, and Insights ties it
together; every page is mobile-responsive.

The site lives on `localhost:3000` for partner review. It has not been
pushed to `nucleusadvisors.in` yet — that domain still shows a "coming
soon" splash and will be flipped only on Vijay's explicit consent, after
the brand-asset audit and Vercel quality gate land.

Next up: polish About / Careers / Insights detail / Contact to match the
home + service-page baseline, then go live. Phase 1.5 (forms wired to a
real Supabase backend) follows immediately.

## Executive Dashboard

| Area | Status | Completion Signal |
| --- | --- | --- |
| Foundations — strategy, repo, deployment plumbing | `[x]` | Positioning, service taxonomy, content engine, careers engine, AIF/Soonicorn and M&A deal-room scope all documented. |
| Phase 1 — Public website | `[~]` | Routes built and reviewable locally; brand-asset audit and Vercel go-live remain. |
| Phase 1.5 — Lead capture backend | `[ ]` | Form submissions log to dev console; Supabase wiring not started. |
| Phase 2 — Content engine + CMS | `[ ]` | Scope and partner-author workflow designed; build not started. |
| Phase 3 — Client portal + M&A deal room | `[ ]` | Scope documented; build not started. |
| Phase 4 — Mobile | `[ ]` | Reuses Phase 3 APIs; not started. |

## Phase 1: Public Website

A premium, credible front door for prospects, candidates and partners.
Built ahead of the backend so the firm has a real face on the internet
while the rest of the platform comes online.

### Build sequence

- [x] Strategy, content scope and phased roadmap documented.
  - Acceptance: positioning, services, careers, insights, lead engine, SEO, and portal hooks captured in `docs/`.
- [x] Premium homepage with lifecycle, service universe, firm proof, knowledge engine and careers teaser.
  - Acceptance: home page communicates the incorporation-to-listing journey and routes visitors to every major surface.
- [x] All nine service pages built.
  - Acceptance: Investment Banking, M&A Advisory, Risk Advisory, Tax & Regulatory, Assurance, Valuations, Finance Outsourcing, Corporate Secretarial, and AIF & Fund Management each have a dedicated page with hero, who-needs-this, when-to-engage, how-we-help, process, proof, FAQs and CTA.
- [x] Investment Banking page is end-to-end (bespoke flagship composition).
  - Acceptance: founder reading journey from identity through proof to CTA, with an interactive fundraise stages module, partner-signed process dossier, Soonicorn proof callout, resources deck and editorial FAQ.
- [x] Insights hub with 135 partner-authored long-form articles.
  - Acceptance: every article is filterable by service line and tag; URL filters are shareable; service pages preview the four most relevant articles with a "see all" link to the hub.
- [x] Reports hub with filterable industry reports.
  - Acceptance: `/reports` lists every industry report with chip filters by service line and report type, mirroring the insights hub pattern.
- [x] About, Team, Careers, Life at Nucleus, Alumni, Clients and Contact pages live.
  - Acceptance: every nav destination resolves to a real page; no dead clicks.
- [x] Bento dropdown navigation with submenus on About / Services / Insights.
  - Acceptance: hover, focus or tap opens a rich mega-menu under the header; About is a two-column firm/join-us bento; Services is a three-column bento across all nine service lines; Insights surfaces a service chip grid plus a "latest article" feature card.
- [x] Unified Resources deck + lead-capture modal on every service page.
  - Acceptance: a single modal (Name / Work email / Company / Role) captures requests for every downloadable across the site; each capture is logged with the resource slug for interest tracking.
- [x] Long-form article infrastructure with reviewer-status gate.
  - Acceptance: drafts visible only in development; production hides anything not approved by a partner. Article reader at `/insights/{slug}` includes a draft banner for partner preview.
- [x] Article thumbnail brand template (Canva) wired for batch generation.
  - Acceptance: one locked editorial-photo template covers every Nucleus article. Brand Template ID and autofill schema verified end-to-end; first proof-of-concept thumbnail live.
- [x] Mobile-responsive across all public pages.
  - Acceptance: every page is verified at mobile and desktop widths; the new nav collapses into a hamburger sheet below 960px.
- [x] Service ↔ team mapping data layer (Phase 1).
  - Acceptance: every service line has a typed `lead` + optional `coLeads` in `team.ts`'s exported `SERVICE_LEADS`; service-page dossier band renders real names live (no more `partnerLabel` placeholder); `getTeamForService` sorts lead → co-leads → seniority and filters to leadership; `serviceSlugs[]` reconciled across all 12 team members; build-time validator `pnpm lint:team` gates every commit; spec at `docs/superpowers/specs/2026-05-21-service-team-mapping-design.md`.
- [x] Service ↔ team mapping — article reauthoring (Phase 2).
  - Acceptance: all 135 articles' `authorSlug` reassigned from placeholders to real leadership partners per `SERVICE_LEADS`; executives (Astha, Samarth, Geetanjali, V. K. Choudhary) removed as authors; new validator `pnpm lint:articles:authors` checks every article author is a leadership partner whose `serviceSlugs[]` covers the article's service; leadership `expertise` tags realigned so `/team` cards no longer surface mismatched service signals. Phase 3 (`/team` profile enrichment, lead/co-lead avatar/link in dossier band) deferred.
- [~] About / Careers / Insights detail / Contact polished to the home + service-page baseline.
  - Acceptance: same typography rhythm, motion, spacing and section primitives as the homepage and Investment Banking page.
- [ ] Bespoke design centerpieces for the remaining eight service pages.
  - Acceptance: each service line gets its own brainstorm and bespoke centerpiece, modelled on the Investment Banking pattern. Eight pages currently render the elevated default.
- [ ] Approved brand assets audited.
  - Acceptance: usable logos, partner photos, team/culture images and profile visuals identified and approved for production.
- [ ] Batch-generate thumbnails for the remaining ~80 articles via the brand template.
  - Acceptance: a one-shot script reads every article with a thumbnail hook, hits Canva autofill, and writes the resulting JPGs into the article registry.
- [ ] Vercel go-live.
  - Acceptance: deploy to `nucleusadvisors.in` (currently "coming soon"), end-to-end tests pass against the live URL, partners sign off.

## Phase 1.5: Lead Capture Backend

Add practical backend storage for the forms already on the site, without
overbuilding into a full CMS.

### Build sequence

- [ ] Supabase project provisioned with secure key handling.
  - Acceptance: Supabase URL and keys configured in env, not committed.
- [ ] Contact form storage.
  - Acceptance: consultation enquiries stored with service interest, consent, source page and timestamp.
- [ ] Newsletter subscription storage.
  - Acceptance: subscription form captures consent and unsubscribe-ready fields.
- [~] Gated download capture.
  - Acceptance: the Resources modal stores each request (lead, asset, service interest, consent, source) and triggers partner email delivery. The capture flow is live on the site; persistence and email delivery are not yet wired to a backend.
- [ ] Career interest and job application storage.
  - Acceptance: candidate submissions stored separately from client leads, with reviewer visibility.
- [ ] Privacy / terms / disclaimer copy approved.
  - Acceptance: every form links to approved privacy/consent language; consent checkbox added to lead-capture modals before going live.
- [ ] Team can inspect submissions safely.
  - Acceptance: a minimal admin view (or secured database access) so the team can read leads even if the full admin UI waits for Phase 2.
- [ ] Form QA across all states.
  - Acceptance: success, error, loading, duplicate and validation states tested in browser.

## Phase 2: Content Engine + CMS

Move from static content to editable content with AI-assisted drafts and
partner self-serve authoring.

### Build sequence

- [ ] CMS schema, editor roles, publish workflow and audit history.
  - Acceptance: pages, sections, services, people, articles, lead magnets, media, FAQs, navigation and audit events are documented and migrated; draft / in-review / approved / scheduled / published / archived states all work; edits and reviewer actions are logged.
- [ ] Partner self-serve article authoring with on-the-fly thumbnail generation.
  - Acceptance: each partner can log into `/admin`, write a new article in a rich-text editor, and have the brand thumbnail generated automatically before sending the draft to a senior partner for review.
- [ ] Service-wise knowledge hubs.
  - Acceptance: articles, FAQs, downloads and case studies are filterable by service line on each service page and in the hub.
- [ ] Newsletter workflow.
  - Acceptance: issues can be drafted, reviewed, published and sent or exported.
- [ ] Website-to-LinkedIn draft pipeline.
  - Acceptance: approved website content can generate LinkedIn-ready copy and track the posted URL.
- [ ] AI-assisted advisory desk.
  - Acceptance: AI drafts articles and live updates from approved official sources (Income Tax, MCA, GST, RBI, SEBI, IBBI, ICAI) with source URL, retrieval date, service tags and SEO metadata. Nothing publishes without explicit partner approval.
- [ ] Live updates page.
  - Acceptance: approved regulatory updates surface with source, date, service line, affected audience and next step.

## Phase 3: Client Portal + M&A Deal Room

Logged-in workflows for clients, the internal team, and external M&A
deal partners.

### Build sequence

- [ ] Authentication and role-based access.
  - Acceptance: secure login for staff and client roles, with role-based visibility across all portal surfaces.
- [ ] Client portal core modules.
  - Acceptance: tasks, documents, billing/invoices and client updates work end-to-end. Internal staff workflows (attendance, internal notes) stay private from clients.
- [ ] M&A deal opportunity model.
  - Acceptance: internal M&A team can create draft / review / live / paused / closed / archived deals with structured metadata.
- [ ] External M&A partner profiles.
  - Acceptance: partner type, organization, interests, ticket size, geography, NDA status and access level captured for every external deal partner.
- [ ] Deal-level access controls and NDA gates.
  - Acceptance: partners see only permitted deals and documents; CIM, data room and sensitive docs require NDA or explicit approval.
- [ ] Interest tracking and Q&A flow.
  - Acceptance: partners can express interest, request documents, ask questions or decline; internal team responds and tracks status.
- [ ] Audit logs across all portal activity.
  - Acceptance: views, downloads, access changes, NDA events and status changes are logged for compliance review.

## Phase 4: Mobile

Reuse the Phase 3 APIs in a mobile app once the web portal is stable.

### Build sequence

- [ ] Mobile app architecture confirmed.
  - Acceptance: Expo / React Native app plan documented; shared API contracts ready.
- [ ] Mobile authentication flow.
  - Acceptance: users can securely log in on iOS and Android.
- [ ] Mobile client portal MVP.
  - Acceptance: tasks, updates and documents work on mobile.

## Open Inputs Needed From Vijay/Team

- [ ] Approved service-specific counters.
  - Needed for: service proof blocks on each service page.
- [ ] Partner photos and approved bios.
  - Needed for: team page and service author bylines.
- [~] Approved client logos.
  - 118 client logos extracted from `Nucleus Profile 2026.pdf` and staged under
    `apps/web/public/brand/clients/<service-line>/` on 2026-05-21. See
    `apps/web/public/brand/clients/README.md` for the inventory and the 5 logos
    flagged for confirmation.
  - Awaiting: Vijay's confirmation of the 5 unknowns, plus any reassignments
    across service lines. Then we can wire the per-service marquees.
- [ ] Approved offsite / culture images.
  - Needed for: Life at Nucleus.
- [ ] Alumni names, photos and outcomes with consent.
  - Needed for: alumni wall on `/careers/alumni`.
- [ ] Final office addresses and phone numbers.
  - Needed for: contact page and LocalBusiness schema.
- [ ] AIF / Soonicorn wording sign-off.
  - Needed for: AIF & Fund Management service page and Soonicorn proof callout.
- [ ] Privacy, terms and disclaimer wording.
  - Needed for: every form, insights hub and download flow before go-live.
- [ ] Hero animation source file.
  - Needed for: homepage hero motion accent.
- [ ] Vijay's content review of 10 Investment Banking long-form articles.
  - Needed for: flipping each article's reviewer status from pending to approved so it surfaces in production.
- [ ] Vijay's content review of 10 Investment Banking FAQ answers.
  - Needed for: production confidence in the FAQ block; decision pending on whether to track reviewer approval per question or per service.
- [~] Vijay's curation of client logos across all nine service pages.
  - First pass done: 118 logos bucketed by sector under
    `apps/web/public/brand/clients/`. Awaiting Vijay's confirmation/reassignment.
- [ ] Vijay's content review of four Investment Banking industry reports + one lead-magnet checklist.
  - Needed for: actual PDFs to back each title before flipping reports to "available" in production.
