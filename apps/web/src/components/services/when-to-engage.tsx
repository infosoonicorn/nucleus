import type { Service } from '@/content/site';
import { FadeIn } from '@/components/motion-primitives';
import { CheckCircle2 } from 'lucide-react';
import { SectionHeader } from '@/components/sections';

const GENERIC_BULLETS = [
  'You need a reliable workplan before a transaction, filing, audit or board decision.',
  'Internal teams need specialist support without losing ownership of the outcome.',
  'Documents, data, assumptions and compliance positions need to be decision-ready.',
  'Management needs clear deliverables, issue trackers and next-step visibility.',
];

export function WhenToEngage({ service }: Readonly<{ service: Service }>) {
  const bullets = service.whenToEngage ?? GENERIC_BULLETS;
  return (
    <section className="service-v1-section service-v1-section-split">
      <SectionHeader
        eyebrow="When to engage"
        title="For decisions where finance, compliance and execution need to move together."
      />
      <div className="service-v1-checklist">
        {bullets.map((item) => (
          <FadeIn key={item}>
            <p>
              <CheckCircle2 aria-hidden="true" size={18} />
              <span>{item}</span>
            </p>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
