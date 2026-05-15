import Link from 'next/link';
import { ArrowRight, ArrowUpRight, FileText } from 'lucide-react';
import { SectionHeader } from '@/components/sections';
import { getReportsForService } from '@/content/reports';

type IndustryReportsProps = Readonly<{
  ordinal: string;
  serviceSlug: string;
}>;

const PREVIEW_COUNT = 4;

const TYPE_BADGE_COLORS: Record<string, string> = {
  'Sector report': 'service-v1-reports-badge-sector',
  'Working paper': 'service-v1-reports-badge-working',
  'Advisory note': 'service-v1-reports-badge-advisory',
  'Data sheet': 'service-v1-reports-badge-data',
};

export function IndustryReports({ ordinal, serviceSlug }: IndustryReportsProps) {
  const all = getReportsForService(serviceSlug);
  if (all.length === 0) return null;

  const preview = all.slice(0, PREVIEW_COUNT);
  const hasMore = all.length > PREVIEW_COUNT;

  return (
    <section className="service-v1-section service-v1-reports">
      <SectionHeader
        eyebrow={`§${ordinal} / Industry reports`}
        title="Research and data we publish alongside the work."
        text="Anonymised benchmarks, working papers, and advisory notes. Request a copy if you would like the full PDF."
      />
      <div className="service-v1-reports-grid">
        {preview.map((report) => (
          <article key={report.slug} className="service-v1-reports-card">
            <div className="service-v1-reports-cover" aria-hidden="true">
              <FileText size={28} />
              <span className="service-v1-reports-cover-meta">
                {formatDate(report.publishedOn)} · {report.pages} pp
              </span>
            </div>
            <div className="service-v1-reports-body">
              <span
                className={`service-v1-reports-badge ${
                  TYPE_BADGE_COLORS[report.reportType] ?? ''
                }`}
              >
                {report.reportType}
              </span>
              <h3 className="service-v1-reports-title">{report.title}</h3>
              <p className="service-v1-reports-abstract">{report.abstract}</p>
              <div className="service-v1-reports-tags">
                {report.tags.map((tag) => (
                  <span key={tag} className="service-v1-reports-tag">
                    {tag}
                  </span>
                ))}
              </div>
              <Link
                href={`/contact?report=${report.slug}`}
                className="service-v1-reports-cta"
              >
                Request the full report
                <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      <div className="service-v1-section-foot">
        <Link
          href={`/reports?service=${serviceSlug}`}
          className="service-v1-section-foot-cta"
        >
          {hasMore ? `See all ${all.length} reports` : 'Browse all reports'}
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short' });
}
