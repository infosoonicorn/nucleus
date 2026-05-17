import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/site-chrome';
import {
  articles,
  getArticleAuthor,
  getLatestPublishedOn,
  isRecentArticle,
} from '@/content/articles';
import { services } from '@/content/site';
import { team } from '@/content/team';
import { InsightsGrid, type GridArticle } from '@/components/insights/insights-grid';
import {
  InsightsToolbar,
  type FilterOption,
} from '@/components/insights/insights-toolbar';
import { NewsletterSignup } from '@/components/insights/newsletter-signup';
import { FeaturedArticle } from '@/components/insights/featured-article';

export const metadata: Metadata = {
  title: 'Insights — Nucleus Advisors',
  description:
    'Long-form writing from Nucleus partners on fundraises, term sheets, M&A, valuations, risk and tax — filter by service line, tag, or author; sort newest or oldest.',
  alternates: {
    canonical: 'https://nucleusadvisors.in/insights',
  },
};

type SearchParams = Promise<{
  service?: string | string[];
  tag?: string | string[];
  author?: string | string[];
  sort?: string | string[];
}>;

function pickFirst(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

/** "May 17, 2026" for the hub cadence indicator. */
function formatHumanDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default async function InsightsHubPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const raw = await searchParams;
  const serviceFilter = pickFirst(raw.service) ?? '';
  const tagFilter = pickFirst(raw.tag) ?? '';
  const authorFilter = pickFirst(raw.author) ?? '';
  const sort: 'newest' | 'oldest' = pickFirst(raw.sort) === 'oldest' ? 'oldest' : 'newest';

  const allowDrafts = process.env.NODE_ENV !== 'production';

  const visible = articles.filter((a) =>
    allowDrafts ? true : a.reviewerStatus === 'approved',
  );

  // Featured "Start here" article: only surfaced when no filters are
  // active (otherwise it would compete with the user's stated intent).
  // Pick the most-recent article flagged `featured: true`, or the
  // most-recent visible article overall as a fallback.
  const noFiltersActive = !serviceFilter && !tagFilter && !authorFilter;
  const featuredArticle = noFiltersActive
    ? visible
        .filter((a) => a.featured)
        .sort((a, b) => b.publishedOn.localeCompare(a.publishedOn))[0] ??
      visible.sort((a, b) => b.publishedOn.localeCompare(a.publishedOn))[0] ??
      null
    : null;

  const filtered = visible
    .filter((a) => (serviceFilter ? a.serviceSlugs.includes(serviceFilter) : true))
    .filter((a) => (tagFilter ? a.tag === tagFilter : true))
    .filter((a) => (authorFilter ? a.authorSlug === authorFilter : true))
    // Hide the featured piece from the grid so it doesn't duplicate the
    // "Start here" slot above.
    .filter((a) => (featuredArticle ? a.slug !== featuredArticle.slug : true))
    .sort((a, b) =>
      sort === 'oldest'
        ? a.publishedOn.localeCompare(b.publishedOn)
        : b.publishedOn.localeCompare(a.publishedOn),
    );

  // Build dropdown option lists from the *visible* set (so options
  // never offer a filter that returns zero results). Counts are based
  // on the current selection-context for each axis: service counts the
  // articles in each service ignoring service selection; tag counts
  // restrict to current service+author; author similarly. The intent
  // is dropdowns stay honest about what's reachable without becoming
  // a UI puzzle where one selection nukes another's options.
  const serviceTitleBySlug = new Map(services.map((s) => [s.slug, s.title]));
  const teamBySlug = new Map(team.map((m) => [m.slug, m]));

  const serviceCounts = new Map<string, number>();
  for (const a of visible) {
    for (const s of a.serviceSlugs) {
      serviceCounts.set(s, (serviceCounts.get(s) ?? 0) + 1);
    }
  }
  const serviceOptions: FilterOption[] = Array.from(serviceCounts.entries())
    .filter(([slug]) => serviceTitleBySlug.has(slug))
    .map(([slug, count]) => ({
      value: slug,
      label: serviceTitleBySlug.get(slug) ?? slug,
      count,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const tagCounts = new Map<string, number>();
  for (const a of visible) {
    if (serviceFilter && !a.serviceSlugs.includes(serviceFilter)) continue;
    if (authorFilter && a.authorSlug !== authorFilter) continue;
    tagCounts.set(a.tag, (tagCounts.get(a.tag) ?? 0) + 1);
  }
  const tagOptions: FilterOption[] = Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ value: tag, label: tag, count }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const authorCounts = new Map<string, number>();
  for (const a of visible) {
    if (serviceFilter && !a.serviceSlugs.includes(serviceFilter)) continue;
    if (tagFilter && a.tag !== tagFilter) continue;
    authorCounts.set(a.authorSlug, (authorCounts.get(a.authorSlug) ?? 0) + 1);
  }
  const authorOptions: FilterOption[] = Array.from(authorCounts.entries())
    .map(([slug, count]) => ({
      value: slug,
      label: teamBySlug.get(slug)?.name ?? slug,
      count,
    }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const activeAuthor = authorFilter ? teamBySlug.get(authorFilter) : null;
  const activeServiceTitle = serviceFilter
    ? serviceTitleBySlug.get(serviceFilter) ?? null
    : null;

  const descriptionParts: string[] = [];
  if (activeServiceTitle) descriptionParts.push(activeServiceTitle);
  if (tagFilter) descriptionParts.push(`#${tagFilter}`);
  if (activeAuthor) descriptionParts.push(`by ${activeAuthor.name}`);
  const filterDescription = descriptionParts.length > 0 ? descriptionParts.join(' · ') : null;

  const gridArticles: GridArticle[] = filtered.map((a) => {
    const author = getArticleAuthor(a);
    return {
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      tag: a.tag,
      readMinutes: a.readMinutes,
      isDraft: a.reviewerStatus !== 'approved',
      isNew: isRecentArticle(a),
      thumbnailSrc: a.thumbnailSrc,
      author: {
        name: author.name,
        role: author.role,
        initials: author.initials,
        headshotSrc: author.headshotSrc,
      },
    };
  });

  // Three most-recent visible articles, regardless of current filters,
  // so a zero-result filter doesn't drop the reader on a blank page.
  // Computed from `visible` (not `filtered`) so they're always available.
  const suggestedArticles: GridArticle[] = visible
    .slice()
    .sort((a, b) => b.publishedOn.localeCompare(a.publishedOn))
    .slice(0, 3)
    .map((a) => {
      const author = getArticleAuthor(a);
      return {
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        tag: a.tag,
        readMinutes: a.readMinutes,
        isDraft: a.reviewerStatus !== 'approved',
        isNew: isRecentArticle(a),
        thumbnailSrc: a.thumbnailSrc,
        author: {
          name: author.name,
          role: author.role,
          initials: author.initials,
          headshotSrc: author.headshotSrc,
        },
      };
    });

  const latestPublishedOn = getLatestPublishedOn({ allowDrafts });

  const anyFilterActive = Boolean(serviceFilter || tagFilter || authorFilter || sort === 'oldest');

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
            M&amp;A, valuations, risk and tax. Filter by service line, tag, or author;
            sort newest or oldest; or search the archive.
          </p>
          {latestPublishedOn ? (
            <p className="hub-cadence" aria-label="Publication cadence">
              <span className="hub-cadence-dot" aria-hidden="true" />
              Latest: {formatHumanDate(latestPublishedOn)}
            </p>
          ) : null}
          {anyFilterActive ? (
            <p className="hub-active-author">
              {activeServiceTitle ? <>Service: <strong>{activeServiceTitle}</strong></> : null}
              {tagFilter ? <>{activeServiceTitle ? ' · ' : ''}Tag: <strong>{tagFilter}</strong></> : null}
              {activeAuthor ? (
                <>{activeServiceTitle || tagFilter ? ' · ' : ''}Author:{' '}
                  <strong>{activeAuthor.name}</strong>
                </>
              ) : null}
              {sort === 'oldest' ? (
                <>{activeServiceTitle || tagFilter || activeAuthor ? ' · ' : ''}Oldest first</>
              ) : null}
              {' · '}
              <Link href="/insights" className="hub-active-clear">
                clear all
              </Link>
            </p>
          ) : null}
        </section>

        {featuredArticle ? (
          <FeaturedArticle
            article={featuredArticle}
            author={getArticleAuthor(featuredArticle)}
          />
        ) : null}

        <section className="hub-toolbar-section" aria-label="Filter and sort">
          <InsightsToolbar
            services={serviceOptions}
            tags={tagOptions}
            authors={authorOptions}
            currentService={serviceFilter}
            currentTag={tagFilter}
            currentAuthor={authorFilter}
            currentSort={sort}
          />
        </section>

        <section className="hub-grid-section">
          <InsightsGrid
            articles={gridArticles}
            filterDescription={filterDescription}
            suggested={suggestedArticles}
          />
        </section>

        <section className="hub-newsletter-section">
          <NewsletterSignup variant="hub" />
        </section>
      </main>
    </PageShell>
  );
}
