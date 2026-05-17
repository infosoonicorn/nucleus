import Link from 'next/link';
import { BookOpen, Linkedin, Mail } from 'lucide-react';
import { articles as allArticles, getArticleAuthor, type Article } from '@/content/articles';

/**
 * "About the author" card at the end of the article reader.
 *
 * Resolves the article's author via `getArticleAuthor()` — which reads
 * straight from `team.ts`. That means a future `/team` page can edit
 * the same TeamMember record (headshot, role, email, LinkedIn, bio)
 * and every article by that partner upgrades automatically. One source
 * of truth, zero duplicated maintenance.
 *
 * The card degrades gracefully when team data is sparse:
 *   - headshotSrc missing      → monogram avatar
 *   - email missing            → "Get in touch" → /contact (no fake mailto)
 *   - linkedinUrl missing      → pill hidden
 *   - shortBio missing         → one-line role statement as fallback
 *
 * Also shows a "More from {first name}" link when the author has other
 * articles in the registry.
 */
export function ArticleAuthorBio({ article }: Readonly<{ article: Article }>) {
  const author = getArticleAuthor(article);
  const firstName = author.name.split(' ')[0];

  // Other approved articles by the same author (drafts surface in dev).
  const allowDrafts = process.env.NODE_ENV !== 'production';
  const moreCount = allArticles.filter(
    (a) =>
      a.authorSlug === author.slug &&
      a.slug !== article.slug &&
      (allowDrafts ? true : a.reviewerStatus === 'approved'),
  ).length;

  const blurb =
    author.shortBio ??
    `${author.role} at Nucleus Advisors. The desk is partner-led; the response on this article comes from this author or a directly briefed colleague.`;

  return (
    <section className="article-author-bio" aria-label="About the author">
      <p className="article-author-bio-eyebrow">About the author</p>
      <div className="article-author-bio-card">
        <span className="article-author-bio-avatar" aria-hidden="true">
          {author.headshotSrc ? (
            // Small photo, next/image adds machinery we don't need.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={author.headshotSrc} alt="" />
          ) : (
            <span className="article-author-bio-monogram">{author.initials}</span>
          )}
        </span>
        <div className="article-author-bio-body">
          <p className="article-author-bio-name">{author.name}</p>
          <p className="article-author-bio-role">{author.role}</p>
          <p className="article-author-bio-blurb">{blurb}</p>
          <div className="article-author-bio-actions">
            {author.email ? (
              <a
                href={`mailto:${author.email}`}
                className="article-author-bio-action article-author-bio-action-primary"
              >
                <Mail size={14} aria-hidden="true" />
                Email {firstName}
              </a>
            ) : (
              <Link
                href="/contact"
                className="article-author-bio-action article-author-bio-action-primary"
              >
                <Mail size={14} aria-hidden="true" />
                Get in touch
              </Link>
            )}
            {author.linkedinUrl ? (
              <a
                href={author.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="article-author-bio-action"
              >
                <Linkedin size={14} aria-hidden="true" />
                LinkedIn
              </a>
            ) : null}
            {moreCount > 0 ? (
              <Link href="/insights" className="article-author-bio-action">
                <BookOpen size={14} aria-hidden="true" />
                {moreCount} more from {firstName}
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
