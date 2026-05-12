import type { Metadata } from 'next';
import { ContactBand, SectionHeader } from '@/components/sections';
import { PageShell } from '@/components/site-chrome';

export const metadata: Metadata = {
  title: 'Life at Nucleus | Nucleus Advisors',
  description: 'Life at Nucleus shell for approved culture, learning and team content.',
};

export default function LifeAtNucleusPage() {
  return (
    <PageShell>
      <main>
        <section className="subpage-hero">
          <div>
            <p className="eyebrow">Careers</p>
            <h1>Life at Nucleus.</h1>
            <p>
              This shell is ready for approved culture images, first-day moments, learning stories
              and team events. No fake people or testimonials are rendered.
            </p>
          </div>
        </section>
        <section className="section">
          <SectionHeader
            eyebrow="Coming content"
            title="Culture content will be added only from approved assets."
          />
        </section>
        <ContactBand title="Interested in the Nucleus learning environment?" />
      </main>
    </PageShell>
  );
}
