import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, BookOpen, Calculator, FileSearch } from 'lucide-react';
import { PageShell } from '@/components/site-chrome';

export const metadata: Metadata = {
  title: 'Resources · Nucleus Advisors',
  description:
    'Free interactive tools, calculators and reference dashboards from Nucleus Advisors — built to help founders, CFOs and finance teams reason through tax, compliance and capital decisions faster.',
};

type ResourceCard = {
  href: string;
  title: string;
  blurb: string;
  tag: string;
  status: 'live' | 'soon';
  icon: typeof BookOpen;
};

const RESOURCES: ResourceCard[] = [
  {
    href: '/resources/income-tax-section-mapper',
    title: 'Income-tax Act Section Mapper',
    blurb:
      'Every section of the Income-tax Act, 1961 cross-referenced to its 2025 successor. Search by section number or topic, browse by category, and see which provisions have been retained, restructured or sunset under the new Act.',
    tag: 'Tax · Reference',
    status: 'live',
    icon: FileSearch,
  },
  // Future tools land here as additional cards. Hidden until ready.
];

export default function ResourcesPage() {
  return (
    <PageShell>
      <main className="resources-page">
        <header className="resources-hero">
          <div className="resources-hero-inner">
            <p className="resources-eyebrow">
              <span aria-hidden="true" className="resources-eyebrow-bar" />
              <span>Resources</span>
            </p>
            <h1 className="resources-title">
              Working tools from a working firm.
            </h1>
            <p className="resources-lede">
              Interactive calculators and reference dashboards we use on
              mandates, opened up for everyone. No login, no email gate —
              built so founders, CFOs and finance teams can reason
              through a position before they pick up the phone.
            </p>
          </div>
        </header>

        <section className="resources-grid-wrap">
          <ul className="resources-grid" aria-label="Available tools">
            {RESOURCES.map((r) => {
              const Icon = r.icon;
              const isLive = r.status === 'live';
              return (
                <li key={r.href}>
                  {isLive ? (
                    <Link href={r.href} className="resources-card">
                      <CardBody r={r} Icon={Icon} isLive />
                    </Link>
                  ) : (
                    <div className="resources-card is-disabled" aria-disabled="true">
                      <CardBody r={r} Icon={Icon} isLive={false} />
                    </div>
                  )}
                </li>
              );
            })}
          </ul>

          <aside className="resources-coming">
            <p className="resources-coming-label">
              <Calculator size={14} aria-hidden="true" /> More tools coming
            </p>
            <p className="resources-coming-body">
              Working on: an ESOP-valuation 409A simulator, an NBFC concurrent-audit
              checklist generator, and a GST-refund document-pack assembler. Tell us
              which would be most useful first — <Link href="/contact">drop a
              note</Link>.
            </p>
          </aside>
        </section>
      </main>
    </PageShell>
  );
}

function CardBody({
  r,
  Icon,
  isLive,
}: {
  r: ResourceCard;
  Icon: typeof BookOpen;
  isLive: boolean;
}) {
  return (
    <>
      <div className="resources-card-head">
        <span className="resources-card-icon" aria-hidden="true">
          <Icon size={20} />
        </span>
        <span className="resources-card-tag">{r.tag}</span>
        {isLive ? (
          <span className="resources-card-status is-live">Live</span>
        ) : (
          <span className="resources-card-status is-soon">Coming soon</span>
        )}
      </div>
      <h2 className="resources-card-title">{r.title}</h2>
      <p className="resources-card-blurb">{r.blurb}</p>
      {isLive ? (
        <span className="resources-card-cta">
          Open tool
          <ArrowUpRight size={14} aria-hidden="true" />
        </span>
      ) : null}
    </>
  );
}
