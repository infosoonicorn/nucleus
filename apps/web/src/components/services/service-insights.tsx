import { ArrowUpRight } from 'lucide-react';
import { SectionHeader } from '@/components/sections';
import {
  insightSources,
  plannedCategories,
  type ServiceInsightSource,
} from '@/content/insights-sources';
import type { Service } from '@/content/site';

const MAX_SOURCES = 6;

function approvedSourcesFor(slug: string): ServiceInsightSource[] {
  const filtered = insightSources.filter(
    (s) => s.serviceSlugs.includes(slug) && s.reviewerStatus === 'approved',
  );
  // Sort by publishedOn descending; cap at MAX_SOURCES.
  return [...filtered]
    .sort((a, b) => (a.publishedOn < b.publishedOn ? 1 : -1))
    .slice(0, MAX_SOURCES);
}

function plannedFor(slug: string) {
  return plannedCategories.filter((c) => c.serviceSlug === slug).slice(0, 4);
}

function assertNoPendingInProduction(items: ServiceInsightSource[]) {
  if (process.env.NODE_ENV !== 'production') return;
  if (items.some((s) => s.reviewerStatus === 'pending')) {
    // Hard fail — caller bug. Pending items must never reach prod rendering.
    throw new Error(
      '[ServiceInsights] pending insight source reached production render path',
    );
  }
}

export function ServiceInsights({ service }: Readonly<{ service: Service }>) {
  const planned = plannedFor(service.slug);
  const sources = approvedSourcesFor(service.slug);
  assertNoPendingInProduction(sources);
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

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}
