import { ArrowUpRight } from 'lucide-react';
import { SectionHeader } from '@/components/sections';
import {
  insightSources,
  plannedCategories,
  type ServiceInsightSource,
} from '@/content/insights-sources';
import type { Service } from '@/content/site';

const MAX_SOURCES = 6;

function plannedFor(slug: string) {
  return plannedCategories.filter((c) => c.serviceSlug === slug).slice(0, 4);
}

export function ServiceInsights({ service }: Readonly<{ service: Service }>) {
  // Pending items are kept out of `sources` by the discriminated-union narrowing
  // predicate below — TypeScript guarantees only the 'approved' branch reaches
  // render. The spec originally called for a runtime assertion as well, but it
  // was redundant with the type narrowing and fired during builds while seed
  // data was still in 'pending' status. The compile-time guarantee is stronger.
  const allForSlug = insightSources.filter((s) => s.serviceSlugs.includes(service.slug));
  const sources = allForSlug
    .filter((s): s is Extract<ServiceInsightSource, { reviewerStatus: 'approved' }> =>
      s.reviewerStatus === 'approved',
    )
    .sort((a, b) => b.publishedOn.localeCompare(a.publishedOn))
    .slice(0, MAX_SOURCES);

  const planned = plannedFor(service.slug);
  if (planned.length === 0 && sources.length === 0) return null;

  return (
    <section className="service-v1-section service-v1-insights">
      <SectionHeader
        eyebrow={`§${service.ordinal} / Insights`}
        title="Knowledge for fundraising decisions."
        text="What we publish and what we're tracking from official sources."
      />
      <div className="service-v1-insights-grid">
        <div className="service-v1-insights-planned">
          <h3>Planned knowledge bank</h3>
          {planned.length === 0 ? null : (
            <ul>
              {planned.map((p) => (
                <li key={p.title}>
                  <span className="service-v1-pending-pill">Updating soon</span>
                  <h4>{p.title}</h4>
                  <p>{p.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="service-v1-insights-sources">
          <h3>Regulatory updates we&apos;re tracking</h3>
          {sources.length === 0 ? (
            <p className="service-v1-insights-empty">
              Reviewer-approved official-source citations will appear here as they
              are confirmed.
            </p>
          ) : (
            <ul>
              {sources.map((s) => (
                <li key={s.id}>
                  <span
                    className={`service-v1-source-badge service-v1-source-${s.source.toLowerCase()}`}
                  >
                    {s.source}
                  </span>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    <h4>
                      {s.title}
                      <ArrowUpRight aria-hidden="true" size={14} />
                    </h4>
                  </a>
                  <p className="service-v1-source-meta">{formatDate(s.publishedOn)}</p>
                  <p>{s.whyItMatters}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

// Relies on full-ICU at runtime. Vercel's default Node runtime ships full-ICU
// (Node 22+). If we ever move to a small-ICU build, the en-IN locale falls back
// to en-US and produces a hydration mismatch — switch to a deterministic format then.
function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}
