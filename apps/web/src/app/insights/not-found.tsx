import Link from 'next/link';
import { ArrowUpRight, Clock } from 'lucide-react';
import { PageShell } from '@/components/site-chrome';
import { articles, getArticleAuthor, isRecentArticle } from '@/content/articles';

/**
 * Bespoke 404 for anything under /insights/* — typo'd article slugs,
 * stale shared links, a topic tag that no longer exists, an author
 * archive for someone who left, etc. Instead of dumping the user on
 * the global 404, surface the three most-recent published articles
 * so the bounced reader has somewhere to go.
 *
 * Lives at /insights/not-found.tsx so it scopes to the insights
 * segment — the global root not-found stays untouched.
 */
export default function InsightsNotFound() {
  const allowDrafts = process.env.NODE_ENV !== 'production';

  const recent = articles
    .filter((a) => (allowDrafts ? true : a.reviewerStatus === 'approved'))
    .sort((a, b) => b.publishedOn.localeCompare(a.publishedOn))
    .slice(0, 3);

  return (
    <PageShell>
      <main className="home-v3 service-v1">
        <section className="hub-hero">
          <p className="hub-eyebrow">Insights</p>
          <h1 className="hub-title">
            That page wandered <em>off.</em>
          </h1>
          <p className="hub-lede">
            The article, topic, or author archive you were after isn&apos;t here.
            It may have been retitled, merged into another piece, or never existed
            at that URL. Three recent reads below — or browse the full archive.
          </p>
          <p className="hub-cadence">
            <Link href="/insights" className="hub-active-clear">
              Back to all insights →
            </Link>
          </p>
        </section>

        {recent.length > 0 ? (
          <section className="hub-grid-section" aria-label="Suggested reads">
            <div className="service-v1-articles-grid hub-articles-grid">
              {recent.map((article) => {
                const author = getArticleAuthor(article);
                return (
                  <Link
                    key={article.slug}
                    href={`/insights/${article.slug}`}
                    className="service-v1-articles-card"
                  >
                    <span className="service-v1-articles-thumb" aria-hidden="true">
                      {article.thumbnailSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={article.thumbnailSrc} alt="" loading="lazy" />
                      ) : (
                        <span className="service-v1-articles-thumb-placeholder">
                          <span className="service-v1-articles-thumb-tag">{article.tag}</span>
                          <span className="service-v1-articles-thumb-brand">
                            Nucleus <em>Insights</em>
                          </span>
                        </span>
                      )}
                    </span>
                    <div className="service-v1-articles-meta">
                      <span className="service-v1-articles-tag">{article.tag}</span>
                      {isRecentArticle(article) ? (
                        <span
                          className="service-v1-articles-new"
                          title="Published in the last 3 weeks"
                        >
                          New
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
          </section>
        ) : null}
      </main>
    </PageShell>
  );
}
