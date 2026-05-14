'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { SectionHeader } from '@/components/sections';

type Stage = {
  ordinal: string;
  name: string;
  nucleusDoes: string;
  deliverable: string;
};

const STAGES: Stage[] = [
  {
    ordinal: '01',
    name: 'Readiness',
    nucleusDoes: 'Readiness assessment, data room scoping, governance review.',
    deliverable: 'Fundraise readiness report.',
  },
  {
    ordinal: '02',
    name: 'Modelling',
    nucleusDoes: '3-statement model, sensitivity tabs, base/bull/bear scenarios.',
    deliverable: 'Financial model.',
  },
  {
    ordinal: '03',
    name: 'Storytelling',
    nucleusDoes: 'Narrative-first investor deck, IM, sector framing.',
    deliverable: 'Investor deck and IM.',
  },
  {
    ordinal: '04',
    name: 'Outreach',
    nucleusDoes: 'Investor mapping, target list, intro coordination.',
    deliverable: 'Investor target list.',
  },
  {
    ordinal: '05',
    name: 'Diligence',
    nucleusDoes: 'DD pack, Q&A management, issue tracker for accountable closure.',
    deliverable: 'Diligence checklist and data room.',
  },
  {
    ordinal: '06',
    name: 'Close',
    nucleusDoes: 'Term sheet review, transaction workplan, signing coordination.',
    deliverable: 'Transaction workplan.',
  },
];

export function FundraiseStages() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  // Six equal bands: progress in [n/6, (n+1)/6] → active stage n.
  const stageIndex = useTransform(scrollYProgress, (v) => {
    const clamped = Math.max(0, Math.min(0.9999, v));
    return Math.floor(clamped * STAGES.length);
  });
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (reduceMotion) return;
    return stageIndex.on('change', (v) =>
      setActive(Math.max(0, Math.min(STAGES.length - 1, v))),
    );
  }, [reduceMotion, stageIndex]);

  function handleKey(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setActive((i) => Math.min(STAGES.length - 1, i + 1));
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    }
  }

  // Reduced motion: render flat six-card grid.
  if (reduceMotion) {
    return (
      <section className="service-v1-section service-v1-stages service-v1-stages-reduced">
        <SectionHeader
          eyebrow="§01 / Fundraise"
          title="How Nucleus moves a fundraise from idea to closed round."
        />
        <div className="service-v1-stages-grid">
          {STAGES.map((stage) => (
            <article key={stage.ordinal}>
              <p className="service-v1-stage-ordinal">{stage.ordinal}</p>
              <h3>{stage.name}</h3>
              <p className="service-v1-stage-label">What Nucleus does</p>
              <p>{stage.nucleusDoes}</p>
              <p className="service-v1-stage-label">Deliverable</p>
              <p>{stage.deliverable}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div ref={containerRef} className="service-v1-stages-pinned-host">
      <div className="service-v1-stages-sticky">
        <section className="service-v1-section service-v1-stages">
          <SectionHeader
            eyebrow="§01 / Fundraise"
            title="How Nucleus moves a fundraise from idea to closed round."
          />
          <div
            role="tablist"
            aria-label="Fundraise stages"
            className="service-v1-stages-tablist"
            onKeyDown={handleKey}
          >
            {STAGES.map((stage, index) => (
              <button
                role="tab"
                key={stage.ordinal}
                type="button"
                aria-selected={index === active}
                tabIndex={index === active ? 0 : -1}
                onClick={() => setActive(index)}
                className={`service-v1-stages-tab ${index === active ? 'is-active' : ''}`}
              >
                <span className="service-v1-stage-ordinal">{stage.ordinal}</span>
                <span>{stage.name}</span>
              </button>
            ))}
          </div>
          <motion.div
            role="tabpanel"
            key={STAGES[active].ordinal}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="service-v1-stages-panel"
          >
            <h3>{STAGES[active].name}</h3>
            <p className="service-v1-stage-label">What Nucleus does</p>
            <p>{STAGES[active].nucleusDoes}</p>
            <p className="service-v1-stage-label">Deliverable</p>
            <p>{STAGES[active].deliverable}</p>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
