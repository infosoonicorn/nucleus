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

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.11, delayChildren: 0.05 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const rule: Variants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

const quoteContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.12 } },
};

const word: Variants = {
  hidden: { opacity: 0, y: '0.55em', filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export function AboutIntro() {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? 'visible' : 'hidden';

  return (
    <section className="about-intro" aria-label="About Nucleus Advisors">
      <motion.div
        className="about-intro-inner"
        variants={container}
        initial={initial}
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
      >
        <motion.p className="home-v3-section-eyebrow about-intro-eyebrow" variants={item}>
          About
        </motion.p>

        <motion.h1 className="about-intro-headline" variants={item}>
          We&rsquo;re built for the decisions that <em>matter</em>.
        </motion.h1>

        <motion.p className="about-intro-lede" variants={item}>
          A senior-led firm covering audit, tax, transactions and advisory.
          We work with founders before the round, with boards through the
          listing, and with families across generations.
        </motion.p>

        <motion.span
          className="about-intro-divider-rule"
          aria-hidden="true"
          variants={rule}
        />

        <motion.p className="home-v3-section-eyebrow about-intro-eyebrow" variants={item}>
          Our philosophy
        </motion.p>

        <motion.p className="about-intro-quote" variants={quoteContainer}>
          {QUOTE_WORDS.map((w, i) => (
            <motion.span
              key={i}
              className={`about-intro-quote-word${w.key ? ' is-key' : ''}`}
              variants={word}
            >
              {w.text}
              {i < QUOTE_WORDS.length - 1 ? ' ' : ''}
            </motion.span>
          ))}
        </motion.p>

        <motion.p className="about-intro-body" variants={item}>
          Each discipline has its own partner &mdash; audit, tax, transactions,
          advisory. What changes at Nucleus is that they coordinate: the audit
          partner reads the deal memo, the tax partner sits in the diligence
          call, the fundraise gets built on a clean compliance base.
        </motion.p>

        <motion.p className="about-intro-established" variants={item}>
          Established 2019 &middot; Headquartered in Gurugram, with offices across India.
        </motion.p>
      </motion.div>
    </section>
  );
}
