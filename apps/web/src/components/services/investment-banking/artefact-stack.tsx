'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  FileSpreadsheet,
  Presentation,
  FileText,
  FolderSearch,
  FileSignature,
} from 'lucide-react';
import { SectionHeader } from '@/components/sections';

type Artefact = {
  name: string;
  Icon: typeof FileSpreadsheet;
  oneLiner: string;
};

const ARTEFACTS: Artefact[] = [
  {
    name: 'Financial model',
    Icon: FileSpreadsheet,
    oneLiner: '3-statement model, sensitivity, base/bull/bear.',
  },
  {
    name: 'Investor deck',
    Icon: Presentation,
    oneLiner: 'Narrative-first, sector-tuned, decision-grade.',
  },
  {
    name: 'Information memo',
    Icon: FileText,
    oneLiner: 'The detailed read for serious investors.',
  },
  {
    name: 'Diligence pack',
    Icon: FolderSearch,
    oneLiner: 'Curated data room and Q&A tracker.',
  },
  {
    name: 'Term sheet support',
    Icon: FileSignature,
    oneLiner: 'Clause review, redlines, negotiation pack.',
  },
];

const DEFAULT_ACTIVE = 1; // Investor deck — richest visual default per spec.

function FlatList() {
  return (
    <ul className="service-v1-artefact-list">
      {ARTEFACTS.map((a) => (
        <li key={a.name}>
          <a.Icon aria-hidden="true" size={20} />
          <div>
            <h3>{a.name}</h3>
            <p>{a.oneLiner}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function ArtefactStack() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(DEFAULT_ACTIVE);

  if (reduceMotion) {
    return (
      <section className="service-v1-section service-v1-artefact-stack-reduced">
        <SectionHeader
          eyebrow="Artefacts"
          title="The documents that come out of a Nucleus fundraise."
        />
        <FlatList />
      </section>
    );
  }

  // Render BOTH the fan and the flat list. CSS hides the fan on mobile and the
  // list on desktop — keeps a working layout regardless of viewport without
  // requiring a viewport-aware JS hook.
  return (
    <section className="service-v1-section service-v1-artefact-stack">
      <SectionHeader
        eyebrow="Artefacts"
        title="The documents that come out of a Nucleus fundraise."
      />
      <div className="service-v1-artefact-fan" role="list" aria-label="Fundraise artefacts">
        {ARTEFACTS.map((a, index) => {
          const offset = index - active;
          return (
            <motion.button
              key={a.name}
              type="button"
              onFocus={() => setActive(index)}
              onMouseEnter={() => setActive(index)}
              animate={{
                rotate: offset * 4,
                x: offset * 36,
                y: Math.abs(offset) * 8,
                zIndex: 100 - Math.abs(offset),
                scale: index === active ? 1 : 0.96,
              }}
              transition={{ type: 'spring', stiffness: 280, damping: 30 }}
              className={`service-v1-artefact-card ${index === active ? 'is-active' : ''}`}
            >
              <a.Icon aria-hidden="true" size={22} />
              <h3>{a.name}</h3>
              <p>{a.oneLiner}</p>
            </motion.button>
          );
        })}
      </div>
      <div className="service-v1-artefact-stack-mobile">
        <FlatList />
      </div>
    </section>
  );
}
