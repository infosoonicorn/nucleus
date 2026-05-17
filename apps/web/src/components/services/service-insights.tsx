import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Clock } from 'lucide-react';
import { getArticlesForService, getArticleAuthor } from '@/content/articles';
import type { Service } from '@/content/site';

const PREVIEW_COUNT = 4;

export function ServiceInsights({
  service,
  ordinal,
}: Readonly<{ service: Service; ordinal?: string }>) {
  // In development, surface drafts so partners can review unreviewed articles
  // on the page. In production, only `reviewerStatus: 'approved'` items render.
  const allowDrafts = process.env.NODE_ENV !== 'production';
  const allArticles = getArticlesForService(service.slug, { allowDrafts });
  const articles = allArticles.slice(0, PREVIEW_COUNT);
  const hasMore = allArticles.length > PREVIEW_COUNT;

  if (articles.length === 0) {
    return null;
  }

  const ord = ordinal ?? service.ordinal;
  return (
    <section className="service-v1-section service-v1-articles">
      <header className="service-v1-articles-header">
        <p className="service-v1-articles-eyebrow">
          <span className="service-v1-articles-eyebrow-num">●{ord}</span>
          <span aria-hidden="true" className="service-v1-articles-eyebrow-bar" />
          <span>Insights</span>
        </p>
        <h2 className="service-v1-articles-headline">
          Notes from the <em>desk</em>.
        </h2>
      </header>

      <div className="service-v1-articles-grid">
        {articles.map((article) => {
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
                  <span className="service-v1-articles-draft" title="Draft — visible in dev only">
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

      <div className="service-v1-section-foot">
        <Link
          href={`/insights?service=${service.slug}`}
          className="service-v1-section-foot-cta"
        >
          {hasMore ? `See all ${allArticles.length} insights` : 'Browse all insights'}
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
