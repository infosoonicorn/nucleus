import type { Service } from '@/content/site';
import { SectionHeader } from '@/components/sections';

export function HowWeHelp({ service }: Readonly<{ service: Service }>) {
  return (
    <section className="service-v1-section">
      <SectionHeader eyebrow="How we help" title="Structured advisory, practical execution." />
      <div className="service-v1-list-grid">
        {service.howWeHelp.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </div>
    </section>
  );
}
