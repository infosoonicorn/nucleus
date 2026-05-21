/**
 * Team members — single source of truth for partners and senior team
 * across all service lines.
 *
 * Sourced from "Nucleus Profile 2026" firm document. Pictures live at
 * `apps/web/public/team/<slug>.jpg` (600x600 square, ≤60 KB each).
 *
 * Curation rule: each member is tagged with `serviceSlugs[]`. They
 * surface on every service page in that array via the right sidebar's
 * TeamBlock (auto). They also surface on `/team` and `/team/<slug>`
 * profile pages.
 *
 * Article authorship: `apps/web/src/content/articles.ts` references
 * partners by `authorSlug` into this file. Editing a partner here
 * (new headshot, role tweak, longer bio) auto-updates every article
 * by that partner — single source of truth.
 *
 * Contact details:
 * - Emails follow the firm convention `<first>@nucleusadvisors.in`.
 *   **Confirm with each partner** before publishing — entries marked
 *   `// TODO confirm email` should be verified before production.
 *   The article author block and team card both hide the email/mailto
 *   when `email` is absent, so leaving it empty is safe.
 * - LinkedIn URLs left empty until each partner provides them.
 */

import type { Service } from './site';

export type ServiceSlug = Service['slug'];

/**
 * Past employer entry. `name` is required and is used as both the text-
 * pill label (default render) and the alt-text when a logo image is
 * present. `src` upgrades the pill to a small grayscale logo image.
 *
 * To add a logo:
 *   1. Drop the PNG at `apps/web/public/team/logos/<name>.png`
 *      (use the company's own brand-asset page where possible to get
 *      a clean, licensed file)
 *   2. Add `src: '/team/logos/<name>.png'` to that PastEmployer record
 * The modal swaps from a text pill to the image automatically. No
 * third-party logo files ship with the default install — populate as
 * the firm clears each one for use.
 */
export type PastEmployer = {
  name: string;
  src?: string;
};

export type TeamMember = {
  slug: string;                                          // url-safe identifier
  name: string;                                          // full display name
  role: string;                                          // e.g. 'Founding Partner'
  group: 'leadership' | 'executive';                     // section on /team page
  seniority: 'partner' | 'senior' | 'associate';         // ordering hint for cards
  initials: string;                                      // monogram avatar fallback
  headshotSrc?: string;                                  // `/team/<slug>.jpg`
  email?: string;                                        // mailto target (omit until confirmed)
  linkedinUrl?: string;                                  // external link, optional
  expertise: readonly string[];                          // 3-4 expertise tags shown as pills
  experienceYears?: number;                              // numeric years of professional experience
  pastEmployers?: readonly (string | PastEmployer)[];    // ex-companies; string = text pill, object = with optional logo
  qualifications?: readonly string[];                    // CA, CFA, LLM, etc.
  shortBio?: string;                                     // 1-2 lines, shown on card
  fullBio?: string;                                      // longer prose, shown in modal / profile page
  serviceSlugs: readonly string[];                       // which service pages they surface on
};

/** Normalise pastEmployers entries — accept both legacy `string` and
 *  rich `PastEmployer` shapes for backward compat with existing data. */
export function normalisePastEmployer(e: string | PastEmployer): PastEmployer {
  return typeof e === 'string' ? { name: e } : e;
}

/**
 * Professional prefixes that precede the legal name on a partner card
 * but aren't part of the spoken first name. "CA Vijay Singh Rathore"
 * is addressed as "Vijay", not "CA". Strip these when extracting the
 * first or last name for use in copy ("Email Vijay", "Writing from
 * Pravesh", etc.).
 */
const HONORIFIC_PREFIXES = new Set(['CA', 'CS', 'Dr.', 'Dr', 'Mr.', 'Mrs.', 'Ms.', 'Adv.', 'Adv']);

function stripHonorific(name: string): string[] {
  const parts = name.trim().split(/\s+/);
  if (parts.length > 0 && HONORIFIC_PREFIXES.has(parts[0])) {
    return parts.slice(1);
  }
  return parts;
}

/** First name after stripping any honorific prefix. */
export function getFirstName(name: string): string {
  const parts = stripHonorific(name);
  return parts[0] ?? name;
}

/** Last name (final token) after stripping any honorific prefix. */
export function getLastName(name: string): string {
  const parts = stripHonorific(name);
  return parts[parts.length - 1] ?? name;
}

export const team: TeamMember[] = [
  // ─── Leadership Team ───────────────────────────────────────────────
  {
    slug: 'pravesh-goel',
    name: 'CA Pravesh Goel',
    role: 'Managing Partner',
    group: 'leadership',
    seniority: 'partner',
    initials: 'PG',
    headshotSrc: '/team/pravesh-goel.jpg',
    // email TODO confirm
    expertise: ['M&A', 'Buy-side / Sell-side', 'Deal Structuring'],
    experienceYears: 20,
    pastEmployers: [
      { name: 'Deloitte', src: '/team/logos/deloitte.png' },
      { name: 'PwC', src: '/team/logos/pwc.png' },
      { name: 'SAIPEM', src: '/team/logos/saipem.png' },
    ],
    qualifications: ['Chartered Accountant'],
    shortBio:
      'Leads the M&A, vCFO and process re-engineering practice. Helps startups and SMEs navigate mergers, acquisitions, and complex disputes with tailored solutions.',
    fullBio: [
      'Pravesh leads the M&A, vCFO and Process Re-engineering division at Nucleus, focusing on driving growth and addressing challenges for startups and SMEs. His work is pivotal in helping these businesses navigate complex mergers, acquisitions, and disputes, ensuring their continued success and strategic development.',
      'Having worked extensively in the area of Statutory Audits, Internal Audits, Risk Management, and Taxation, he brings expertise, experience and wisdom to the firm through overall supervision and assurance of the quality of work delivered across these assignments.',
    ].join('\n\n'),
    serviceSlugs: ['ma-advisory'],
  },
  {
    slug: 'vijay-singh-rathore',
    name: 'CA Vijay Singh Rathore',
    role: 'Founding Partner',
    group: 'leadership',
    seniority: 'partner',
    initials: 'VSR',
    headshotSrc: '/team/vijay-singh-rathore.jpg',
    email: 'vijay@nucleusadvisors.in', // TODO confirm
    expertise: ['Financial Due Diligence', 'Valuations', 'Startup Fundraising'],
    experienceYears: 10,
    pastEmployers: [
      { name: 'ICICI Bank', src: '/team/logos/icici-bank.png' },
    ],
    qualifications: ['Chartered Accountant'],
    shortBio:
      'Heads investment banking. Works closely with founders on financial modelling, pitch decks, term sheet negotiations, and fundraising strategy.',
    fullBio: [
      'Vijay heads the Investment Banking vertical at Nucleus. He works closely with founders, assisting early-stage startups with financial modelling, investor pitch decks, and fundraising strategies, including term sheet negotiations. Over his career, he has successfully supported 100+ startups in navigating their fundraising journeys.',
      'Vijay also collaborates with venture capital funds and family offices, providing support in financial due diligence and post-investment monitoring, demonstrating a strong command of both startup ecosystems and institutional investing. His wealth of experience makes him a trusted partner for investors and founders alike.',
      'Previously, Vijay served as an Internal Auditor at ICICI Bank, focusing on the Retail Liabilities Group. During his tenure, he conducted audits across 65 locations in North India, gaining expertise in anti-money laundering (AML), compliance, credit, forex, and remittance processes.',
    ].join('\n\n'),
    serviceSlugs: ['investment-banking', 'valuations'],
  },
  {
    slug: 'ashish-gupta',
    name: 'CA Ashish Gupta',
    role: 'Senior Partner',
    group: 'leadership',
    seniority: 'partner',
    initials: 'AG',
    headshotSrc: '/team/ashish-gupta.jpg',
    expertise: ['Internal Audit', 'ICFR', 'Risk Management'],
    experienceYears: 13,
    pastEmployers: [
      { name: 'ICICI Bank', src: '/team/logos/icici-bank.png' },
      { name: 'Yes Bank', src: '/team/logos/yes-bank.png' },
      { name: 'AU Small Finance Bank', src: '/team/logos/au-small-finance-bank.png' },
    ],
    qualifications: ['Chartered Accountant'],
    shortBio:
      'Leads internal audit and risk management. Specialises in banking, finance and NBFC sectors — audits, risk assessments, and process optimisation.',
    fullBio: [
      'Ashish leads the Internal Audit and Risk Management division at Nucleus. He is a seasoned professional with deep expertise in internal audit, risk management, and process re-engineering within the banking, finance, and Non-Banking Financial Company (NBFC) sectors.',
      'He has successfully led audits, risk assessments, and process optimisation projects that help organisations manage risk, enhance operational efficiency, and maintain regulatory compliance. With a keen eye for identifying system vulnerabilities and inefficiencies, he designs tailored solutions that strengthen internal controls and drive long-term business growth.',
      'His work spans a diverse range of clients, from large banks to emerging NBFCs, ensuring each institution can navigate complex risk environments with confidence.',
    ].join('\n\n'),
    serviceSlugs: ['risk-advisory'],
  },
  {
    slug: 'abhishek-gupta',
    name: 'CA Abhishek Gupta',
    role: 'Partner',
    group: 'leadership',
    seniority: 'partner',
    initials: 'ABG',
    headshotSrc: '/team/abhishek-gupta.jpg',
    expertise: ['Statutory Audit', 'Direct Tax', 'Controllership'],
    experienceYears: 6,
    pastEmployers: [
      { name: 'ACME', src: '/team/logos/acme.png' },
    ],
    qualifications: ['Chartered Accountant'],
    shortBio:
      'Leads audit and assurance. Significant experience in statutory audits across companies, startups and PSUs, plus limited reviews of listed companies.',
    fullBio: [
      'Abhishek leads the Audit & Assurance division at Nucleus, combining expertise with a client-first approach. He has significant experience in statutory audits for companies, startups, and PSUs, along with limited reviews of listed companies.',
      'His work spans assurance services such as utilisation certificates, RBI and FEMA compliance, and buy-back related requirements. He has also handled internal audits, process re-engineering, internal financial controls, physical verifications, income tax audits, and litigation.',
      'Focused on building trust and delivering value, he helps clients navigate regulatory complexities, enhance processes, and achieve their objectives effectively.',
    ].join('\n\n'),
    serviceSlugs: ['assurance', 'tax-regulatory', 'finance-outsourcing'],
  },
  {
    slug: 'aakash-kalra',
    name: 'CA Aakash Kalra',
    role: 'Partner',
    group: 'leadership',
    seniority: 'partner',
    initials: 'AK',
    headshotSrc: '/team/aakash-kalra.jpg',
    expertise: ['Deals', 'M&A', 'Diligence'],
    experienceYears: 10,
    pastEmployers: [
      { name: 'Deloitte', src: '/team/logos/deloitte.png' },
      { name: 'PwC', src: '/team/logos/pwc.png' },
    ],
    qualifications: ['Chartered Accountant'],
    shortBio:
      'Partner with the M&A, due diligence and vCFO practice. Deep deal experience across ecommerce, auto ancillary, fintech, IT and consumer.',
    fullBio: [
      'Aakash is Partner with the M&A, Due Diligence and v-CFO division at Nucleus, focusing on successful closure of deals and M&A transactions.',
      'Having professional M&A experience from Deloitte and PwC, he has handled inbound and outbound restructuring and business consulting on M&A structures and arrangements (mergers, demergers, etc.).',
      'He holds professional experience across multiple clients in due diligence, FP&A, deal advisory and extensive deal running experience across ecommerce, auto ancillary, fintech, IT, and the consumer sector.',
    ].join('\n\n'),
    serviceSlugs: ['ma-advisory'],
  },
  {
    slug: 'hemendra-chauhan',
    name: 'CA Hemendra Chauhan',
    role: 'Partner',
    group: 'leadership',
    seniority: 'partner',
    initials: 'HC',
    headshotSrc: '/team/hemendra-chauhan.jpg',
    expertise: ['GST', 'Income Tax', 'Compliance'],
    experienceYears: 8,
    qualifications: ['Chartered Accountant'],
    shortBio:
      'GST and finance controllership specialist. Strong track record in hassle-free GST refunds and minimising litigation in indirect taxation.',
    fullBio: [
      'Hemendra specialises in GST and Finance Controllership, with a focus on Indirect Taxation (GST). He has a remarkable track record of helping companies secure hassle-free GST refunds and managing GST compliances in a way that minimises litigation matters.',
      'In the realm of financial management, he excels in maintaining accurate and compliant books of accounts, streamlining compliance processes, and implementing strategic frameworks to support startups in optimising their finance and accounts functions. His expertise ensures regulatory adherence, operational efficiency, and sustainable growth, contributing to the firm\'s reputation for delivering excellence.',
    ].join('\n\n'),
    serviceSlugs: ['tax-regulatory'],
  },
  {
    slug: 'neha-rathore',
    name: 'CS Neha Rathore',
    role: 'Partner',
    group: 'leadership',
    seniority: 'partner',
    initials: 'NR',
    headshotSrc: '/team/neha-rathore.jpg',
    expertise: ['Secretarial Compliance', 'AIF Compliance', 'FEMA & ROC'],
    experienceYears: 7,
    qualifications: ['Company Secretary'],
    shortBio:
      'Specialises in secretarial compliances and corporate governance. Manages Companies Act compliance, ROC filings, and contract / SHA drafting for M&A.',
    fullBio: [
      'Neha is a highly skilled professional specialising in secretarial compliances and legal work for companies. With a deep understanding of corporate governance, regulatory requirements, and legal frameworks, she plays a crucial role in ensuring organisations adhere to statutory obligations, maintain transparency, and manage risks effectively.',
      'Her responsibilities include managing companies\' compliance with laws such as the Companies Act, overseeing the proper filing of documents, and ensuring timely submission of required forms with authorities like the Registrar of Companies. She also provides expert legal guidance ranging from contract drafting to dispute resolution, offering essential support for mergers and acquisitions.',
    ].join('\n\n'),
    serviceSlugs: ['corporate-secretarial', 'aif-fund-management'],
  },
  {
    slug: 'rajat-singla',
    name: 'CA Rajat Singla',
    role: 'Partner',
    group: 'leadership',
    seniority: 'partner',
    initials: 'RS',
    headshotSrc: '/team/rajat-singla.jpg',
    expertise: ['GST', 'Income Tax', 'TDS'],
    experienceYears: 3,
    qualifications: ['Chartered Accountant'],
    serviceSlugs: ['tax-regulatory'],
  },

  // ─── Executive Team ────────────────────────────────────────────────
  {
    slug: 'geetanjali-virmani',
    name: 'Geetanjali Virmani',
    role: 'Senior Network Partner',
    group: 'executive',
    seniority: 'senior',
    initials: 'GV',
    headshotSrc: '/team/geetanjali-virmani.jpg',
    expertise: ['Accounting & Compliance', 'Controllership', 'Internal Audit'],
    experienceYears: 15,
    pastEmployers: ['Genpact'],
    qualifications: ['Chartered Accountant'],
    serviceSlugs: [],
  },
  {
    slug: 'vijay-k-choudhary',
    name: 'Vijay K. Choudhary',
    role: 'Advisor to the Board',
    group: 'executive',
    seniority: 'senior',
    initials: 'VKC',
    headshotSrc: '/team/vijay-k-choudhary.jpg',
    expertise: ['Special Situations', 'Income Tax', 'IBC'],
    experienceYears: 40,
    pastEmployers: ['NABARD (Board Member)'],
    qualifications: ['Chartered Accountant'],
    serviceSlugs: [],
  },
  {
    slug: 'samarth-pandey',
    name: 'Samarth Pandey',
    role: 'Principal, Investments',
    group: 'executive',
    seniority: 'senior',
    initials: 'SP',
    headshotSrc: '/team/samarth-pandey.jpg',
    email: 'samarth@nucleusadvisors.in', // TODO confirm
    expertise: ['SV - AIF', 'Transaction Advisory', 'Investment Banking'],
    experienceYears: 2,
    qualifications: ['B.Com', 'CFA (Pursuing)'],
    shortBio:
      'Drives the build phase of every IB mandate — model, deck, IM, data room, FAQ pack. Owns the day-to-day cadence with founders and the diligence issue tracker.',
    fullBio: [
      'Samarth works alongside Vijay on the investment banking bench. He drives the build phase of every mandate — three-statement model, base/bull/bear scenarios, narrative deck, information memorandum, data room scoping and the FAQ pack that fronts the diligence call.',
      'He owns the day-to-day cadence with founders, the investor-map maintenance, and the issue tracker that holds every diligence ask accountable to closure. On most mandates he is the person you exchange the most emails with.',
    ].join('\n\n'),
    serviceSlugs: [],
  },
  {
    slug: 'astha-kumar',
    name: 'Astha Kumar',
    role: 'Associate Lawyer',
    group: 'executive',
    seniority: 'associate',
    initials: 'AK2',
    headshotSrc: '/team/astha-kumar.jpg',
    expertise: ['Agreement Drafting', 'M&A Documentation', 'AIF Compliance'],
    experienceYears: 2,
    qualifications: ['BA LLB', 'LLM'],
    serviceSlugs: [],
  },
];

const SENIORITY_ORDER: Record<TeamMember['seniority'], number> = {
  partner: 0,
  senior: 1,
  associate: 2,
};

/**
 * Literal-union of every team member's slug. Used to type-check
 * `SERVICE_LEADS`.
 */
export type TeamSlug = (typeof team)[number]['slug'];

export type ServiceLead = {
  lead: TeamSlug;
  coLeads?: readonly TeamSlug[];
};

/**
 * Single source of truth for who leads (and co-leads) each service line.
 * Consumed by `getTeamForService` for sort order and by `process.tsx` for
 * the rendered partner block. Validated at build time by
 * `scripts/lint-team-services.mjs` (added in a later task in this plan).
 */
export const SERVICE_LEADS: Record<ServiceSlug, ServiceLead> = {
  'investment-banking':    { lead: 'vijay-singh-rathore' },
  'ma-advisory':           { lead: 'pravesh-goel', coLeads: ['aakash-kalra'] },
  'valuations':            { lead: 'vijay-singh-rathore' },
  'assurance':             { lead: 'abhishek-gupta' },
  'risk-advisory':         { lead: 'ashish-gupta' },
  'tax-regulatory':        { lead: 'abhishek-gupta', coLeads: ['hemendra-chauhan', 'rajat-singla'] },
  'corporate-secretarial': { lead: 'neha-rathore' },
  'finance-outsourcing':   { lead: 'abhishek-gupta' },
  'aif-fund-management':   { lead: 'neha-rathore' },
};

export function getTeamForService(slug: ServiceSlug): TeamMember[] {
  const entry = SERVICE_LEADS[slug];
  const leadOrder: TeamSlug[] = entry ? [entry.lead, ...(entry.coLeads ?? [])] : [];
  return team
    .filter((m) => m.group === 'leadership' && m.serviceSlugs.includes(slug))
    .sort((a, b) => {
      const ai = leadOrder.indexOf(a.slug as TeamSlug);
      const bi = leadOrder.indexOf(b.slug as TeamSlug);
      if (ai !== -1 || bi !== -1) {
        if (ai === -1) return 1;
        if (bi === -1) return -1;
        return ai - bi;
      }
      return SENIORITY_ORDER[a.seniority] - SENIORITY_ORDER[b.seniority];
    });
}

export function getTeamMemberBySlug(slug: string): TeamMember | undefined {
  return team.find((m) => m.slug === slug);
}

/**
 * Case-insensitive lookup by display name. Kept for backward-compatible
 * lookups; the canonical path is slug-based.
 */
export function getTeamMemberByName(name: string): TeamMember | undefined {
  const needle = name.trim().toLowerCase();
  return team.find((m) => m.name.toLowerCase() === needle);
}

/**
 * Group + sort all members for the `/team` page. Leadership first
 * (partners by listing order in `team`), then executive team.
 */
export function getTeamGrouped(): { leadership: TeamMember[]; executive: TeamMember[] } {
  return {
    leadership: team.filter((m) => m.group === 'leadership'),
    executive: team.filter((m) => m.group === 'executive'),
  };
}
