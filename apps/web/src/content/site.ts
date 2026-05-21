import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  Crown,
  Factory,
  FileCheck2,
  Landmark,
  LineChart,
  Rocket,
  Scale,
  ShieldCheck,
  Wallet,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type ServiceCrossLinkBase = {
  kind: 'in-house-fund' | 'partner' | 'related-firm';
  brand: string;
  logoPath: string;          // path under /public, e.g. '/brand/soonicorn-ventures.png'
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  href: string;              // external URL
  disclaimer: string;
};

export type ServiceCrossLink =
  | (ServiceCrossLinkBase & { reviewerStatus: 'approved'; reviewerApprovedAt: string })
  | (ServiceCrossLinkBase & { reviewerStatus: 'pending'; reviewerApprovedAt?: never });

export type IndustryReport = {
  slug: string;                 // url-safe identifier
  title: string;
  abstract: string;             // 1-2 lines for the card
  reportType: string;           // 'Sector report' | 'Working paper' | 'Data sheet' etc.
  pages: number;                // page count for the cover meta
  publishedOn: string;          // YYYY-MM-DD
  tags: string[];               // ['Fundraise', 'India']
  status: 'available' | 'coming-soon';
};

export type ProcessDossierPhase = {
  ordinal: string;            // e.g. '●01'
  name: string;                // e.g. 'Mandate & scope'
  weeks: string;               // e.g. 'Weeks 1-2'
  desc: string;                // longer paragraph shown when phase is active
  items: string[];             // bullets shown when phase is active
  deliv: string;               // deliverable label
  stampLine: string;           // italic line on the wax/ink stamp once phase is signed off
};

export type ProcessDossier = {
  fileLabel: string;           // 'N · Engagement File / 042 — 2026'
  fileBadge: string;           // 'File 042-2026 · In progress'
  projectName: string;         // 'Anonymised mandate' or similar — italic serif
  engagementType: string;      // 'Sell-side · Primary fundraise'
  /** Per-service dossier title. May contain `<em>...</em>` markers for
   *  italic-red emphasis. Example: "From <em>mandate</em>, to <em>wire</em>." */
  headline?: string;
  phases: ProcessDossierPhase[]; // 4 phases
};

export type HelpItem = {
  title: string;
  summary: string;                          // one-line meta for small cards (dot-separated etc.)
  body: string;                             // longer paragraph for the flagship card
  bullets: string[];                        // detail bullets shown in the flagship card
  badge?: string;                           // optional eyebrow on the flagship card, e.g. 'Flagship mandate'
};

/**
 * Track-record metric shown in the count-up row inside ClientLogos.
 * Reusable across all service lines — each entry animates from 0 to
 * `value` when scrolled into view. The label sits beneath in mono.
 *
 *   { value: 30,  suffix: '+',   label: 'Mandates run' }
 *   { value: 200, prefix: '$',   suffix: 'M+', label: 'Capital raised' }
 */
export type Metric = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

export type Service = {
  title: string;
  slug: string;
  summary: string;
  promise: string;
  seoTitle: string;
  metaDescription: string;
  howWeHelp: string[];                      // legacy flat list; used by default composition
  howWeHelpDetailed?: HelpItem[];           // rich bento payload; when present, used instead
  deliverables: string[];
  experts: string[];
  leadMagnet: string;
  cta: string;
  proof?: string[];
  icon: LucideIcon;
  /** Track-record counters — exactly 4 metrics render in a row above
   *  the client-logo marquee. Reusable across service lines. */
  metrics?: Metric[];
  /** Two-digit ordinal: '01' through '09'. Drives the ●NN eyebrow on service pages. */
  ordinal: string;
  displayHeadline?: string;                 // 3-word punchier hero headline; falls back to title.
  heroLive?: string;                        // editorial strip beneath the CTAs (e.g. "Partner-led mandates · $3M–$50M · India + cross-border"); hides if absent.
  whenToEngage?: { if: string; then: string }[]; // 4 IF/THEN scenario pairs; fallback shows generic checklist if absent.
  process?: { name: string; text: string }[]; // Custom engagement phases; falls back to generic 4-phase if absent.
  processTitle?: string;                       // Optional custom section title for Process; falls back to "A clear engagement path for {service.title}."
  processDossier?: ProcessDossier;             // Rich "engagement file" dossier rendering. When present, replaces the simple timeline.
  // industryReports moved to `apps/web/src/content/reports.ts` (centralised across services).
  faq?: { q: string; a?: string }[];        // a falls back to 'Updating soon' when absent.
  crossLink?: ServiceCrossLink;             // Optional cross-link panel data.
};

export const site = {
  name: 'Nucleus Advisors',
  email: 'info@nucleusadvisors.in',
  linkedin: 'https://in.linkedin.com/company/nucleusadvisors',
  locations: ['Gurugram', 'Bangalore', 'Jaipur', 'Faridabad', 'Bhatinda'],
};

export const navigation = [
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Team', href: '/team' },
  { label: 'Insights', href: '/insights' },
  { label: 'Careers', href: '/careers' },
  { label: 'Contact', href: '/contact' },
];

import { team } from './team';

export type ProofPoint = {
  /** Stable identifier for lookup by consumers (e.g. the /team hero
   *  hand-picks specific counters without relying on array position). */
  slug: 'partners' | 'team' | 'clients' | 'deals' | 'offices' | 'experience';
  value: number;
  suffix: string;
  label: string;
};

// Partner count is derived from team.ts: every leadership-group member
// is a partner. Add or remove a partner there and every proof bar +
// metadata description that reads from `proof` updates automatically.
const partnerCount = team.filter((m) => m.group === 'leadership').length;

export const proof: ProofPoint[] = [
  { slug: 'partners',   value: partnerCount, suffix: '', label: 'Partners' },
  { slug: 'team',       value: 90,           suffix: '+', label: 'Team members' },
  { slug: 'clients',    value: 300,          suffix: '+', label: 'Clients served' },
  { slug: 'deals',      value: 100,          suffix: '+', label: 'Deals closed' },
  { slug: 'offices',    value: 5,            suffix: '', label: 'Offices' },
  { slug: 'experience', value: 100,          suffix: '+', label: 'Years combined experience' },
];

export function getProofBySlug(slug: ProofPoint['slug']): ProofPoint {
  const found = proof.find((p) => p.slug === slug);
  if (!found) throw new Error(`proof missing slug "${slug}"`);
  return found;
}

// Manual review date for proof figures. Bump when the headcount/deals/offices
// numbers above are re-validated by partners. Surfaced on the proof strip.
export const proofAsOf = { iso: '2026-05', label: 'May 2026' } as const;

export const lifecycle = [
  {
    title: 'Incorporation and early compliance',
    text: 'Company formation, statutory setup, registrations, accounting foundations and compliance calendars.',
  },
  {
    title: 'First finance stack',
    text: 'Bookkeeping, MIS, payroll, GST, tax filings, investor-friendly reporting and finance process setup.',
  },
  {
    title: 'Fundraising and investor readiness',
    text: 'Models, pitch decks, due diligence, valuation, data rooms and investor targeting.',
  },
  {
    title: 'Growth and control building',
    text: 'Internal audit, IFC, process improvement, controllership, tax planning and regulatory discipline.',
  },
  {
    title: 'Transactions and restructuring',
    text: 'M&A, mergers, demergers, diligence, valuation and transaction documentation support.',
  },
  {
    title: 'Scale and listing readiness',
    text: 'Audit readiness, Ind AS, controls, governance, reporting discipline and board-level dashboards.',
  },
];

export const decisiveMoments = [
  'Raising capital or preparing for a transaction.',
  'Buying, selling, merging or restructuring a business.',
  'Strengthening internal controls, IFC and risk management.',
  'Improving finance operations, bookkeeping, MIS and controllership.',
  'Handling tax, GST, transfer pricing and regulatory complexity.',
  'Preparing valuations, diligence packs and investor material.',
  'Meeting audit, assurance and Ind AS expectations.',
];

export const services: Service[] = [
  {
    title: 'Investment Banking',
    slug: 'investment-banking',
    summary:
      'Fundraising, investor targeting, financial modelling, pitch decks, due diligence support and transaction closure.',
    promise:
      'We help founders and businesses prepare, position and execute capital raises and strategic transactions with disciplined financial storytelling.',
    seoTitle: 'Investment Banking Advisory in India | Fundraising & Deal Support',
    metaDescription:
      'Nucleus Advisors supports startups, growth companies, investors and family offices with fundraising, financial modelling, pitch decks, due diligence, investor targeting and deal closure.',
    howWeHelp: [
      'Fundraising readiness assessment.',
      'Financial modelling and scenario planning.',
      'Investor pitch decks and information memorandums.',
      'Investor targeting and outreach support.',
      'Financial due diligence preparation.',
      'Term sheet and transaction support.',
      'Post-investment monitoring support for funds and family offices.',
    ],
    howWeHelpDetailed: [
      {
        badge: 'Flagship mandate',
        title: 'Fundraising readiness',
        summary: 'Readiness assessment · governance · data-room scoping',
        body: 'The work that decides whether a round happens — a clean readiness assessment, governance review, and a data-room scoped to investor expectations before outreach begins.',
        bullets: [
          'Readiness assessment',
          'Governance & cap-table review',
          'Data-room scoping',
          'Founder & board briefings',
        ],
      },
      {
        title: 'Financial modelling',
        summary: 'Operating models · scenarios · cap-table walks',
        body: '3-statement model with sensitivity tabs and base/bull/bear scenarios. Cap-table walks for primary and secondary stress-tested for what investors actually probe.',
        bullets: [
          '3-statement model',
          'Base / bull / bear scenarios',
          'Sensitivity tabs',
          'Cap-table walks',
        ],
      },
      {
        title: 'Investor narrative',
        summary: 'Pitch deck · information memorandum · investor FAQ',
        body: 'Narrative-first deck, IM, and reactive FAQ pack — sector-tuned, decision-grade, and built around the questions investors actually open first.',
        bullets: [
          'Pitch deck',
          'Information memorandum',
          'Investor FAQ pack',
          'Sector framing',
        ],
      },
      {
        title: 'Investor outreach',
        summary: 'Curated targeting · warm intros · banker management',
        body: 'Investor mapping by stage and sector, intro coordination, and the outreach cadence we run for you or alongside your team.',
        bullets: [
          'Investor mapping',
          'Target list build',
          'Intro coordination',
          'Outreach cadence',
        ],
      },
      {
        title: 'Diligence preparation',
        summary: 'Vendor DD · Q&A management · technical & commercial reviews',
        body: 'Pre-emptive DD pack, Q&A workflow with named owners, and technical / commercial reviews that get ahead of investor questions.',
        bullets: [
          'Vendor DD pack',
          'Q&A management',
          'Technical reviews',
          'Commercial reviews',
        ],
      },
      {
        title: 'Transaction support',
        summary: 'Termsheet · SHA negotiation · closing mechanics',
        body: 'Term sheet line-by-line review, SHA negotiation alongside legal counsel, and signing / closing coordination through to wire.',
        bullets: [
          'Termsheet review',
          'SHA negotiation',
          'Closing mechanics',
          'Workplan & milestones',
        ],
      },
      {
        title: 'Portfolio stewardship',
        summary: 'Post-investment monitoring for funds & family offices',
        body: 'Post-close governance: investor reporting cadence, board-pack quality, and covenant tracking for funds and family offices.',
        bullets: [
          'Investor reporting cadence',
          'Board-pack quality',
          'Covenant tracking',
          'Portfolio MIS',
        ],
      },
    ],
    deliverables: [
      'Fundraise readiness report.',
      'Financial model.',
      'Investor deck.',
      'Information memorandum.',
      'Due diligence checklist and data room structure.',
      'Investor target list.',
      'Transaction workplan.',
    ],
    experts: ['CA Vijay Singh Rathore', 'CA Aakash Kalra', 'Samarth Pandey'],
    leadMagnet: 'Fundraise Readiness Checklist',
    cta: 'Discuss your fundraise',
    icon: Landmark,
    /* Placeholder metrics — Vijay to verify exact numbers before pushing
       to origin. Tracker item logged. */
    metrics: [
      { value: 30,  suffix: '+',  label: 'Mandates run' },
      { value: 200, prefix: '$', suffix: 'M+', label: 'Capital raised' },
      { value: 18,  suffix: ' wk', label: 'Avg close timeline' },
      { value: 12,  suffix: '+',  label: 'Funds in active network' },
    ],
    ordinal: '01',
    displayHeadline: 'Prepare. Position. Close.',
    heroLive: 'Partner-led mandates · $3M–$50M · India + cross-border',
    whenToEngage: [
      {
        if: 'Raising your next round and the model needs to hold up to investor diligence.',
        then: 'We pressure-test the model, build the storyline, and package what investors actually open first.',
      },
      {
        if: 'Term sheet on the table — clauses and dilution math need a second pair of eyes.',
        then: 'We translate the term sheet line by line and benchmark against current market.',
      },
      {
        if: 'Board pushing fundraise readiness in a 60–90 day window.',
        then: 'We compress the 12-week fundraise into a workplan with named owners.',
      },
      {
        if: 'Considering a strategic exit and need a defensible valuation.',
        then: 'We build the valuation defense pack — DCF, comps, transaction precedents — and rehearse the negotiation.',
      },
      {
        if: 'Investor map needs to go beyond a few warm intros — actively reaching out to fit-stage funds and family offices.',
        then: 'We segment the universe, build the target list with intros, and run the outreach calendar for you.',
      },
      {
        if: 'Post-investment governance pressure — investor reporting cadence, board pack quality, covenant tracking.',
        then: 'We design the investor-MIS pack, set the cadence, and surface variances before the next board call.',
      },
    ],
    processTitle: 'From mandate, to wire.',
    process: [
      {
        name: 'Mandate & scope',
        text: 'Define what a successful round looks like, agree the workplan, set fees, timeline, and named owners on both sides.',
      },
      {
        name: 'Build & pressure-test',
        text: 'Model, deck, IM. Every assumption stress-tested as if hostile investor diligence is already running.',
      },
      {
        name: 'Market & manage',
        text: 'Investor mapping, outreach calendar, intro coordination, and Q&A management. We run the campaign so you can run the company.',
      },
      {
        name: 'Close & transition',
        text: 'Term sheet review, SHA negotiation alongside legal, signing and wire coordination, then investor-reporting cadence handed back to the team.',
      },
    ],
    processDossier: {
      fileLabel: 'N · Engagement File / 042 — 2026',
      fileBadge: 'File 042 · 2026 — illustrative',
      projectName: 'Anonymised mandate',
      engagementType: 'Sell-side · Primary fundraise',
      headline: 'From <em>mandate</em>, to <em>wire</em>.',
      phases: [
        {
          ordinal: '●01',
          name: 'Mandate & scope',
          weeks: 'Weeks 1–2',
          desc: 'Define what a successful round looks like, agree the workplan, set fees, timeline, and named owners on both sides.',
          items: ['Success criteria', 'Workplan & owners', 'Fees & timeline'],
          deliv: 'Engagement letter',
          stampLine: 'Aligned',
        },
        {
          ordinal: '●02',
          name: 'Build & pressure-test',
          weeks: 'Weeks 3–6',
          desc: 'Model, deck, IM. Every assumption stress-tested as if hostile investor diligence is already running.',
          items: ['Operating model', 'Pitch deck', 'Information memo'],
          deliv: 'Investor-ready pack',
          stampLine: 'Stress-tested',
        },
        {
          ordinal: '●03',
          name: 'Market & manage',
          weeks: 'Weeks 7–12',
          desc: 'Investor mapping, outreach calendar, intro coordination, and Q&A management. We run the campaign so you can run the company.',
          items: ['Investor map', 'Outreach calendar', 'Q&A management'],
          deliv: 'Live process + warm intros',
          stampLine: 'In market',
        },
        {
          ordinal: '●04',
          name: 'Close & handover',
          weeks: 'Weeks 13–16 + 90-day handover',
          desc: "Term sheet locked, SHA negotiated alongside counsel, signing and wire coordinated. Then ninety days of post-wire handover — first board cadence, investor-reporting template, cap-table refresh, KPI dashboard moved to the in-house team — and the file is formally closed. No retainer tail, no recurring fee.",
          items: [
            'Term sheet + SHA close',
            'Signing, wire, allocations confirmed',
            '90-day handover: board, IR, cap-table',
            'File closed · partner on call as advisor',
          ],
          deliv: 'Closed round, transitioned cleanly',
          stampLine: 'Closed',
        },
      ],
    },
    crossLink: {
      kind: 'in-house-fund',
      brand: 'Soonicorn Ventures',
      logoPath: '/brand/soonicorn-ventures.png',
      eyebrow: '● In-house capital alongside advisory',
      title: 'Soonicorn Ventures',
      body: "Nucleus is Investment Manager to Soonicorn Angel Trust-I, an early-stage fund focused on seed and pre-Series A startups raising up to US $1M. If your round fits the fund's mandate, you can also explore Soonicorn Ventures directly.",
      ctaLabel: 'Visit Soonicorn Ventures',
      href: 'https://soonicornventures.com/',
      disclaimer: 'This is not an offer or solicitation to invest in or raise from any fund or security. Any engagement with Soonicorn Ventures is subject to its fund mandate, stage and sector fit, and independent diligence.',
      reviewerStatus: 'approved',
      reviewerApprovedAt: '2026-05-14',
    },
    faq: [
      {
        q: 'When should we engage a banker versus raising on our own network?',
        a: "Most founders start on their own network — and that works for the first cheque or two. The case for bringing in a banker is usually one of three things. First, the round has grown past your circle: you need a wider investor map than your existing intros, run a proper process, and protect yourself from a single-source negotiation. Second, the work has grown beyond a side-of-desk effort: model, deck, IM, diligence pack, Q&A — that's a full-time job for several weeks and pulls a founder off the company at the worst possible moment. Third, you've been told the cap-table or valuation needs to be defended, and you'd rather have someone whose only job is to defend it. If none of those are true, hold off. If two are true, talk to us.",
      },
      {
        q: 'What does "investor diligence ready" actually mean?',
        a: "Most founders think it means a clean deck and a working model. It actually means everything an investor will ask in the next 60 days is already in the data room, labelled and version-controlled. That's the model — three statements, base / bull / bear, sensitivity tabs, and a cap-table walk including ESOP top-ups. It's the IM that anticipates the FAQ pack. It's a clean board-resolution trail, signed shareholder agreements, audited financials for the last three years, a tax position note, and a one-page summary of every material contract. It's the answers to the awkward questions — customer concentration, key-person risk, related-party transactions — written down before they're asked. Being ready means the diligence call ends faster than it started.",
      },
      {
        q: 'How is Nucleus compensated — retainer or success-fee?',
        a: 'Both, structured to keep our interests on the same side as yours. A monthly retainer covers the working time we put in regardless of round outcome — model, deck, IM, partner hours, project management. A success fee, structured as a percentage of the round closed, recognises that fundraising is binary and our job is to actually get it done. The retainer is typically modest and the success fee is the larger number. Exact terms depend on round size, complexity, geography of investors, and whether we are running a process end-to-end or supporting one your team already started. We share a fee proposal after the first one-hour scoping call — no obligation, no surprise.',
      },
      {
        q: 'What is a typical fundraise timeline with Nucleus?',
        a: "For a primary Series A or B in India, plan on 14 to 18 weeks from engagement letter to wire — assuming readiness work is done in parallel and there are no governance or audit issues to fix first. Roughly: weeks 1–2 are scope and workplan. Weeks 3–6 are build — model, deck, IM, diligence pack. Weeks 7–12 are market — investor outreach, intro coordination, term sheet conversations. Weeks 13–18 are close — term sheet selection, diligence, SHA negotiation, signing, wire. Outliers go faster (a hot round with pre-emptive interest can close in 8 weeks) or slower (a complex carve-out or strategic process can take 6–9 months). We tell you what the realistic range looks like in the first scoping call, not after we've signed you up.",
      },
      {
        q: 'Do you sign an NDA before our first meeting?',
        a: "Yes — happy to. Most first meetings are exploratory enough that an NDA isn't strictly needed, but if you'd prefer to share specific numbers, customer names, or deal context, we sign a standard mutual NDA before you do. Our template is one page and we are happy to mark up yours instead. Either way, anything you share stays inside Nucleus and is not shared with other clients or with portfolio companies of Soonicorn Ventures unless you have explicitly consented to a specific introduction.",
      },
      {
        q: 'How are you different from a boutique IB or a Big-4 corporate finance team?',
        a: "Three differences in practice. First — staffing. The partner you meet is the partner who does the work. There is no junior pool dropped on you after the engagement letter is signed. Second — scope flexibility. Boutiques tend to want a full-process mandate or nothing. Big-4 corporate finance teams are billed by the hour and incentivised to expand scope. We can run end-to-end or plug in to a specific part of an in-flight process — readiness audit, investor map, term sheet review — without forcing a full-stack engagement. Third — the in-house fund. Soonicorn Ventures, our sister entity, gives us a working view of what investors look at because we ARE investors. Most banker shops describe diligence; we live it from the other side every week.",
      },
      {
        q: 'Will you work alongside our legal counsel during the deal?',
        a: 'Yes — and we strongly recommend you keep your own counsel rather than using one we suggest. Our role on the legal side is commercial translation, not legal advice. We read the term sheet line by line with you, flag the clauses that materially shift dilution, governance, or downside protection, and brief your lawyer on what the round actually needs. Your lawyer drafts and negotiates the SHA and other definitive documents. We sit in the room with both sides during the negotiation and make sure the commercial intent does not get lost in the legal language. That division of labour keeps you faster and protected.',
      },
      {
        q: 'What happens after the round closes — does the engagement end?',
        a: 'The fundraise engagement does, but the relationship usually does not. The last two weeks of our mandate are spent on transition — investor-reporting cadence handed back to your team, board-pack template handed over, covenant tracker set up, the first quarterly update drafted alongside your CFO. Beyond that, most founders we work with come back for the next round, an M&A conversation, or a valuation when a secondary or ESOP event comes up. Some retain us on a low-volume basis for ongoing board prep and investor relations. We do not lock you into anything — every continuation is a fresh, smaller engagement scoped at the time.',
      },
      {
        q: 'Can you also raise from Soonicorn Ventures, your in-house fund?',
        a: 'In theory yes, in practice rarely the headline. Soonicorn Ventures is a SEBI-registered Category I AIF run by Nucleus that backs seed and pre-Series A startups raising up to US $1M. If your round fits the fund mandate, Soonicorn may participate alongside other investors. Two things to know. First, the fund cannot lead a round we are advising on — that would be a conflict of interest, and the SEBI AIF regulations are clear on it. We disclose any participation up front, get your written acknowledgement, and price the cheque on the same terms as the rest of the round. Second, most Nucleus IB mandates are larger than Soonicorn writes — Series A and beyond. For those, Soonicorn is not in the conversation.',
      },
      {
        q: 'What size of round do you take mandates for?',
        a: 'Practically, US $3M and up. The economics of running a full process — partner-led staffing, model, deck, IM, diligence, term sheet negotiation, close — only work above that threshold. Below it, the right move is usually a lighter readiness audit and an investor map, not a full mandate. We are happy to do that smaller piece of work for founders we like. At the other end, the largest round we have been involved in to date is just over US $50M; we have run multi-strategy buy-side mandates above that in M&A, but for primary fundraises that is roughly the upper bound for an India-anchored mid-market bench.',
      },
    ],
    // Industry reports now centralised in `apps/web/src/content/reports.ts`
    // and queried via `getReportsForService('investment-banking')`.
  },
  {
    title: 'M&A Advisory',
    slug: 'ma-advisory',
    summary:
      'Buy-side, sell-side, mergers, demergers, restructuring, succession planning, transaction strategy and documentation support.',
    promise:
      'We support businesses through the strategic, financial, compliance and execution layers of mergers, acquisitions and restructuring.',
    seoTitle: 'M&A Advisory in India | Buy-Side, Sell-Side & Restructuring',
    metaDescription:
      'Nucleus Advisors advises companies on M&A strategy, due diligence, mergers, demergers, restructuring, transaction modelling and deal execution.',
    howWeHelp: [
      'Transaction strategy and feasibility assessment.',
      'Buy-side and sell-side transaction support.',
      'Mergers, demergers and restructuring advisory.',
      'Due diligence coordination.',
      'Valuation and transaction modelling.',
      'Investor and acquirer material.',
      'Transaction documentation support with legal and secretarial teams.',
      'Succession planning — founder exits and family-business ownership transitions.',
    ],
    howWeHelpDetailed: [
      {
        badge: 'Flagship mandate',
        title: 'Buy-side mandates',
        summary: 'Strategic targeting · diligence · negotiation',
        body: 'End-to-end buy-side advisory — target screening, valuation triangulation, diligence coordination, and term-sheet negotiation through to close.',
        bullets: [
          'Target screening',
          'Strategic-fit assessment',
          'Diligence coordination',
          'Term-sheet negotiation',
        ],
      },
      {
        title: 'Sell-side mandates',
        summary: 'Process design · buyer outreach · close',
        body: 'Sell-side process from teaser through to close — buyer mapping, CIM, data-room, Q&A management, and bid evaluation.',
        bullets: [
          'Teaser & CIM',
          'Buyer mapping',
          'Data-room build',
          'Bid evaluation',
        ],
      },
      {
        title: 'Restructuring & demergers',
        summary: 'Group simplification · spin-offs · scheme work',
        body: 'Group reorganisation, demergers, slump sales and scheme-of-arrangement work — commercial design, tax structuring, and regulatory coordination.',
        bullets: [
          'Group simplification',
          'Demerger schemes',
          'Slump-sale structuring',
          'Holding-company moves',
        ],
      },
      {
        title: 'Transaction modelling',
        summary: 'Valuation · synergies · sensitivity',
        body: 'Deal model with valuation triangulation, synergy build, accretion-dilution analysis and downside sensitivities — the math management defends in the boardroom.',
        bullets: [
          'Valuation triangulation',
          'Synergy quantification',
          'Accretion-dilution',
          'Sensitivity layers',
        ],
      },
      {
        title: 'Diligence coordination',
        summary: 'Vendor DD · Q&A · issue tracking',
        body: 'Diligence orchestration across financial, commercial, tax, legal and technical streams — issue tracker driven to accountable closure.',
        bullets: [
          'Vendor DD pack',
          'Q&A management',
          'Issue tracker',
          'Workstream coordination',
        ],
      },
      {
        title: 'Documentation & close',
        summary: 'SPA / SHA · CPs · closing mechanics',
        body: 'Commercial drafting alongside legal counsel — SPA / SHA negotiation, CP tracking, signing and closing mechanics through to wire.',
        bullets: [
          'SPA / SHA negotiation',
          'Conditions-precedent tracking',
          'Signing coordination',
          'Closing mechanics',
        ],
      },
      {
        title: 'Succession planning',
        summary: 'Ownership transition · founder exit · family handover',
        body: 'Structured ownership and leadership transitions — founder exits, family-business handovers, and management buy-outs — with valuation, holdco design and governance worked through before the conversation gets emotional.',
        bullets: [
          'Founder exit structuring',
          'Family-business handover',
          'Holdco & estate design',
          'Leadership transition',
        ],
      },
    ],
    processDossier: {
      fileLabel: 'N · Engagement File / 071 — 2026',
      fileBadge: 'File 071 · 2026 — illustrative',
      projectName: 'Anonymised M&A mandate',
      engagementType: 'Buy-side · Strategic acquisition',
      headline: 'From <em>scope</em>, to <em>signed deal</em>.',
      phases: [
        {
          ordinal: '●01',
          name: 'Scope & target screening',
          weeks: 'Weeks 1–3',
          desc: 'Investment thesis, strategic fit framework, target screening universe, and a shortlist filtered to companies worth approaching.',
          items: [
            'Investment thesis',
            'Strategic-fit framework',
            'Target universe',
            'Shortlist filter',
          ],
          deliv: 'Engagement letter',
          stampLine: 'Aligned',
        },
        {
          ordinal: '●02',
          name: 'Outreach & dialogue',
          weeks: 'Weeks 4–8',
          desc: 'Approach letters, exploratory meetings, IOI / NBO management, and the bilateral diligence that turns interest into a serious conversation.',
          items: [
            'Approach letters',
            'Exploratory dialogue',
            'IOI / NBO management',
            'Bilateral diligence',
          ],
          deliv: 'Shortlist with live engagement',
          stampLine: 'Engaged',
        },
        {
          ordinal: '●03',
          name: 'Diligence & negotiation',
          weeks: 'Weeks 9–14',
          desc: 'Vendor / buy-side DD coordination, Q&A management, valuation triangulation, and term-sheet negotiation alongside counsel.',
          items: [
            'Diligence coordination',
            'Q&A management',
            'Valuation triangulation',
            'Term sheet negotiation',
          ],
          deliv: 'Signed term sheet',
          stampLine: 'Negotiated',
        },
        {
          ordinal: '●04',
          name: 'Close & integration handover',
          weeks: 'Weeks 15–20 + 60-day handover',
          desc: 'SPA / SHA negotiation, conditions-precedent tracking, signing and wire coordination — then a 60-day integration handover with the in-house leadership.',
          items: [
            'SPA / SHA close',
            'CP tracking',
            'Signing & wire',
            '60-day integration handover',
          ],
          deliv: 'Closed transaction, integrated cleanly',
          stampLine: 'Closed',
        },
      ],
    },
    faq: [
      {
        q: 'When does a company need M&A advisory versus running the process internally?',
        a: 'Internal teams can handle conversations with a known counterparty. The case for M&A advisory is usually one of three: the universe of potential buyers or targets is wider than your network and needs systematic mapping; the diligence, negotiation and documentation load is too heavy to handle alongside operating the company; or you want a third party in the room when terms are negotiated so the relationship with the other side stays clean. If none of those are true, hold off. If two are true, talk to us.',
      },
      {
        q: "What's the difference between buy-side and sell-side mandates?",
        a: 'Buy-side means we work for the acquirer — target screening, approach, diligence and negotiation. Sell-side means we work for the seller — process design, buyer outreach, CIM and bid evaluation. Same partners, different posture. On a sell-side we run a competitive process to get to the best price; on a buy-side we run a structured search and a disciplined negotiation. We take both, but never both sides of the same transaction.',
      },
      {
        q: 'How are M&A fees structured?',
        a: "A modest monthly retainer covers partner-led work — strategy memos, model, diligence coordination, documentation alongside counsel. A success fee, structured as a percentage of transaction value, only triggers on a closed deal. The retainer is fully creditable against the success fee. Exact rates depend on transaction size, complexity and whether it's buy-side or sell-side, and land on the engagement letter before kick-off. No back-loaded surprises, no out-of-pocket markups.",
      },
      {
        q: 'What is a typical M&A timeline with Nucleus?',
        a: "Plan on sixteen to twenty weeks for a mid-market transaction from engagement letter to close, give or take two weeks. The variable is the other side's pace, not the prep. The first six weeks are scope, target screening, and approach. Weeks seven to twelve are dialogue and diligence. Weeks thirteen to twenty are term sheet, SPA / SHA negotiation, CP tracking and close. Restructuring or cross-border transactions can stretch to twenty-four to twenty-eight weeks.",
      },
      {
        q: 'Do you sign an NDA before the first meeting?',
        a: 'Yes. A short, mutual NDA goes out the same day a founder or board reaches out — before any materials change hands either direction. The form is one page, 24-month tail, India-law unless the counterparty is incorporated abroad. Internally we maintain Chinese walls between the IB / M&A team and Soonicorn Ventures, our in-house fund. Any potential conflict is flagged in writing before kick-off, not buried in a footer.',
      },
      {
        q: 'How are you different from boutique M&A houses or Big-4 corporate finance?',
        a: 'Most boutique and Big-4 teams sell with partners and deliver with juniors. We staff partner-deep, run a handful of mandates at a time rather than thirty, and the team is built from former founders and ex-CFOs rather than audit or consulting alumni. Fees are mostly success-aligned rather than retainer-heavy, so our incentive is the same as yours: a clean close. We also stay engaged for sixty days post-close on integration handover.',
      },
      {
        q: 'Will you work alongside our legal counsel?',
        a: 'Always. Bring your own counsel — we run the commercial workstream, they run the legal one, and we sit in the same room at term sheet, SPA and SHA. Our lane is valuation, structure, deal economics and process discipline. Counsel drives SPA / SHA drafting, reps and warranties, governance, regulatory filings and closing mechanics. We never receive referral economics from counsel introductions — that is on the engagement letter.',
      },
      {
        q: 'What happens if the transaction falls through?',
        a: "You owe the retainer for the time spent — that's it. The success component never triggers without a wire. We document why the transaction didn't close, what to fix before re-attempting, and whether the strategic logic still holds. Many companies come back twelve to eighteen months later with a sharper view. We hold the file open without charge for that period.",
      },
      {
        q: "Can Soonicorn Ventures participate in a deal you're running?",
        a: "Soonicorn cannot lead a transaction we are advising on — that would be a conflict, and SEBI AIF regulations are clear on it. As a non-lead, smaller-cheque participant in a competitive process, yes, with disclosure to all parties in writing before any materials are shared. Most of our M&A mandates sit above Soonicorn's investment band anyway, so the question rarely comes up.",
      },
      {
        q: 'What size of transactions do you take mandates for?',
        a: "Practically, transaction values from US $5M and up for a full mandate. Below that, the economics of partner-led delivery don't work — we are happy to do a lighter strategic review, target map, or term-sheet read for founders we like, scoped as a fixed-fee project. At the upper end our typical mandates sit in the US $5M to US $100M band; we have run buy-side strategic mandates above that.",
      },
    ],
    deliverables: [
      'Transaction feasibility note.',
      'Deal model.',
      'Valuation note.',
      'Information memorandum.',
      'Diligence issue tracker.',
      'Negotiation support pack.',
      'Closing checklist.',
    ],
    experts: [
      'CA Pravesh Goel',
      'CA Vijay Singh Rathore',
      'CA Aakash Kalra',
      'CS Neha Rathore',
    ],
    leadMagnet: 'M&A Readiness Checklist',
    cta: 'Evaluate a transaction',
    icon: BriefcaseBusiness,
    // TODO: Vijay to verify M&A metrics before pushing to origin.
    metrics: [
      { value: 20, suffix: '+',  label: 'Deals advised' },
      { value: 150, prefix: '$', suffix: 'M+', label: 'Aggregate deal value' },
      { value: 20, suffix: ' wk', label: 'Avg deal timeline' },
      { value: 40, suffix: '+',  label: 'Strategic buyers in network' },
    ],
    ordinal: '02',
    heroLive: 'Buy-side & sell-side · $5M–$100M · India + cross-border',
    whenToEngage: [
      {
        if: 'Receiving informal interest from a strategic acquirer and need to decide whether to engage.',
        then: 'We run a feasibility note covering valuation range, deal structure options, and the diligence you would be put through.',
      },
      {
        if: 'Considering a buy-side acquisition to consolidate a market or buy capability.',
        then: 'We screen targets, model the synergies, manage diligence, and structure the deal documentation.',
      },
      {
        if: 'Family or co-founder restructuring forces a demerger, share transfer, or buyout.',
        then: 'We work alongside legal and secretarial teams to engineer the restructuring, valuation defense, and tax-efficient execution.',
      },
      {
        if: 'Heading into a closing call with a price gap that needs to be defended.',
        then: 'We build the negotiation pack, walk into the room with you, and translate price into deal value.',
      },
      {
        if: 'Running a sell-side process — preparing the company for a structured auction with multiple acquirers.',
        then: 'We build the teaser, IM, deal model, and run the data room and Q&A workflow through diligence and signing.',
      },
      {
        if: 'Internal pre-deal valuation needed to anchor the ask before approaching counterparties.',
        then: 'We model the value bridge — DCF, comps, precedents — and stress-test what a hostile diligence would push back on.',
      },
    ],
  },
  {
    title: 'Risk Advisory',
    slug: 'risk-advisory',
    summary:
      'Internal audit, IFC, ICFR, process audits, revenue audits, concurrent audits and process re-engineering.',
    promise:
      'We help management teams identify control gaps, reduce operating risk and build processes that scale.',
    seoTitle: 'Risk Advisory, Internal Audit & IFC Consulting | Nucleus Advisors',
    metaDescription:
      'Nucleus Advisors helps companies strengthen internal audit, IFC, ICFR, risk management, process controls, revenue audits, concurrent audits and process re-engineering.',
    howWeHelp: [
      'Internal audits.',
      'Risk assessment.',
      'IFC and ICFR implementation or review.',
      'Process audits and process re-engineering.',
      'Revenue audits and concurrent audits.',
      'Special audits.',
      'PPE and physical verification.',
      'Fraud and forensic investigations where required.',
    ],
    howWeHelpDetailed: [
      {
        badge: 'Flagship mandate',
        title: 'Internal audit',
        summary: 'Annual plan · scope · evidence-based reports',
        body: 'Risk-based internal audit programme — annual scope, fieldwork, evidence-backed observations, and an action tracker the audit committee can follow.',
        bullets: [
          'Annual audit plan',
          'Risk-based scoping',
          'Field testing',
          'Action tracker',
        ],
      },
      {
        title: 'IFC / ICFR',
        summary: 'Design assessment · operating effectiveness · remediation',
        body: 'Internal Financial Controls design and operating-effectiveness reviews — process narratives, test results, deficiency notes and remediation roadmap.',
        bullets: [
          'Design assessment',
          'Operating-effectiveness testing',
          'Deficiency notes',
          'Remediation plan',
        ],
      },
      {
        title: 'Process audits',
        summary: 'Process maps · gap notes · re-engineering',
        body: 'End-to-end process reviews across procure-to-pay, order-to-cash, hire-to-retire and record-to-report — gap notes, re-engineering recommendations, KPI design.',
        bullets: [
          'Process mapping',
          'Gap analysis',
          'Re-engineering',
          'KPI design',
        ],
      },
      {
        title: 'Revenue & concurrent audits',
        summary: 'Cycle reviews · independent sign-off',
        body: 'Cycle audits over revenue, treasury, inventory or any high-risk function — independent sign-off the board, regulator or lender relies on.',
        bullets: [
          'Revenue cycle reviews',
          'Concurrent audits',
          'Inventory verification',
          'Treasury reviews',
        ],
      },
      {
        title: 'Forensic & investigation',
        summary: 'Fraud · whistleblower · evidence preservation',
        body: 'Forensic investigations on whistleblower complaints, vendor fraud, expense leakage or financial statement irregularities — evidence-preserving, board-ready reports.',
        bullets: [
          'Fraud investigation',
          'Whistleblower review',
          'Evidence preservation',
          'Board reporting',
        ],
      },
      {
        title: 'Asset verification',
        summary: 'PPE register · physical · location-tagged',
        body: 'Fixed-asset verification — register reconciliation, physical tagging, location confirmation and audit-ready evidence.',
        bullets: [
          'Register reconciliation',
          'Physical verification',
          'Location tagging',
          'Discrepancy notes',
        ],
      },
    ],
    processDossier: {
      fileLabel: 'N · Engagement File / 112 — 2026',
      fileBadge: 'File 112 · 2026 — illustrative',
      projectName: 'Anonymised internal audit mandate',
      engagementType: 'Risk-based internal audit · annual plan',
      headline: 'From <em>risk universe</em>, to <em>action tracker</em>.',
      phases: [
        {
          ordinal: '●01',
          name: 'Risk universe & scoping',
          weeks: 'Weeks 1–2',
          desc: 'Risk-and-control register, audit-committee-aligned scoping, materiality thresholds, and an annual plan with owners on both sides.',
          items: [
            'Risk-and-control register',
            'Materiality thresholds',
            'Audit-committee alignment',
            'Annual plan',
          ],
          deliv: 'Approved audit plan',
          stampLine: 'Approved',
        },
        {
          ordinal: '●02',
          name: 'Walkthroughs & control design',
          weeks: 'Weeks 3–6',
          desc: 'Process walkthroughs, narrative documentation, control matrix, and design-effectiveness conclusions for every in-scope cycle.',
          items: [
            'Process walkthroughs',
            'Control narratives',
            'Design effectiveness',
            'Control matrix',
          ],
          deliv: 'Documented control environment',
          stampLine: 'Walked',
        },
        {
          ordinal: '●03',
          name: 'Testing & evidence',
          weeks: 'Weeks 7–14',
          desc: 'Sample-based testing of operating effectiveness, evidence collection, exception tracking, and management responses captured live.',
          items: [
            'Sample testing',
            'Evidence collection',
            'Exception tracking',
            'Management responses',
          ],
          deliv: 'Test workpapers + exceptions log',
          stampLine: 'Tested',
        },
        {
          ordinal: '●04',
          name: 'Report & action tracker',
          weeks: 'Weeks 15–16 + ongoing tracker',
          desc: 'Audit-committee report, prioritised observations, remediation roadmap, and a quarterly action tracker that management runs.',
          items: [
            'Audit-committee report',
            'Prioritised observations',
            'Remediation roadmap',
            'Quarterly action tracker',
          ],
          deliv: 'Audit report + live action tracker',
          stampLine: 'Reported',
        },
      ],
    },
    faq: [
      {
        q: 'When should we bring in external internal audit instead of building in-house?',
        a: "Build in-house when the company has hit a scale where a permanent function pays for itself — usually past 300 employees or multiple business units. Bring in external internal audit when the audit committee wants independent assurance, when there's a regulatory trigger (IFC / ICFR for listed entities), or when in-house attempts have created findings without action. We are also brought in to bootstrap an internal audit function — set the methodology, build the team, hand over in twelve to eighteen months.",
      },
      {
        q: "What's the right scope for an annual internal audit plan?",
        a: "Risk-based — derive the plan from a current risk-and-control register, not from last year's checklist. We typically cover the top eight to twelve cycles in year one: procure-to-pay, order-to-cash, payroll, treasury, fixed assets, inventory, IT general controls and the two or three cycles material to your sector. The audit committee approves the plan; we deliver it across the year with quarterly status updates.",
      },
      {
        q: 'How are internal audit fees structured?',
        a: "Annual retainer scoped to the approved plan, billed monthly. The retainer covers fieldwork, reporting and the action-tracker reviews. Out-of-scope special audits (forensic, fraud, M&A-related) are scoped and billed separately at engagement-level rates. We don't bill by the hour — predictable annual budgeting matters more to CFOs than precise time tracking.",
      },
      {
        q: "What's the timeline for a first-year IFC / ICFR implementation?",
        a: 'Sixteen to twenty weeks for a mid-sized listed entity to reach a documented, tested and remediated control environment. The first six weeks are scoping and walkthroughs; weeks seven to fourteen are design and operating-effectiveness testing; the final six weeks are remediation, retesting and the audit-committee report. After year one, the maintenance cadence drops to roughly forty percent of that effort annually.',
      },
      {
        q: 'How do you handle confidentiality around findings?',
        a: 'Findings go to the audit committee and management — never to anyone else inside or outside the firm. We sign mutual NDAs at engagement letter stage. Our workpapers are stored on access-controlled servers, separated from other client engagements, and destroyed seven years after engagement close as professional standards require.',
      },
      {
        q: 'How are you different from Big-4 internal audit?',
        a: 'Same staffing point as our other practices — Big-4 teams sell with partners and deliver with junior consultants. We staff partner-deep, run fewer engagements, and the partner you meet is the partner who signs the report. Our methodology is the same as Big-4 (IIA standards, risk-based audit, IFC / ICFR aligned to SOX-equivalent rigour) — what differs is who is actually in the room.',
      },
      {
        q: 'Will you work with our existing internal audit team?',
        a: "Yes, and often that's the structure that works best. We co-source — your team does the routine cycle audits, we cover the specialised or higher-risk areas, and our partner sits on the audit committee briefing. After eighteen to twenty-four months your team usually owns ninety percent of the work and we step into a quality-assurance role.",
      },
      {
        q: 'What happens to the action tracker after the engagement?',
        a: 'It belongs to you — we hand over the live tracker, the methodology, and the templates at the end of the engagement. We continue to review the tracker quarterly during the retainer; after the retainer ends, you run it. Most clients keep the quarterly review going on a smaller retainer rather than letting the tracker go stale.',
      },
      {
        q: 'Can the same firm do both statutory audit and internal audit?',
        a: "Not for the same company. Independence rules in the Companies Act and ICAI's code prohibit it. If we already do your statutory audit, we cannot also do internal audit, and vice versa. We sometimes pair with another firm doing the audit we cannot — but the engagement letter makes that crystal clear from day one.",
      },
      {
        q: 'What size companies do you typically work with?',
        a: "Mid-market — typically companies with revenue between INR 50 crore and INR 2,000 crore. Smaller companies usually don't need a full internal audit function yet; larger companies often have built one in-house. The sweet spot for an external partner-led practice is that mid band, where the audit committee wants independent assurance but a full in-house function isn't yet warranted.",
      },
    ],
    deliverables: [
      'Risk and control matrix.',
      'Internal audit plan.',
      'Audit observations and management action tracker.',
      'IFC/ICFR design and operating effectiveness report.',
      'Process improvement roadmap.',
      'Board or audit committee reporting pack.',
    ],
    experts: ['CA Ashish Gupta', 'CA Abhishek Gupta', 'Geetanjali Virmani'],
    leadMagnet: 'Internal Controls Health Check',
    cta: 'Review your control environment',
    icon: ShieldCheck,
    // TODO: Vijay to verify Risk Advisory metrics.
    metrics: [
      { value: 60, suffix: '+',  label: 'Internal audits delivered' },
      { value: 40, suffix: '+',  label: 'Companies served' },
      { value: 12, suffix: '+',  label: 'IFC / ICFR engagements' },
      { value: 8,  suffix: ' wk', label: 'Avg engagement length' },
    ],
    ordinal: '03',
    heroLive: 'Risk-based audits · IFC / ICFR · mid-market India',
    whenToEngage: [
      {
        if: 'Audit committee wants a formal internal audit calendar across business units this year.',
        then: 'We design the audit universe, prioritise by risk, and deliver an issue-tracker the committee can review quarterly.',
      },
      {
        if: 'IFC and ICFR controls are out of date and the statutory auditor flagged design gaps.',
        then: 'We rebuild the risk-control matrix, test operating effectiveness, and close design gaps before the next audit cycle.',
      },
      {
        if: 'Revenue leakage suspected — distributors, branch network, or e-commerce returns feel out of pattern.',
        then: 'We run a revenue audit, surface leakage and override patterns, and design controls to stop the recurrence.',
      },
      {
        if: 'A fraud or whistleblower complaint needs an independent investigation.',
        then: 'We scope a forensic review, secure evidence, and report findings with disciplinary and recovery recommendations.',
      },
      {
        if: 'Concurrent audit needed at branches or warehouses to keep daily exceptions in check.',
        then: 'We deploy concurrent audit teams, design daily exception reporting, and escalate breakdowns the same week.',
      },
      {
        if: 'Process bottleneck — order-to-cash or procure-to-pay cycles are slow and error-prone.',
        then: 'We map the as-is process, design the to-be flow, and rebuild the controls to scale with volume.',
      },
    ],
  },
  {
    title: 'Tax & Regulatory',
    slug: 'tax-regulatory',
    summary:
      'Direct tax, international tax, transfer pricing, GST, regulatory filings, assessments and advisory.',
    promise:
      'We help businesses manage tax and regulatory complexity without losing sight of commercial decisions.',
    seoTitle: 'Tax & Regulatory Advisory | Direct Tax, GST & Transfer Pricing',
    metaDescription:
      'Nucleus Advisors advises businesses on direct tax, international tax, transfer pricing, GST, tax assessments, statutory filings and regulatory compliance.',
    howWeHelp: [
      'Domestic tax advisory and filings.',
      'International tax and treaty advisory.',
      'Transfer pricing advisory and documentation.',
      'GST registration, filings, audits, refunds and advisory.',
      'Tax assessments and opinions.',
      'Statutory compliance.',
      'Regulatory coordination for company matters.',
    ],
    howWeHelpDetailed: [
      {
        badge: 'Flagship mandate',
        title: 'Direct tax',
        summary: 'Advisory · planning · assessment representation',
        body: 'Corporate and individual direct tax — annual returns, planning, structuring views, and representation before assessing officers and appellate authorities.',
        bullets: [
          'Annual returns',
          'Tax planning',
          'Assessment representation',
          'Appellate work',
        ],
      },
      {
        title: 'International tax & treaty',
        summary: 'Cross-border structuring · DTAA application',
        body: 'Cross-border transactions — DTAA application, place-of-effective-management review, withholding analysis and POEM/BEPS-aware structuring.',
        bullets: [
          'DTAA analysis',
          'Cross-border structuring',
          'Withholding review',
          'POEM / BEPS notes',
        ],
      },
      {
        title: 'Transfer pricing',
        summary: 'Documentation · benchmarking · APAs',
        body: 'Transfer pricing documentation, benchmarking studies, master file / country-by-country reporting, and advance pricing agreement support.',
        bullets: [
          'TP documentation',
          'Benchmarking study',
          'Master file / CbCR',
          'APA support',
        ],
      },
      {
        title: 'GST advisory & litigation',
        summary: 'Registration · returns · refunds · disputes',
        body: 'End-to-end GST — registrations, monthly / annual returns, refund applications, audits, and representation in notices and appeals.',
        bullets: [
          'Registrations & returns',
          'Refund applications',
          'GST audits',
          'Notice & appeal representation',
        ],
      },
      {
        title: 'Tax controversy',
        summary: 'Notices · appeals · representation',
        body: 'Tax notice management and appellate representation — CIT(A), ITAT and high-court briefings alongside counsel.',
        bullets: [
          'Notice management',
          'CIT(A) appeals',
          'ITAT representation',
          'Counsel briefings',
        ],
      },
      {
        title: 'Compliance calendar',
        summary: 'Year-round filings · reminders · status',
        body: 'Living compliance calendar across direct, indirect and statutory filings — owners, due dates, reminders and a single status view for the CFO.',
        bullets: [
          'Annual filing tracker',
          'Owner mapping',
          'Due-date reminders',
          'CFO status view',
        ],
      },
    ],
    processDossier: {
      fileLabel: 'N · Engagement File / 184 — 2026',
      fileBadge: 'File 184 · 2026 — illustrative',
      projectName: 'Anonymised tax engagement',
      engagementType: 'Direct tax · assessment & advisory',
      headline: 'From <em>position</em>, to <em>assessment closed</em>.',
      phases: [
        {
          ordinal: '●01',
          name: 'Position review',
          weeks: 'Weeks 1–2',
          desc: 'Read the prior returns, assessment history, group structure and material positions — surface what an officer is likely to question.',
          items: [
            'Prior-year returns',
            'Assessment history',
            'Group structure',
            'Position memo',
          ],
          deliv: 'Position memo',
          stampLine: 'Reviewed',
        },
        {
          ordinal: '●02',
          name: 'Compliance & documentation',
          weeks: 'Weeks 3–6',
          desc: 'Current-year returns, transfer-pricing documentation, supporting workings and audit-ready tax workpapers.',
          items: [
            'Annual returns',
            'TP documentation',
            'Supporting workings',
            'Audit-ready papers',
          ],
          deliv: 'Filed returns + TP documentation',
          stampLine: 'Filed',
        },
        {
          ordinal: '●03',
          name: 'Assessment & representation',
          weeks: 'Weeks 7–14',
          desc: 'Notice responses, hearing representation, evidence packs and submissions before the assessing officer.',
          items: [
            'Notice responses',
            'Hearing representation',
            'Evidence packs',
            'Submissions',
          ],
          deliv: 'Assessment representation pack',
          stampLine: 'Represented',
        },
        {
          ordinal: '●04',
          name: 'Order & follow-through',
          weeks: 'Weeks 15–20 + appeals if needed',
          desc: 'Order review, decision on appeal vs accept, refund follow-up, and an appellate path through CIT(A) / ITAT where warranted.',
          items: [
            'Order review',
            'Appeal decision',
            'Refund follow-up',
            'Appellate path',
          ],
          deliv: 'Assessment closed or appeal filed',
          stampLine: 'Closed',
        },
      ],
    },
    faq: [
      {
        q: 'When should we bring in external tax advisory versus handle it in-house?',
        a: "Build in-house when filings are routine and the team is at scale. Bring in external advisory when there's a structural decision in play — a cross-border transaction, a transfer-pricing assessment, an investment manager structure, a notice that's gone beyond the routine. Also bring us in when an internal team is overloaded during assessment season. We don't replace your finance team; we sit alongside it for the work that needs partner-grade attention.",
      },
      {
        q: 'When is the right time to do international tax structuring?',
        a: 'Before the cross-border element exists, not after. Structuring a cross-border investment or transaction after the cash has moved is twice the work and often locks in a worse outcome. The decision points to engage us are: planning an outbound investment, setting up an overseas subsidiary, planning a cross-border M&A, raising from a non-resident investor, or considering a holding-company restructure. Six to eight weeks of structuring before action saves quarters of unwinding.',
      },
      {
        q: 'How are tax assessment and litigation fees structured?',
        a: 'Tax assessment representation is billed as a fixed engagement fee, scoped after the notice and assessment year are reviewed. Appellate work (CIT(A), ITAT, High Court) is scoped per appeal with milestones tied to the stage. Counsel fees at higher forums are separately billed at counsel rates. We give a full fee estimate before engagement letter, including the probable counsel-fee range for higher forums.',
      },
      {
        q: 'How long does a typical assessment representation take?',
        a: 'Three to six months from notice to assessment order for a routine scrutiny assessment. Complex assessments — transfer pricing, related-party transactions, large additions — can stretch to nine months. We commit to a hearing calendar with the assessing officer at the first hearing; once the calendar is set, the timeline becomes predictable.',
      },
      {
        q: 'How do you handle confidential financial data?',
        a: "Mutual NDA at engagement letter stage. Workpapers and source documents sit on access-controlled servers — segregated per client, accessible only to the named engagement team. We do not share materials across engagements, and we never use one client's data to inform views given to another. Standard professional confidentiality is enforced through ICAI's code and our internal policies.",
      },
      {
        q: 'How are you different from Big-4 tax practices?',
        a: 'Partner-led delivery rather than associate-heavy. Big-4 tax practices are excellent — and necessary when the matter touches multiple jurisdictions at scale. For India-domestic work, mid-market international tax, transfer pricing for INR 50–2,000 crore companies, and routine assessment / appellate work, a partner-led smaller practice gets you direct partner attention at a fraction of the cost.',
      },
      {
        q: 'Will you work with our existing in-house tax team?',
        a: 'Yes. Most of our engagements are with companies that have a tax controller or a finance lead handling routine compliance. We layer on for the partner-grade decisions — structuring, assessment defence, opinions, audits. Your team retains ownership of day-to-day filings; we own the matters that need a partner signature.',
      },
      {
        q: 'Can you represent us in higher appellate forums?',
        a: 'We represent up to ITAT directly. For High Court and Supreme Court matters we brief and work alongside senior tax counsel — we have a panel of three counsel we work with regularly. The engagement letter notes counsel-fee ranges so there are no surprises if the matter escalates.',
      },
      {
        q: 'What happens after a tax notice is closed?',
        a: "We document the position taken, file it in the assessment defence pack, and update the position memo so future assessments don't re-litigate the same issue. If the closure was conditional on changes to the company's position going forward, we walk through those with the finance team so they get baked into next year's filings.",
      },
      {
        q: 'Do you handle both GST and direct tax under one engagement?',
        a: 'Yes, and we usually recommend it. Most issues that matter to a CFO have both direct-tax and indirect-tax dimensions — transfer pricing of services, treatment of inter-company transactions, M&A structuring, ESOP grants to non-residents. Splitting them across firms loses the cross-view. The same partner team covers both.',
      },
    ],
    deliverables: [
      'Tax position note.',
      'Compliance calendar.',
      'GST impact analysis.',
      'Transfer pricing documentation.',
      'Assessment response support.',
      'Refund support pack.',
      'Regulatory filing tracker.',
    ],
    experts: ['CA Pravesh Goel', 'CA Hemendra Chauhan', 'Rajat Singla', 'CS Neha Rathore'],
    leadMagnet: 'GST and Tax Compliance Calendar',
    cta: 'Review tax and compliance exposure',
    icon: Scale,
    // TODO: Vijay to verify Tax & Regulatory metrics.
    metrics: [
      { value: 400, suffix: '+', label: 'Returns filed annually' },
      { value: 80,  suffix: '+', label: 'Companies served' },
      { value: 30,  suffix: '+', label: 'Tax notices represented' },
      { value: 10,  suffix: '+', label: 'Cross-border tax matters' },
    ],
    ordinal: '04',
    heroLive: 'Direct + indirect tax · transfer pricing · cross-border ready',
    whenToEngage: [
      {
        if: 'Cross-border transaction on the table and tax structure can swing the post-tax outcome.',
        then: 'We structure under DTAA, GAAR, and transfer-pricing rules, and document the position with substance evidence.',
      },
      {
        if: 'GST notices arriving — assessments, mismatch reports, refund delays.',
        then: 'We respond to notices, reconcile filings, and recover blocked refunds while you keep operating.',
      },
      {
        if: 'Group restructuring or related-party transactions need a transfer pricing position before year-end.',
        then: 'We benchmark, document, and defend the position in the format assessing officers expect.',
      },
      {
        if: 'Leadership wants a one-page view of every statutory exposure and filing risk.',
        then: 'We build the compliance calendar with named owners, dates, and impact — one dashboard, no surprises.',
      },
      {
        if: 'Income-tax assessment or notice of demand needs a defensible response under deadline.',
        then: 'We prepare the response, marshal evidence, and represent before assessing officers and appellate forums.',
      },
      {
        if: 'Royalty, ESOP cross-charge, or service-fee structure with a foreign parent or subsidiary needs a tax opinion.',
        then: 'We deliver the opinion under domestic tax and treaty rules, with the documentation an assessing officer can verify.',
      },
    ],
  },
  {
    title: 'Assurance',
    slug: 'assurance',
    summary:
      'Statutory audits, bank audits, system audits, Ind AS, limited reviews, restatement, forensic and special reviews.',
    promise:
      'We help companies build confidence in financial reporting, audit readiness and compliance evidence.',
    seoTitle: 'Assurance, Audit & Ind AS Advisory | Nucleus Advisors',
    metaDescription:
      'Nucleus Advisors provides statutory audit, bank audit, system audit, limited review, Ind AS, IFRS, restatement, utilization certificate and assurance support.',
    howWeHelp: [
      'Statutory audits.',
      'Bank audits.',
      'Limited reviews.',
      'System audits.',
      'Ind AS and IFRS advisory.',
      'Utilization certificates.',
      'RBI/FEMA compliance support.',
      'Restatement of financials.',
      'Audit support for controllership teams.',
    ],
    howWeHelpDetailed: [
      {
        badge: 'Flagship mandate',
        title: 'Statutory audit',
        summary: 'Year-end audit · Ind AS · audit report',
        body: 'Year-end statutory audit — planning, materiality, fieldwork, Ind AS impact review, and audit report issued on a calendar management can rely on.',
        bullets: [
          'Planning & materiality',
          'Field testing',
          'Ind AS review',
          'Audit report',
        ],
      },
      {
        title: 'Limited reviews',
        summary: 'Quarterly · half-year · listed-company reviews',
        body: 'Quarterly and half-year limited reviews for listed entities — reconciliation work, results sign-off, and audit-committee briefings.',
        bullets: [
          'Quarterly reviews',
          'Half-year reviews',
          'Reconciliation work',
          'Audit-committee briefings',
        ],
      },
      {
        title: 'Bank audits',
        summary: 'Branch · concurrent · statutory',
        body: 'Branch, concurrent and statutory bank audits — advances review, asset classification, regulatory reporting and statutory sign-off.',
        bullets: [
          'Branch audit',
          'Concurrent audit',
          'Advances review',
          'Regulatory reporting',
        ],
      },
      {
        title: 'Ind AS / IFRS',
        summary: 'Convergence · impact notes · disclosures',
        body: 'Ind AS / IFRS convergence — opening-balance adjustments, accounting policy notes, transition impact analysis and disclosure drafting.',
        bullets: [
          'Opening adjustments',
          'Policy notes',
          'Transition impact',
          'Disclosure drafting',
        ],
      },
      {
        title: 'System & IT audits',
        summary: 'Access · process controls · ITGC',
        body: 'System audits over access controls, change management, and IT general controls — evidence-backed reports for management and the regulator.',
        bullets: [
          'Access controls',
          'Change management',
          'ITGC testing',
          'Management reports',
        ],
      },
      {
        title: 'Special-purpose certifications',
        summary: 'UCs · FEMA · regulatory certificates',
        body: 'Utilisation certificates, FEMA / RBI certificates, fund-end reports and other special-purpose attestations issued under independent auditor sign-off.',
        bullets: [
          'Utilisation certificates',
          'FEMA / RBI certificates',
          'Fund-end reports',
          'Independent sign-off',
        ],
      },
    ],
    processDossier: {
      fileLabel: 'N · Engagement File / 233 — 2026',
      fileBadge: 'File 233 · 2026 — illustrative',
      projectName: 'Anonymised audit engagement',
      engagementType: 'Statutory audit · Ind AS',
      headline: 'From <em>planning</em>, to <em>audit signed</em>.',
      phases: [
        {
          ordinal: '●01',
          name: 'Planning & risk assessment',
          weeks: 'Weeks 1–3',
          desc: 'Audit planning memo, materiality, risk assessment, fraud risk discussion and a calendar agreed with management.',
          items: [
            'Planning memo',
            'Materiality',
            'Risk assessment',
            'Audit calendar',
          ],
          deliv: 'Audit plan + calendar',
          stampLine: 'Planned',
        },
        {
          ordinal: '●02',
          name: 'Interim fieldwork',
          weeks: 'Weeks 4–8',
          desc: 'Walkthroughs, control testing, substantive procedures on selected cycles, and early flagging of areas needing year-end attention.',
          items: [
            'Walkthroughs',
            'Control testing',
            'Substantive testing',
            'Year-end pre-work',
          ],
          deliv: 'Interim audit workpapers',
          stampLine: 'Tested',
        },
        {
          ordinal: '●03',
          name: 'Year-end fieldwork',
          weeks: 'Weeks 9–14',
          desc: 'Year-end substantive procedures, Ind AS adjustments, related-party transaction testing, going-concern review, and audit-committee discussion.',
          items: [
            'Year-end substantive',
            'Ind AS review',
            'RPT testing',
            'Going-concern review',
          ],
          deliv: 'Year-end audit workpapers',
          stampLine: 'Audited',
        },
        {
          ordinal: '●04',
          name: 'Report & sign-off',
          weeks: 'Weeks 15–16',
          desc: 'Audit report, management letter, audit-committee briefing, and statutory sign-off issued on the calendar agreed at kick-off.',
          items: [
            'Audit report',
            'Management letter',
            'Audit-committee briefing',
            'Statutory sign-off',
          ],
          deliv: 'Signed audit report + management letter',
          stampLine: 'Signed',
        },
      ],
    },
    faq: [
      {
        q: 'When should we change our statutory auditor?',
        a: "The Companies Act mandates rotation for listed and large unlisted companies — once every five or ten years depending on type. Beyond the regulatory trigger, change auditors when the current relationship has gone stale (same partner-team for five-plus years, audit becoming mechanical), when there's been a material disagreement on an accounting position, or when the company's complexity has outgrown the current firm. A change is a six-month process planned ahead — opening-balance audit, transition workpapers, audit-committee approval.",
      },
      {
        q: 'When is the right time to start year-end audit work?',
        a: 'Eight to ten weeks before year-end for interim fieldwork. Walkthroughs, control testing, and substantive procedures on stable cycles (revenue, AP, payroll) happen in the interim period so year-end is concentrated on year-end-specific work. Companies that wait for year-end to start audit work end up with a compressed audit and pressure on the close calendar. We schedule the calendar with management in the planning meeting.',
      },
      {
        q: 'How are statutory audit fees structured?',
        a: "Annual engagement fee scoped to the year's audit plan, billed in two or three installments tied to milestones (planning, interim, sign-off). Out-of-scope work — restatement, special audits, opinions outside the audit — is scoped and billed separately at engagement-level rates. We provide a full fee proposal before engagement letter, and we don't surprise-bill mid-year.",
      },
      {
        q: 'How long does a typical statutory audit take?',
        a: 'Sixteen weeks of partner involvement, of which eight to ten are interim fieldwork and the rest are year-end. The actual on-site fieldwork is much shorter — a typical mid-market audit involves two to three weeks of in-person fieldwork. The rest is review, partner sign-off, and audit-committee discussion. Listed entities add four weeks for the limited reviews around quarterly results.',
      },
      {
        q: 'How do you handle confidential financial data?',
        a: "Same standards as any other practice — mutual NDA, access-controlled workpapers, ring-fenced engagement teams, no cross-client use. As statutory auditors we are bound by ICAI's code which is stricter than NDA — disclosure of audit information to anyone outside the entity is a professional offence.",
      },
      {
        q: 'How are you different from Big-4 audit firms?',
        a: "For mid-market companies (INR 50 crore to INR 2,000 crore revenue), Big-4 audit is often over-priced and under-attended — partner attention is rationed, and the day-to-day team is junior. A partner-led mid-tier firm delivers the same audit quality at a fraction of the cost, with the partner actually in the room. Big-4 is the right choice when listing on a foreign exchange or when the company's scale truly warrants Big-4 brand-name comfort to specific stakeholders.",
      },
      {
        q: 'Can you also do limited reviews and special audits?',
        a: "Yes. Limited reviews for listed entities (quarterly and half-year), special audits (forensic, regulatory, transaction-related), system audits, and certifications (utilisation, FEMA, RBI) are all within scope. Each is scoped as its own engagement so the work doesn't bleed into the statutory audit fee.",
      },
      {
        q: "What if there's a disagreement on an accounting position?",
        a: "Disagreements get worked through with management first, then with the audit committee. If it's an accounting standard interpretation, we provide our position in writing with reasoning, references and any alternate views considered. If the difference can't be resolved, it lands in the audit report — a qualified opinion, emphasis of matter, or other modification as appropriate. We never adjust our position to keep an engagement.",
      },
      {
        q: 'What happens after the audit report is signed?',
        a: 'Management letter goes to the audit committee with observations on the year — control weaknesses, accounting policy refinements, and process improvements. We follow up the next year on the status of those observations. Statutory audit ends at the sign-off; ongoing advisory is a separate engagement if needed.',
      },
      {
        q: 'Do you take audits of listed companies?',
        a: 'Yes, for SME-platform and mid-cap mainboard listings. We have the peer review and the FRRB exposure compliance required to sign listed-company audits. For large-cap or globally listed entities, we usually act as joint auditors with a Big-4 firm rather than as sole auditor — that gets the cost benefit without losing the Big-4 brand comfort that some institutional investors look for.',
      },
    ],
    deliverables: [
      'Audit plan.',
      'Audit queries and closure tracker.',
      'Financial reporting review.',
      'Ind AS impact note.',
      'Compliance evidence checklist.',
      'Management letter and improvement observations.',
    ],
    experts: ['CA Abhishek Gupta', 'Geetanjali Virmani'],
    leadMagnet: 'Audit Readiness Checklist',
    cta: 'Prepare for audit readiness',
    icon: FileCheck2,
    // TODO: Vijay to verify Assurance metrics.
    metrics: [
      { value: 50, suffix: '+', label: 'Statutory audits delivered' },
      { value: 30, suffix: '+', label: 'Companies served' },
      { value: 8,  suffix: '+', label: 'Ind AS / IFRS conversions' },
      { value: 10, suffix: '+', label: 'Sectors covered' },
    ],
    ordinal: '05',
    heroLive: 'Statutory audit · Ind AS · listed and unlisted',
    whenToEngage: [
      {
        if: 'First-time Ind AS conversion this year and books need to hold up under closer review.',
        then: 'We re-state, document Ind AS impact notes, and prepare the audit-ready supporting schedules.',
      },
      {
        if: "Statutory auditor's queries are piling up and management is firefighting at year-end.",
        then: 'We run audit readiness — close the open items, package the responses, and shorten the audit cycle.',
      },
      {
        if: 'Bank or lender requires a special audit or utilisation certificate before disbursement.',
        then: 'We scope the review, deliver the certificate, and document the assumptions the bank will sign off on.',
      },
      {
        if: 'Material restatement may be required after an accounting position change or regulatory observation.',
        then: 'We work through the restatement, build the disclosure language, and brief the audit committee on impact.',
      },
      {
        if: 'RBI inspection or FEMA-related external audit is upcoming.',
        then: 'We run the readiness review, build the response documentation, and walk the inspection team through evidence.',
      },
      {
        if: 'Controllership team needs an experienced bench to manage the statutory audit alongside year-end close.',
        then: "We embed audit support — query closure, schedule preparation, evidence trail — so the close and audit don't compete for the same people.",
      },
    ],
  },
  {
    title: 'Valuations',
    slug: 'valuations',
    summary:
      'Business valuation, ESOP, brand, IFRS/Ind AS, FDI, transaction and fundraising valuations.',
    promise:
      'We prepare valuation work that supports transactions, compliance, fundraising, reporting and strategic decision-making.',
    seoTitle: 'Business Valuation, ESOP Valuation & FDI Valuation | Nucleus Advisors',
    metaDescription:
      'Nucleus Advisors provides business valuation, ESOP valuation, brand valuation, IFRS/Ind AS valuation, FDI valuation and transaction valuation support.',
    howWeHelp: [
      'Business valuation.',
      'Startup and fundraise valuation.',
      'ESOP valuation.',
      'Brand valuation.',
      'FDI valuation.',
      'IFRS/Ind AS valuation.',
      'Transaction valuation and fairness support.',
      'Valuation inputs for investor and board discussions.',
    ],
    howWeHelpDetailed: [
      {
        badge: 'Flagship mandate',
        title: 'Business valuation',
        summary: 'DCF · comparables · transaction multiples',
        body: 'Enterprise and equity valuation using DCF, comparable-company and transaction multiples — defensible workpapers and a clear bridge from assumptions to value.',
        bullets: [
          'DCF model',
          'Trading comparables',
          'Transaction multiples',
          'Value bridge',
        ],
      },
      {
        title: 'Fundraise valuation',
        summary: 'Pre-money · post-money · negotiation defence',
        body: 'Pre-money and post-money valuations for primary rounds, with the working that defends the number across investor diligence and term-sheet negotiation.',
        bullets: [
          'Pre-money workings',
          'Post-money cap-table',
          'Stress-test scenarios',
          'Negotiation defence pack',
        ],
      },
      {
        title: 'ESOP valuation',
        summary: 'Grant-date · Indian regulatory · 409A-style',
        body: 'ESOP valuations for grant-date pricing — Indian regulatory views (Income-tax / Companies Act) and 409A-style methodology for cross-border entities.',
        bullets: [
          'Grant-date pricing',
          'Income-tax view',
          'Companies Act view',
          '409A-style methodology',
        ],
      },
      {
        title: 'FDI / FEMA valuation',
        summary: 'Cross-border · investor reports · FEMA-compliant',
        body: 'FDI / FEMA-compliant valuations for share issuance and transfer between resident and non-resident parties — investor reports, banker certificates.',
        bullets: [
          'Share issue / transfer',
          'FEMA pricing guidelines',
          'Investor reports',
          'Banker certificates',
        ],
      },
      {
        title: 'Brand & intangibles',
        summary: 'Royalty relief · cost · market',
        body: 'Brand and intangible-asset valuations using royalty relief, cost and market approaches — for transaction, tax or financial-reporting use.',
        bullets: [
          'Royalty relief',
          'Cost approach',
          'Market approach',
          'Use-case framing',
        ],
      },
      {
        title: 'Fairness opinions',
        summary: 'Transaction fairness · IBC matters · board reliance',
        body: 'Fairness opinions for transactions and IBC matters — board-reliable views with reasoned methodology and underlying workings.',
        bullets: [
          'Transaction fairness',
          'IBC fairness',
          'Board reliance',
          'Methodology disclosure',
        ],
      },
    ],
    processDossier: {
      fileLabel: 'N · Engagement File / 295 — 2026',
      fileBadge: 'File 295 · 2026 — illustrative',
      projectName: 'Anonymised valuation mandate',
      engagementType: 'Business valuation · transaction',
      headline: 'From <em>scope</em>, to <em>report issued</em>.',
      phases: [
        {
          ordinal: '●01',
          name: 'Scope & purpose',
          weeks: 'Week 1',
          desc: 'Pin down the purpose (transaction / regulatory / dispute), the value standard, the date, and the readers — then design the methodology that fits.',
          items: [
            'Purpose statement',
            'Value standard',
            'Valuation date',
            'Reader profile',
          ],
          deliv: 'Scope memo',
          stampLine: 'Scoped',
        },
        {
          ordinal: '●02',
          name: 'Inputs & build',
          weeks: 'Weeks 1–2',
          desc: 'Historicals, forecasts, comparables, transaction precedents and discount-rate build — the model the valuation hangs on.',
          items: [
            'Historicals & forecasts',
            'Comparable companies',
            'Transaction precedents',
            'Discount-rate build',
          ],
          deliv: 'Valuation model + workpapers',
          stampLine: 'Built',
        },
        {
          ordinal: '●03',
          name: 'Triangulation & sensitivity',
          weeks: 'Weeks 2–3',
          desc: 'Triangulate across methodologies, run sensitivities on the variables that matter most, and stress-test against the use-case.',
          items: [
            'Methodology triangulation',
            'Sensitivity layers',
            'Stress-test scenarios',
            'Methodology weighting',
          ],
          deliv: 'Concluded value with workings',
          stampLine: 'Triangulated',
        },
        {
          ordinal: '●04',
          name: 'Report & defence',
          weeks: 'Week 3 + follow-up',
          desc: 'Final valuation report, methodology disclosure, and the working that defends the number across diligence, board or regulator scrutiny.',
          items: [
            'Valuation report',
            'Methodology disclosure',
            'Defence pack',
            'Q&A support',
          ],
          deliv: 'Valuation report + defence pack',
          stampLine: 'Issued',
        },
      ],
    },
    faq: [
      {
        q: 'When does a company need an independent valuation?',
        a: "Most commonly: a fundraise (to support the share-issue price for FEMA / Income-tax purposes), an ESOP grant (for grant-price determination), a related-party transaction (to demonstrate arm's length), a transaction (M&A fairness or pricing), a restatement (purchase-price allocation under Ind AS 103), or a regulatory ask (RBI / SEBI). Less commonly: dispute / IBC matters, internal management decisions, or shareholder buyouts. The purpose drives the value standard and the methodology — we scope that in week one.",
      },
      {
        q: "What's the right standard of value for our purpose?",
        a: 'Depends on the purpose. Fair market value is the default for tax and regulatory contexts. Fair value (Ind AS / IFRS) for financial reporting. Investment value or strategic value for M&A. Liquidation value for IBC. Getting the standard wrong is the most common source of valuation rework — we anchor on the purpose first, the standard second, the methodology third. Most reports have the standard noted on the cover.',
      },
      {
        q: 'How are valuation fees structured?',
        a: "Fixed engagement fee per valuation, scoped after the purpose, value standard and complexity are agreed. Simple fundraise / ESOP valuations are in a defined band; complex transaction valuations, multi-entity valuations, or contested matters are scoped individually. Fees never depend on the conclusion — that would undermine the report's independence.",
      },
      {
        q: 'How long does a typical valuation take?',
        a: 'Two to three weeks for a routine fundraise or ESOP valuation. Three to four weeks for a transaction valuation with multiple methodologies. Six to eight weeks for a complex multi-entity or cross-border valuation. The timeline is mostly driven by information availability — the actual analytical work is two to three weeks of partner time.',
      },
      {
        q: 'How do you defend the valuation in diligence or in court?',
        a: "Every report ships with a defence pack: methodology disclosure, assumption schedule, sensitivity analysis, and the alternative views considered. The same partner who signed the report represents in diligence calls, audit-committee questions, or appellate proceedings. We don't outsource the defence.",
      },
      {
        q: 'How are you different from Big-4 valuation teams?',
        a: 'Same staffing point as the rest of the firm — partner-led delivery rather than associate-heavy. For ESOP, fundraise, FEMA and Indian-regulatory valuations Big-4 is typically more expensive and slower without delivering a meaningfully different report. For cross-border fairness opinions where institutional investors specifically require Big-4 brand, we recommend Big-4.',
      },
      {
        q: 'Can the same firm value and audit?',
        a: "Not for the same company. SEBI's Listing Obligations, the Companies Act, and ICAI's code all prohibit the auditor of a listed or large company from also providing valuation services to that company. We sometimes pair — value for one company, audit for an unrelated company — but never both for the same.",
      },
      {
        q: 'What if we disagree with the valuation conclusion?',
        a: "Disagreement is expected — usually because management's expectations diverge from market-implied multiples or DCF assumptions. We walk through every assumption, show the sensitivity to the variables in question, and document the disagreement on the workpapers. If the difference is fundamental, we don't issue the report. We never adjust the number to land where the client wants.",
      },
      {
        q: 'How often should we refresh the valuation?',
        a: "Annually as a default for ESOP and fundraise contexts. Sooner when there's a material event — a closed round at a new price, a significant business development, a regulatory change in valuation methodology. A stale valuation defended against current diligence is harder to support than a fresh one.",
      },
      {
        q: 'What size of transactions or companies do you value?',
        a: 'Sweet spot is companies with revenue between INR 20 crore and INR 2,000 crore, or transactions in the US $5M to US $500M band. Smaller engagements work too — a $1M ESOP grant valuation is a routine assignment. Above that band, we sometimes pair with a Big-4 firm where institutional investor preference demands it.',
      },
    ],
    deliverables: [
      'Valuation report.',
      'Valuation model.',
      'Assumptions pack.',
      'Scenario analysis.',
      'Investor or board summary.',
      'Compliance-ready supporting schedules.',
    ],
    experts: ['CA Vijay Singh Rathore', 'CA Aakash Kalra'],
    leadMagnet: 'Valuation Readiness Checklist',
    cta: 'Start a valuation discussion',
    icon: LineChart,
    // TODO: Vijay to verify Valuations metrics.
    metrics: [
      { value: 80, suffix: '+',  label: 'Valuations issued' },
      { value: 500, prefix: '$', suffix: 'M+', label: 'Aggregate enterprise value' },
      { value: 3,  suffix: ' wk', label: 'Avg turnaround' },
      { value: 12, suffix: '+',  label: 'Sectors covered' },
    ],
    ordinal: '06',
    heroLive: 'Business · ESOP · FEMA · fairness opinions · India + cross-border',
    whenToEngage: [
      {
        if: 'Issuing ESOPs and need a defensible Rule 11UA valuation before the grant.',
        then: 'We build the valuation under the right method, document the cap-table assumptions, and prepare the supporting schedules.',
      },
      {
        if: 'Investor coming in from offshore — FDI valuation required at fair market value.',
        then: 'We prepare the FEMA-compliant valuation, defend the methodology, and coordinate the FC-GPR filings.',
      },
      {
        if: 'Board is taking a strategic decision — divestment, joint venture, or rights issue — and needs an independent number.',
        then: 'We deliver the valuation with scenario analysis, assumption pack, and a board-ready summary.',
      },
      {
        if: 'IFRS or Ind AS impairment testing on goodwill, intangibles, or PPE is required this close.',
        then: 'We run the value-in-use model, build the disclosure language, and walk the auditor through assumptions.',
      },
      {
        if: 'Need a fairness opinion or transaction valuation for a related-party deal or court-approved scheme.',
        then: 'We deliver an independent valuation with method justification and the documentation regulators and courts expect.',
      },
      {
        if: 'Brand or intangible asset valuation needed for licensing, IP transfer, or asset reorganisation.',
        then: 'We benchmark, build the royalty-relief or relief-from-royalty model, and document the assumption set.',
      },
    ],
  },
  {
    title: 'Finance Outsourcing',
    slug: 'finance-outsourcing',
    summary:
      'Accounting, MIS, payroll, statutory compliance, expense verification, fixed asset register and controllership.',
    promise:
      'We help companies run sharper finance operations with reliable reporting, compliant books and better management visibility.',
    seoTitle: 'Finance Outsourcing, Accounting, MIS & vCFO Services',
    metaDescription:
      'Nucleus Advisors supports finance teams with accounting, MIS reporting, payroll, statutory compliance, expense verification, fixed asset registers and vCFO services.',
    howWeHelp: [
      'Accounting services.',
      'MIS reporting.',
      'Statutory compliance.',
      'Payroll services.',
      'Expense verification.',
      'Fixed asset register management.',
      'Physical verification.',
      'Controllership.',
      'vCFO support.',
      'Audit support.',
    ],
    howWeHelpDetailed: [
      {
        badge: 'Flagship mandate',
        title: 'vCFO',
        summary: 'Strategic finance · board reporting · investor liaison',
        body: 'Fractional CFO engagement — strategic finance, board reporting, fundraise support and investor liaison without the cost of a full-time hire.',
        bullets: [
          'Board reporting',
          'Strategic finance',
          'Fundraise support',
          'Investor liaison',
        ],
      },
      {
        title: 'Books & monthly close',
        summary: 'Accounting · reconciliations · MIS pack',
        body: 'Day-to-day accounting, monthly close calendar, reconciliations and a CFO-ready MIS pack delivered on the same day each month.',
        bullets: [
          'Accounting',
          'Monthly close',
          'Reconciliations',
          'MIS pack',
        ],
      },
      {
        title: 'Controllership',
        summary: 'Process · policy · audit-ready records',
        body: 'Controllership layer over outsourced books — financial policy, approval workflows, control documentation and audit-ready records.',
        bullets: [
          'Financial policy',
          'Approval workflows',
          'Control documentation',
          'Audit-ready records',
        ],
      },
      {
        title: 'Payroll & statutory',
        summary: 'Salary · TDS · PF / ESIC compliance',
        body: 'End-to-end payroll — salary processing, TDS, PF / ESIC / PT, year-end forms and employee queries handled in-house.',
        bullets: [
          'Salary processing',
          'TDS / Form 16',
          'PF / ESIC / PT',
          'Employee queries',
        ],
      },
      {
        title: 'Compliance trackers',
        summary: 'Year-round filings · expiry reminders · audit logs',
        body: 'Compliance trackers across statutory, tax and labour filings — owner mapping, expiry reminders and audit logs that survive personnel changes.',
        bullets: [
          'Filing tracker',
          'Owner mapping',
          'Expiry reminders',
          'Audit logs',
        ],
      },
      {
        title: 'Tools & automation',
        summary: 'Zoho / Tally / NetSuite · workflow design',
        body: 'Setup and workflow design across Zoho, Tally, NetSuite or equivalent — reducing manual handoffs and creating a single source of truth.',
        bullets: [
          'Tool setup',
          'Workflow design',
          'Integration',
          'Reporting templates',
        ],
      },
    ],
    processDossier: {
      fileLabel: 'N · Engagement File / 318 — 2026',
      fileBadge: 'File 318 · 2026 — illustrative',
      projectName: 'Anonymised finance-outsourcing mandate',
      engagementType: 'Books + vCFO · monthly cadence',
      headline: 'From <em>diagnose</em>, to <em>steady state</em>.',
      phases: [
        {
          ordinal: '●01',
          name: 'Diagnose & onboard',
          weeks: 'Weeks 1–3',
          desc: 'Current-state diagnostic, opening-balances cleanup, chart-of-accounts redesign, and access to the tooling stack we will run on.',
          items: [
            'Current-state diagnostic',
            'Opening balances cleanup',
            'Chart-of-accounts redesign',
            'Tooling setup',
          ],
          deliv: 'Clean opening + access',
          stampLine: 'Onboarded',
        },
        {
          ordinal: '●02',
          name: 'Process design',
          weeks: 'Weeks 3–5',
          desc: 'Approval workflows, monthly close calendar, MIS template, and the control documentation an auditor will rely on.',
          items: [
            'Approval workflows',
            'Monthly close calendar',
            'MIS template',
            'Control documentation',
          ],
          deliv: 'Documented process + MIS template',
          stampLine: 'Designed',
        },
        {
          ordinal: '●03',
          name: 'Steady state',
          weeks: 'Month 2 onwards',
          desc: 'Daily bookkeeping, monthly close on the published calendar, MIS pack delivered on the agreed day, and statutory filings on time.',
          items: [
            'Daily accounting',
            'Monthly close',
            'MIS pack delivery',
            'Statutory filings',
          ],
          deliv: 'Steady-state delivery',
          stampLine: 'Live',
        },
        {
          ordinal: '●04',
          name: 'Quarterly business review',
          weeks: 'Every quarter',
          desc: 'Variance analysis, working-capital review, runway / burn discussion, and a one-page board update that travels well.',
          items: [
            'Variance analysis',
            'Working-capital review',
            'Runway discussion',
            'Board update',
          ],
          deliv: 'QBR pack + board update',
          stampLine: 'Reviewed',
        },
      ],
    },
    faq: [
      {
        q: 'When does a company benefit from outsourced finance?',
        a: 'Three cases. First, the company is too small for a full in-house finance team but too large for the founder to handle on a spreadsheet — typically Series A through early Series B. Second, the company has an in-house team but needs partner-level oversight without hiring a CFO — a vCFO layer. Third, the company is going through a transition (new funding, restructuring, M&A integration) and needs surge capacity. If none of those, building in-house is the right answer.',
      },
      {
        q: 'When does a company outgrow vCFO and need a full-time CFO?',
        a: 'Three triggers: monthly close requires more than one person full-time; investor reporting cadence has crossed quarterly into monthly; or strategic finance work (capital allocation, M&A pipeline, treasury) is dominating the finance role. Most companies cross that threshold around US $20M ARR or 200 employees. We help in the transition — scope the role, run the search alongside the founder, and hand over cleanly.',
      },
      {
        q: 'How are outsourced finance fees structured?',
        a: 'Monthly retainer scoped to the work — usually a fixed amount per month based on transaction volume, complexity and whether vCFO is in scope. The retainer covers everything in the scope; out-of-scope special projects (fundraise, audit support, M&A integration) are scoped separately. No per-hour billing — predictable monthly budgeting matters.',
      },
      {
        q: 'How long does onboarding take?',
        a: "Three to four weeks to opening balances clean, chart-of-accounts redesigned, tooling stack set up, and first close ready. The first month live is usually a hybrid — we run the close, your team observes, and we hand over the runbook. By month two we're at steady state.",
      },
      {
        q: 'How do you handle confidential data and system access?',
        a: "Mutual NDA at engagement letter stage. We work inside your accounting system (Zoho, Tally, NetSuite or whatever) rather than running parallel books — your data stays in your environment. Access is restricted to the named engagement team. We don't move data to our servers except for the workpapers we are obligated to retain.",
      },
      {
        q: 'How are you different from typical outsourced firms?',
        a: 'Most outsourced finance firms scale by adding junior accountants. We staff partner-deep — a partner reviews every close, sits on monthly reviews, and is available for the strategic finance calls. The day-to-day work happens with a smaller engagement team, but the partner is genuinely in the engagement, not just on the engagement letter.',
      },
      {
        q: 'Will the same team work with us or rotate?',
        a: "Same team. Rotation is the right model for routine commoditised work; finance outsourcing benefits from continuity. The partner stays through the engagement. The execution team can change with personnel moves, but we transition in pairs so context isn't lost. If you specifically want rotation for independence reasons (uncommon outside audit) we accommodate.",
      },
      {
        q: 'What happens if we want to bring finance in-house later?',
        a: 'Common path. We help scope the in-house role, can run the search alongside, and run a structured handover — typically eight to twelve weeks of overlap during which the in-house lead shadows us, then takes over with us in advisory standby. After the transition we are often retained on a smaller scope (audit support, specific projects) rather than a complete exit.',
      },
      {
        q: 'Can you support fundraising alongside operations?',
        a: 'Yes, and most of our engagements do. The vCFO is involved in fundraise prep, investor diligence and post-close reporting. For the actual fundraise mandate (pitch, IM, investor outreach), we co-engage with our Investment Banking practice under a separate engagement letter so the work is properly scoped and the fee structure is clear.',
      },
      {
        q: "What's the minimum engagement size?",
        a: 'We typically engage with companies past Series A or with revenue above INR 5 crore — below that scale, the cost of a partner-led outsourced finance team is hard to justify against the alternative of one in-house accountant. For pre-Series-A companies we sometimes do a fixed-fee monthly bookkeeping engagement, but the vCFO layer requires a higher base.',
      },
    ],
    deliverables: [
      'Monthly MIS pack.',
      'Compliance tracker.',
      'Bookkeeping and close calendar.',
      'Payroll tracker.',
      'Finance process SOPs.',
      'Expense verification report.',
      'Fixed asset register.',
    ],
    experts: ['CA Pravesh Goel', 'CA Aakash Kalra', 'CA Rajat Singla', 'CA Hemendra Chauhan', 'Geetanjali Virmani'],
    leadMagnet: 'Monthly MIS Template for Founders',
    cta: 'Strengthen finance operations',
    icon: BarChart3,
    // TODO: Vijay to verify Finance Outsourcing metrics.
    metrics: [
      { value: 25, suffix: '+',  label: 'vCFO engagements' },
      { value: 50, suffix: '+',  label: 'Books closed monthly' },
      { value: 4,  suffix: ' wk', label: 'Avg ramp-up time' },
      { value: 90, suffix: '%',  label: 'Retention beyond Year 1' },
    ],
    ordinal: '07',
    heroLive: 'Books · vCFO · controllership · INR 5 cr+ revenue companies',
    whenToEngage: [
      {
        if: "Founder-led finance team can't keep up — close is slipping and the board is asking for cleaner numbers.",
        then: 'We take the books, run the close calendar, and deliver a monthly MIS pack the board can read in 10 minutes.',
      },
      {
        if: 'Payroll has become a recurring headache — statutory misses, late TDS, employee complaints.',
        then: 'We run payroll end-to-end with the compliance tracker — PF, ESI, TDS — and surface exceptions before they become disputes.',
      },
      {
        if: 'Need a vCFO for cashflow planning, banker conversations, and investor reporting — but not a full-time hire yet.',
        then: 'Our vCFO bench plugs in part-time, builds the operating cadence, and grows into a full mandate when you are ready.',
      },
      {
        if: "Fixed assets and inventory ledgers haven't been physically reconciled in years.",
        then: 'We run physical verification, rebuild the fixed asset register, and design the SOP so it stays clean going forward.',
      },
      {
        if: 'Expense or vendor billing trust gaps — leakage, duplicate payments, missing documents at month-end.',
        then: 'We run expense verification with sample-and-100% checks, surface leakage, and tighten the approval matrix.',
      },
      {
        if: 'Finance SOPs are tribal knowledge — single-point dependencies, no documented close calendar.',
        then: 'We document SOPs, train the team, and hand back a finance function that runs without a single owner.',
      },
    ],
  },
  {
    title: 'Corporate Secretarial',
    slug: 'corporate-secretarial',
    summary:
      'Incorporation, ROC, registers, board and shareholder documentation, due diligence and compliance calendars.',
    promise:
      'We help companies keep corporate records, filings, governance actions and transaction documentation aligned with statutory requirements.',
    seoTitle: 'Corporate Secretarial, Company Law & Compliance Support',
    metaDescription:
      'Nucleus Advisors supports company formation, annual filings, statutory registers, company law matters, AIF compliance, due diligence and transaction documentation coordination.',
    howWeHelp: [
      'Company formation.',
      'Annual filings.',
      'Statutory registers and records.',
      'Charge creation and satisfaction.',
      'Company law matters.',
      'General meeting extensions.',
      'AIF compliance support.',
      'Contract and transaction documentation coordination.',
      'Secretarial due diligence.',
    ],
    howWeHelpDetailed: [
      {
        badge: 'Flagship mandate',
        title: 'Incorporation & setup',
        summary: 'Company formation · founder shareholding · post-incorporation',
        body: 'New-company setup — incorporation, founder shareholding structure, first board / shareholder resolutions and all post-incorporation filings.',
        bullets: [
          'Company formation',
          'Founder shareholding',
          'First resolutions',
          'Post-incorporation filings',
        ],
      },
      {
        title: 'Annual ROC filings',
        summary: 'AOC-4 · MGT-7 · DPT-3 · board events',
        body: 'Annual ROC filings — AOC-4, MGT-7, DPT-3, board event filings and year-end declarations on a calendar that never slips.',
        bullets: [
          'AOC-4 / MGT-7',
          'DPT-3',
          'Board-event filings',
          'Year-end declarations',
        ],
      },
      {
        title: 'Statutory registers',
        summary: 'Members · directors · charges · minutes',
        body: 'Maintenance of statutory registers — members, directors, charges, contracts, related-party transactions and minutes — kept current and audit-ready.',
        bullets: [
          'Members & directors',
          'Charges register',
          'RPT register',
          'Minute books',
        ],
      },
      {
        title: 'Board & general meetings',
        summary: 'Notices · resolutions · minute drafting',
        body: 'Board and general meeting support — notices, agendas, resolutions, minute drafting and post-meeting filings.',
        bullets: [
          'Notices & agendas',
          'Resolutions',
          'Minute drafting',
          'Post-meeting filings',
        ],
      },
      {
        title: 'AIF compliance',
        summary: 'SEBI returns · fund-level filings · investor docs',
        body: 'Secretarial support for SEBI-registered AIFs — quarterly / annual returns, fund-level filings, investor onboarding documents and trustee coordination.',
        bullets: [
          'SEBI quarterly returns',
          'Fund-level filings',
          'Investor onboarding docs',
          'Trustee coordination',
        ],
      },
      {
        title: 'Secretarial due diligence',
        summary: 'Pre-transaction · period-cover · gap notes',
        body: 'Secretarial due diligence for transactions — period-cover review, gap notes, remediation tracker and seller / buyer comfort packs.',
        bullets: [
          'Period-cover review',
          'Gap notes',
          'Remediation tracker',
          'Comfort pack',
        ],
      },
    ],
    processDossier: {
      fileLabel: 'N · Engagement File / 402 — 2026',
      fileBadge: 'File 402 · 2026 — illustrative',
      projectName: 'Anonymised secretarial mandate',
      engagementType: 'Annual ROC + meetings retainer',
      headline: 'From <em>health check</em>, to <em>quarterly clean</em>.',
      phases: [
        {
          ordinal: '●01',
          name: 'Health check & onboarding',
          weeks: 'Weeks 1–2',
          desc: 'Register status review, filings history audit, gap notes, and a remediation list to close before the next filing window.',
          items: [
            'Register status review',
            'Filings history audit',
            'Gap notes',
            'Remediation list',
          ],
          deliv: 'Health-check report + clean-up plan',
          stampLine: 'Audited',
        },
        {
          ordinal: '●02',
          name: 'Annual filings cycle',
          weeks: 'Weeks 3–10',
          desc: 'AOC-4, MGT-7, DPT-3 and board-event filings — drafted, reviewed and filed within the statutory window with zero last-minute rush.',
          items: [
            'AOC-4 / MGT-7',
            'DPT-3',
            'Board event filings',
            'Director declarations',
          ],
          deliv: 'Annual filings completed',
          stampLine: 'Filed',
        },
        {
          ordinal: '●03',
          name: 'Meetings & resolutions',
          weeks: 'Year-round',
          desc: 'Board and general meeting cycle — notices, agendas, resolutions, minute drafting, and the related post-meeting filings.',
          items: [
            'Notices & agendas',
            'Resolutions drafted',
            'Minute books updated',
            'Post-meeting filings',
          ],
          deliv: 'Compliant meetings register',
          stampLine: 'Maintained',
        },
        {
          ordinal: '●04',
          name: 'Quarterly compliance review',
          weeks: 'Every quarter',
          desc: 'Compliance tracker review, expiring approvals refreshed, and a one-page status update for the board chairperson.',
          items: [
            'Tracker review',
            'Approval renewals',
            'Status update',
            'Forward-look calendar',
          ],
          deliv: 'Quarterly compliance status',
          stampLine: 'Reviewed',
        },
      ],
    },
    faq: [
      {
        q: 'When does a private company need a company secretary?',
        a: "The Companies Act requires a CS for public companies and private companies with paid-up capital above INR 10 crore. Outside the regulatory trigger, hire a CS function (in-house or outsourced) when filings are starting to slip, when there's an upcoming funding round that requires clean compliance, or when the board is starting to meet formally. A solo CS in-house works at one scale; an outsourced partner-led practice covers the same scope at a fraction of the cost up to mid-market.",
      },
      {
        q: "Annual filings versus ongoing compliance — what's the difference?",
        a: 'Annual filings (AOC-4, MGT-7, DPT-3) are the ROC submissions every company files once a year. Ongoing compliance covers everything in between — board meetings, general meetings, resolutions, statutory register updates, charge filings, director declarations, and the responses to ROC queries. Annual filings are usually fine; ongoing compliance is where most companies drift. Both need to be done, both are within our scope.',
      },
      {
        q: 'How are corporate secretarial fees structured?',
        a: 'Annual retainer covering the standard scope (annual filings, board / general meetings, statutory registers, ongoing compliance) billed in two installments. Out-of-scope work (incorporations, transactions, secretarial DD, FEMA matters) is scoped per project. The retainer is set based on company size, number of meetings expected, and AIF / regulated-entity overlay if any.',
      },
      {
        q: 'How quickly can you turn around an incorporation?',
        a: 'Five to seven business days for a routine private-company incorporation from documents in hand. Faster if name approval and DSCs are already in place. Fund / AIF entity incorporations take three to four weeks because of additional MOA / AOA drafting and regulatory cross-checks. We give a date at engagement and we hold it.',
      },
      {
        q: 'How do you handle confidential cap-table and director data?',
        a: "Mutual NDA at engagement letter. Access to the company's ROC portal is limited to the named engagement team, and we use unique credentials per client (never shared). Statutory registers we maintain on your behalf belong to you — we maintain the working copies and the final copies sit with the company secretary or company records as the Companies Act requires.",
      },
      {
        q: 'How are you different from solo CS practices?',
        a: 'Solo CS practices are excellent for the basics at a low cost. Where we differ: partner attention on the matters that need it (FEMA, AIF compliance, secretarial DD, transaction documentation), continuity if the lead partner is unavailable, and process discipline across a firm rather than dependence on one person. For mid-market companies past Series A, the difference becomes meaningful — for very small companies, a solo practice is often the right choice.',
      },
      {
        q: 'Can you also handle AIF and fund-level compliance?',
        a: "Yes — it's a significant part of our practice given the Soonicorn relationship and the firm's broader fund-services work. SEBI quarterly returns, investor onboarding documents, trustee coordination, fund-level filings, PPM updates and investor letters. The same partner team covers both corporate secretarial and fund-level work, so there's no handoff between practices.",
      },
      {
        q: 'What if we have missed filings from before engaging you?',
        a: 'Common situation. The first ninety days of engagement are usually a clean-up sprint: gap audit, prioritised remediation list, late-filing penalties calculated, and a path to fully current compliance. Penalties are paid by the company; our work is to get back to a clean baseline. After that, ongoing compliance keeps it clean.',
      },
      {
        q: 'What does post-incorporation support cover?',
        a: 'First year of compliance — first board meeting documentation, opening of bank accounts coordination, statutory register setup, first filings (commencement of business, share allotments to founders / investors), and the calendar of compliance events for the year ahead. Most newly-incorporated companies retain us for the post-incorporation year because doing it alone is high-risk for a first-time company.',
      },
      {
        q: 'Can you support FEMA and FDI matters?',
        a: 'Yes. FDI filings (FC-GPR, FC-TRS), ODI filings, ECB filings, downstream investment reporting, and FEMA compliance for share issuance / transfer between residents and non-residents. We coordinate with the AD bank and RBI directly. For complex cross-border structures, we work alongside specialist FEMA counsel — that pairing is on the engagement letter so fees are clear.',
      },
    ],
    deliverables: [
      'Compliance calendar.',
      'Statutory registers checklist.',
      'Board and shareholder documentation tracker.',
      'ROC filing tracker.',
      'Due diligence request list.',
      'Governance action note.',
    ],
    experts: ['CS Neha Rathore', 'Astha Kumar'],
    leadMagnet: 'Corporate Compliance Calendar',
    cta: 'Review corporate compliance status',
    icon: ClipboardCheck,
    // TODO: Vijay to verify Corporate Secretarial metrics.
    metrics: [
      { value: 35, suffix: '+', label: 'Incorporations completed' },
      { value: 60, suffix: '+', label: 'Companies under retainer' },
      { value: 300, suffix: '+', label: 'Compliance events handled' },
      { value: 5,  suffix: ' d',  label: 'Avg ROC turnaround' },
    ],
    ordinal: '08',
    heroLive: 'Incorporation · ROC · AIF · FEMA — partner-reviewed',
    whenToEngage: [
      {
        if: 'Incorporating a new entity — Pvt Ltd, LLP, or AIF — and want the structure right from day one.',
        then: 'We run incorporation end-to-end, draft MoA and AoA, and coordinate first-board, statutory registers, and bank account setup.',
      },
      {
        if: 'Annual ROC filings and statutory registers are running behind and the next due date is uncomfortably close.',
        then: 'We catch up the registers, file the lagging returns, and rebuild the compliance calendar so it stays current.',
      },
      {
        if: 'Investor diligence ahead and corporate records need to be inspection-ready.',
        then: 'We run secretarial due diligence, gap-fix the records, and prepare the document index investors will request.',
      },
      {
        if: 'Board approvals, special resolutions, charge filings need to move alongside a transaction.',
        then: 'We sequence the corporate actions, draft the documentation, and file with ROC in step with the deal calendar.',
      },
      {
        if: 'Charge creation, satisfaction, or modification is pending and lender or auditor is asking for proof.',
        then: 'We file the charges with ROC, track satisfaction, and rebuild the security register so lenders and auditors get a clean trail.',
      },
      {
        if: 'AIF or fund vehicle needs ongoing secretarial discipline — registers, filings, trustee coordination.',
        then: 'We run the AIF secretarial calendar, file with ROC and SEBI in step, and keep the fund records audit-ready.',
      },
    ],
  },
  {
    title: 'AIF & Fund Management',
    slug: 'aif-fund-management',
    summary:
      'AIF structuring support, setup coordination, compliance maintenance, investor onboarding and fund operations.',
    promise:
      'We help sponsors, fund platforms and investment networks bring structure, compliance discipline, documentation and operating clarity to AIF and fund management ecosystems.',
    seoTitle: 'AIF Setup, Fund Management & Compliance Support | Nucleus Advisors',
    metaDescription:
      'Nucleus Advisors supports AIF structuring, setup coordination, compliance maintenance, investor onboarding, documentation, reporting and fund operations.',
    howWeHelp: [
      'AIF structure planning and setup coordination.',
      'Fund documentation and compliance calendar support.',
      'Investor onboarding and KYC process support.',
      'Drawdown, contribution and unit certificate process coordination.',
      'Trustee, sponsor, investment manager and service-provider coordination.',
      'Compliance maintenance and filing trackers.',
      'Investor communication and reporting workflows.',
      'Fund operations process design.',
      'Portfolio update and monitoring discipline.',
      'AIF due diligence and secretarial support.',
    ],
    howWeHelpDetailed: [
      {
        badge: 'Flagship mandate',
        title: 'AIF structure & setup',
        summary: 'Structure · trustee · sponsor · SEBI registration',
        body: 'End-to-end AIF setup — structure design, trustee / sponsor / IM arrangements, PPM drafting, contribution agreement and SEBI registration.',
        bullets: [
          'Structure design',
          'Trustee & sponsor',
          'PPM drafting',
          'SEBI registration',
        ],
      },
      {
        title: 'Fund operations',
        summary: 'Drawdowns · contributions · unit certificates · NAV',
        body: 'Day-to-day fund operations — drawdown notices, contribution tracking, unit certificate issuance, NAV cycles and investor communications.',
        bullets: [
          'Drawdown notices',
          'Contribution tracking',
          'Unit certificates',
          'NAV cycles',
        ],
      },
      {
        title: 'Investor onboarding',
        summary: 'KYC · contribution agreements · accreditation',
        body: 'Investor onboarding — KYC collection, contribution agreement execution, accreditation checks and bank-account coordination.',
        bullets: [
          'KYC collection',
          'Contribution agreements',
          'Accreditation',
          'Bank-account coordination',
        ],
      },
      {
        title: 'Compliance maintenance',
        summary: 'Quarterly returns · investor letters · SEBI calendar',
        body: 'Living compliance calendar — quarterly returns to SEBI, investor letters, audit timelines and regulatory filings tracked to closure.',
        bullets: [
          'SEBI quarterly returns',
          'Investor letters',
          'Audit timelines',
          'Regulatory filings',
        ],
      },
      {
        title: 'Portfolio operations',
        summary: 'Investment tracking · valuation rounds · investor reporting',
        body: 'Portfolio operations — deal-flow logs, investment commitment tracking, periodic valuation rounds and investor reporting workflows.',
        bullets: [
          'Deal-flow logs',
          'Commitment tracking',
          'Valuation rounds',
          'Investor reporting',
        ],
      },
      {
        title: 'Service-provider coordination',
        summary: 'Custodian · administrator · audit liaison',
        body: 'Coordination across custodian, fund administrator, statutory auditor and tax adviser — single point of contact for the fund manager.',
        bullets: [
          'Custodian liaison',
          'Fund-admin coordination',
          'Auditor liaison',
          'Tax adviser coordination',
        ],
      },
    ],
    processDossier: {
      fileLabel: 'N · Engagement File / 506 — 2026',
      fileBadge: 'File 506 · 2026 — illustrative',
      projectName: 'Anonymised AIF setup',
      engagementType: 'Category I AIF · SEBI registration',
      headline: 'From <em>structure</em>, to <em>first close</em>.',
      phases: [
        {
          ordinal: '●01',
          name: 'Structure & sponsor',
          weeks: 'Weeks 1–4',
          desc: 'Structure choice (Cat I / II / III), sponsor and trustee arrangements, jurisdiction view, and the commercial framework agreed with anchor LPs.',
          items: [
            'Structure choice',
            'Sponsor & trustee',
            'Jurisdiction view',
            'Anchor-LP framework',
          ],
          deliv: 'Structure memo + commercial framework',
          stampLine: 'Structured',
        },
        {
          ordinal: '●02',
          name: 'Documentation & filings',
          weeks: 'Weeks 5–10',
          desc: 'PPM drafting, contribution agreement, indenture of trust, service-provider agreements and the SEBI registration application.',
          items: [
            'PPM',
            'Contribution agreement',
            'Trust indenture',
            'SEBI application',
          ],
          deliv: 'SEBI application filed',
          stampLine: 'Filed',
        },
        {
          ordinal: '●03',
          name: 'Approval & launch',
          weeks: 'Weeks 11–16',
          desc: 'SEBI Q&A management, registration approval, first-close coordination, drawdown notices and investor onboarding go-live.',
          items: [
            'SEBI Q&A',
            'Registration approval',
            'First-close coordination',
            'Investor onboarding',
          ],
          deliv: 'SEBI registration + first close',
          stampLine: 'Approved',
        },
        {
          ordinal: '●04',
          name: 'Operate & report',
          weeks: 'Quarter-on-quarter',
          desc: 'Quarterly returns to SEBI, investor letters, NAV cycles, audit timelines, and the trustee / custodian / administrator liaison.',
          items: [
            'Quarterly SEBI returns',
            'Investor letters',
            'NAV cycles',
            'Service-provider liaison',
          ],
          deliv: 'Operational fund · regular cadence',
          stampLine: 'Live',
        },
      ],
    },
    faq: [
      {
        q: 'When should a fund manager use external AIF advisors versus build in-house?',
        a: 'First-time fund managers almost always benefit from external setup — the regulatory work is specialised and one-time. Past the first fund, in-house operations capability grows. We typically continue with multi-fund managers in a partner-grade compliance and SEBI-liaison role even after the in-house ops team is built. For single-fund or first-time managers, end-to-end external support is the norm.',
      },
      {
        q: "Cat I, II or III — what's the right structure for our first fund?",
        a: "Cat I for early-stage / venture / social impact (broadly the regulator's 'positive externality' fund types). Cat II is the default for growth / private equity / debt funds that don't have positive-externality classification. Cat III for hedge / long-short / liquid strategies. The decision drives leverage caps, tax pass-through treatment, and SEBI reporting load. We scope the structure decision in week one of engagement.",
      },
      {
        q: 'How are AIF setup and operations fees structured?',
        a: 'Setup is a fixed engagement fee tied to milestones (structure approval, document drafting, SEBI application, registration, first close). Ongoing operations is a quarterly retainer scoped to fund size, investor count, and SEBI compliance load. Trustee and custodian fees are separate (paid directly by the fund). All fees on the engagement letter before kick-off.',
      },
      {
        q: 'How long does it take to get a first close?',
        a: "Twelve to sixteen weeks from engagement letter to first close, assuming structure is straightforward and PPM commercials are largely agreed. Cross-border structures (GIFT City / IFSC, offshore feeders) add four to six weeks for additional regulatory steps. SEBI's own processing time for the AIF registration is six to eight weeks of that window — predictable but not compressible.",
      },
      {
        q: 'How do you handle confidential LP information?',
        a: "Mutual NDAs at engagement letter and individually with each LP onboarding. LP records sit on access-controlled systems segregated per fund. We never use LP information from one fund to inform another fund's marketing or operations. SEBI's reporting requirements limit disclosure scope to aggregate data — individual LP disclosure beyond what SEBI requires never happens.",
      },
      {
        q: 'How are you different from law firms doing AIF setup?',
        a: 'Law firms do excellent drafting work — PPM, contribution agreement, trust deed. What we bring on top is the operational design (drawdowns, NAV cycles, investor communications, quarterly compliance), the SEBI liaison through registration, and the post-launch operations capability. Most managers use a law firm for the documents and us for everything around them. We coordinate the workstreams.',
      },
      {
        q: 'Can you continue post-launch operations support?',
        a: "That's the steady-state engagement. Quarterly SEBI returns, drawdown notices, investor reporting, NAV cycles, audit timelines, regulatory filings, and the trustee / custodian / fund-administrator liaison. Most fund managers retain us through the fund's life rather than re-staffing each function in-house — the economics favour external for any fund below US $200M AUM.",
      },
      {
        q: "What happens if there's a regulatory enquiry from SEBI?",
        a: 'We handle the response — drafting, evidence packs, follow-up correspondence, and the formal meetings with the SEBI desk officer. Most enquiries are routine clarifications resolved within four to six weeks. For more serious matters (show-cause notices, enforcement), we work alongside SEBI-specialist counsel; that pairing is documented on the engagement letter so fees are clear if it ever happens.',
      },
      {
        q: 'Can you set up funds in IFSC / GIFT City?',
        a: 'Yes. GIFT City IFSCA-registered fund management entities are a growing share of our work — both as a primary domicile and as a feeder into a domestic AIF. The structuring decision (GIFT vs domestic AIF vs offshore vs hybrid) is driven by LP base, asset class, and tax efficiency. We scope that decision before engagement.',
      },
      {
        q: "What's the minimum fund size that's economically viable?",
        a: 'US $10M corpus for a Cat I or Cat II fund is the practical floor — below that, the fixed cost of setup, trustee, audit and compliance outweighs the management fee. The economics improve sharply above US $25M. For sub-$10M strategies we sometimes recommend the company set up as a non-AIF structure (LLP / private trust) with lighter regulation, scope-permitting.',
      },
    ],
    deliverables: [
      'AIF setup workplan.',
      'Regulatory and compliance calendar.',
      'Investor onboarding checklist.',
      'KYC and document collection tracker.',
      'Drawdown and unit certificate process tracker.',
      'Fund operations SOP.',
      'Investment documentation tracker.',
      'Portfolio reporting calendar.',
    ],
    experts: ['CS Neha Rathore', 'CA Vijay Singh Rathore', 'Samarth Pandey', 'Astha Kumar'],
    leadMagnet: 'AIF Setup and Compliance Readiness Checklist',
    cta: 'Discuss AIF structuring and fund operations',
    proof: [
      'Investment Manager to Soonicorn Angel Trust-I.',
      'Soonicorn Angel Trust-I is presented publicly as a SEBI-registered Category I Angel Fund.',
      'Proof is shown as operating experience, not as investment solicitation or performance promotion.',
    ],
    icon: Building2,
    // TODO: Vijay to verify AIF & Fund Management metrics — Soonicorn-related.
    metrics: [
      { value: 2,  suffix: '+',  label: 'AIF structures set up' },
      { value: 50, prefix: '$',  suffix: 'M+', label: 'AUM advised' },
      { value: 12, suffix: ' wk', label: 'Avg fund-launch timeline' },
      { value: 60, suffix: '+',  label: 'Portfolio companies tracked' },
    ],
    ordinal: '09',
    heroLive: 'Cat I / II / III · SEBI · GIFT City ready',
    whenToEngage: [
      {
        if: 'Setting up a new AIF and need the structure, sponsor, trustee, and investment manager arrangements aligned with SEBI.',
        then: 'We build the AIF setup workplan, coordinate registrations and service providers, and prepare the compliance calendar.',
      },
      {
        if: 'Fund is live but investor onboarding, KYC, and drawdown processes are ad-hoc and slowing capital calls.',
        then: 'We design the onboarding workflow, drawdown tracker, and unit certificate process — turning the operating layer into a discipline.',
      },
      {
        if: 'Quarterly investor reporting and regulatory filings are eating up partner bandwidth.',
        then: 'We take the reporting calendar — investor updates, portfolio MIS, regulatory filings — off the partners’ desks.',
      },
      {
        if: 'Considering a fund extension, new scheme, or restructure and need SEBI-aligned coordination.',
        then: 'We work with trustee, custodian, legal, and SEBI counsel to package the change and execute the filings.',
      },
      {
        if: 'Portfolio monitoring is informal — drawdowns, milestones, valuations not tracked on a consistent cadence.',
        then: 'We build the portfolio MIS, set the valuation policy, and design the IC and update cadence.',
      },
      {
        if: 'Investor coming in for due diligence — questions on track record, processes, governance, compliance.',
        then: 'We package the fund DD pack — IC minutes, valuation policy, regulatory filings, audit trail — and walk diligence teams through it.',
      },
    ],
  },
];

export type ClientType = {
  slug: string;
  name: string;
  context: string;
  icon: LucideIcon;
};

export type ClientSegment = {
  slug: string;
  label: string;
  items: ClientType[];
};

/**
 * Nucleus client universe, grouped into operating businesses and
 * financial institutions. Two columns of equal weight — no "featured"
 * treatment. The homepage and About page render from this single source.
 */
export const clientSegments: ClientSegment[] = [
  {
    slug: 'operating-businesses',
    label: 'Operating businesses',
    items: [
      {
        slug: 'listed',
        name: 'Listed companies',
        context: 'Statutory audit, board reporting, IFC / ICFR, transactional advisory.',
        icon: Building2,
      },
      {
        slug: 'unlisted',
        name: 'Privately-held companies',
        context: 'Audit, tax, governance, succession and restructuring.',
        icon: BriefcaseBusiness,
      },
      {
        slug: 'manufacturing',
        name: 'Manufacturing',
        context: 'Capital intensity, working capital, plant accounting and audit complexity.',
        icon: Factory,
      },
      {
        slug: 'services',
        name: 'Services',
        context: 'Revenue recognition, contract economics, MIS and people-cost discipline.',
        icon: BarChart3,
      },
      {
        slug: 'startups',
        name: 'Founder-led startups',
        context: 'Fundraise readiness, runway, valuation, board reporting and ESOP.',
        icon: Rocket,
      },
    ],
  },
  {
    slug: 'financial-institutions',
    label: 'Financial institutions',
    items: [
      {
        slug: 'banks',
        name: 'Banks',
        context: 'Concurrent, statutory and branch audits; regulatory reviews.',
        icon: Landmark,
      },
      {
        slug: 'nbfcs',
        name: 'NBFCs',
        context: 'Statutory audit, IFC, RBI compliance and securitisation review.',
        icon: Wallet,
      },
      {
        slug: 'funds',
        name: 'Funds & AIFs',
        context: 'Fund setup, NAV, investor reporting and regulatory compliance.',
        icon: LineChart,
      },
      {
        slug: 'family-offices',
        name: 'Family offices',
        context: 'Portfolio diligence, governance, reporting and restructuring.',
        icon: Crown,
      },
    ],
  },
];

export type Testimonial = {
  quote: string;
  authorName: string;
  authorRole: string;
  authorCompany?: string;
  companyLogo?: string;
  authorPhoto?: string;
  consentNote?: string;
  featured?: boolean;
};

/*
 * Real, consented testimonials only.
 *
 * Workflow before adding an entry here:
 *   1. Get written consent from the client to attribute the quote on the public site.
 *   2. Capture the consent context in `consentNote` (e.g. "Approved by signatory on 2026-04-12").
 *   3. Confirm with the relevant partner that the client logo/photo can be used externally.
 *
 * When the array is empty, the homepage testimonial section auto-hides in production
 * and shows a clearly-marked "awaiting consented quotes" placeholder in dev.
 */
export const testimonials: Testimonial[] = [];

export const insightCategories = [
  'Deals and Investment Banking',
  'M&A and Restructuring',
  'Risk, IFC and Internal Audit',
  'GST and Indirect Tax',
  'Direct Tax and Transfer Pricing',
  'Valuations',
  'Assurance and Reporting',
  'AIF and Fund Management',
];
