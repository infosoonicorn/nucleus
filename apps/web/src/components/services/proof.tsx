import type { Service } from '@/content/site';
import { SectionHeader } from '@/components/sections';

export function Proof({ service }: Readonly<{ service: Service }>) {
  if (!service.proof || service.proof.length === 0) return null;
  return (
    <section className="service-v1-section service-v1-section-proof">
      <SectionHeader
        eyebrow="Proof with guardrails"
        title="Operating experience presented carefully and without solicitation."
      />
      <div className="service-v1-list-grid">
        {service.proof.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </div>
    </section>
  );
}
