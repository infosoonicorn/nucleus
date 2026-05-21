/**
 * Macro industry taxonomy — collapses the 26 raw sub-sectors from
 * `clients-roster.ts` into 18 industries the firm publicly talks about.
 *
 * Source of truth: this file. Raw sub-sectors are preserved on each
 * record's `industrySlug` for tooltip + history. The page renders
 * the macro by default.
 *
 * To reassign a sub-sector to a different macro: move it between the
 * SUB_TO_MACRO entries. To reassign one specific client (e.g. Barq
 * Mobility was in 'Transaction Advisory' which isn't a real industry),
 * add an entry to CLIENT_OVERRIDES.
 */

export type MacroIndustry = {
  slug: string;
  title: string;
  subSectors: string[]; // sub-sector slugs that compose this macro
};

export const MACRO_INDUSTRIES: MacroIndustry[] = [
  { slug: 'bfsi-fintech', title: 'BFSI & Fin-Tech', subSectors: ['bfsi', 'fin-tech'] },
  { slug: 'automobiles-tools', title: 'Automobiles & Tools', subSectors: ['automobiles-tools'] },
  { slug: 'other-manufacturing', title: 'Other Manufacturing', subSectors: ['other-manufacturing'] },
  { slug: 'infrastructure', title: 'Infrastructure', subSectors: ['infrastructure'] },
  { slug: 'energy-power', title: 'Energy & Power', subSectors: ['energy-power'] },
  { slug: 'climate-tech', title: 'Climate-Tech', subSectors: ['climate-tech'] },
  {
    slug: 'mobility-aero',
    title: 'Mobility, Aerospace & Drones',
    subSectors: ['ev', 'drone-tech'],
  },
  { slug: 'logistic-tech', title: 'Logistic Tech', subSectors: ['logistic-tech'] },
  {
    slug: 'information-technology',
    title: 'Information Technology',
    subSectors: ['information-technology', 'ar-vr-tech', 'others'],
  },
  {
    slug: 'commerce-b2b',
    title: 'Commerce & B2B Platforms',
    subSectors: ['e-commerce', 'b2b'],
  },
  { slug: 'consumer-tech', title: 'Consumer Tech', subSectors: ['consumer-tech'] },
  { slug: 'd2c-fmcg', title: 'D2C FMCG', subSectors: ['d2c-fmcg'] },
  { slug: 'fashion', title: 'Fashion', subSectors: ['fashion'] },
  { slug: 'qsr-hospitality', title: 'QSR & Hospitality', subSectors: ['qsr-hospitality'] },
  {
    slug: 'healthcare-pharma',
    title: 'Healthcare & Pharma',
    subSectors: ['healthcare', 'pharmaceutical'],
  },
  { slug: 'agriculture', title: 'Agriculture', subSectors: ['agriculture'] },
  { slug: 'media-telecom', title: 'Media & Telecom', subSectors: ['telecom', 'publishing'] },
  { slug: 'non-profits', title: 'Non-Profits', subSectors: ['non-profits'] },
];

const SUB_TO_MACRO: Record<string, string> = (() => {
  const m: Record<string, string> = {};
  for (const macro of MACRO_INDUSTRIES) {
    for (const sub of macro.subSectors) m[sub] = macro.slug;
  }
  return m;
})();

/**
 * Per-client macro overrides for the 8 Transaction Advisory page-22
 * clients (TAS is a service, not an industry) and a few Fundraising
 * "Others" companies that have a clearer industry fit.
 */
const CLIENT_OVERRIDES: Record<string, string> = {
  // Page-22 Transaction Advisory companies → real industries
  'barq-mobility': 'mobility-aero',
  vaidyopchar: 'healthcare-pharma',
  'bier-garten': 'qsr-hospitality',
  rizek: 'commerce-b2b',
  xfurbish: 'consumer-tech',
  syook: 'information-technology',
  vdi: 'other-manufacturing',
  'unknown-auto-wrench': 'automobiles-tools',
  // Page-23 "Others" with a clearer industry — Astrophel is aerospace
  'astrophel-aerospace': 'mobility-aero',
};

export function macroForClient(slug: string, industrySlug: string): string {
  return CLIENT_OVERRIDES[slug] ?? SUB_TO_MACRO[industrySlug] ?? industrySlug;
}

export function macroTitle(macroSlug: string): string {
  return MACRO_INDUSTRIES.find((m) => m.slug === macroSlug)?.title ?? macroSlug;
}
