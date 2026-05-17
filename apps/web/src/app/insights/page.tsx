import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/site-chrome';
import { articles, getArticleAuthor } from '@/content/articles';
import { services } from '@/content/site';
import { team } from '@/content/team';
import { InsightsGrid, type GridArticle } from '@/components/insights/insights-grid';

export const metadata: Metadata = {
  title: 'Insights — Nucleus Advisors',
  description:
    'Long-form writing from Nucleus partners on fundraises, term sheets, M&A, valuations, risk and tax — searchable by service line, tag, or author.',
};

type SearchParams = Promise<{
  service?: string | string[];
  tag?: string | string[];
  author?: string | string[];
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
  const authorFilter = pickFirst(raw.author);

  const allowDrafts = process.env.NODE_ENV !== 'production';

  const visible = articles
    .filter((a) => (allowDrafts ? true : a.reviewerStatus === 'approved'))
    .sort((a, b) => b.publishedOn.localeCompare(a.publishedOn));

  const filtered = visible
    .filter((a) => (serviceFilter ? a.serviceSlugs.includes(serviceFilter) : true))
    .filter((a) => (tagFilter ? a.tag === tagFilter : true))
    .filter((a) => (authorFilter ? a.authorSlug === authorFilter : true));

  // Filter chips — only show services that have at least one article, and tags
  // present in the currently-visible set.
  const serviceCounts = countByMulti(visible, (a) => a.serviceSlugs);
  const tagsForService = serviceFilter
    ? Array.from(new Set(visible.filter((a) => a.serviceSlugs.includes(serviceFilter)).map((a) => a.tag)))
    : Array.from(new Set(visible.map((a) => a.tag)));

  const serviceTitleBySlug = new Map(services.map((s) => [s.slug, s.title]));
  const teamBySlug = new Map(team.map((m) => [m.slug, m]));

  const activeService = serviceFilter ? serviceTitleBySlug.get(serviceFilter) : null;
  const activeAuthor = authorFilter ? teamBySlug.get(authorFilter) : null;

  // Build a single-line description of the active server filters so the
  // search input has context next to the result count.
  const descriptionParts: string[] = [];
  if (activeService) descriptionParts.push(activeService);
  if (tagFilter) descriptionParts.push(`#${tagFilter}`);
  if (activeAuthor) descriptionParts.push(`by ${activeAuthor.name}`);
  const filterDescription = descriptionParts.length > 0 ? descriptionParts.join(' · ') : null;

  // Project to the slimmer client-component shape so we don't ship the
  // full body text down the wire just to render cards.
  const gridArticles: GridArticle[] = filtered.map((a) => {
    const author = getArticleAuthor(a);
    return {
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      tag: a.tag,
      readMinutes: a.readMinutes,
      isDraft: a.reviewerStatus !== 'approved',
      author: {
        name: author.name,
        role: author.role,
        initials: author.initials,
        headshotSrc: author.headshotSrc,
      },
    };
  });

  return (
    <PageShell>
      <main className="home-v3 service-v1">
        <section className="hub-hero">
          <p className="hub-eyebrow">Insights</p>
          <h1 className="hub-title">
            Notes from the <em>desk.</em>
          </h1>
          <p className="hub-lede">
            Long-form writing from Nucleus partners. Fundraise mechanics, term sheets,
            M&amp;A, valuations, risk and tax. Search the archive or filter by service line,
            tag, or author.
          </p>
          {activeAuthor ? (
            <p className="hub-active-author">
              Showing articles by{' '}
              <strong>{activeAuthor.name}</strong>
              {' · '}
              <Link href="/insights" className="hub-active-clear">
                clear author filter
              </Link>
            </p>
          ) : null}
        </section>

        <section className="hub-filters" aria-label="Filter insights">
          <div className="hub-filter-row">
            <span className="hub-filter-label">Service —</span>
            <FilterChip
              href={authorFilter ? `/insights?author=${authorFilter}` : '/insights'}
              active={!serviceFilter}
              label={`All · ${visible.length}`}
            />
            {Array.from(serviceCounts.entries())
              .sort((a, b) => b[1] - a[1])
              .map(([slug, count]) => {
                const title = serviceTitleBySlug.get(slug) ?? slug;
                const params = new URLSearchParams();
                params.set('service', slug);
                if (authorFilter) params.set('author', authorFilter);
                return (
                  <FilterChip
                    key={slug}
                    href={`/insights?${params.toString()}`}
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
                href={
                  serviceFilter
                    ? `/insights?service=${serviceFilter}${authorFilter ? `&author=${authorFilter}` : ''}`
                    : authorFilter
                      ? `/insights?author=${authorFilter}`
                      : '/insights'
                }
                active={!tagFilter}
                label="All"
              />
              {tagsForService.map((tag) => {
                const params = new URLSearchParams();
                if (serviceFilter) params.set('service', serviceFilter);
                if (authorFilter) params.set('author', authorFilter);
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
          <InsightsGrid articles={gridArticles} filterDescription={filterDescription} />
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
