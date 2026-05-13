'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';
import { site } from '@/content/site';
import { Magnetic, Reveal } from '@/components/motion-primitives';

const decisionPrompts = [
  'a fundraise',
  'an acquisition',
  'an audit',
  'a valuation',
  'an IFC review',
  'an AIF setup',
];

const ROTATOR_INTERVAL_MS = 2400;

export function HomeClosingCta() {
  const reduceMotion = useReducedMotion();
  const [promptIndex, setPromptIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const timer = setInterval(() => {
      setPromptIndex((i) => (i + 1) % decisionPrompts.length);
    }, ROTATOR_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [reduceMotion]);

  return (
    <section className="home-v3-closing" aria-label="Contact Nucleus Advisors">
      <ClosingBackdrop reduceMotion={!!reduceMotion} />

      <Reveal className="home-v3-closing-inner">
        <span className="home-v3-section-eyebrow home-v3-section-eyebrow-light">
          Start the conversation
        </span>
        <h2 className="home-v3-closing-headline">
          <span className="home-v3-closing-headline-row">When the decision is</span>
          <span className="home-v3-closing-rotator-row">
            <span className="home-v3-closing-rotator" aria-live="polite">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={promptIndex}
                  className="home-v3-closing-rotator-word"
                  initial={{ y: '110%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  exit={{ y: '-110%', opacity: 0 }}
                  transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                >
                  {decisionPrompts[promptIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </span>
          <span className="home-v3-closing-headline-row">
            bring it to a partner who has seen it before.
          </span>
        </h2>
        <p>
          One brief, one practitioner, one workplan. Tell us what you are working through and a
          partner will respond within one working day.
        </p>
        <div className="home-v3-closing-actions">
          <Magnetic strength={0.24}>
            <Link className="home-v3-button home-v3-button-primary home-v3-closing-cta" href="/contact">
              <span className="home-v3-closing-cta-label">Start a conversation</span>
              <ArrowRight aria-hidden="true" size={18} className="home-v3-closing-cta-arrow" />
              <span className="home-v3-closing-cta-shine" aria-hidden="true" />
              <span className="home-v3-closing-cta-pulse" aria-hidden="true" />
            </Link>
          </Magnetic>
          <a className="home-v3-button home-v3-button-ghost-light" href={`mailto:${site.email}`}>
            <Mail aria-hidden="true" size={18} />
            {site.email}
          </a>
        </div>

        <ClosingFootBar />
      </Reveal>
    </section>
  );
}

function ClosingBackdrop({ reduceMotion }: Readonly<{ reduceMotion: boolean }>) {
  return (
    <div className="home-v3-closing-backdrop" aria-hidden="true">
      <span className="home-v3-closing-grid" />
      <motion.span
        className="home-v3-closing-blob home-v3-closing-blob-red"
        animate={
          reduceMotion
            ? undefined
            : {
                x: [-30, 30, -30],
                y: [-20, 10, -20],
                scale: [1, 1.05, 1],
              }
        }
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        className="home-v3-closing-blob home-v3-closing-blob-blue"
        animate={
          reduceMotion
            ? undefined
            : {
                x: [20, -10, 20],
                y: [10, -25, 10],
                scale: [1, 1.08, 1],
              }
        }
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        className="home-v3-closing-blob home-v3-closing-blob-cream"
        animate={
          reduceMotion
            ? undefined
            : {
                x: [-15, 25, -15],
                y: [15, -5, 15],
              }
        }
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span className="home-v3-closing-vignette" />
    </div>
  );
}

function ClosingFootBar() {
  return (
    <ul className="home-v3-closing-footbar" aria-label="At a glance">
      <li>
        <span>Offices</span>
        <strong>{site.locations.length} cities</strong>
      </li>
      <li>
        <span>Reply window</span>
        <strong>Within 1 working day</strong>
      </li>
      <li>
        <span>Engagement style</span>
        <strong>Partner-led, written</strong>
      </li>
    </ul>
  );
}
