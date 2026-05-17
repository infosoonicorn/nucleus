import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowUpRight,
  Briefcase,
  GraduationCap,
  Linkedin,
  Mail,
} from 'lucide-react';
import { PageShell } from '@/components/site-chrome';
import { team, getTeamMemberBySlug } from '@/content/team';
import { articles as allArticles } from '@/content/articles';
import { services } from '@/content/site';

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return team.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const m = getTeamMemberBySlug(slug);
  if (!m) return { title: 'Profile — Nucleus Advisors' };
  return {
    title: `${m.name}, ${m.role} — Nucleus Advisors`,
    description:
      m.shortBio ??
      `${m.role} at Nucleus Advisors. Expertise: ${m.expertise.join(', ')}.`,
  };
}

export default async function TeamMemberPage({ params }: Props) {
  const { slug } = await params;
  const member = getTeamMemberBySlug(slug);
  if (!member) notFound();

  const fullBioParagraphs = member.fullBio
    ? member.fullBio.split('\n\n')
    : member.shortBio
    ? [member.shortBio]
    : ['Detailed bio coming soon. Get in touch to learn more about working with this partner.'];

  const allowDrafts = process.env.NODE_ENV !== 'production';
  const articlesByThisPartner = allArticles
    .filter(
      (a) =>
        a.authorSlug === member.slug && (allowDrafts ? true : a.reviewerStatus === 'approved'),
    )
    .sort((a, b) => b.publishedOn.localeCompare(a.publishedOn));

  const serviceTitleBySlug = new Map(services.map((s) => [s.slug, s.title]));
  const memberServices = member.serviceSlugs
    .map((s) => ({ slug: s, title: serviceTitleBySlug.get(s) ?? s }))
    .filter((s) => s.title !== s.slug);

  return (
    <PageShell>
      <main className="home-v3 service-v1">
        <article className="team-profile">
          <Link href="/team" className="article-page-back">
            <ArrowLeft size={14} aria-hidden="true" />
            <span>All team</span>
          </Link>

          <header className="team-profile-head">
            <div className="team-profile-photo" aria-hidden="true">
              {member.headshotSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={member.headshotSrc} alt="" />
              ) : (
                <span className="team-profile-monogram">{member.initials}</span>
              )}
            </div>
            <div className="team-profile-head-meta">
              <p className="team-profile-role">{member.role}</p>
              <h1 className="team-profile-name">{member.name}</h1>
              <ul className="team-page-card-expertise" aria-label="Expertise">
                {member.expertise.map((e) => (
                  <li key={e} className="team-page-card-pill">
                    {e}
                  </li>
                ))}
              </ul>
              <div className="team-profile-actions">
                {member.email ? (
                  <a
                    href={`mailto:${member.email}`}
                    className="resource-cta resource-cta-primary"
                  >
                    <Mail size={14} aria-hidden="true" />
                    Email {member.name.split(' ').slice(-1)[0]}
                  </a>
                ) : (
                  <Link href="/contact" className="resource-cta resource-cta-primary">
                    <Mail size={14} aria-hidden="true" />
                    Get in touch
                  </Link>
                )}
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

          <div className="team-profile-facts">
            {member.experienceYears ? (
              <div className="team-page-modal-fact">
                <span className="team-page-modal-fact-label">Experience</span>
                <span className="team-page-modal-fact-value">
                  {member.experienceYears}+ years
                </span>
              </div>
            ) : null}
            {member.qualifications && member.qualifications.length > 0 ? (
              <div className="team-page-modal-fact">
                <span className="team-page-modal-fact-label">
                  <GraduationCap size={11} aria-hidden="true" /> Qualifications
                </span>
                <span className="team-page-modal-fact-value">
                  {member.qualifications.join(', ')}
                </span>
              </div>
            ) : null}
            {member.pastEmployers && member.pastEmployers.length > 0 ? (
              <div className="team-page-modal-fact">
                <span className="team-page-modal-fact-label">
                  <Briefcase size={11} aria-hidden="true" /> Previously
                </span>
                <span className="team-page-modal-fact-value">
                  {member.pastEmployers.join(', ')}
                </span>
              </div>
            ) : null}
          </div>

          <section className="team-profile-body">
            {fullBioParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </section>

          {memberServices.length > 0 ? (
            <section className="team-profile-services">
              <p className="team-profile-section-eyebrow">Active on</p>
              <ul>
                {memberServices.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`}>
                      {s.title}
                      <ArrowUpRight size={13} aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {articlesByThisPartner.length > 0 ? (
            <section className="team-profile-articles">
              <p className="team-profile-section-eyebrow">Writing from {member.name.split(' ')[0]}</p>
              <ul>
                {articlesByThisPartner.map((a) => (
                  <li key={a.slug}>
                    <Link href={`/insights/${a.slug}`}>
                      <span className="team-profile-article-title">{a.title}</span>
                      <span className="team-profile-article-meta">
                        {a.tag} · {a.readMinutes} min
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </article>
      </main>
    </PageShell>
  );
}
