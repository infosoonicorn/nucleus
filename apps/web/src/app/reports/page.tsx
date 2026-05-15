import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, FileText } from 'lucide-react';
import { PageShell } from '@/components/site-chrome';
import { getAllReports, REPORT_TYPES } from '@/content/reports';
import { services } from '@/content/site';

export const metadata: Metadata = {
  title: 'Industry Reports — Nucleus Advisors',
  description:
    'Anonymised benchmarks, working papers, advisory notes and data sheets from Nucleus partners across investment banking, M&A, valuations, risk and tax.',
};

type SearchParams = Promise<{
  service?: string | string[];
  type?: string | string[];
}>;

function pickFirst(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

const TYPE_BADGE_COLORS: Record<string, string> = {
  'Sector report': 'service-v1-reports-badge-sector',
  'Working paper': 'service-v1-reports-badge-working',
  'Advisory note': 'service-v1-reports-badge-advisory',
  'Data sheet': 'service-v1-reports-badge-data',
};

export default async function ReportsHubPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const raw = await searchParams;
  const serviceFilter = pickFirst(raw.service);
  const typeFilter = pickFirst(raw.type);

  const all = getAllReports();
  const filtered = all
    .filter((r) => (serviceFilter ? r.serviceSlugs.includes(serviceFilter) : true))
    .filter((r) => (typeFilter ? r.reportType === typeFilter : true));

  const serviceCounts = countByMulti(all, (r) => r.serviceSlugs);
  const typeCounts = countBy(all, (r) => r.reportType);
  const serviceTitleBySlug = new Map(services.map((s) => [s.slug, s.title]));

  return (
    <PageShell>
      <main className="home-v3 service-v1">
        <section className="hub-hero">
          <p className="hub-eyebrow">Industry Reports</p>
          <h1 className="hub-title">
            Research <em>and data</em>, alongside the work.
          </h1>
          <p className="hub-lede">
            Anonymised benchmarks, working papers, advisory notes and data sheets across the
            services Nucleus runs. Request a copy for the full PDF.
          </p>
        </section>

        <section className="hub-filters" aria-label="Filter reports">
          <div className="hub-filter-row">
            <span className="hub-filter-label">Service —</span>
            <FilterChip
              href="/reports"
              active={!serviceFilter}
              label={`All · ${all.length}`}
            />
            {Array.from(serviceCounts.entries())
              .sort((a, b) => b[1] - a[1])
              .map(([slug, count]) => {
                const title = serviceTitleBySlug.get(slug) ?? slug;
                const params = new URLSearchParams();
                params.set('service', slug);
                if (typeFilter) params.set('type', typeFilter);
                return (
                  <FilterChip
                    key={slug}
                    href={`/reports?${params.toString()}`}
                    active={serviceFilter === slug}
                    label={`${title} · ${count}`}
                  />
                );
              })}
          </div>

          <div className="hub-filter-row">
            <span className="hub-filter-label">Type —</span>
            <FilterChip
              href={serviceFilter ? `/reports?service=${serviceFilter}` : '/reports'}
              active={!typeFilter}
              label="All"
            />
            {REPORT_TYPES.filter((t) => (typeCounts.get(t) ?? 0) > 0).map((t) => {
              const params = new URLSearchParams();
              if (serviceFilter) params.set('service', serviceFilter);
              params.set('type', t);
              return (
                <FilterChip
                  key={t}
                  href={`/reports?${params.toString()}`}
                  active={typeFilter === t}
                  label={`${t} · ${typeCounts.get(t)}`}
                />
              );
            })}
          </div>
        </section>

        <section className="hub-grid-section">
          {filtered.length === 0 ? (
            <div className="hub-empty">
              <p>No reports match these filters yet.</p>
              <Link href="/reports" className="hub-empty-reset">
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="service-v1-reports-grid hub-reports-grid">
              {filtered.map((report) => (
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
          )}
        </section>
      </main>
    </PageShell>
  );
}

function FilterChip({
  href,
  active,
  label,
}: Readonly<{ href: string; active: boolean; label: string }>) {
  return (
    <Link
      href={href}
      className={`hub-chip ${active ? 'is-active' : ''}`}
      aria-current={active ? 'page' : undefined}
    >
      {label}
    </Link>
  );
}

function countBy<T>(items: T[], getKey: (item: T) => string): Map<string, number> {
  const map = new Map<string, number>();
  for (const it of items) {
    const k = getKey(it);
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return map;
}

function countByMulti<T>(items: T[], getKeys: (item: T) => string[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const it of items) {
    for (const k of getKeys(it)) {
      map.set(k, (map.get(k) ?? 0) + 1);
    }
  }
  return map;
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short' });
}
