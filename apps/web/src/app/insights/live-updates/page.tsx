import type { Metadata } from 'next';
import { ContactBand, SectionHeader } from '@/components/sections';
import { PageShell } from '@/components/site-chrome';

export const metadata: Metadata = {
  title: 'Live Updates | Nucleus Advisors',
  description: 'Official-source live updates shell for future reviewed regulatory and tax updates.',
};

export default function LiveUpdatesPage() {
  return (
    <PageShell>
      <main>
        <section className="subpage-hero">
          <div>
            <p className="eyebrow">Insights</p>
            <h1>Live updates shell.</h1>
            <p>
              This route is reserved for reviewed updates from official sources such as Income Tax,
              MCA, GST/CBIC, RBI, SEBI, IBBI, ICAI and relevant government schemes.
            </p>
          </div>
        </section>
        <section className="section">
          <SectionHeader
            eyebrow="Review workflow"
            title="No live tax, legal or regulatory content publishes without human review."
            text="Future updates should include source URL, retrieval date, service mapping and reviewer."
          />
        </section>
        <ContactBand title="Need help interpreting a recent update?" />
      </main>
    </PageShell>
  );
}
