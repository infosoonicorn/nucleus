export type ServiceInsightSourceKind =
  | 'SEBI'
  | 'RBI'
  | 'MCA'
  | 'CBDT'
  | 'DPIIT'
  | 'IBBI'
  | 'ICAI'
  | 'CBIC';

type ServiceInsightSourceBase = {
  id: string;
  source: ServiceInsightSourceKind;
  title: string;
  publishedOn: string; // ISO date YYYY-MM-DD
  url: string; // external
  whyItMatters: string; // one short sentence
  serviceSlugs: string[]; // e.g. ['investment-banking']
};

export type ServiceInsightSource =
  | (ServiceInsightSourceBase & {
      reviewerStatus: 'approved';
      reviewerApprovedAt: string;
    })
  | (ServiceInsightSourceBase & {
      reviewerStatus: 'pending';
      reviewerApprovedAt?: never;
    });

/** A category we plan to publish content under. Renders as a 'coming soon' card
 * in <ServiceInsights> until real articles land in a future Phase 2 CMS pass. */
export type PlannedKnowledgeCategory = {
  serviceSlug: string;
  title: string;
  text: string;
};

// Seed items for Investment Banking. ALL start as 'pending'. Vijay or a partner
// flips to 'approved' before merge. <ServiceInsights> uses a discriminated-union
// narrowing predicate so the TypeScript compiler guarantees only the 'approved'
// branch can reach render.
export const insightSources: ServiceInsightSource[] = [
  {
    id: 'sebi-aif-master-circular',
    source: 'SEBI',
    title: 'SEBI Master Circular for Alternative Investment Funds',
    publishedOn: '2025-05-07',
    url: 'https://www.sebi.gov.in/legal/master-circulars/may-2025/master-circular-for-alternative-investment-funds_94177.html',
    whyItMatters:
      'Consolidated AIF rules — relevant context for founders evaluating fund-routed capital.',
    serviceSlugs: ['investment-banking', 'aif-fund-management'],
    reviewerStatus: 'pending',
  },
  {
    id: 'rbi-fema-fdi-master',
    source: 'RBI',
    title: 'RBI Master Direction — Foreign Investment in India (FEMA)',
    publishedOn: '2024-08-12',
    // note: landing page URL; reviewer to replace with the specific FEMA FDI master direction before approval.
    url: 'https://rbi.org.in/Scripts/BS_ViewMasDirections.aspx',
    whyItMatters:
      'Governs how non-resident investors can put capital into Indian companies — directly affects round structuring.',
    serviceSlugs: ['investment-banking'],
    reviewerStatus: 'pending',
  },
  {
    id: 'dpiit-startup-recognition',
    source: 'DPIIT',
    title: 'DPIIT Startup India recognition framework',
    publishedOn: '2024-12-01',
    url: 'https://www.startupindia.gov.in/content/sih/en/startupgov/startup-recognition-page.html',
    whyItMatters:
      'Recognition unlocks tax holiday and angel-tax exemption — material to fundraise economics.',
    serviceSlugs: ['investment-banking'],
    reviewerStatus: 'pending',
  },
  {
    id: 'incometax-angel-tax-rules',
    source: 'CBDT',
    title: 'CBDT notification on angel tax valuation rules',
    publishedOn: '2023-09-25',
    url: 'https://incometaxindia.gov.in/communications/notification/notification-no-81-2023.pdf',
    whyItMatters:
      'Sets the valuation methodology and exemptions that determine angel-tax exposure on share issuance.',
    serviceSlugs: ['investment-banking'],
    reviewerStatus: 'pending',
  },
];

export const plannedCategories: PlannedKnowledgeCategory[] = [
  {
    serviceSlug: 'investment-banking',
    title: 'Fundraise readiness',
    text: 'Checklists and prep notes for first-time and repeat raisers.',
  },
  {
    serviceSlug: 'investment-banking',
    title: 'Investor mapping',
    text: 'How we segment angels, VCs, family offices and strategic capital by stage.',
  },
  {
    serviceSlug: 'investment-banking',
    title: 'Term sheets & structures',
    text: 'Reading the headline numbers and the clauses founders miss.',
  },
  {
    serviceSlug: 'investment-banking',
    title: 'Sector deep dives',
    text: 'What changes when fundraising in fintech, SaaS, consumer, manufacturing.',
  },
];
