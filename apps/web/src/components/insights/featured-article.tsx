import Link from 'next/link';
import { ArrowUpRight, Clock } from 'lucide-react';
import { type Article, isRecentArticle } from '@/content/articles';
import type { TeamMember } from '@/content/team';

/**
 * "Start here" — single elevated article that anchors the top of
 * /insights. Larger layout than the grid cards: thumbnail (or
 * brand placeholder) on the left, eyebrow + title + excerpt +
 * author + meta on the right. One CTA button.
 *
 * Selection happens in the server page (insights/page.tsx); this
 * component just renders whatever it's handed. Caller is responsible
 * for filtering the featured article out of the grid below so the
 * same piece doesn't appear twice.
 */
export function FeaturedArticle({
  article,
  author,
}: Readonly<{ article: Article; author: TeamMember }>) {
  return (
    <section className="hub-featured" aria-labelledby="hub-featured-heading">
      <Link href={`/insights/${article.slug}`} className="hub-featured-card">
        <span className="hub-featured-thumb" aria-hidden="true">
          {article.thumbnailSrc ? (
            // Larger image than the grid cards, so eager.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={article.thumbnailSrc} alt="" loading="eager" />
          ) : (
            <span className="hub-featured-thumb-placeholder">
              <span className="hub-featured-thumb-tag">{article.tag}</span>
              <span className="hub-featured-thumb-brand">
                Nucleus <em>Insights</em>
              </span>
            </span>
          )}
        </span>
        <div className="hub-featured-body">
          <p className="hub-featured-eyebrow">
            Start here
            {isRecentArticle(article) ? (
              <span className="hub-featured-new" aria-label="Published in the last 3 weeks">
                New
              </span>
            ) : null}
          </p>
          <h2 id="hub-featured-heading" className="hub-featured-title">
            {article.title}
          </h2>
          <p className="hub-featured-excerpt">{article.excerpt}</p>
          <div className="hub-featured-foot">
            <span className="hub-featured-author">
              <span className="hub-featured-avatar" aria-hidden="true">
                {author.headshotSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={author.headshotSrc} alt="" />
                ) : (
                  author.initials
                )}
              </span>
              <span>
                <span className="hub-featured-name">{author.name}</span>
                <span className="hub-featured-role">{author.role}</span>
              </span>
            </span>
            <span className="hub-featured-meta">
              <Clock size={12} aria-hidden="true" />
              {article.readMinutes} min read
            </span>
          </div>
          <span className="hub-featured-cta" aria-hidden="true">
            Read the piece
            <ArrowUpRight size={14} />
          </span>
        </div>
      </Link>
    </section>
  );
}
