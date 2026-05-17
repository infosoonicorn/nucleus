import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  Coins,
  Crown,
  Factory,
  FileCheck2,
  Landmark,
  LineChart,
  Rocket,
  Scale,
  ShieldCheck,
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
  date: string;                // e.g. '14 Apr 2026' — illustrative milestone date
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
  partnerLabel: string;        // 'Lead: V. S. Rathore, Partner'
  partnerSignature: string;    // 'V. S. Rathore' — renders in Caveat (cursive)
  partnerCaption: string;      // 'Partner sign-off'
  footerLine: string;          // 'Nucleus Advisors · Gurugram · Bengaluru · Jaipur'
  footerNote: string;          // 'Issued under partnership letter dated 12 Apr 2026'
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
  { label: 'Careers', href: '/careers' },
  { label: 'Insights', href: '/insights' },
  { label: 'Contact', href: '/contact' },
];

export type ProofPoint = {
  value: number;
  suffix: string;
  label: string;
};

export const proof: ProofPoint[] = [
  { value: 8, suffix: '', label: 'Partners' },
  { value: 90, suffix: '+', label: 'Team members' },
  { value: 130, suffix: '+', label: 'Clients served' },
  { value: 50, suffix: '+', label: 'Deals closed' },
  { value: 5, suffix: '', label: 'Offices' },
  { value: 100, suffix: '+', label: 'Years combined experience' },
];

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
  'Improving finance operations, MIS and controllership.',
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
      partnerLabel: 'Lead: V. S. Rathore, Partner',
      partnerSignature: 'V. S. Rathore',
      partnerCaption: 'Partner sign-off',
      footerLine: 'Nucleus Advisors · Gurugram · Bengaluru · Jaipur',
      footerNote: 'Issued under partnership letter — illustrative example',
      phases: [
        {
          ordinal: '●01',
          name: 'Mandate & scope',
          weeks: 'Weeks 1–2',
          date: '14 Apr 2026',
          desc: 'Define what a successful round looks like, agree the workplan, set fees, timeline, and named owners on both sides.',
          items: ['Success criteria', 'Workplan & owners', 'Fees & timeline'],
          deliv: 'Engagement letter',
          stampLine: 'Aligned',
        },
        {
          ordinal: '●02',
          name: 'Build & pressure-test',
          weeks: 'Weeks 3–6',
          date: '06 May 2026',
          desc: 'Model, deck, IM. Every assumption stress-tested as if hostile investor diligence is already running.',
          items: ['Operating model', 'Pitch deck', 'Information memo'],
          deliv: 'Investor-ready pack',
          stampLine: 'Stress-tested',
        },
        {
          ordinal: '●03',
          name: 'Market & manage',
          weeks: 'Weeks 7–12',
          date: '21 Jun 2026',
          desc: 'Investor mapping, outreach calendar, intro coordination, and Q&A management. We run the campaign so you can run the company.',
          items: ['Investor map', 'Outreach calendar', 'Q&A management'],
          deliv: 'Live process + warm intros',
          stampLine: 'In market',
        },
        {
          ordinal: '●04',
          name: 'Close & handover',
          weeks: 'Weeks 13–16 + 90-day handover',
          date: '',
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
      'Buy-side, sell-side, mergers, demergers, restructuring, transaction strategy and documentation support.',
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
      'CA Tarun Agarwal',
      'CS Neha Rathore',
    ],
    leadMagnet: 'M&A Readiness Checklist',
    cta: 'Evaluate a transaction',
    icon: BriefcaseBusiness,
    ordinal: '02',
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
    ordinal: '03',
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
    deliverables: [
      'Tax position note.',
      'Compliance calendar.',
      'GST impact analysis.',
      'Transfer pricing documentation.',
      'Assessment response support.',
      'Refund support pack.',
      'Regulatory filing tracker.',
    ],
    experts: ['CA Hemendra Chauhan', 'Rajat Singla', 'CS Neha Rathore', 'Vijay K. Choudhary'],
    leadMagnet: 'GST and Tax Compliance Calendar',
    cta: 'Review tax and compliance exposure',
    icon: Scale,
    ordinal: '04',
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
    deliverables: [
      'Audit plan.',
      'Audit queries and closure tracker.',
      'Financial reporting review.',
      'Ind AS impact note.',
      'Compliance evidence checklist.',
      'Management letter and improvement observations.',
    ],
    experts: ['CA Abhishek Gupta', 'CA Tarun Agarwal', 'Geetanjali Virmani'],
    leadMagnet: 'Audit Readiness Checklist',
    cta: 'Prepare for audit readiness',
    icon: FileCheck2,
    ordinal: '05',
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
    deliverables: [
      'Valuation report.',
      'Valuation model.',
      'Assumptions pack.',
      'Scenario analysis.',
      'Investor or board summary.',
      'Compliance-ready supporting schedules.',
    ],
    experts: ['CA Vijay Singh Rathore', 'CA Aakash Kalra', 'CA Tarun Agarwal'],
    leadMagnet: 'Valuation Readiness Checklist',
    cta: 'Start a valuation discussion',
    icon: LineChart,
    ordinal: '06',
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
    deliverables: [
      'Monthly MIS pack.',
      'Compliance tracker.',
      'Bookkeeping and close calendar.',
      'Payroll tracker.',
      'Finance process SOPs.',
      'Expense verification report.',
      'Fixed asset register.',
    ],
    experts: ['CA Pravesh Goel', 'CA Tarun Agarwal', 'CA Hemendra Chauhan', 'Geetanjali Virmani'],
    leadMagnet: 'Monthly MIS Template for Founders',
    cta: 'Strengthen finance operations',
    icon: BarChart3,
    ordinal: '07',
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
    ordinal: '08',
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
    ordinal: '09',
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

export type ClientArchetype = {
  slug: string;
  name: string;
  valueLine: string;
  icon: LucideIcon;
  accent?: 'red' | 'navy';
};

/**
 * The five operating contexts the Nucleus bench is configured for.
 * Replaces the older flat `industries` list; the about page and homepage both
 * render from this single source.
 */
export const clientArchetypes: ClientArchetype[] = [
  {
    slug: 'manufacturing',
    name: 'Manufacturing',
    valueLine:
      'Capital intensity, working capital, plant accounting and audit complexity.',
    icon: Factory,
    accent: 'red',
  },
  {
    slug: 'services',
    name: 'Services',
    valueLine:
      'Revenue recognition, contract economics, MIS and people-cost discipline.',
    icon: BriefcaseBusiness,
  },
  {
    slug: 'funded-tech',
    name: 'Funded tech',
    valueLine:
      'Fundraise readiness, runway, valuation, board reporting and ESOP.',
    icon: Rocket,
  },
  {
    slug: 'family-business',
    name: 'Family business',
    valueLine:
      'Governance, succession, restructuring and quiet professional rigour.',
    icon: Crown,
  },
  {
    slug: 'funds-and-investors',
    name: 'Funds & investors',
    valueLine:
      'AIF setup, fund operations, portfolio diligence and reporting.',
    icon: Coins,
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
