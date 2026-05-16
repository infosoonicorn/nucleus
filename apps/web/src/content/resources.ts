/**
 * Resources — single source of truth for everything a visitor can request
 * to download (reports, working papers, checklists, templates, guides).
 *
 * Wraps `reports.ts` (industry reports stay there, owned by Insights team)
 * and adds lead-magnet style downloadables (checklists, templates) that the
 * service pages used to surface via the old LeadMagnet inline form.
 *
 * One unified shape so a single modal can request any of them.
 */

import { reports as industryReports, type Report } from './reports';

export type ResourceKind =
  | 'Sector report'
  | 'Working paper'
  | 'Advisory note'
  | 'Data sheet'
  | 'Checklist'
  | 'Template'
  | 'Guide';

export type ResourceFormat = 'PDF' | 'XLSX' | 'DOCX';

export type Resource = {
  slug: string;
  title: string;
  abstract: string;
  kind: ResourceKind;
  format: ResourceFormat;
  pages?: number;
  publishedOn?: string;          // YYYY-MM-DD
  tags: string[];
  serviceSlugs: string[];
  status: 'available' | 'coming-soon';
};

/**
 * Lead-magnet style downloadables (checklists / templates / guides) that
 * the firm publishes alongside the industry reports.
 *
 * Add a new entry here and it shows up on the matching service page
 * automatically. To retire one, delete the entry — nothing else to update.
 */
const downloadables: Resource[] = [
  {
    slug: 'fundraise-readiness-checklist',
    title: 'Fundraise readiness checklist',
    abstract:
      'A partner-built 12-page checklist covering model, deck, IM, data room and Q&A pack — the same readiness bar we put founders through before an investor outreach.',
    kind: 'Checklist',
    format: 'PDF',
    pages: 12,
    publishedOn: '2026-02-20',
    tags: ['Fundraise', 'Readiness'],
    serviceSlugs: ['investment-banking'],
    status: 'available',
  },
];

function fromReport(r: Report): Resource {
  return {
    slug: r.slug,
    title: r.title,
    abstract: r.abstract,
    kind: r.reportType as ResourceKind,
    format: 'PDF',
    pages: r.pages,
    publishedOn: r.publishedOn,
    tags: r.tags,
    serviceSlugs: r.serviceSlugs,
    status: r.status,
  };
}

export const resources: Resource[] = [
  ...downloadables,
  ...industryReports.map(fromReport),
];

export function getResourcesForService(slug: string): Resource[] {
  return resources
    .filter((r) => r.serviceSlugs.includes(slug))
    .sort((a, b) => (b.publishedOn ?? '').localeCompare(a.publishedOn ?? ''));
}

export function getResourceBySlug(slug: string): Resource | undefined {
  return resources.find((r) => r.slug === slug);
}
