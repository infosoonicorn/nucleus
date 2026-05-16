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

  /* ── Fundraise-stage sample templates ──
   *
   * One per stage of the IB fundraise journey (see FundraiseStages
   * component). Requesting these opens the same capture modal used
   * everywhere else; on submit, the partner emails a redacted sample
   * of the artefact we produce at that stage on a real mandate.
   *
   * Filtered out of the main ResourceDeck (Templates aren't visitor-
   * facing research) — they only surface via the FundraiseStages
   * deliverable click.
   */
  {
    slug: 'ib-stage-readiness-report',
    title: 'Fundraise readiness report — sample',
    abstract:
      'Redacted sample of the readiness assessment we deliver at the end of week 2 — gap analysis, data-room scoping, governance flags.',
    kind: 'Template',
    format: 'PDF',
    tags: ['Sample', 'Readiness'],
    serviceSlugs: ['investment-banking'],
    status: 'available',
  },
  {
    slug: 'ib-stage-financial-model',
    title: 'Financial model — sample',
    abstract:
      'Redacted sample of the three-statement model with base/bull/bear sensitivity layer that we build by end of week 4.',
    kind: 'Template',
    format: 'XLSX',
    tags: ['Sample', 'Modelling'],
    serviceSlugs: ['investment-banking'],
    status: 'available',
  },
  {
    slug: 'ib-stage-investor-deck-im',
    title: 'Investor deck and IM — sample',
    abstract:
      'Redacted sample of the narrative-first investor deck and information memorandum prepared in weeks 5–7 of a mandate.',
    kind: 'Template',
    format: 'PDF',
    tags: ['Sample', 'Storytelling'],
    serviceSlugs: ['investment-banking'],
    status: 'available',
  },
  {
    slug: 'ib-stage-investor-target-list',
    title: 'Investor target list — sample',
    abstract:
      'Redacted sample of the investor map and target list, with rationale and approach notes per fund, prepared at the start of outreach.',
    kind: 'Template',
    format: 'XLSX',
    tags: ['Sample', 'Outreach'],
    serviceSlugs: ['investment-banking'],
    status: 'available',
  },
  {
    slug: 'ib-stage-diligence-pack',
    title: 'Diligence checklist and data-room — sample',
    abstract:
      'Redacted sample of the diligence pack and issue tracker we maintain through weeks 10–14 of a mandate.',
    kind: 'Template',
    format: 'PDF',
    tags: ['Sample', 'Diligence'],
    serviceSlugs: ['investment-banking'],
    status: 'available',
  },
  {
    slug: 'ib-stage-transaction-workplan',
    title: 'Transaction workplan — sample',
    abstract:
      'Redacted sample of the closing workplan covering term sheet review, signing coordination, and post-wire handover (weeks 14–16).',
    kind: 'Template',
    format: 'PDF',
    tags: ['Sample', 'Close'],
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
