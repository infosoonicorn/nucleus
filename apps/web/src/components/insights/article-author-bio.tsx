import Link from 'next/link';
import { BookOpen, Linkedin, Mail } from 'lucide-react';
import type { Article } from '@/content/articles';
import { articles as allArticles } from '@/content/articles';
import { getTeamMemberByName } from '@/content/team';

/**
 * "About the author" card at the end of the article reader.
 *
 * Resolves `article.author.name` against the team registry. When a
 * matching TeamMember exists (`team.ts`), the card upgrades to use
 * the partner's headshot, longer bio, email and LinkedIn — so we get
 * automatic visual improvement as team data is populated.
 *
 * When the partner is not yet in `team.ts`, the card still reads as
 * a professional block (avatar with monogram, role chip, contextual
 * single-line blurb, "get in touch" CTA pointing at /contact). The
 * "no fake content" rule is intact: we never invent an email, photo,
 * or bio — we only surface what exists.
 *
 * Also computes the count of other articles by this author and shows
 * a "More from {first name}" link when there are any.
 */
export function ArticleAuthorBio({ article }: Readonly<{ article: Article }>) {
  const { author } = article;
  const member = getTeamMemberByName(author.name);
  const firstName = author.name.split(' ')[0];

  // Other approved articles by the same author (drafts surface in dev).
  const allowDrafts = process.env.NODE_ENV !== 'production';
  const moreCount = allArticles.filter(
    (a) =>
      a.author.name === author.name &&
      a.slug !== article.slug &&
      (allowDrafts ? true : a.reviewerStatus === 'approved'),
  ).length;

  // Single-paragraph blurb — prefer the partner's shortBio when we have
  // it, otherwise fall back to a one-line role statement so the card
  // body never reads as empty.
  const blurb =
    member?.shortBio ??
    `${author.role} at Nucleus Advisors. The desk is partner-led; the response on this article comes from this author or a directly briefed colleague.`;

  return (
    <section className="article-author-bio" aria-label="About the author">
      <p className="article-author-bio-eyebrow">About the author</p>
      <div className="article-author-bio-card">
        <span className="article-author-bio-avatar" aria-hidden="true">
          {member?.headshotSrc ? (
            // Small photo, next/image adds machinery we don't need.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={member.headshotSrc} alt="" />
          ) : (
            <span className="article-author-bio-monogram">{author.initials}</span>
          )}
        </span>
        <div className="article-author-bio-body">
          <p className="article-author-bio-name">{author.name}</p>
          <p className="article-author-bio-role">{author.role}</p>
          <p className="article-author-bio-blurb">{blurb}</p>
          <div className="article-author-bio-actions">
            {member?.email ? (
              <a
                href={`mailto:${member.email}`}
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
            {member?.linkedinUrl ? (
              <a
                href={member.linkedinUrl}
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
