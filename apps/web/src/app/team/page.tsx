import type { Metadata } from 'next';
import { PageShell } from '@/components/site-chrome';
import { TeamPageCard } from '@/components/team/team-page-card';
import { getTeamGrouped } from '@/content/team';

export const metadata: Metadata = {
  title: 'Team — Nucleus Advisors',
  description:
    'Partner-led mandates at Nucleus Advisors. Meet the leadership and executive team — investment banking, M&A, audit, tax, risk, valuations and corporate secretarial.',
};

export default function TeamPage() {
  const { leadership, executive } = getTeamGrouped();

  return (
    <PageShell>
      <main className="home-v3 service-v1">
        <section className="team-page-hero">
          <p className="team-page-hero-eyebrow">Team</p>
          <h1 className="team-page-hero-title">
            Partner-led. Every <em>mandate</em>.
          </h1>
          <p className="team-page-hero-lede">
            A bench of partners and senior practitioners who run mandates themselves. Combined
            100+ years of experience across investment banking, M&amp;A, audit, tax, risk,
            valuations and corporate secretarial.
          </p>
          <div className="team-page-hero-stats" aria-label="Firm stats">
            <div className="team-page-hero-stat">
              <span className="team-page-hero-stat-num">100+</span>
              <span className="team-page-hero-stat-label">years combined experience</span>
            </div>
            <div className="team-page-hero-stat">
              <span className="team-page-hero-stat-num">130+</span>
              <span className="team-page-hero-stat-label">clients across sectors</span>
            </div>
            <div className="team-page-hero-stat">
              <span className="team-page-hero-stat-num">50+</span>
              <span className="team-page-hero-stat-label">deals advised</span>
            </div>
            <div className="team-page-hero-stat">
              <span className="team-page-hero-stat-num">5</span>
              <span className="team-page-hero-stat-label">offices across India</span>
            </div>
          </div>
        </section>

        <section className="team-page-section" aria-labelledby="leadership-heading">
          <header className="team-page-section-head">
            <p className="team-page-section-eyebrow">●01</p>
            <h2 id="leadership-heading" className="team-page-section-title">
              Leadership.
            </h2>
            <p className="team-page-section-sub">
              The partners who own the mandates end-to-end.
            </p>
          </header>
          <div className="team-page-grid">
            {leadership.map((m) => (
              <TeamPageCard key={m.slug} member={m} />
            ))}
          </div>
        </section>

        <section className="team-page-section" aria-labelledby="executive-heading">
          <header className="team-page-section-head">
            <p className="team-page-section-eyebrow">●02</p>
            <h2 id="executive-heading" className="team-page-section-title">
              Executive team.
            </h2>
            <p className="team-page-section-sub">
              Senior practitioners, board advisors and the engine room that runs every engagement.
            </p>
          </header>
          <div className="team-page-grid">
            {executive.map((m) => (
              <TeamPageCard key={m.slug} member={m} />
            ))}
          </div>
        </section>
      </main>
    </PageShell>
  );
}
