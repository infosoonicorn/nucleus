import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { ContactBand, SectionHeader } from '@/components/sections';
import { PageShell } from '@/components/site-chrome';
import { insightCategories } from '@/content/site';

export const metadata: Metadata = {
  title: 'Insights | Nucleus Advisors',
  description:
    'Nucleus Advisors insight shell for knowledge bank categories, live updates, newsletters and lead magnets.',
};

const editorialModules = [
  {
    title: 'Official-source updates',
    text: 'Income Tax, MCA, GST/CBIC, RBI, SEBI, IBBI, ICAI and relevant government scheme updates.',
  },
  {
    title: 'Service knowledge banks',
    text: 'Articles, FAQs, checklists and explainers mapped to service pages and reviewer ownership.',
  },
  {
    title: 'Lead magnets',
    text: 'Readiness checklists, templates and starter guides connected to future gated capture.',
  },
  {
    title: 'Newsletter distribution',
    text: 'Approved website content can later be packaged into newsletters and LinkedIn drafts.',
  },
];

const guardrails = [
  'No AI-generated tax, legal or regulatory content publishes without human approval.',
  'Each article should store source URL, retrieval date, service mapping and reviewer.',
  'Prepared-by and reviewed-by lines should be added once partner approval is configured.',
  'No fake live updates or copied competitor commentary.',
];

export default function InsightsPage() {
  return (
    <PageShell>
      <main>
        <section className="subpage-hero">
          <div>
            <p className="eyebrow">Insights</p>
            <h1>Knowledge bank, newsletters and official-source updates.</h1>
            <p>
              Phase 1 introduces the editorial structure without fake live content. AI-assisted
              drafting remains future/internal and human-reviewed before publishing.
            </p>
          </div>
        </section>
        <section className="section">
          <SectionHeader
            eyebrow="Categories"
            title="Service-wise knowledge modules for future publishing."
          />
          <div className="pill-grid">
            {insightCategories.map((category) => (
              <span key={category}>{category}</span>
            ))}
          </div>
        </section>
        <section className="section alt-section">
          <SectionHeader
            eyebrow="Content engine"
            title="From advisory work to reviewed public knowledge."
          />
          <div className="people-grid">
            {editorialModules.map((module) => (
              <article key={module.title}>
                <span>Module</span>
                <h3>{module.title}</h3>
                <p>{module.text}</p>
              </article>
            ))}
          </div>
        </section>
        <section className="section split-section">
          <SectionHeader
            eyebrow="Editorial workflow"
            title="AI can assist drafts. Nucleus reviewers approve what gets published."
            text="Future articles should track source URLs, retrieval dates, related services, reviewer and distribution notes."
          />
          <Link className="mini-panel linked-panel" href="/insights/live-updates">
            <h3>Live updates shell</h3>
            <p>Official-source monitoring route for Phase 2.</p>
            <span className="text-link">
              Open shell
              <ArrowRight aria-hidden="true" size={16} />
            </span>
          </Link>
        </section>
        <section className="section">
          <SectionHeader eyebrow="Publishing guardrails" title="Trust before speed." />
          <div className="list-grid">
            {guardrails.map((item) => (
              <div key={item}>{item}</div>
            ))}
          </div>
        </section>
        <ContactBand
          title="Want a Nucleus checklist or advisory note?"
          text="Downloads and newsletter capture will be connected once Phase 1.5 backend storage is active."
        />
      </main>
    </PageShell>
  );
}
