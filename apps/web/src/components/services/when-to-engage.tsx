'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
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

const PAIR_STAGGER = 0.18;

const pairVariants: Variants = {
  hidden: {},
  visible: (i: number) => ({
    transition: { delayChildren: i * PAIR_STAGGER, staggerChildren: 0.12 },
  }),
};

const thenVariants: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export function WhenToEngage({ ordinal, moments }: WhenToEngageProps) {
  const reduceMotion = useReducedMotion();

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
      <SectionHeader
        eyebrow={`§${ordinal} / When to engage`}
        title="The moments where outside judgement earns its keep."
        text="Four scenarios where founders and boards bring us in."
      />
      <dl className="service-v1-when-list" aria-label="When to engage Nucleus">
        {moments.map((m, i) => (
          <motion.div
            key={m.if}
            className="service-v1-when-pair"
            custom={i}
            variants={pairVariants}
            initial={reduceMotion ? false : 'hidden'}
            whileInView={reduceMotion ? undefined : 'visible'}
            viewport={{ once: true, margin: '-80px' }}
          >
            <dt className="service-v1-when-if">
              <span className="service-v1-when-chip service-v1-when-chip-if">
                <span className="service-v1-when-ordinal">
                  §{String(i + 1).padStart(2, '0')}
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
            </dt>
            <motion.dd
              className="service-v1-when-then"
              variants={reduceMotion ? undefined : thenVariants}
            >
              <span className="service-v1-when-chip service-v1-when-chip-then">THEN</span>
              <p>{m.then}</p>
            </motion.dd>
          </motion.div>
        ))}
      </dl>
    </section>
  );
}
