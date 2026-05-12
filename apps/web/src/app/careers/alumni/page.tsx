import type { Metadata } from 'next';
import { ContactBand, SectionHeader } from '@/components/sections';
import { PageShell } from '@/components/site-chrome';

export const metadata: Metadata = {
  title: 'Alumni | Nucleus Advisors',
  description: 'Nucleus Advisors alumni shell for approved future alumni stories.',
};

export default function AlumniPage() {
  return (
    <PageShell>
      <main>
        <section className="subpage-hero">
          <div>
            <p className="eyebrow">Careers</p>
            <h1>Nucleus alumni network.</h1>
            <p>
              A future alumni wall can celebrate approved journeys, learning tracks and role moves
              without inventing profiles.
            </p>
          </div>
        </section>
        <section className="section">
          <SectionHeader
            eyebrow="Future module"
            title="Alumni stories will appear after approval and consent."
          />
        </section>
        <ContactBand title="Want to reconnect with Nucleus?" />
      </main>
    </PageShell>
  );
}
