import type { Service } from '@/content/site';
import { SectionHeader } from '@/components/sections';

const PHASES = [
  { name: 'Diagnose', text: 'Scope the issue, identify decision owners, agree the workplan.' },
  { name: 'Structure', text: 'Build the model, assemble evidence, sequence the workstream.' },
  { name: 'Execute', text: 'Run the workstream, manage information, track issues to closure.' },
  { name: 'Report', text: 'Convert findings into management-ready action and next steps.' },
];

export function Process({ service }: Readonly<{ service: Service }>) {
  return (
    <section className="service-v1-section service-v1-section-alt">
      <SectionHeader
        eyebrow="Process"
        title={`A clear engagement path for ${service.title}.`}
      />
      <div className="service-v1-timeline">
        {PHASES.map((phase, index) => (
          <div key={phase.name}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{phase.name}</h3>
            <p>{phase.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
