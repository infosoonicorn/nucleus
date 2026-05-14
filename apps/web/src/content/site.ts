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

export type Service = {
  title: string;
  slug: string;
  summary: string;
  promise: string;
  seoTitle: string;
  metaDescription: string;
  howWeHelp: string[];
  deliverables: string[];
  experts: string[];
  leadMagnet: string;
  cta: string;
  proof?: string[];
  icon: LucideIcon;
  /** Two-digit ordinal: '01' through '09'. Drives the §NN eyebrow on service pages. */
  ordinal: string;
  displayHeadline?: string;                 // 3-word punchier hero headline; falls back to title.
  whenToEngage?: { if: string; then: string }[]; // 4 IF/THEN scenario pairs; fallback shows generic checklist if absent.
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
    ],
    crossLink: {
      kind: 'in-house-fund',
      brand: 'Soonicorn Ventures',
      logoPath: '/brand/soonicorn-ventures.png',
      eyebrow: '§ In-house capital alongside advisory',
      title: 'Soonicorn Ventures',
      body: "Nucleus is Investment Manager to Soonicorn Angel Trust-I, an early-stage fund focused on seed and pre-Series A startups raising up to US $1M. If your round fits the fund's mandate, you can also explore Soonicorn Ventures directly.",
      ctaLabel: 'Visit Soonicorn Ventures',
      href: 'https://soonicornventures.com/',
      disclaimer: 'This is not an offer or solicitation to invest in or raise from any fund or security. Any engagement with Soonicorn Ventures is subject to its fund mandate, stage and sector fit, and independent diligence.',
      reviewerStatus: 'approved',
      reviewerApprovedAt: '2026-05-14',
    },
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
