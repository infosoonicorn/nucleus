# Nucleus Advisors Project Tracker

This is the living dashboard for the Nucleus website and platform build. Every agent must update this file when completing meaningful work.

Source of truth:

- Strategy/content: `docs/content-master.md`
- Architecture: `docs/architecture.md`
- Platform/CMS/backend logic: `docs/content-platform.md`
- Agent rules: `CLAUDE.md`
- Current handoff: `HANDOFF.md`

## How To Use This Tracker

Status legend:

- `[ ]` Not started
- `[~]` In progress, partially complete, or needs review
- `[x]` Complete and verified
- `[!]` Blocked or needs Vijay/team input

Update rules:

- Tick an item only when the acceptance criteria below it are satisfied.
- Add a short note when something is blocked or intentionally deferred.
- If a route, component, data model, or workflow changes, update related tracker items in the same change.
- Do not mark visible work done until it is verified in browser.
- Keep `HANDOFF.md` aligned after non-trivial tracker changes.
- All agents must read this tracker before starting work and update it before claiming a meaningful task is complete.
- If an agent discovers new work, it must be added here instead of staying only in chat.

## Executive Dashboard

| Area | Status | Completion Signal |
| --- | --- | --- |
| Strategy and architecture | `[x]` | Core positioning, service taxonomy, phases, content engine, careers engine, AIF/Soonicorn, M&A deal room documented |
| Phase 1 static website | `[~]` | Local content-structured site and route set built; deployed gate and approved asset audit remain |
| Phase 1.5 lightweight backend | `[ ]` | Lead forms, newsletter, gated downloads, job applications stored in backend |
| Phase 2 CMS/content engine | `[ ]` | CMS, AI drafts, review workflow, knowledge banks, website-to-LinkedIn drafts |
| Phase 3 portal/deal room | `[ ]` | Client portal and M&A partner deal room with permissions/audit logs |
| Phase 4 mobile | `[ ]` | Expo app using shared backend APIs |

## Current Snapshot

Last updated: 2026-05-15 — Investment Banking page is now end-to-end. Most recent landings (in order): FundraiseStages converted from scroll-pinned to timer autoplay; central `/insights` and `/reports` hubs with filterable listings replace the Phase-1 shells; IB sections reordered along the founder reading journey; FAQ rebuilt as 2-column editorial Q&A; unified Resources deck (horizontal scroller, 5 cards, framer-motion stagger) replaces the old LeadMagnet + IndustryReports preview, with a single capture modal (Name / Email / Company / Role) wired to a `/api/resources/request` stub that logs each capture with `resourceSlug` for interest tracking. Next active task is bringing About / Careers / Insights detail / Contact up to the home-v3 + service-v1 baseline.

Current branch: `main` (60+ ahead of origin — origin is intentionally untouched while production DNS still points "coming soon"). Push to origin requires explicit Vijay consent.

Recent commit landmarks on `main`:

- `f352492 feat(resources): unified deck + capture modal for all downloadables`
- `018dae7 feat(faq): 2-column layout on web (single column on mobile)`
- `784dd44 feat(faq): editorial Q&A column matching the dossier brand language`
- `01e6a1e refactor(ib): reorder sections along founder reading journey`
- `62efbee feat(insights+reports): central hubs with filters; service pages preview 4`
- `280b5de fix(ib): autoplay fundraise stages, drop scroll-jacking + tighten rhythm`
- `c982beb polish(web): unified section rhythm + headers + hairlines on IB page`

Current deployed preview:

- `https://nucleus-bay.vercel.app`

Current local app:

- `http://localhost:3000`

Important note:

- `Nucleus_Data For Reference/` is local reference only and must not be pushed.
- `outputs/` contains generated summaries/screenshots and is not source of truth.

## Phase 0: Strategy, Setup, And Governance

### Repository and Deployment Foundation

- [x] GitHub repository created for Nucleus.
  - Acceptance: repo exists at `infosoonicorn/nucleus`.
- [x] Vercel project connected to GitHub.
  - Acceptance: Vercel project URL documented and deployment working.
- [x] Cloudflare setup initiated.
  - Acceptance: nameservers updated and DNS approach documented.
- [x] Microsoft email DNS protection documented.
  - Acceptance: `CLAUDE.md` warns not to change MX/SPF/DKIM/DMARC unless Vijay asks.
- [x] Local reference folder protected.
  - Acceptance: `Nucleus_Data For Reference/` is in `.gitignore`.
- [x] Claude/Codex working rules documented.
  - Acceptance: `CLAUDE.md` and `docs/claude-onboarding.md` exist.
- [x] Browser verification workflow documented.
  - Acceptance: `docs/testing.md`, Playwright config, and e2e test exist.
- [x] Internal visual project tracker route created.
  - Acceptance: `/project-tracker` renders `docs/project-tracker.md` as a dashboard and is excluded from indexing.

### Strategy Documentation

- [x] Architecture documented.
  - Acceptance: `docs/architecture.md` contains phased roadmap.
- [x] Content master documented.
  - Acceptance: `docs/content-master.md` contains positioning, services, careers, insights, lead engine, SEO, portal hooks.
- [x] Content platform documented.
  - Acceptance: `docs/content-platform.md` contains CMS, AI, lead, careers, social, and deal room workflows.
- [x] Internal one-page summary created.
  - Acceptance: `outputs/nucleus-strategy-one-pager.pdf` generated for team feedback.
- [x] AIF & Fund Management added as service line.
  - Acceptance: content master and platform docs include AIF/Fund Management and Soonicorn proof guardrails.
- [x] Phase 3 M&A partner deal room added.
  - Acceptance: architecture/content/platform docs include deal room scope and controls.

## Phase 1: Static Premium Website

Goal:

Launch a premium, credible, fast public website with structured content. It should feel complete to visitors while remaining ready for CMS migration later.

### Phase 1 Build Sequence

- [x] Create structured content source.
  - Acceptance: services, navigation, homepage sections, proof, careers, insights shell, and CTAs are stored in reusable local content modules/data files rather than scattered hardcoded JSX.
- [x] Create full route skeleton.
  - Acceptance: routes exist for `/`, `/about`, `/services`, `/services/[slug]`, `/careers`, `/insights`, `/contact`.
- [x] Create optional shell routes.
  - Acceptance: placeholder/shell routes exist for `/careers/life-at-nucleus`, `/careers/alumni`, `/insights/live-updates`, `/downloads`, if included in Phase 1.
- [x] Build reusable design system components.
  - Acceptance: header, footer, hero, service cards, proof counters, CTA bands, article cards, form blocks, process/timeline blocks, and section wrappers exist.
- [x] Build homepage.
  - Acceptance: homepage clearly communicates incorporation-to-listing lifecycle, service universe, firm proof, Soonicorn/AIF proof, knowledge engine, careers teaser, and CTA.
- [x] Build services overview page.
  - Acceptance: all service lines are listed with short positioning, proof angle, and links to service pages.
- [x] Build reusable service detail layout.
  - Acceptance: one layout supports hero, who needs this, when to engage, how we help, process, proof, sample documents, knowledge bank, FAQs, lead magnet, related services, CTA.
- [x] Build all service pages.
  - Acceptance: pages exist for all core service lines listed below and use the shared layout.
- [x] Build careers main page.
  - Acceptance: page covers CA articleship, CA/MBA/graduate roles, learning tracks, Life at Nucleus teaser, alumni teaser, job post placeholder, candidate CTA.
- [x] Build insights shell.
  - Acceptance: page introduces knowledge bank, live updates, newsletters, lead magnets, and AI-assisted advisory desk as a future/internal workflow without fake live content.
- [x] Build contact page.
  - Acceptance: page includes locations, service-interest form UI, email, and clear consent language.
- [x] Build footer and navigation.
  - Acceptance: all visible nav links route correctly and footer includes services, careers, insights, contact, and policy placeholders where needed.
- [x] Responsive QA.
  - Acceptance: desktop and mobile views are checked in browser for homepage, service page, careers, insights, and contact.
- [x] Phase 1 local quality gate.
  - Acceptance: `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `pnpm test:e2e` pass.
- [ ] Phase 1 deployed quality gate.
  - Acceptance: Vercel deployment is checked and `PLAYWRIGHT_BASE_URL=https://nucleus-bay.vercel.app pnpm test:e2e` passes.

### Phase 1 Service Pages

- [x] Investment Banking page.
  - Acceptance: includes fundraising, modelling, investor readiness, diligence, deal support, lead magnet, FAQs, related experts.
- [x] M&A Advisory page.
  - Acceptance: includes buy-side/sell-side, restructuring, due diligence, valuation, transaction process, M&A readiness lead magnet.
- [x] Risk Advisory page.
  - Acceptance: includes internal audit, IFC/ICFR, process audit, controls, management action tracker, risk health check.
- [x] Tax & Regulatory page.
  - Acceptance: includes direct tax, GST, transfer pricing, international tax, assessments, compliance calendar, source/review disclaimers.
- [x] Assurance page.
  - Acceptance: includes statutory audit, limited review, bank audit, Ind AS/IFRS, audit readiness, sample PBC/checklist content.
- [x] Valuations page.
  - Acceptance: includes business, ESOP, FDI, brand, IFRS/Ind AS, transaction valuation, valuation readiness lead magnet.
- [x] Finance Outsourcing page.
  - Acceptance: includes accounting, MIS, payroll, controllership, vCFO, fixed assets, monthly MIS lead magnet.
- [x] Corporate Secretarial page.
  - Acceptance: includes incorporation, ROC, registers, board/shareholder documentation, due diligence, compliance calendar.
- [x] AIF & Fund Management page.
  - Acceptance: includes AIF setup, compliance maintenance, investor onboarding, documentation, fund operations, Soonicorn proof with guardrails.

### Phase 1 Visual And Asset Tasks

- [ ] Audit approved brand assets.
  - Acceptance: usable logos, partner photos, team/culture images, and profile visuals are identified without pushing raw reference folder.
- [x] Define visual direction.
  - Acceptance: dark/light mix, fintech-consulting tone, round-edge buttons, animated hero direction, and visual report hooks are implemented consistently.
- [x] Use real assets where approved.
  - Acceptance: no fake client logos, fake testimonials, fake team members, or fake live data.
- [x] Add motion carefully.
  - Acceptance: animations add premium feel without blocking readability or mobile performance.
- [x] Homepage motion redesign (Lenis + framer-motion + Lottie slot).
  - Acceptance: homepage uses Lenis smooth scroll, reusable motion primitives, scoped `.home-v3` design system; reduced-motion respected; lint/typecheck/build/e2e green; Lottie spec captured in `docs/home-hero-lottie-spec.md` (asset itself pending).
- [ ] Source hero Lottie animation.
  - Acceptance: a brand-tinted Lottie JSON sourced from LottieFiles or in-house motion artist is placed at `apps/web/public/lottie/nucleus-hero.json`. Spec: `docs/home-hero-lottie-spec.md`.
- [~] Apply motion / spacing language to remaining public pages.
  - Acceptance: About, Services overview, Service detail, Careers, Insights, Contact inherit the home-v3 typography rhythm and tasteful motion without a full per-page redesign.
  - Status (2026-05-15): Investment Banking is end-to-end (Hero, WhenToEngage, HowWeHelp bento, FundraiseStages autoplay, Process dossier, Soonicorn callout, Proof, Insights preview, Resources deck, FAQ 2-col editorial, RelatedServices, ContactBand). The 8 other service pages render the elevated default composition. `/insights` and `/reports` hubs are now real filterable listings (no longer Phase-1 shells). Section primitives in `apps/web/src/components/services/` and `apps/web/src/components/resources/` are ready for About / Careers / Insights detail / Contact slices.
- [x] Add service-specific proof blocks.
  - Acceptance: firm-wide counters stay on homepage; service pages use service-specific proof/counter placeholders where verified numbers are pending.
- [ ] Home page — page-wide unifying spine/thread.
  - Acceptance: a single visual element (recommended: left-edge numbered spine with red→navy gradient fill tied to scroll, reusing the `§NN` numbering vocabulary; alternatives B/C documented in chat) connects all home sections so the page reads as one journey rather than nine chapters.
  - Status (2026-05-13): deferred. To revisit after About / Services / Careers / Insights / Contact are at parity.
  - Note: design options documented in the 2026-05-13 conversation; option A (spine rail) recommended. Decisions still open: spine position (left vs right), label always-on vs hover.
- [x] Investment Banking service page — bespoke composition.
  - Acceptance: `/services/investment-banking` renders the bespoke composition with FundraiseStages (autoplay, 6 stages), HowWeHelp bento, Process dossier (4 phases, partner-signed), SoonicornCallout (orbital plate + 12 portfolio logos), ServiceInsights, ResourceDeck, FAQ editorial; lint, typecheck, build pass; manual browser verification clean. Section order follows the founder reading journey (identity → recognition → what → how → why-us → proof → read deeper → ask → CTA).
- [x] Central editorial hubs — `/insights` and `/reports` with filters.
  - Acceptance: `/insights` renders all articles across services with chip filters by service line and tag; `/reports` renders all industry reports with chip filters by service and report type; filters are URL-query-driven so views are shareable; service pages show first 4 items + "See all" link to the hub pre-filtered. Replaces the Phase-1 placeholder shells.
- [x] Long-form Insights articles infrastructure.
  - Acceptance: `apps/web/src/content/articles.ts` holds 10 IB articles authored by Vijay Singh Rathore (Founding Partner) with reviewer-status gate (drafts visible in dev only). Article reader route at `/insights/[slug]` with metadata, draft banner, back-to-insights link. Content awaits Vijay's per-article review before each `reviewerStatus` flips to `approved`.
- [x] Unified Resources deck + capture modal.
  - Acceptance: `apps/web/src/content/resources.ts` aggregates industry reports + lead-magnet checklists by service. `ResourceDeck` renders a horizontal-scroller of cards with framer-motion stagger and prev/next nav. Every "Get this" / "Request the full report" button opens the same `RequestResourceButton` modal (Name / Work email / Company / Role) wired to `POST /api/resources/request`, which validates and logs each capture as structured JSON with `resourceSlug`. Replaces the old separate LeadMagnet section and `/contact?report=…` dead-link pattern.
- [ ] Bespoke centerpieces for remaining 8 service pages.
  - Acceptance: each service line gets its own brainstorm + spec + bespoke centerpiece, modelled on the IB pattern. Currently rendering elevated default composition.
- [ ] Rename `.home-v3` CSS scope to a neutral name (e.g. `.np-base`).
  - Acceptance: mechanical find-replace across `globals.css` and all home components, builds clean.
- [ ] Deep-linkable fundraise stages (`?stage=outreach`).
  - Acceptance: URL param highlights a specific centerpiece stage on load. Partner-side feature (cherry-pick E2 deferred from IB build).
- [ ] Sector strip on service pages.
  - Acceptance: single row of covered sectors below hero. Needs approved sector list. (Cherry-pick E3 deferred from IB build.)
- [ ] Service-tinted hero atmosphere per service.
  - Acceptance: each service hero gets its own aurora/atmosphere variant. (Cherry-pick E4 deferred from IB build.)
- [ ] Source SVG of Soonicorn Ventures wordmark (currently PNG).
  - Acceptance: `apps/web/public/brand/soonicorn-ventures.svg` exists, page references SVG.
- [x] IB-specific FAQ content (10 Q+A pairs).
  - Acceptance: `services[].faq` populated for Investment Banking with 10 partner-voice answers covering engagement timing, diligence readiness, compensation, timeline, NDA, differentiation, legal-counsel split, post-close, Soonicorn conflict-of-interest, mandate sizing. Rendered as 2-column editorial Q&A on `/services/investment-banking`. Content still flagged for Vijay's content review before flipping each answer's `reviewerApprovedAt`.
- [ ] Quarterly review cadence for `insightSources`.
  - Acceptance: documented review schedule and partner ownership; pending items flipped to approved as confirmed.
- [ ] Soonicorn callout copy re-approval cycle.
  - Acceptance: documented re-review cadence; `reviewerApprovedAt` re-stamped on each pass.
- [ ] ArtefactStack mobile reduced-motion fallback consolidation.
  - Acceptance: revisit `<ArtefactStack>` so both fan and list paths are unified — currently the motion-on path renders both and toggles via CSS, which works but duplicates the data render.
- [ ] FundraiseStages reduced-motion hydration flash.
  - Acceptance: a user with `prefers-reduced-motion` may see a brief flash on first render before the JS `useReducedMotion` hook resolves; address via CSS media-query-driven rendering rather than JS branching.
- [ ] Phase 1.5 lead-magnet email validation.
  - Acceptance: when `/api/lead-magnet-stub` is replaced with the real Supabase write, swap `email.includes('@')` for a proper validator (zod schema or RFC-compliant regex).
- [ ] Lead-magnet stub edge-case tests.
  - Acceptance: add Playwright tests for empty-string email and malformed-but-present email (currently covered only for missing field).
- [ ] Pre-existing home.spec.ts nav flake.
  - Acceptance: investigate and fix the intermittent failure where clicking the "Services" nav link on `/` doesn't navigate. Separate investigation already underway.
- [ ] Vijay content review of 10 IB long-form articles.
  - Acceptance: Vijay reads each entry in `apps/web/src/content/articles.ts`, edits as needed, and flips each `reviewerStatus: 'pending'` to `'approved'` with `reviewerApprovedAt: 'YYYY-MM-DD'`. Until then, articles surface only in dev (the production gate hides drafts).
- [ ] Vijay content review of 10 IB FAQ answers.
  - Acceptance: Vijay reads each entry in `services[].faq` for Investment Banking. Currently surfaced without a per-answer reviewer stamp — discuss whether to extend the FAQ data model to track `reviewerApprovedAt` per Q or stamp at the service-level.
- [x] Investment Banking page — 2-column shell with sticky team / reports / CTA sidebar.
  - Acceptance: `/services/investment-banking` renders a 1fr | 320px grid on desktop ≥1100px (Hero, WhenToEngage, ClientLogos are full-width; everything else is in the main column alongside the sidebar). Right sidebar holds TeamBlock + SidebarLatestReports + SidebarCTA, is `position: sticky`, scrolls independently on hover. On <1100px, sidebar collapses below main. `apps/web/src/content/team.ts` is the single source of truth for partners + senior team across all services. Initial IB entries: Vijay Singh Rathore (Founding Partner), Samarth Pandey (Senior Associate).
- [ ] Confirm team-member emails + collect LinkedIn URLs + headshots.
  - Acceptance: review `apps/web/src/content/team.ts`; the IB emails (`vijay@nucleusadvisors.in`, `samarth@nucleusadvisors.in`) follow the firm convention but need partner confirmation (search for `// TODO confirm`). Add `linkedinUrl` per member so the LinkedIn button surfaces (hidden when empty). Drop headshot photos into `apps/web/public/team/<slug>.jpg` and set `headshotSrc` to replace the initials monogram avatars.
- [ ] Roll the 2-column shell + sidebar to the other 8 service pages.
  - Acceptance: update `ServicePageDefault` to wrap in `ServicePageShell` and render the same right sidebar. Empty sidebar slots render nothing (already handled by each block returning null). Tag team members with additional `serviceSlugs` as appropriate.
- [ ] Left section index / TOC for service pages.
  - Acceptance: left rail TOC explicitly deferred in this pass (Vijay opted to skip). When revived: clickable section list, sticky position, active-section highlight via IntersectionObserver, scrollIntoView on click, hidden below 1100px.
- [ ] /team and /team/[slug] pages.
  - Acceptance: a single "Team" route lists every member from `team.ts` grouped by seniority; each member has a full profile page at `/team/<slug>` with longer bio, services they work on, contact actions. Today the "Read profile" button on team cards opens a modal — Phase 2 swaps to a real route.
- [ ] Vijay curation of client logos across all 9 service pages.
  - Acceptance: review the 12 entries in `apps/web/src/content/clients.ts`. The `<ClientLogos>` strip is now wired into both the IB bespoke page AND the default service composition — every service page automatically renders the marquee when at least one client is tagged with its slug (renders nothing otherwise). Partner action: extend each entry's `serviceSlugs` array to include every service the logo legitimately belongs to (e.g. `['investment-banking', 'ma-advisory']`). Also decide which 12 (or other set) belong on IB vs the Soonicorn proof block to avoid the identical list appearing twice on the same page.
- [ ] Vijay content review of 4 IB industry reports + 1 lead-magnet checklist.
  - Acceptance: review each entry in `apps/web/src/content/reports.ts` and `apps/web/src/content/resources.ts` (downloadables block). Need actual PDFs to back each title before flipping any to "available" in production — currently the API returns success copy that promises an email, but no PDF delivery exists yet (Phase 1.5).
- [ ] Pre-fill / acknowledge `report` query param on `/contact`.
  - Acceptance: if `?report=<slug>` is present, `/contact` shows a small banner ("Report request: <title>") and pre-fills the form's enquiry textarea. The old "Request the full report → /contact?report=…" pattern is now superseded by the Resources modal, but stray inbound links from search/cache may still land here. Either redirect to `/reports?service=…` or honour the param. Low priority.
- [ ] Local dev: avoid `.next/` cache corruption from OneDrive sync.
  - Acceptance: project's `.next/` is symlinked to `~/.cache/nucleus-advisors-web/next` on Vijay's machine (manual setup, not git-tracked). Document this in `docs/claude-onboarding.md` or `README.md` so any future agent / new machine setup doesn't hit the recurring `Compaction failed: Another write batch or compaction is already active` Turbopack failure. Long-term fix: move repo out of `~/Documents/` or exclude `.next/` in OneDrive preferences.
- [ ] Phase 1.5 captures persistence to file (interim before Supabase).
  - Acceptance: `/api/resources/request` writes each capture line to `~/Library/Application Support/nucleus-advisors/lead-captures.jsonl` so requests survive dev server restarts. Today they only live in stdout. Drop once Supabase is wired.
- [ ] Consent + privacy copy on Resources modal.
  - Acceptance: before pushing to origin, add a "By submitting, you agree to be contacted about this resource. See our Privacy Policy" line + checkbox (or unticked-acknowledgement) — required for India/EU GDPR-style follow-ups.

## Phase 1.5: Lightweight Backend

Goal:

Add practical backend capture before full CMS, without overbuilding.

- [ ] Supabase project created.
  - Acceptance: Supabase URL/keys configured safely in env, not committed.
- [ ] Contact form storage.
  - Acceptance: consultation enquiries are stored with service interest, consent, source page, and timestamp.
- [ ] Newsletter subscription storage.
  - Acceptance: subscription form captures consent and unsubscribe-ready fields.
- [~] Gated download capture.
  - Acceptance: lead magnet form stores lead, asset, service interest, consent, and source.
  - Status (2026-05-15): Phase 1 stub live — `POST /api/resources/request` validates payload against the central `resources.ts` registry and logs each capture as structured JSON (`resourceSlug, resourceTitle, resourceKind, serviceSlugs, name, email, company, role, receivedAt`) to the server console. Same modal flow is wired to every "Get this" / "Request the full report" CTA across `/services/*` and `/reports`. Phase 1.5 swap: replace the `console.warn` with a Supabase `lead_captures` insert and trigger the partner email delivery; add explicit consent checkbox + privacy-policy link; add rate limiting (Cloudflare Turnstile) before pushing to origin.
- [ ] Career interest/job application storage.
  - Acceptance: candidate submissions are separated from client leads.
- [ ] Basic admin visibility.
  - Acceptance: team can inspect submissions safely, even if full admin UI waits for Phase 2.
- [ ] Form testing.
  - Acceptance: success/error/loading/duplicate/validation states tested.

## Phase 2: CMS, Content Engine, And Distribution

Goal:

Move from static structured content to editable content, AI-assisted drafts, service knowledge hubs, newsletters, and social distribution.

### CMS Foundation

- [ ] CMS schema designed.
  - Acceptance: pages, sections, services, people, articles, lead magnets, media, FAQs, navigation, audit events documented and migrated.
- [ ] CMS editor roles created.
  - Acceptance: admin, editor, reviewer, staff, client roles exist where needed.
- [ ] Publish workflow implemented.
  - Acceptance: draft, in_review, approved, scheduled, published, archived states work.
- [ ] Audit history implemented.
  - Acceptance: edits, publish/unpublish, reviewer actions, and important changes are logged.
- [ ] Static content migration plan completed.
  - Acceptance: Phase 1 content can be migrated into CMS without redesign.

### Knowledge And Lead Engine

- [ ] Service-wise knowledge banks implemented.
  - Acceptance: articles/FAQs/downloads/case studies can be filtered by service.
- [ ] Lead magnets implemented.
  - Acceptance: each service has at least one gated checklist/report/template.
- [ ] Newsletter workflow implemented.
  - Acceptance: issues can be drafted, reviewed, published, and sent/exported.
- [ ] Website-to-LinkedIn draft workflow implemented.
  - Acceptance: approved website content can generate LinkedIn-ready copy and track posted URL.
- [ ] Visual report template created.
  - Acceptance: downloadable reports have a premium reusable design format.

### AI-Assisted Advisory Desk

- [ ] Official source monitoring configured.
  - Acceptance: approved sources are stored and monitored for Income Tax, MCA, GST/CBIC, RBI, SEBI, IBBI, ICAI, etc.
- [ ] AI draft pipeline implemented.
  - Acceptance: AI drafts updates/articles with source URL, retrieval date, service tags, SEO metadata, FAQs, CTA.
- [ ] Partner/reviewer mapping implemented.
  - Acceptance: drafts route to correct service-line reviewer/partner.
- [ ] No auto-publish guardrail implemented.
  - Acceptance: AI-generated content cannot publish without human approval.
- [ ] Live updates page implemented.
  - Acceptance: approved updates show source, date, service line, affected audience, and next step.

## Phase 3: Portal And M&A Partner Deal Room

Goal:

Build logged-in workflows for clients, internal team, and approved external deal partners.

### Client/Internal Portal

- [ ] Authentication implemented.
  - Acceptance: secure login for staff/client roles.
- [ ] Profiles and organizations implemented.
  - Acceptance: users belong to organizations/entities with role-based access.
- [ ] Client tasks module.
  - Acceptance: internal team can assign tasks; clients see only approved/client-visible tasks.
- [ ] Documents module.
  - Acceptance: signed URLs/private storage; internal/client visibility separated.
- [ ] Billing/invoice module.
  - Acceptance: invoices/billing records visible according to permissions.
- [ ] Attendance/internal team module.
  - Acceptance: internal staff workflows are private from clients.
- [ ] Client updates module.
  - Acceptance: client-specific updates can be posted and audited.

### M&A Partner Deal Room

- [ ] Deal opportunity model.
  - Acceptance: internal M&A team can create draft/review/live/paused/closed/archived deals.
- [ ] External partner profiles.
  - Acceptance: partner type, organization, interests, ticket size, geography, NDA status, access level captured.
- [ ] Deal-level access controls.
  - Acceptance: partners see only permitted deals and documents.
- [ ] NDA/approval gates.
  - Acceptance: CIM/data room/sensitive docs require NDA or explicit approval.
- [ ] Interest tracking.
  - Acceptance: partners can express interest, request docs, ask questions, decline.
- [ ] Q&A and follow-up workflow.
  - Acceptance: internal team can respond, track status, and assign follow-ups.
- [ ] Audit logs.
  - Acceptance: views, downloads, access changes, NDA events, and status changes are logged.
- [ ] Confidentiality QA.
  - Acceptance: no public indexing, no cross-deal leakage, no internal notes visible externally.

## Phase 4: Mobile

Goal:

Reuse the same backend APIs for mobile when web portal workflows are stable.

- [ ] Mobile app architecture confirmed.
  - Acceptance: Expo/React Native app plan documented.
- [ ] Shared API/contracts ready.
  - Acceptance: mobile can reuse packages/types/validation.
- [ ] Mobile auth flow.
  - Acceptance: users can securely log in.
- [ ] Mobile client portal MVP.
  - Acceptance: tasks, updates, and documents work on mobile.

## Cross-Cutting Completion Gates

### Content Quality

- [ ] No fake content.
  - Acceptance: no fake clients, fake testimonials, fake invoices, fake team members, or fake activity.
- [ ] Regulatory wording reviewed.
  - Acceptance: tax/legal/AIF content uses review disclaimers and avoids improper claims.
- [ ] Soonicorn positioning reviewed.
  - Acceptance: Nucleus/Soonicorn relationship is clear without fund solicitation.
- [ ] Partner attribution reviewed.
  - Acceptance: no partner is shown as author/reviewer without approval.
- [ ] Case study approval policy followed.
  - Acceptance: case studies are anonymised unless explicit approval exists.

### SEO And Analytics

- [ ] Metadata complete.
  - Acceptance: every public page has title, description, canonical intent, and OG image plan.
- [ ] Sitemap and robots checked.
  - Acceptance: public pages indexable; private portal/deal room non-indexable.
- [ ] Schema added where relevant.
  - Acceptance: Organization, Service, Person, Article, FAQPage, BreadcrumbList considered.
- [ ] Analytics plan implemented.
  - Acceptance: traffic/conversion events tracked without violating consent rules.

### Privacy, Consent, And Security

- [ ] Privacy policy placeholder or page.
  - Acceptance: contact/download/newsletter/career forms link to privacy/consent language.
- [ ] Consent captured.
  - Acceptance: newsletter, lead, candidate, and download consent stored with timestamp/version once backend exists.
- [ ] Private routes protected.
  - Acceptance: client portal and M&A deal room cannot be indexed or accessed publicly.
- [ ] Secrets protected.
  - Acceptance: no env/secrets committed.

### Verification

- [ ] Local quality gate.
  - Acceptance: `pnpm lint`, `pnpm typecheck`, `pnpm build`, `pnpm test:e2e` pass.
- [ ] Browser QA.
  - Acceptance: desktop and mobile screenshots reviewed for key public routes.
- [ ] Deployed QA.
  - Acceptance: Vercel URL tested after deployment.
- [ ] Handoff updated.
  - Acceptance: `HANDOFF.md` reflects current status, changed files, tests, blockers, and next step.

## Open Inputs Needed From Vijay/Team

- [ ] Confirm approved service-specific counters.
  - Needed for: service proof blocks.
- [ ] Confirm partner photos and bios for website use.
  - Needed for: team/service author pages.
- [ ] Confirm client logos that can be publicly shown.
  - Needed for: proof sections.
- [ ] Confirm approved offsite/culture images.
  - Needed for: Life at Nucleus.
- [ ] Confirm alumni names/photos/outcomes with consent.
  - Needed for: alumni wall.
- [ ] Confirm final contact numbers and office addresses.
  - Needed for: contact page and LocalBusiness schema.
- [ ] Confirm AIF/Soonicorn wording.
  - Needed for: AIF & Fund Management page.
- [ ] Confirm privacy/terms/disclaimer wording.
  - Needed for: forms, insights, downloads.
- [ ] Source hero Lottie file.
  - Needed for: hero "Advisory coverage" canvas accent (`apps/web/public/lottie/nucleus-hero.json`). Spec in `docs/home-hero-lottie-spec.md`.
- [x] Reviewer-approved entries in `apps/web/src/content/insights-sources.ts` for Investment Banking.
  - Resolution (2026-05-14): all 4 IB regulatory entries approved with `reviewerApprovedAt: '2026-05-14'`; RBI source URL corrected. The Regulatory Updates surface is currently deferred to Phase 2 (needs dynamic monitoring) — the panel is not shown on the IB page; `ServiceInsights` now renders long-form articles instead.

## Parking Lot

Ideas intentionally deferred until after Phase 1:

- Full Supabase CMS.
- AI-assisted source monitoring.
- Public calculators/tools.
- Automated newsletter sending.
- LinkedIn API posting.
- Full client portal.
- M&A partner deal room.
- Mobile app.
