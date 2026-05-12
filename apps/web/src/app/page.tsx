import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  FileCheck2,
  Landmark,
  LineChart,
  Newspaper,
  ShieldCheck,
  UsersRound,
} from 'lucide-react';
import { ContactBand, Eyebrow, SectionHeader, ServiceGrid } from '@/components/sections';
import { PageShell } from '@/components/site-chrome';
import { decisiveMoments, industries, insightCategories, lifecycle } from '@/content/site';

const heroSignals = [
  { label: 'Transactions', icon: Landmark },
  { label: 'Controls', icon: ShieldCheck },
  { label: 'Valuations', icon: LineChart },
  { label: 'Reporting', icon: FileCheck2 },
];

export default function Home() {
  return (
    <PageShell>
      <main>
        <section className="home-hero-v2">
          <div className="hero-v2-grid">
            <div className="hero-v2-copy">
              <Eyebrow>Full-spectrum advisory firm</Eyebrow>
              <h1>From incorporation to listing readiness.</h1>
              <p>
                Nucleus Advisors helps founders, boards, investors, promoters and finance teams
                move through capital, controls, compliance, reporting and transaction decisions
                with clarity.
              </p>
              <div className="hero-actions">
                <Link className="button" href="/contact">
                  Start a conversation
                  <ArrowRight aria-hidden="true" size={18} />
                </Link>
                <Link className="button button-ghost" href="/services">
                  Explore services
                </Link>
              </div>
            </div>

            <div className="hero-advisory-board" aria-label="Nucleus advisory coverage">
              <div className="board-header">
                <span>Advisory coverage</span>
                <strong>Setup → Scale → Listing</strong>
              </div>
              <div className="board-signal-grid">
                {heroSignals.map((signal) => {
                  const Icon = signal.icon;

                  return (
                    <div key={signal.label}>
                      <Icon aria-hidden="true" size={20} />
                      <span>{signal.label}</span>
                    </div>
                  );
                })}
              </div>
              <div className="board-flow">
                {['Incorporate', 'Operate', 'Raise', 'Control', 'Transact', 'Report'].map(
                  (step, index) => (
                    <span key={step} style={{ animationDelay: `${index * 110}ms` }}>
                      {step}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>

          <div className="home-proof-strip" aria-label="Nucleus proof points">
            {[
              ['8', 'partners'],
              ['90+', 'team members'],
              ['130+', 'clients'],
              ['50+', 'deals'],
              ['5', 'offices'],
            ].map(([value, label]) => (
              <div key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="section home-section" id="business-lifecycle">
          <SectionHeader
            eyebrow="Business lifecycle"
            title="From incorporation to listing readiness."
            text="The website is organised around the moments where founders, boards and finance teams need outside judgement and execution support."
          />
          <div className="lifecycle-grid polished-grid">
            {lifecycle.map((item, index) => (
              <article key={item.title}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section alt-section home-section">
          <SectionHeader
            eyebrow="Services"
            title="A connected advisory universe."
            text="Nine service lines cover capital, transactions, controls, tax, assurance, valuations, finance operations, secretarial work and AIF/fund operations."
          />
          <ServiceGrid />
        </section>

        <section className="section home-section">
          <SectionHeader
            eyebrow="When clients engage"
            title="The common moments where Nucleus becomes useful."
          />
          <div className="moment-grid polished-grid">
            {decisiveMoments.map((moment) => (
              <p key={moment}>{moment}</p>
            ))}
          </div>
        </section>

        <section className="section split-section alt-section home-section">
          <SectionHeader
            eyebrow="Advisory depth"
            title="Capital, controls and compliance handled as connected workstreams."
            text="The firm’s strength is not one isolated service. It is the ability to connect transaction work with risk, tax, assurance, governance and finance operations."
          />
          <div className="signal-stack">
            <div>
              <Building2 aria-hidden="true" size={24} />
              <h3>Soonicorn and AIF operating proof</h3>
              <p>
                Nucleus is Investment Manager to Soonicorn Angel Trust-I. The site presents this as
                fund operations experience without investment solicitation.
              </p>
            </div>
            <div>
              <Newspaper aria-hidden="true" size={24} />
              <h3>Knowledge bank and tools</h3>
              <p>
                Insights, checklists and lead magnets are mapped service-wise for future editorial
                review and newsletter distribution.
              </p>
            </div>
            <div>
              <UsersRound aria-hidden="true" size={24} />
              <h3>Partner-visible delivery</h3>
              <p>
                Service pages name relevant experts and keep proof blocks service-specific where
                verified numbers are pending.
              </p>
            </div>
          </div>
        </section>

        <section className="section home-section">
          <SectionHeader
            eyebrow="Industries"
            title="Built for businesses where finance decisions carry strategic weight."
          />
          <div className="pill-grid">
            {industries.map((industry) => (
              <span key={industry}>{industry}</span>
            ))}
          </div>
        </section>

        <section className="section feature-row alt-section home-section">
          <div>
            <Eyebrow>Careers</Eyebrow>
            <h2>Career paths across real business work.</h2>
            <p>
              CA articles, CAs, MBAs, graduates and analysts can build judgement across audit,
              tax, risk, deals, finance operations and compliance.
            </p>
            <Link className="text-link" href="/careers">
              Explore careers
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
          <div>
            <Eyebrow>Insights</Eyebrow>
            <h2>Knowledge built around services, not noise.</h2>
            <p>
              Insights and checklists will map to services, official sources and reviewer approval
              before publication.
            </p>
            <div className="pill-grid compact">
              {insightCategories.slice(0, 4).map((category) => (
                <span key={category}>{category}</span>
              ))}
            </div>
          </div>
        </section>

        <ContactBand />
      </main>
    </PageShell>
  );
}
