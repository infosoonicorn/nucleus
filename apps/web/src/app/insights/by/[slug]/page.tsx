import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowUpRight,
  BookOpen,
  Briefcase,
  ChevronRight,
  Clock,
  GraduationCap,
  Linkedin,
  Mail,
} from 'lucide-react';
import { PageShell } from '@/components/site-chrome';
import { articles } from '@/content/articles';
import { team, getTeamMemberBySlug, getFirstName } from '@/content/team';

const FIRM_EMAIL = 'info@nucleusadvisors.in';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return team.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const member = getTeamMemberBySlug(slug);
  if (!member) return { title: 'Author — Nucleus Advisors' };
  return {
    title: `${member.name} — Insights | Nucleus Advisors`,
    description:
      member.shortBio ??
      `Articles by ${member.name}, ${member.role} at Nucleus Advisors.`,
    alternates: {
      canonical: `/insights/by/${member.slug}`,
      types: {
        'application/rss+xml': [
          {
            url: `/insights/by/${member.slug}/feed.xml`,
            title: `${member.name} — Insights | Nucleus Advisors`,
          },
        ],
      },
    },
    openGraph: {
      type: 'profile',
      title: `${member.name} — Insights`,
      description:
        member.shortBio ??
        `Articles by ${member.name}, ${member.role} at Nucleus Advisors.`,
      url: `/insights/by/${member.slug}`,
      images: [{ url: member.headshotSrc ?? '/og-default.png', width: 1200, height: 630 }],
    },
  };
}

export default async function AuthorArchivePage({ params }: Props) {
  const { slug } = await params;
  const member = getTeamMemberBySlug(slug);
  if (!member) notFound();

  const allowDrafts = process.env.NODE_ENV !== 'production';
  const authored = articles
    .filter(
      (a) => a.authorSlug === member.slug && (allowDrafts ? true : a.reviewerStatus === 'approved'),
    )
    .sort((a, b) => b.publishedOn.localeCompare(a.publishedOn));

  // Body of work stats
  const totalWords = authored.reduce(
    (n, a) => n + a.body.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/^#+\s*/gm, '').split(/\s+/).filter(Boolean).length,
    0,
  );
  const totalMinutes = authored.reduce((n, a) => n + a.readMinutes, 0);

  const firstName = getFirstName(member.name);
  const emailHref = `mailto:${member.email ?? FIRM_EMAIL}`;

  const bioParagraphs = member.fullBio
    ? member.fullBio.split('\n\n')
    : member.shortBio
    ? [member.shortBio]
    : [`${member.role} at Nucleus Advisors.`];

  return (
    <PageShell>
      <main className="home-v3 service-v1">
        <article className="author-archive">
          <nav className="article-breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li aria-hidden="true" className="article-breadcrumb-sep"><ChevronRight size={12} /></li>
              <li><Link href="/insights">Insights</Link></li>
              <li aria-hidden="true" className="article-breadcrumb-sep"><ChevronRight size={12} /></li>
              <li><Link href={`/insights/by/${member.slug}`}>{member.name}</Link></li>
            </ol>
          </nav>

          <header className="author-archive-head">
            <div className="author-archive-photo" aria-hidden="true">
              {member.headshotSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={member.headshotSrc} alt="" />
              ) : (
                <span className="author-archive-monogram">{member.initials}</span>
              )}
            </div>
            <div className="author-archive-head-meta">
              <p className="author-archive-eyebrow">Writing from the desk</p>
              <h1 className="author-archive-name">{member.name}</h1>
              <p className="author-archive-role">{member.role}</p>
              <ul className="team-page-card-expertise" aria-label="Expertise">
                {member.expertise.map((e) => (
                  <li key={e} className="team-page-card-pill">{e}</li>
                ))}
              </ul>
              <div className="author-archive-actions">
                <a href={emailHref} className="resource-cta resource-cta-primary">
                  <Mail size={14} aria-hidden="true" />
                  Email {firstName}
                </a>
                {member.linkedinUrl ? (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-cta resource-cta-ghost"
                  >
                    <Linkedin size={14} aria-hidden="true" />
                    LinkedIn
                  </a>
                ) : null}
              </div>
            </div>
          </header>

          <section className="author-archive-stats" aria-label="Body of work">
            <div className="author-archive-stat">
              <span className="author-archive-stat-num">{authored.length}</span>
              <span className="author-archive-stat-label">
                {authored.length === 1 ? 'article' : 'articles'}
              </span>
            </div>
            {member.experienceYears ? (
              <div className="author-archive-stat">
                <span className="author-archive-stat-num">{member.experienceYears}+</span>
                <span className="author-archive-stat-label">years in practice</span>
              </div>
            ) : null}
            <div className="author-archive-stat">
              <span className="author-archive-stat-num">
                {(totalWords / 1000).toFixed(1)}k
              </span>
              <span className="author-archive-stat-label">words written</span>
            </div>
            <div className="author-archive-stat">
              <span className="author-archive-stat-num">{totalMinutes}</span>
              <span className="author-archive-stat-label">min total reading</span>
            </div>
          </section>

          {(member.qualifications && member.qualifications.length > 0) ||
          (member.pastEmployers && member.pastEmployers.length > 0) ? (
            <section className="author-archive-credentials">
              {member.qualifications && member.qualifications.length > 0 ? (
                <div className="author-archive-credline">
                  <span className="author-archive-credlabel">
                    <GraduationCap size={12} aria-hidden="true" /> Qualifications
                  </span>
                  <span className="author-archive-credvalue">
                    {member.qualifications.join(', ')}
                  </span>
                </div>
              ) : null}
              {member.pastEmployers && member.pastEmployers.length > 0 ? (
                <div className="author-archive-credline">
                  <span className="author-archive-credlabel">
                    <Briefcase size={12} aria-hidden="true" /> Previously
                  </span>
                  <span className="author-archive-credvalue">
                    {member.pastEmployers
                      .map((e) => (typeof e === 'string' ? e : e.name))
                      .join(' · ')}
                  </span>
                </div>
              ) : null}
            </section>
          ) : null}

          <section className="author-archive-bio">
            {bioParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </section>

          <section className="author-archive-articles" aria-labelledby="author-archive-articles-heading">
            <header className="author-archive-articles-head">
              <p className="author-archive-articles-eyebrow">
                <BookOpen size={12} aria-hidden="true" /> Body of work
              </p>
              <h2 id="author-archive-articles-heading" className="author-archive-articles-title">
                All articles by {firstName}.
              </h2>
            </header>

            {authored.length === 0 ? (
              <p className="author-archive-empty">
                {firstName} has not published any articles yet.{' '}
                <Link href="/insights">Browse all insights →</Link>
              </p>
            ) : (
              <div className="author-archive-list">
                {authored.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/insights/${a.slug}`}
                    className="author-archive-item"
                  >
                    <span className="author-archive-item-thumb" aria-hidden="true">
                      {a.thumbnailSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={a.thumbnailSrc} alt="" loading="lazy" />
                      ) : (
                        <span className="author-archive-item-thumb-fallback">{a.tag}</span>
                      )}
                    </span>
                    <div className="author-archive-item-body">
                      <p className="author-archive-item-tag">{a.tag}</p>
                      <h3 className="author-archive-item-title">{a.title}</h3>
                      <p className="author-archive-item-excerpt">{a.excerpt}</p>
                      <p className="author-archive-item-foot">
                        <Clock size={11} aria-hidden="true" />
                        {a.readMinutes} min read
                        <ArrowUpRight size={12} aria-hidden="true" className="author-archive-item-arrow" />
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </article>
      </main>
    </PageShell>
  );
}

