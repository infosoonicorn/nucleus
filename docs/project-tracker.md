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

Last updated: 2026-05-13 — home polish pass landed (nav blur, moments rail grid, hero counters derived, proof single-source, lifecycle scroll trimmed). Home spine/thread refinement intentionally deferred; next active task is bringing About / Services / Careers / Insights / Contact up to the home-v3 motion + typography baseline.

Current branch: `main` (also `claude/sleepy-kirch-f73f38` worktree).

Current commit baseline:

- `867763a chore(web): add framer-motion, lenis, lottie-react, clsx, tailwind-merge, tailwindcss-animate`
- Homepage motion redesign committed on top of the above (this pass).

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
  - Status (2026-05-14): Services slice landed for Investment Banking (bespoke composition with FundraiseStages, ArtefactStack, SoonicornCallout, ServiceInsights primitives) and elevated default composition for the other 8 service pages. Section primitives in `apps/web/src/components/services/` ready for About / Careers / Insights / Contact slices.
- [x] Add service-specific proof blocks.
  - Acceptance: firm-wide counters stay on homepage; service pages use service-specific proof/counter placeholders where verified numbers are pending.
- [ ] Home page — page-wide unifying spine/thread.
  - Acceptance: a single visual element (recommended: left-edge numbered spine with red→navy gradient fill tied to scroll, reusing the `§NN` numbering vocabulary; alternatives B/C documented in chat) connects all home sections so the page reads as one journey rather than nine chapters.
  - Status (2026-05-13): deferred. To revisit after About / Services / Careers / Insights / Contact are at parity.
  - Note: design options documented in the 2026-05-13 conversation; option A (spine rail) recommended. Decisions still open: spine position (left vs right), label always-on vs hover.
- [x] Investment Banking service page — bespoke composition.
  - Acceptance: `/services/investment-banking` renders the bespoke composition with FundraiseStages, ArtefactStack, SoonicornCallout, ServiceInsights; lint, typecheck, build, e2e pass; manual browser verification clean.
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
- [ ] IB-specific FAQ content (4 Q+A pairs).
  - Acceptance: `services[].faq` populated for Investment Banking, partner-approved.
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

## Phase 1.5: Lightweight Backend

Goal:

Add practical backend capture before full CMS, without overbuilding.

- [ ] Supabase project created.
  - Acceptance: Supabase URL/keys configured safely in env, not committed.
- [ ] Contact form storage.
  - Acceptance: consultation enquiries are stored with service interest, consent, source page, and timestamp.
- [ ] Newsletter subscription storage.
  - Acceptance: subscription form captures consent and unsubscribe-ready fields.
- [ ] Gated download capture.
  - Acceptance: lead magnet form stores lead, asset, service interest, consent, and source.
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
- [!] Three reviewer-approved entries in `apps/web/src/content/insights-sources.ts` for Investment Banking.
  - Needed for: visible "Regulatory updates we're tracking" panel on the IB page. Component currently shows a friendly empty-state message until at least one item flips to approved.

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
