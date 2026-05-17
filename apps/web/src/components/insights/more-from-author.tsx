import Link from 'next/link';
import { ArrowUpRight, Clock } from 'lucide-react';
import {
  articles as allArticles,
  getArticleAuthor,
  type Article,
} from '@/content/articles';
import { getFirstName } from '@/content/team';

/**
 * "More from <author>" mini-grid at the bottom of the article reader.
 * Renders up to 3 other articles by the same partner. Each card mirrors
 * the structure of the team-modal article cards: 84px thumbnail or
 * tag-fallback on the left, tag + title + read-time on the right.
 *
 * Server component — selection done at render time, no client state.
 * Self-hides when the partner has no other articles to surface.
 */
export function MoreFromAuthor({
  current,
  limit = 3,
}: Readonly<{ current: Article; limit?: number }>) {
  const author = getArticleAuthor(current);
  const allowDrafts = process.env.NODE_ENV !== 'production';

  const others = allArticles
    .filter(
      (a) =>
        a.authorSlug === current.authorSlug &&
        a.slug !== current.slug &&
        (allowDrafts ? true : a.reviewerStatus === 'approved'),
    )
    .sort((a, b) => b.publishedOn.localeCompare(a.publishedOn))
    .slice(0, limit);

  if (others.length === 0) return null;

  const firstName = getFirstName(author.name);

  return (
    <section className="more-from-author" aria-labelledby="more-from-author-heading">
      <header className="more-from-author-head">
        <p id="more-from-author-heading" className="more-from-author-eyebrow">
          More from {firstName}
        </p>
        <Link
          href={`/insights/by/${author.slug}`}
          className="more-from-author-archive"
        >
          Full archive
          <ArrowUpRight size={11} aria-hidden="true" />
        </Link>
      </header>
      <div className="more-from-author-grid">
        {others.map((a) => (
          <Link key={a.slug} href={`/insights/${a.slug}`} className="more-from-author-card">
            <span className="more-from-author-thumb" aria-hidden="true">
              {a.thumbnailSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={a.thumbnailSrc} alt="" loading="lazy" />
              ) : (
                <span className="more-from-author-thumb-fallback">{a.tag}</span>
              )}
            </span>
            <div className="more-from-author-body">
              <p className="more-from-author-tag">{a.tag}</p>
              <h3 className="more-from-author-title">{a.title}</h3>
              <p className="more-from-author-foot">
                <Clock size={11} aria-hidden="true" />
                {a.readMinutes} min read
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
