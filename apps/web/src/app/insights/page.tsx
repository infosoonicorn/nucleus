import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Clock } from 'lucide-react';
import { PageShell } from '@/components/site-chrome';
import { articles, getArticleAuthor } from '@/content/articles';
import { services } from '@/content/site';

export const metadata: Metadata = {
  title: 'Insights — Nucleus Advisors',
  description:
    'Long-form writing from Nucleus partners on fundraises, term sheets, M&A, valuations, risk and tax — searchable by service line.',
};

type SearchParams = Promise<{
  service?: string | string[];
  tag?: string | string[];
}>;

function pickFirst(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function InsightsHubPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const raw = await searchParams;
  const serviceFilter = pickFirst(raw.service);
  const tagFilter = pickFirst(raw.tag);

  const allowDrafts = process.env.NODE_ENV !== 'production';

  const visible = articles
    .filter((a) => (allowDrafts ? true : a.reviewerStatus === 'approved'))
    .sort((a, b) => b.publishedOn.localeCompare(a.publishedOn));

  const filtered = visible
    .filter((a) => (serviceFilter ? a.serviceSlugs.includes(serviceFilter) : true))
    .filter((a) => (tagFilter ? a.tag === tagFilter : true));

  // Filter chips — only show services that have at least one article, and tags
  // present in the currently-visible set.
  const serviceCounts = countByMulti(visible, (a) => a.serviceSlugs);
  const tagsForService = serviceFilter
    ? Array.from(new Set(visible.filter((a) => a.serviceSlugs.includes(serviceFilter)).map((a) => a.tag)))
    : Array.from(new Set(visible.map((a) => a.tag)));

  const serviceTitleBySlug = new Map(services.map((s) => [s.slug, s.title]));

  return (
    <PageShell>
      <main className="home-v3 service-v1">
        <section className="hub-hero">
          <p className="hub-eyebrow">Insights</p>
          <h1 className="hub-title">
            Notes from the <em>desk.</em>
          </h1>
          <p className="hub-lede">
            Long-form writing from Nucleus partners — fundraise mechanics, term sheets, M&amp;A,
            valuations, risk and tax. Filter by service line or tag.
          </p>
        </section>

        <section className="hub-filters" aria-label="Filter insights">
          <div className="hub-filter-row">
            <span className="hub-filter-label">Service —</span>
            <FilterChip
              href="/insights"
              active={!serviceFilter}
              label={`All · ${visible.length}`}
            />
            {Array.from(serviceCounts.entries())
              .sort((a, b) => b[1] - a[1])
              .map(([slug, count]) => {
                const title = serviceTitleBySlug.get(slug) ?? slug;
                const href = `/insights?service=${slug}`;
                return (
                  <FilterChip
                    key={slug}
                    href={href}
                    active={serviceFilter === slug}
                    label={`${title} · ${count}`}
                  />
                );
              })}
          </div>

          {tagsForService.length > 0 ? (
            <div className="hub-filter-row">
              <span className="hub-filter-label">Tag —</span>
              <FilterChip
                href={serviceFilter ? `/insights?service=${serviceFilter}` : '/insights'}
                active={!tagFilter}
                label="All"
              />
              {tagsForService.map((tag) => {
                const params = new URLSearchParams();
                if (serviceFilter) params.set('service', serviceFilter);
                params.set('tag', tag);
                return (
                  <FilterChip
                    key={tag}
                    href={`/insights?${params.toString()}`}
                    active={tagFilter === tag}
                    label={tag}
                  />
                );
              })}
            </div>
          ) : null}
        </section>

        <section className="hub-grid-section">
          {filtered.length === 0 ? (
            <div className="hub-empty">
              <p>No insights match these filters yet.</p>
              <Link href="/insights" className="hub-empty-reset">
                Clear filters
              </Link>
            </div>
          ) : (
            <div className="service-v1-articles-grid hub-articles-grid">
              {filtered.map((article) => {
                const author = getArticleAuthor(article);
                const isDraft = article.reviewerStatus !== 'approved';
                return (
                  <Link
                    key={article.slug}
                    href={`/insights/${article.slug}`}
                    className="service-v1-articles-card"
                  >
                    <div className="service-v1-articles-meta">
                      <span className="service-v1-articles-tag">{article.tag}</span>
                      {isDraft ? (
                        <span
                          className="service-v1-articles-draft"
                          title="Draft — visible in dev only"
                        >
                          Draft
                        </span>
                      ) : null}
                    </div>
                    <h3 className="service-v1-articles-title">{article.title}</h3>
                    <p className="service-v1-articles-excerpt">{article.excerpt}</p>
                    <div className="service-v1-articles-foot">
                      <span className="service-v1-articles-author">
                        <span className="service-v1-articles-avatar" aria-hidden="true">
                          {author.headshotSrc ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={author.headshotSrc} alt="" />
                          ) : (
                            author.initials
                          )}
                        </span>
                        <span>
                          <span className="service-v1-articles-name">{author.name}</span>
                          <span className="service-v1-articles-role">{author.role}</span>
                        </span>
                      </span>
                      <span className="service-v1-articles-time">
                        <Clock size={12} aria-hidden="true" />
                        {article.readMinutes} min
                      </span>
                    </div>
                    <span className="service-v1-articles-read" aria-hidden="true">
                      Read
                      <ArrowUpRight size={14} />
                    </span>
                  </Link>
                );
              })}
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

function countByMulti<T>(items: T[], getKeys: (item: T) => string[]): Map<string, number> {
  const map = new Map<string, number>();
  for (const it of items) {
    for (const k of getKeys(it)) {
      map.set(k, (map.get(k) ?? 0) + 1);
    }
  }
  return map;
}
