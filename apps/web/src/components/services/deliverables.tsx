import type { Service } from '@/content/site';
import { SectionHeader } from '@/components/sections';

export function Deliverables({ service }: Readonly<{ service: Service }>) {
  return (
    <section className="service-v1-section">
      <SectionHeader eyebrow="Deliverables" title="What clients can expect to receive." />
      <div className="service-v1-list-grid">
        {service.deliverables.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </div>
    </section>
  );
}
