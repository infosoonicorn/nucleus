import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { services, type Service } from '@/content/site';
import { ContactBand, Eyebrow, LeadMagnet, SectionHeader } from './sections';

export function ServiceDetail({ service }: Readonly<{ service: Service }>) {
  const related = services.filter((item) => item.slug !== service.slug).slice(0, 3);

  return (
    <main>
      <section className="subpage-hero service-hero">
        <div>
          <Eyebrow>Service</Eyebrow>
          <h1>{service.title}</h1>
          <p>{service.promise}</p>
          <div className="hero-actions">
            <Link className="button" href="/contact">
              {service.cta}
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
            <Link className="button button-ghost" href="/services">
              All services
            </Link>
          </div>
        </div>
        <aside className="service-fact-panel">
          <h2>What this supports</h2>
          <p>{service.summary}</p>
          <span>{service.leadMagnet}</span>
        </aside>
      </section>

      <section className="section split-section">
        <SectionHeader
          eyebrow="When to engage"
          title="For decisions where finance, compliance and execution need to move together."
          text="Each service page uses the same content model so Phase 1 content can later migrate into the CMS without changing the front-end structure."
        />
        <div className="check-list">
          {[
            'You need a reliable workplan before a transaction, filing, audit or board decision.',
            'Internal teams need specialist support without losing ownership of the outcome.',
            'Documents, data, assumptions and compliance positions need to be decision-ready.',
            'Management needs clear deliverables, issue trackers and next-step visibility.',
          ].map((item) => (
            <p key={item}>
              <CheckCircle2 aria-hidden="true" size={18} />
              {item}
            </p>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHeader eyebrow="How we help" title="Structured advisory, practical execution." />
        <div className="list-grid">
          {service.howWeHelp.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </section>

      <section className="section alt-section">
        <SectionHeader
          eyebrow="Process"
          title="A clear engagement path from scope to decision support."
        />
        <div className="timeline">
          {['Diagnose', 'Structure', 'Execute', 'Report'].map((step, index) => (
            <div key={step}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{step}</h3>
              <p>
                Scope the issue, collect the evidence, run the workstream and convert findings into
                management-ready action.
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHeader eyebrow="Deliverables" title="What clients can expect to receive." />
        <div className="list-grid">
          {service.deliverables.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </section>

      {service.proof ? (
        <section className="section proof-section">
          <SectionHeader
            eyebrow="Proof with guardrails"
            title="Operating experience presented carefully and without solicitation."
          />
          <div className="list-grid">
            {service.proof.map((item) => (
              <div key={item}>{item}</div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="section split-section">
        <SectionHeader
          eyebrow="Knowledge bank"
          title="FAQs, sample documents and insight modules are ready for CMS migration."
          text="Phase 1 avoids fake live articles. The page shows the editorial structure and routes visitors to a real conversation."
        />
        <div className="mini-panel">
          <h3>Related experts</h3>
          {service.experts.map((expert) => (
            <p key={expert}>{expert}</p>
          ))}
        </div>
      </section>

      <section className="section alt-section">
        <SectionHeader
          eyebrow="Sample documents"
          title="Typical working documents and client inputs."
          text="These are representative planning modules, not downloadable legal, tax or investment advice."
        />
        <div className="list-grid">
          {service.deliverables.slice(0, 4).map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </section>

      <section className="section">
        <SectionHeader eyebrow="FAQs" title="Questions this page is designed to answer." />
        <div className="faq-grid">
          {[
            `When should a company engage Nucleus for ${service.title}?`,
            'What information should the client prepare before the first discussion?',
            'What deliverables can management expect from this workstream?',
            'Which related services may become relevant as the engagement progresses?',
          ].map((question) => (
            <details key={question}>
              <summary>{question}</summary>
              <p>
                The answer depends on scope, stage and available records. Nucleus starts by
                clarifying the decision, required documents, workplan, owners and expected output.
              </p>
            </details>
          ))}
        </div>
      </section>

      <LeadMagnet service={service} />

      <section className="section">
        <SectionHeader eyebrow="Related services" title="Adjacent workstreams often connect." />
        <div className="service-grid service-grid-compact">
          {related.map((item) => (
            <Link className="service-card" href={`/services/${item.slug}`} key={item.slug}>
              <h3>{item.title}</h3>
              <p>{item.summary}</p>
              <span className="card-link">
                View service
                <ArrowRight aria-hidden="true" size={16} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <ContactBand title={`Talk to Nucleus about ${service.title}.`} text={service.promise} />
    </main>
  );
}
