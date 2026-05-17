/**
 * Section-ordinal convention for service pages.
 *
 * Every service page numbers its content sections ●01 → ●NN in DOM
 * order, starting from the FIRST content section after the hero. The
 * hero keeps its own service-taxonomy number ("●01 / Investment
 * Banking") — a different scope from section numbering inside the page.
 *
 * The default service composition uses `DEFAULT_SECTION_ORDINAL` so
 * every service page reads the same way. Bespoke pages (like
 * Investment Banking) can declare their own map when their section
 * mix differs (e.g. IB inserts FundraiseStages between How we help
 * and Process).
 *
 * To add a new section: insert the key in DOM order and renumber the
 * values from ●01 onward.
 */

export const DEFAULT_SECTION_ORDINAL = {
  clientLogos: '01',     // Track record (metrics + logo strip)
  whenToEngage: '02',
  howWeHelp: '03',
  process: '04',
  insights: '05',
  resources: '06',
  faq: '07',
  contact: '08',
} as const;

export const IB_SECTION_ORDINAL = {
  clientLogos: '01',
  whenToEngage: '02',
  howWeHelp: '03',
  fundraise: '04',
  process: '05',
  soonicorn: '06',
  insights: '07',
  resources: '08',
  faq: '09',
  contact: '10',
} as const;

export type SectionOrdinalMap = Readonly<Record<string, string>>;
