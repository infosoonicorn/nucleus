'use client';

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
import { CheckCircle2, ChevronDown } from 'lucide-react';
import { FadeIn, WordReveal } from '@/components/motion-primitives';
import { SectionHeader } from '@/components/sections';

type WhenToEngageProps = Readonly<{
  ordinal: string;
  moments?: { if: string; then: string }[];
}>;

const GENERIC_BULLETS = [
  'You need a reliable workplan before a transaction, filing, audit or board decision.',
  'Internal teams need specialist support without losing ownership of the outcome.',
  'Documents, data, assumptions and compliance positions need to be decision-ready.',
  'Management needs clear deliverables, issue trackers and next-step visibility.',
];

// Per-pair whileInView triggers the stagger; children of a pair animate
// in sequence once it enters the viewport.
const pairVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export function WhenToEngage({ ordinal, moments }: WhenToEngageProps) {
  const reduceMotion = useReducedMotion();
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        next.add(i);
      }
      return next;
    });
  }

  // Fallback: generic checklist for services without curated IF/THEN scenarios.
  // Other 8 services hit this branch until their content is written.
  if (!moments || moments.length === 0) {
    return (
      <section className="service-v1-section service-v1-section-split">
        <SectionHeader
          eyebrow="When to engage"
          title="For decisions where finance, compliance and execution need to move together."
        />
        <div className="service-v1-checklist">
          {GENERIC_BULLETS.map((item) => (
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

  return (
    <section className="service-v1-section service-v1-when">
      <header className="service-v1-when-header">
        <p className="service-v1-when-eyebrow">
          <span aria-hidden="true" className="service-v1-when-eyebrow-bar" />
          <span>When to engage</span>
        </p>
        <h2 className="service-v1-when-headline">
          The moments where <em>outside judgement</em> earns its keep.
        </h2>
      </header>
      <dl className="service-v1-when-list" aria-label="When to engage Nucleus">
        {moments.map((m, i) => {
          const isOpen = openIndices.has(i);
          const thenId = `when-then-${ordinal}-${i}`;
          return (
            <motion.div
              key={m.if}
              className={`service-v1-when-pair ${isOpen ? 'is-open' : ''}`}
              variants={pairVariants}
              initial={reduceMotion ? false : 'hidden'}
              whileInView={reduceMotion ? undefined : 'visible'}
              viewport={{ once: true, margin: '-80px' }}
            >
              <dt>
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={thenId}
                  className="service-v1-when-if"
                >
                  <span className="service-v1-when-chip service-v1-when-chip-if">
                    <span className="service-v1-when-ordinal">
                      ●{String(i + 1).padStart(2, '0')}
                    </span>
                    IF
                  </span>
                  <p>
                    {reduceMotion ? (
                      m.if
                    ) : (
                      <span aria-hidden="true">
                        <WordReveal text={m.if} />
                      </span>
                    )}
                    {reduceMotion ? null : <span className="service-v1-sr-only">{m.if}</span>}
                  </p>
                  <ChevronDown
                    aria-hidden="true"
                    size={18}
                    className="service-v1-when-chev"
                  />
                </button>
              </dt>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.dd
                    id={thenId}
                    className="service-v1-when-then"
                    initial={reduceMotion ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={reduceMotion ? { opacity: 1, height: 'auto' } : { opacity: 0, height: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div className="service-v1-when-then-inner">
                      <span className="service-v1-when-chip service-v1-when-chip-then">THEN</span>
                      <p>{m.then}</p>
                    </div>
                  </motion.dd>
                ) : null}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </dl>
    </section>
  );
}
