/**
 * Team members — single source of truth for partners and senior team
 * across all service lines.
 *
 * Curation rule: each member is tagged with `serviceSlugs[]`. They
 * surface on every service page in that array via the right sidebar's
 * TeamBlock (auto). Add or remove tags here; nothing else to update.
 *
 * Contact details:
 * - Emails follow the firm convention `<first>@nucleusadvisors.in`.
 *   **Confirm these with Vijay** before pushing to origin — mark
 *   verified entries by removing the `// TODO confirm` comment.
 * - LinkedIn URLs left empty until the partner provides them; the
 *   LinkedIn action button hides when the field is empty.
 * - Headshot photos not yet collected — cards fall back to an initials
 *   monogram avatar. Drop images in `apps/web/public/team/<slug>.jpg`
 *   and set `headshotSrc` to surface them.
 */

export type TeamMember = {
  slug: string;                                          // url-safe identifier
  name: string;                                          // full display name
  role: string;                                          // e.g. 'Founding Partner'
  seniority: 'partner' | 'senior' | 'associate';         // ordering hint for cards
  initials: string;                                      // monogram avatar fallback
  headshotSrc?: string;                                  // optional `/team/<slug>.jpg`
  email?: string;                                        // mailto target (omit until confirmed)
  linkedinUrl?: string;                                  // external link, optional
  shortBio?: string;                                     // 1–2 lines, shown on card
  fullBio?: string;                                      // longer prose, shown in modal
  serviceSlugs: string[];                                // which service pages they surface on
};

export const team: TeamMember[] = [
  {
    slug: 'vijay-singh-rathore',
    name: 'Vijay Singh Rathore',
    role: 'Founding Partner',
    seniority: 'partner',
    initials: 'VSR',
    email: 'vijay@nucleusadvisors.in', // TODO confirm
    shortBio:
      'Founding Partner. Leads investment banking mandates end-to-end — readiness, narrative, investor outreach, term-sheet negotiation.',
    fullBio: [
      'Vijay is the founding partner of Nucleus Advisors and leads the firm’s investment banking practice. He has run primary fundraises for India-based companies from Series A through Series C, with mandates concentrated in the $3M–$50M range.',
      'Before Nucleus, Vijay built and ran Soonicorn Ventures (the firm’s SEBI-registered Category I AIF, focused on seed-to-Series-A startups raising up to $1M). The combination gives him a working view of how investors read a deck, a model, and a cap-table from both sides of the table.',
      'He has run mandates across fintech, B2B SaaS, mobility, EV, food-tech and consumer brands. He prefers cleaner term sheets over higher headline valuations, partner-led delivery over leveraged junior teams, and an FAQ pack written before the diligence call rather than during it.',
    ].join('\n\n'),
    serviceSlugs: ['investment-banking'],
  },
  {
    slug: 'samarth-pandey',
    name: 'Samarth Pandey',
    role: 'Senior Associate',
    seniority: 'senior',
    initials: 'SP',
    email: 'samarth@nucleusadvisors.in', // TODO confirm
    shortBio:
      'Senior Associate on the investment banking bench. Builds models, decks, IMs and investor maps; runs diligence workstreams.',
    fullBio: [
      'Samarth works alongside Vijay on the investment banking bench. He drives the build phase of every mandate — three-statement model, base/bull/bear scenarios, narrative deck, information memorandum, data room scoping and the FAQ pack that fronts the diligence call.',
      'He owns the day-to-day cadence with founders, the investor-map maintenance, and the issue tracker that holds every diligence ask accountable to closure. On most mandates he is the person you exchange the most emails with.',
    ].join('\n\n'),
    serviceSlugs: ['investment-banking'],
  },

  // ─── Service-line partners (stub entries) ────────────────────────────
  // Name, role, initials and service tags are confirmed. Headshots,
  // emails, LinkedIn URLs, and bios are pending each partner's input.
  // The article-author-bio component falls back gracefully when these
  // are empty; populating them here upgrades every article by that
  // partner automatically.
  {
    slug: 'pravesh-goel',
    name: 'Pravesh Goel',
    role: 'Partner · M&A Advisory',
    seniority: 'partner',
    initials: 'PG',
    serviceSlugs: ['ma-advisory'],
  },
  {
    slug: 'aakash-kalra',
    name: 'Aakash Kalra',
    role: 'Partner · M&A Advisory',
    seniority: 'partner',
    initials: 'AK',
    serviceSlugs: ['ma-advisory'],
  },
  {
    slug: 'ashish-gupta',
    name: 'Ashish Gupta',
    role: 'Partner · Risk Advisory',
    seniority: 'partner',
    initials: 'AG',
    serviceSlugs: ['risk-advisory'],
  },
  {
    slug: 'abhishek-gupta',
    name: 'Abhishek Gupta',
    role: 'Partner · Tax & Assurance',
    seniority: 'partner',
    initials: 'ABG',
    serviceSlugs: ['tax-regulatory', 'assurance'],
  },
  {
    slug: 'rajat-singla',
    name: 'Rajat Singla',
    role: 'Partner · Finance Outsourcing',
    seniority: 'partner',
    initials: 'RS',
    serviceSlugs: ['finance-outsourcing'],
  },
  {
    slug: 'neha-rathore',
    name: 'Neha Rathore',
    role: 'Partner · CS & Fund Management',
    seniority: 'partner',
    initials: 'NR',
    serviceSlugs: ['corporate-secretarial', 'aif-fund-management'],
  },
];

const SENIORITY_ORDER: Record<TeamMember['seniority'], number> = {
  partner: 0,
  senior: 1,
  associate: 2,
};

export function getTeamForService(slug: string): TeamMember[] {
  return team
    .filter((m) => m.serviceSlugs.includes(slug))
    .sort((a, b) => SENIORITY_ORDER[a.seniority] - SENIORITY_ORDER[b.seniority]);
}

export function getTeamMemberBySlug(slug: string): TeamMember | undefined {
  return team.find((m) => m.slug === slug);
}

/**
 * Case-insensitive lookup by display name. Used by the article author
 * bio to resolve `article.author.name` to the full TeamMember record
 * (with bio, email, headshot, etc.) when one exists. Returns undefined
 * if the partner is not yet in the team registry — the consumer should
 * fall back to whatever minimal data the article author block provides.
 */
export function getTeamMemberByName(name: string): TeamMember | undefined {
  const needle = name.trim().toLowerCase();
  return team.find((m) => m.name.toLowerCase() === needle);
}
