import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { ContactBand, ProofBar } from '@/components/sections';
import { PageShell } from '@/components/site-chrome';
import { AboutHero } from '@/components/about/about-hero';
import { AboutPhilosophy } from '@/components/about/philosophy';
import { AboutOfficesMap } from '@/components/about/offices-map';
import { FirmMoments } from '@/components/firm/moments';
import { FirmLifecycle } from '@/components/firm/lifecycle';
import { WhoWeServe } from '@/components/firm/who-we-serve';
import { TeamPageCard } from '@/components/team/team-page-card';
import { getTeamGrouped } from '@/content/team';

export const metadata: Metadata = {
  title: 'About Nucleus Advisors | Senior-led advisory firm in India',
  description:
    'Nucleus Advisors is a senior-led firm covering audit, tax, transactions and advisory. 8 partners, 90+ team, 130+ clients, 50+ deals advised, 5 offices across India.',
};

export default function AboutPage() {
  const { leadership } = getTeamGrouped();

  return (
    <PageShell>
      <main className="home-v3">
        <AboutHero />
        <ProofBar />
        <AboutPhilosophy />
        <FirmMoments />
        <FirmLifecycle />

        <section className="team-page-section about-leadership" aria-labelledby="about-leadership-heading">
          <header className="team-page-section-head">
            <p className="team-page-section-eyebrow">●01 Leadership</p>
            <h2 id="about-leadership-heading" className="team-page-section-title">
              Partners who run the mandates end-to-end.
            </h2>
            <p className="team-page-section-sub">
              Each Nucleus engagement has a named partner accountable for it. These are theirs.
            </p>
          </header>
          <div className="team-page-grid">
            {leadership.map((m) => (
              <TeamPageCard key={m.slug} member={m} />
            ))}
          </div>
          <div className="about-leadership-foot">
            <Link className="about-leadership-more" href="/team">
              Meet the full team
              <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </section>

        <WhoWeServe />
        <AboutOfficesMap />
        <ContactBand />
      </main>
    </PageShell>
  );
}
