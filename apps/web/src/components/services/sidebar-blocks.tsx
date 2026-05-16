import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';
import { getResourcesForService } from '@/content/resources';
import { RequestResourceButton } from '@/components/resources/request-resource-button';

/**
 * Right-sidebar composition blocks. Each one is small, self-contained
 * and renders nothing when there's no data for the service.
 */

export function SidebarLatestReports({
  serviceSlug,
  limit = 3,
}: Readonly<{ serviceSlug: string; limit?: number }>) {
  const all = getResourcesForService(serviceSlug);
  // Only show the report-style resources in the sidebar — keeps the
  // capture funnel focused. Lead-magnet checklists already live in the
  // main column's ResourceDeck.
  const reports = all
    .filter((r) =>
      ['Sector report', 'Working paper', 'Advisory note', 'Data sheet'].includes(r.kind),
    )
    .slice(0, limit);
  if (reports.length === 0) return null;

  return (
    <section className="sidebar-block sidebar-reports-block" aria-labelledby="sidebar-reports-heading">
      <header className="sidebar-block-head">
        <p className="sidebar-block-eyebrow">Latest research</p>
        <h2 id="sidebar-reports-heading" className="sidebar-block-title">
          From the desk.
        </h2>
      </header>
      <ul className="sidebar-reports-list">
        {reports.map((r) => (
          <li key={r.slug} className="sidebar-report-item">
            <span className="sidebar-report-cover" aria-hidden="true">
              <FileText size={16} />
            </span>
            <div className="sidebar-report-body">
              <p className="sidebar-report-kind">
                {r.kind}
                {r.pages ? ` · ${r.pages} pp` : ''}
              </p>
              <p className="sidebar-report-title">{r.title}</p>
              <RequestResourceButton resource={r} label="Get the PDF" />
            </div>
          </li>
        ))}
      </ul>
      <Link
        href={`/reports?service=${serviceSlug}`}
        className="sidebar-block-allcta"
      >
        Browse all reports
        <ArrowRight size={12} aria-hidden="true" />
      </Link>
    </section>
  );
}

export function SidebarCTA({
  serviceSlug,
}: Readonly<{ serviceSlug: string }>) {
  return (
    <section className="sidebar-block sidebar-cta-block" aria-labelledby="sidebar-cta-heading">
      <h2 id="sidebar-cta-heading" className="sidebar-cta-title">
        Talk to a <em>partner</em>.
      </h2>
      <p className="sidebar-cta-text">
        A 30-minute scoping call. No deck, no fee. We&rsquo;ll tell you whether
        it&rsquo;s the right time to engage and what the next step actually looks like.
      </p>
      <Link
        href={`/contact?service=${serviceSlug}`}
        className="resource-cta resource-cta-primary sidebar-cta-btn"
      >
        Request a call
        <ArrowRight size={14} aria-hidden="true" />
      </Link>
    </section>
  );
}
