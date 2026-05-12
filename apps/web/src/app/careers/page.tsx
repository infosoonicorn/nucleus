import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ContactBand, SectionHeader } from '@/components/sections';
import { PageShell } from '@/components/site-chrome';

export const metadata: Metadata = {
  title: 'Careers | Nucleus Advisors',
  description:
    'Explore CA articleship, analyst, CA, MBA, graduate and experienced career tracks at Nucleus Advisors.',
};

const tracks = [
  {
    title: 'CA Articleship Track',
    text: 'Audit, assurance, GST, tax, compliance, internal audit, finance operations and client communication discipline.',
  },
  {
    title: 'Deals and Investment Banking Track',
    text: 'Financial modelling, pitch decks, due diligence, valuation, investor material and transaction coordination.',
  },
  {
    title: 'Risk and Assurance Track',
    text: 'Internal audit, IFC, ICFR, statutory audit, limited review, control testing and reporting.',
  },
  {
    title: 'Tax and Regulatory Track',
    text: 'Direct tax, GST, transfer pricing, compliance calendars, assessments and advisory notes.',
  },
  {
    title: 'Finance Operations and vCFO Track',
    text: 'Accounting, MIS, payroll, controllership, compliance operations and management reporting.',
  },
  {
    title: 'Corporate Secretarial Track',
    text: 'Company law, ROC filings, statutory registers, board documentation and transaction support.',
  },
];

const whyJoin = [
  'Broad exposure across service lines instead of narrow repetitive work.',
  'Work with startups, growth companies, funds and established enterprises.',
  'Senior-led mentoring from partners and experienced professionals.',
  'Early client-facing and problem-solving exposure for high performers.',
  'Structured learning for CA articles and young professionals.',
  'Multi-city presence and a growing advisory platform.',
];

const process = [
  'Apply for a role, articleship or talent community interest.',
  'HR screens qualification, city, service interest and availability.',
  'Shortlisted candidates meet the relevant service team.',
  'Selected candidates receive role-specific next steps from HR.',
];

export default function CareersPage() {
  return (
    <PageShell>
      <main>
        <section className="subpage-hero">
          <div>
            <p className="eyebrow">Careers</p>
            <h1>Build advisory judgment across finance, transactions, risk and compliance.</h1>
            <p>
              Careers at Nucleus are structured for CA articles, CAs, MBAs, graduates, analysts and
              experienced professionals who want practical exposure.
            </p>
          </div>
        </section>
        <section className="section">
          <SectionHeader eyebrow="Learning tracks" title="Role paths that map to real client work." />
          <div className="people-grid">
            {tracks.map((track) => (
              <article key={track.title}>
                <span>Track</span>
                <h3>{track.title}</h3>
                <p>{track.text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="section alt-section">
          <SectionHeader
            eyebrow="Why Nucleus"
            title="A serious learning environment with room to grow."
          />
          <div className="list-grid">
            {whyJoin.map((item) => (
              <div key={item}>{item}</div>
            ))}
          </div>
        </section>
        <section className="section split-section">
          <SectionHeader
            eyebrow="CA articleship"
            title="Build business judgment, not just file discipline."
            text="Articleship content will expand after HR confirms policy details such as office openings, study leave and application process."
          />
          <div className="mini-panel">
            <h3>What articles should experience</h3>
            <p>
              How books, tax, audit, compliance, controls, valuation and transactions connect in
              real companies.
            </p>
          </div>
        </section>
        <section className="section feature-row">
          <div>
            <h2>Life at Nucleus</h2>
            <p>Team culture, learning moments and approved offsite imagery will live here.</p>
            <Link className="text-link" href="/careers/life-at-nucleus">
              View shell
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
          <div>
            <h2>Alumni</h2>
            <p>A future alumni wall can show approved stories without fake profiles or testimonials.</p>
            <Link className="text-link" href="/careers/alumni">
              View shell
              <ArrowRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </section>
        <section className="section alt-section">
          <SectionHeader eyebrow="Application process" title="Clear next steps for candidates." />
          <div className="timeline">
            {process.map((step, index) => (
              <div key={step}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{step}</h3>
              </div>
            ))}
          </div>
        </section>
        <ContactBand
          title="Interested in working with Nucleus Advisors?"
          text="Phase 1 shows the candidate CTA. Application capture and storage move into Phase 1.5."
        />
      </main>
    </PageShell>
  );
}
