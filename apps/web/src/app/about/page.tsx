import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowUpRight } from 'lucide-react';
import { PageShell } from '@/components/site-chrome';
import { AboutIntro } from '@/components/about/about-intro';
import { AboutClients } from '@/components/about/clients-summary';
import { AboutOffices } from '@/components/about/offices';
import { FirmMoments } from '@/components/firm/moments';
import { FirmLifecycle } from '@/components/firm/lifecycle';
import { WhoWeServe } from '@/components/firm/who-we-serve';
import { TeamPageCard } from '@/components/team/team-page-card';
import { HomeClosingCta } from '@/components/home/closing-cta';
import { getTeamGrouped } from '@/content/team';
import { getProofBySlug } from '@/content/site';

const partnersCount = getProofBySlug('partners').value;
const teamCount = getProofBySlug('team');
const clientsCount = getProofBySlug('clients');
const dealsCount = getProofBySlug('deals');
const officesCount = getProofBySlug('offices').value;

export const metadata: Metadata = {
  title: 'About Nucleus Advisors | Senior-led advisory firm in India',
  description: `Nucleus Advisors is a senior-led firm covering audit, tax, transactions and advisory. Established 2019. ${partnersCount} partners, ${teamCount.value}${teamCount.suffix} team, ${clientsCount.value}${clientsCount.suffix} clients, ${dealsCount.value}${dealsCount.suffix} deals advised, ${officesCount} offices across India.`,
};

export default function AboutPage() {
  const { leadership } = getTeamGrouped();

  return (
    <PageShell>
      <main className="home-v3">
        <AboutIntro />
        <FirmMoments />
        <WhoWeServe />

        <section className="about-leadership" aria-labelledby="about-leadership-heading">
          <div className="about-leadership-header">
            <p className="home-v3-section-eyebrow about-leadership-eyebrow">Leadership</p>
            <h2 id="about-leadership-heading" className="about-leadership-heading">
              Partners who run the mandates end-to-end.
            </h2>
            <p className="about-leadership-sub">
              Each Nucleus engagement has a named partner accountable for it. These are theirs.
            </p>
          </div>
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

        <FirmLifecycle />

        <AboutClients />
        <AboutOffices />
        <HomeClosingCta />
      </main>
    </PageShell>
  );
}
