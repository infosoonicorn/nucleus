import type { Metadata } from 'next';
import { ContactBand, SectionHeader, ServiceGrid } from '@/components/sections';
import { PageShell } from '@/components/site-chrome';

export const metadata: Metadata = {
  title: 'Services | Nucleus Advisors',
  description:
    'Explore Nucleus Advisors services across investment banking, M&A, risk advisory, tax, assurance, valuations, finance outsourcing, secretarial and AIF support.',
};

export default function ServicesPage() {
  return (
    <PageShell>
      <main>
        <section className="subpage-hero">
          <div>
            <p className="eyebrow">Services</p>
            <h1>Full-spectrum advisory from setup to scale.</h1>
            <p>
              Each service page is structured around buyer questions, process, deliverables, proof,
              lead magnets and related expertise.
            </p>
          </div>
        </section>
        <section className="section">
          <SectionHeader
            eyebrow="Service universe"
            title="Choose the workstream closest to the decision in front of you."
          />
          <ServiceGrid />
        </section>
        <ContactBand />
      </main>
    </PageShell>
  );
}
