import Link from 'next/link';
import { ArrowUpRight, Clock } from 'lucide-react';
import { articles as allArticles, type Article } from '@/content/articles';

/**
 * Sidebar block: "Read next." Surfaces up to 4 articles related to
 * the current one. Selection rule:
 *   1. Same service line(s), excluding self.
 *   2. Then fall back to most-recent published articles, excluding self.
 * Draft articles are surfaced in development so partners can preview the
 * relationship pattern even before reviewer sign-off; production gates
 * on `reviewerStatus === 'approved'`.
 */
export function ArticleRelated({
  current,
  limit = 4,
}: Readonly<{ current: Article; limit?: number }>) {
  const allowDrafts = process.env.NODE_ENV !== 'production';

  const candidates = allArticles
    .filter((a) => a.slug !== current.slug)
    .filter((a) => (allowDrafts ? true : a.reviewerStatus === 'approved'));

  const sameService = candidates
    .filter((a) => a.serviceSlugs.some((s) => current.serviceSlugs.includes(s)))
    .sort((a, b) => b.publishedOn.localeCompare(a.publishedOn));

  const fallback = candidates
    .filter((a) => !sameService.includes(a))
    .sort((a, b) => b.publishedOn.localeCompare(a.publishedOn));

  const picks = [...sameService, ...fallback].slice(0, limit);
  if (picks.length === 0) return null;

  return (
    <section
      className="sidebar-block article-related-block"
      aria-labelledby="article-related-heading"
    >
      <header className="sidebar-block-head">
        <p className="sidebar-block-eyebrow">Read next</p>
        <h2 id="article-related-heading" className="sidebar-block-title">
          More from the desk.
        </h2>
      </header>
      <ul className="article-related-list">
        {picks.map((a) => (
          <li key={a.slug} className="article-related-item">
            <Link href={`/insights/${a.slug}`} className="article-related-link">
              <span className="article-related-tag">{a.tag}</span>
              <span className="article-related-title">{a.title}</span>
              <span className="article-related-meta">
                <span className="article-related-author">{a.author.name}</span>
                <span aria-hidden="true" className="article-related-sep">·</span>
                <span className="article-related-readtime">
                  <Clock size={11} aria-hidden="true" />
                  {a.readMinutes} min
                </span>
                <ArrowUpRight size={12} aria-hidden="true" className="article-related-arrow" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
