import type { Service } from '@/content/site';
import { SectionHeader } from '@/components/sections';

export function KnowledgeBank({ service }: Readonly<{ service: Service }>) {
  return (
    <section className="service-v1-section service-v1-section-split">
      <SectionHeader
        eyebrow="Knowledge bank"
        title="FAQs, sample documents and insight modules are ready for CMS migration."
        text="Phase 1 avoids fake live articles. The page shows the editorial structure and routes visitors to a real conversation."
      />
      <div className="service-v1-mini-panel">
        <h3>Related experts</h3>
        {service.experts.map((expert) => (
          <p key={expert}>{expert}</p>
        ))}
      </div>
    </section>
  );
}
