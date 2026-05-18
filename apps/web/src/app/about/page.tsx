import type { Metadata } from 'next';
import { ContactBand, ProofBar, SectionHeader } from '@/components/sections';
import { PageShell } from '@/components/site-chrome';
import { clientSegments, site } from '@/content/site';

export const metadata: Metadata = {
  title: 'About Nucleus Advisors | Full-Spectrum Consulting Firm in India',
  description:
    'Learn about Nucleus Advisors, a consulting firm with 8 partners, 90+ team members, 130+ clients, 50+ deals and offices across India.',
};

const advisoryAreas = [
  'M&A, restructuring and transaction readiness.',
  'Fundraising, valuations and investor material.',
  'Internal audit, IFC, ICFR and process controls.',
  'Tax, GST, transfer pricing and regulatory work.',
  'Assurance, Ind AS and financial reporting.',
  'Finance operations, MIS, payroll and controllership.',
];

const leadership = [
  {
    name: 'CA Pravesh Goel',
    role: 'Managing Partner',
    focus: 'M&A, vCFO, process re-engineering, audit, risk management and taxation.',
  },
  {
    name: 'CA Vijay Singh Rathore',
    role: 'Founding Partner',
    focus: 'Financial due diligence, valuations, startup fundraising and investor strategy.',
  },
  {
    name: 'CA Tarun Agarwal',
    role: 'Senior Partner',
    focus: 'vCFO, accounting advisory, regulatory compliance and reporting controls.',
  },
  {
    name: 'CA Ashish Gupta',
    role: 'Senior Partner',
    focus: 'Internal audit, risk management and process re-engineering for financial businesses.',
  },
  {
    name: 'CA Aakash Kalra',
    role: 'Partner',
    focus: 'M&A, due diligence, restructuring, FP&A and deal advisory.',
  },
  {
    name: 'CS Neha Rathore',
    role: 'Secretarial Partner',
    focus: 'Corporate governance, AIF compliance, ROC filings and transaction documentation.',
  },
];

export default function AboutPage() {
  return (
    <PageShell>
      <main>
        <section className="subpage-hero">
          <div>
            <p className="eyebrow">About</p>
            <h1>Specialised advisory for critical business decisions.</h1>
            <p>
              Nucleus Advisors provides specialised services across M&A, risk advisory, internal
              audits, assurance, IFC, transfer pricing, valuations, due diligence, tax and finance
              operations.
            </p>
          </div>
        </section>
        <ProofBar />
        <section className="section split-section">
          <SectionHeader
            eyebrow="Firm overview"
            title="We partner entrepreneurs and leadership teams in decision-making, implementation and monitoring."
            text="Nucleus is designed as a senior-led advisory platform where transaction work, controls, compliance and reporting can be handled as connected decisions."
          />
          <div className="mini-panel">
            <h3>What we advise on</h3>
            <p>Transactions, controls, compliance, reporting, governance and finance operations.</p>
          </div>
        </section>
        <section className="section alt-section">
          <SectionHeader eyebrow="Advisory universe" title="The work we connect for clients." />
          <div className="list-grid">
            {advisoryAreas.map((area) => (
              <div key={area}>{area}</div>
            ))}
          </div>
        </section>
        <section className="section">
          <SectionHeader
            eyebrow="Leadership"
            title="Senior-led practices with specialist execution teams."
            text="Photos and long bios can be added after final approval and consent. Phase 1 keeps the public page factual and restrained."
          />
          <div className="people-grid">
            {leadership.map((person) => (
              <article key={person.name}>
                <span>{person.role}</span>
                <h3>{person.name}</h3>
                <p>{person.focus}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="section">
          <SectionHeader eyebrow="Who we serve" title="Built for both sides of the capital table." />
          <div className="builtfor-columns">
            {clientSegments.map((segment) => (
              <div className="builtfor-column" key={segment.slug}>
                <p className="builtfor-column-label">{segment.label}</p>
                <ul className="builtfor-list">
                  {segment.items.map((item) => (
                    <li key={item.slug} className="builtfor-item">
                      <span className="builtfor-item-icon" aria-hidden="true">
                        <item.icon size={18} />
                      </span>
                      <div className="builtfor-item-body">
                        <span className="builtfor-item-name">{item.name}</span>
                        <span className="builtfor-item-context">{item.context}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
        <section className="section alt-section">
          <SectionHeader eyebrow="Locations" title="Offices across key business markets." />
          <div className="list-grid">
            {site.locations.map((location) => (
              <div key={location}>{location}</div>
            ))}
          </div>
        </section>
        <ContactBand />
      </main>
    </PageShell>
  );
}
