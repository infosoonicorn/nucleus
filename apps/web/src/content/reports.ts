/**
 * Industry reports — single source of truth across all service lines.
 *
 * Mirrors the articles.ts pattern: every report tags one or more services via
 * `serviceSlugs`. Service-line pages slice the first N for preview; the
 * `/reports` hub renders the full filterable list.
 */

export type ReportType = 'Sector report' | 'Working paper' | 'Advisory note' | 'Data sheet';

export type Report = {
  slug: string;
  title: string;
  abstract: string;
  reportType: string;
  pages: number;
  publishedOn: string;          // YYYY-MM-DD
  tags: string[];
  status: 'available' | 'coming-soon';
  serviceSlugs: string[];       // which service pages this report shows up on
};

export const reports: Report[] = [
  {
    slug: 'fundraise-readiness-benchmark-india-2026',
    title: 'Fundraise readiness benchmark: Series A in India, 2026',
    abstract:
      'Where founders typically stand on model, deck, IM, and data room when they think they are ready — and what investors actually look for in the first 90 minutes.',
    reportType: 'Sector report',
    pages: 28,
    publishedOn: '2026-03-12',
    tags: ['Fundraise', 'Series A', 'India'],
    status: 'available',
    serviceSlugs: ['investment-banking'],
  },
  {
    slug: 'term-sheet-economics-dilution',
    title: 'Term sheet economics: what dilution actually means over 18 months',
    abstract:
      'A working-paper walk-through of liquidation preferences, anti-dilution, and ESOP top-ups — modelled across a $5M Series A and a follow-on round.',
    reportType: 'Working paper',
    pages: 16,
    publishedOn: '2026-02-04',
    tags: ['Term sheet', 'Dilution', 'Cap table'],
    status: 'available',
    serviceSlugs: ['investment-banking'],
  },
  {
    slug: 'valuation-defense-pack-diligence-stress',
    title: 'The valuation defense pack: what investors stress in diligence',
    abstract:
      'The seven model lines that get pulled apart in every Series B diligence, with the documentation and back-up files we build to hold them together.',
    reportType: 'Advisory note',
    pages: 22,
    publishedOn: '2026-01-22',
    tags: ['Valuation', 'Diligence'],
    status: 'available',
    serviceSlugs: ['investment-banking', 'valuations'],
  },
  {
    slug: 'investor-cap-table-archetypes',
    title: 'Investor cap-table archetypes — by stage, by sector',
    abstract:
      'Anonymised cap tables across 40+ recent Indian rounds. Patterns by stage, sector, and round size — what looks normal, what looks expensive, what looks misaligned.',
    reportType: 'Data sheet',
    pages: 34,
    publishedOn: '2025-12-08',
    tags: ['Cap table', 'Benchmarks'],
    status: 'available',
    serviceSlugs: ['investment-banking'],
  },
];

export function getReportsForService(slug: string): Report[] {
  return reports
    .filter((r) => r.serviceSlugs.includes(slug))
    .sort((a, b) => b.publishedOn.localeCompare(a.publishedOn));
}

export function getAllReports(): Report[] {
  return [...reports].sort((a, b) => b.publishedOn.localeCompare(a.publishedOn));
}

export const REPORT_TYPES: ReportType[] = [
  'Sector report',
  'Working paper',
  'Advisory note',
  'Data sheet',
];

