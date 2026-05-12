import type { Metadata } from 'next';
import { Download } from 'lucide-react';
import { ContactBand, SectionHeader } from '@/components/sections';
import { PageShell } from '@/components/site-chrome';
import { services } from '@/content/site';

export const metadata: Metadata = {
  title: 'Downloads | Nucleus Advisors',
  description: 'Nucleus Advisors lead magnet and checklist download shell.',
};

export default function DownloadsPage() {
  return (
    <PageShell>
      <main>
        <section className="subpage-hero">
          <div>
            <p className="eyebrow">Downloads</p>
            <h1>Checklists, templates and readiness tools.</h1>
            <p>
              Phase 1 lists planned lead magnets. Gated capture and delivery will be connected once
              the lightweight backend is active.
            </p>
          </div>
        </section>
        <section className="section">
          <SectionHeader eyebrow="Lead magnets" title="Service-wise assets planned for Phase 1.5." />
          <div className="list-grid">
            {services.map((service) => (
              <div key={service.slug}>
                <Download aria-hidden="true" size={18} />
                {service.leadMagnet}
              </div>
            ))}
          </div>
        </section>
        <ContactBand title="Ask for a checklist or consultation." />
      </main>
    </PageShell>
  );
}
