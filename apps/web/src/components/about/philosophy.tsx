'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';

type Word = { text: string; key?: boolean };

const QUOTE_WORDS: Word[] = [
  { text: 'We' },
  { text: 'don’t' },
  { text: 'put' },
  { text: 'a' },
  { text: 'generalist' },
  { text: 'on' },
  { text: 'a' },
  { text: 'specialist’s', key: true },
  { text: 'work.' },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const quoteVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.15 } },
};

const wordVariants: Variants = {
  hidden: { opacity: 0, y: '0.55em', filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export function AboutPhilosophy() {
  const reduceMotion = useReducedMotion();
  const initialState = reduceMotion ? 'visible' : 'hidden';

  return (
    <section className="about-philosophy" aria-label="How Nucleus runs mandates">
      <motion.div
        className="about-philosophy-inner"
        variants={containerVariants}
        initial={initialState}
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <motion.span
          className="about-philosophy-mark"
          aria-hidden="true"
          variants={fadeUp}
        >
          &ldquo;
        </motion.span>
        <motion.span
          className="about-philosophy-rule"
          aria-hidden="true"
          variants={fadeUp}
        />
        <motion.p className="about-philosophy-eyebrow" variants={fadeUp}>
          Philosophy
        </motion.p>
        <motion.p
          className="about-philosophy-quote"
          variants={quoteVariants}
        >
          {QUOTE_WORDS.map((w, i) => (
            <motion.span
              key={i}
              className={`about-philosophy-quote-word${w.key ? ' is-key' : ''}`}
              variants={wordVariants}
            >
              {w.text}
              {i < QUOTE_WORDS.length - 1 ? ' ' : ''}
            </motion.span>
          ))}
        </motion.p>
        <motion.p className="about-philosophy-body" variants={fadeUp}>
          Each discipline at Nucleus has its own partner. The audit partner
          runs your audit. The tax partner runs your tax. The deal partner
          runs your raise. What changes at Nucleus is that they coordinate
          &mdash; the audit partner reads the deal memo, the tax partner sits
          in the diligence call, the fundraise gets built on a clean
          compliance base. The right partner for the work, every time.
        </motion.p>
      </motion.div>
    </section>
  );
}
