import type { Service } from '@/content/site';
import { SectionHeader } from '@/components/sections';

function genericQuestions(service: Service) {
  return [
    `When should a company engage Nucleus for ${service.title}?`,
    'What information should the client prepare before the first discussion?',
    'What deliverables can management expect from this workstream?',
    'Which related services may become relevant as the engagement progresses?',
  ];
}

export function Faq({ service }: Readonly<{ service: Service }>) {
  const items: { q: string; a?: string }[] =
    service.faq ?? genericQuestions(service).map((q) => ({ q }));

  return (
    <section className="service-v1-section">
      <SectionHeader eyebrow="FAQs" title="Questions this page is designed to answer." />
      <div className="service-v1-faq-grid">
        {items.map(({ q, a }) => (
          <details key={q}>
            <summary>{q}</summary>
            {a ? (
              <p>{a}</p>
            ) : (
              <p>
                <span className="service-v1-pending-pill">Updating soon</span>{' '}
                Reviewer-approved content for this question is in preparation.
              </p>
            )}
          </details>
        ))}
      </div>
    </section>
  );
}
