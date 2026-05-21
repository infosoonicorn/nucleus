'use client';

import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { ChevronLeft, ChevronRight, Compass, Quote } from 'lucide-react';
import { decisiveMoments, proof, type ProofPoint } from '@/content/site';
import { FadeIn, WordReveal } from '@/components/motion-primitives';

// Stats — pulled from proof[] so headcount/deal numbers stay in sync with
// the rest of the site. Order picked for narrative impact (people first,
// then reach, then experience).
const STAT_SLUGS: Array<ProofPoint['slug']> = [
  'partners',
  'team',
  'clients',
  'deals',
  'offices',
  'experience',
];

const STAT_BLURBS: Record<ProofPoint['slug'], string> = {
  partners: 'Senior partners — every mandate has one accountable.',
  team: 'Specialists across audit, tax, transactions, advisory.',
  clients: 'Founders, boards, investors and families served.',
  deals: 'M&A, fundraises and restructurings closed.',
  offices: 'Cities across India — Gurugram, Mumbai, Bangalore and more.',
  experience: 'Combined partner experience on the bench.',
};

// Firm milestone timeline — placeholder dates flagged for partner review.
// IMPORTANT: dates 2020/2022/2024 below are PLACEHOLDERS and must be
// confirmed by Vijay or a partner before this section ships to a wider
// audience. The 2019 founding date and the 2026 "today" datapoint are
// confirmed (see CLAUDE.md and content/site.ts).
const QUOTE_WORDS: Array<{ text: string; key?: boolean }> = [
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

const ROTATE_INTERVAL_MS = 5400;

export function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const normX = useMotionValue(0);
  const normY = useMotionValue(0);
  const smoothX = useSpring(normX, { stiffness: 80, damping: 18, mass: 0.6 });
  const smoothY = useSpring(normY, { stiffness: 80, damping: 18, mass: 0.6 });
  const auroraRedX = useTransform(smoothX, [-1, 1], [-30, 30]);
  const auroraRedY = useTransform(smoothY, [-1, 1], [-20, 20]);
  const auroraNavyX = useTransform(smoothX, [-1, 1], [22, -22]);
  const auroraNavyY = useTransform(smoothY, [-1, 1], [16, -16]);
  const gridX = useTransform(smoothX, [-1, 1], [-6, 6]);
  const gridY = useTransform(smoothY, [-1, 1], [-4, 4]);

  function handleMove(event: React.MouseEvent<HTMLElement>) {
    if (reduceMotion) return;
    const node = sectionRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;
    normX.set((localX / rect.width) * 2 - 1);
    normY.set((localY / rect.height) * 2 - 1);
  }
  function handleLeave() {
    if (reduceMotion) return;
    normX.set(0);
    normY.set(0);
  }

  return (
    <section
      ref={sectionRef}
      className="about-hero"
      aria-label="About Nucleus Advisors"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <AboutAtmosphere
        auroraRedX={auroraRedX}
        auroraRedY={auroraRedY}
        auroraNavyX={auroraNavyX}
        auroraNavyY={auroraNavyY}
        gridX={gridX}
        gridY={gridY}
      />

      <div className="about-hero-stage">
        <FadeIn duration={0.55}>
          <p className="about-hero-tag">
            <span className="about-hero-tag-dot" aria-hidden="true" />
            About Nucleus &middot; Established 2019
          </p>
        </FadeIn>

        <h1 className="about-hero-headline">
          <span className="home-v3-sr-only">
            Built for the decisions that matter.
          </span>
          <span className="about-hero-headline-row" aria-hidden="true">
            <WordReveal text="Built for the decisions" />
          </span>
          <span
            className="about-hero-headline-row about-hero-headline-row-em"
            aria-hidden="true"
          >
            <WordReveal text="that matter." delay={0.35} />
          </span>
        </h1>

        <FadeIn delay={0.9} duration={0.8}>
          <p className="about-hero-lede">
            A senior-led firm covering audit, tax, transactions and advisory.
            We work with founders before the round, with boards through the
            listing, and with families across generations &mdash; coordinated
            across nine practices, not handed off between them.
          </p>
        </FadeIn>

        <StatsGrid reduceMotion={!!reduceMotion} />
      </div>

    </section>
  );
}

// Philosophy and DecisionMoments are exported as standalone sections so the
// About page can sequence them around the AboutJourney block. Each is wrapped
// in its own <section> with a light cream background that matches the hero
// palette, so they read as a continuous flow when placed in order.

export function AboutPhilosophy() {
  return (
    <section className="about-aftermath" aria-label="Our philosophy">
      <Philosophy />
    </section>
  );
}

export function AboutMoments() {
  return (
    <section className="about-aftermath" aria-label="Decision moments">
      <DecisionMoments />
    </section>
  );
}

// ----- atmosphere (matches the home hero treatment for visual continuity) -----

type AtmosphereProps = {
  auroraRedX: MotionValue<number>;
  auroraRedY: MotionValue<number>;
  auroraNavyX: MotionValue<number>;
  auroraNavyY: MotionValue<number>;
  gridX: MotionValue<number>;
  gridY: MotionValue<number>;
};

function AboutAtmosphere({
  auroraRedX,
  auroraRedY,
  auroraNavyX,
  auroraNavyY,
  gridX,
  gridY,
}: Readonly<AtmosphereProps>) {
  return (
    <div className="about-hero-atmosphere" aria-hidden="true">
      <motion.div className="about-hero-grid" style={{ x: gridX, y: gridY }}>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="about-grid"
              width="56"
              height="56"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 56 0 L 0 0 0 56"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeDasharray="2 3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#about-grid)" />
        </svg>
      </motion.div>
      <motion.span
        className="about-hero-aurora about-hero-aurora-red"
        style={{ x: auroraRedX, y: auroraRedY }}
      />
      <motion.span
        className="about-hero-aurora about-hero-aurora-navy"
        style={{ x: auroraNavyX, y: auroraNavyY }}
      />
    </div>
  );
}

// ----- animated stat counters (count up on enter view) -----

function StatsGrid({ reduceMotion }: Readonly<{ reduceMotion: boolean }>) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className="about-hero-stats">
      {STAT_SLUGS.map((slug, idx) => {
        const stat = proof.find((p) => p.slug === slug);
        if (!stat) return null;
        return (
          <article
            key={slug}
            className="about-hero-stat"
            style={{
              transitionDelay: `${idx * 60}ms`,
              opacity: inView ? 1 : 0,
              transform: inView ? 'translateY(0)' : 'translateY(14px)',
            }}
          >
            <p className="about-hero-stat-value">
              <CountUp
                end={stat.value}
                run={inView}
                reduceMotion={reduceMotion}
              />
              <span className="about-hero-stat-suffix">{stat.suffix}</span>
            </p>
            <p className="about-hero-stat-label">{stat.label}</p>
            <p className="about-hero-stat-blurb">{STAT_BLURBS[slug]}</p>
          </article>
        );
      })}
    </div>
  );
}

function CountUp({
  end,
  run,
  reduceMotion,
}: Readonly<{ end: number; run: boolean; reduceMotion: boolean }>) {
  const [display, setDisplay] = useState(reduceMotion ? end : 0);
  const mv = useMotionValue(reduceMotion ? end : 0);

  useEffect(() => {
    if (!run || reduceMotion) {
      if (reduceMotion) setDisplay(end);
      return;
    }
    const controls = animate(mv, end, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    });
    return () => controls.stop();
  }, [run, end, reduceMotion, mv]);

  return <span className="tabular-nums">{display}</span>;
}

// ----- philosophy quote -----

function Philosophy() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <div ref={ref} className="about-hero-philosophy">
      <span className="about-hero-philosophy-mark" aria-hidden="true">
        <Quote size={36} strokeWidth={1.6} />
      </span>
      <p className="about-hero-philosophy-eyebrow">Our philosophy</p>
      <p className="about-hero-philosophy-quote">
        {QUOTE_WORDS.map((w, i) => (
          <motion.span
            key={i}
            className={`about-hero-philosophy-word${w.key ? ' is-key' : ''}`}
            initial={{ opacity: 0, y: '0.5em', filter: 'blur(4px)' }}
            animate={
              inView
                ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                : { opacity: 0, y: '0.5em', filter: 'blur(4px)' }
            }
            transition={{
              duration: 0.55,
              delay: 0.1 + i * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {w.text}
            {i < QUOTE_WORDS.length - 1 ? ' ' : ''}
          </motion.span>
        ))}
      </p>
      <p className="about-hero-philosophy-body">
        Each discipline has its own partner &mdash; audit, tax, transactions,
        advisory. What changes at Nucleus is that they coordinate: the audit
        partner reads the deal memo, the tax partner sits in the diligence
        call, the fundraise gets built on a clean compliance base.
      </p>
    </div>
  );
}

// ----- decisive moments rotator (kept but restyled to fit the cinematic flow) -----

function DecisionMoments() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const total = decisiveMoments.length;
  const current = decisiveMoments[index] ?? '';
  const words = current.split(' ');
  const active = inView && !paused;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!active) return;
    timerRef.current = setInterval(() => {
      setIndex((p) => (p + 1) % total);
    }, ROTATE_INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [active, total]);

  function pauseBriefly() {
    setPaused(true);
    setTimeout(() => setPaused(false), 9000);
  }
  function goPrev() {
    setIndex((p) => (p - 1 + total) % total);
    pauseBriefly();
  }
  function goNext() {
    setIndex((p) => (p + 1) % total);
    pauseBriefly();
  }
  function goTo(target: number) {
    setIndex(target);
    pauseBriefly();
  }

  return (
    <div
      ref={ref}
      className="about-hero-moments"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <FadeIn>
        <header className="about-hero-moments-header">
          <span className="home-v3-section-eyebrow">When clients engage</span>
          <h2>The decision moments where Nucleus becomes useful.</h2>
        </header>
      </FadeIn>

      <div className="about-hero-moments-stage" aria-live="polite">
        <span className="about-hero-moments-counter">
          <Compass aria-hidden="true" size={14} />
          {String(index + 1).padStart(2, '0')}
          <span aria-hidden="true">/</span>
          {String(total).padStart(2, '0')}
        </span>

        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={index}
            className="about-hero-moments-display"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {words.map((w, wi) => (
              <motion.span
                key={`${index}-${wi}`}
                initial={{ y: '105%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                  delay: wi * 0.05,
                }}
                className="about-hero-moments-word"
              >
                {w}
                {wi < words.length - 1 ? ' ' : ''}
              </motion.span>
            ))}
          </motion.p>
        </AnimatePresence>

        <div className="about-hero-moments-progress" aria-hidden="true">
          <motion.span
            key={`progress-${index}-${active}`}
            className="about-hero-moments-progress-fill"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: active ? 1 : 0 }}
            transition={{
              duration: active ? ROTATE_INTERVAL_MS / 1000 : 0,
              ease: 'linear',
            }}
            style={{ transformOrigin: '0% 50%' }}
          />
        </div>

        <div className="about-hero-moments-nav">
          <button
            type="button"
            className="about-hero-moments-arrow"
            onClick={goPrev}
            aria-label="Previous decision moment"
          >
            <ChevronLeft aria-hidden="true" size={18} />
          </button>
          <button
            type="button"
            className="about-hero-moments-arrow"
            onClick={goNext}
            aria-label="Next decision moment"
          >
            <ChevronRight aria-hidden="true" size={18} />
          </button>
        </div>
      </div>

      <ul className="about-hero-moments-rail" role="tablist" aria-label="Decision moments">
        {decisiveMoments.map((m, i) => (
          <li key={m}>
            <button
              type="button"
              role="tab"
              aria-selected={i === index}
              className={`about-hero-moments-pill${i === index ? ' is-active' : ''}`}
              onClick={() => goTo(i)}
            >
              <span className="about-hero-moments-pill-index" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="about-hero-moments-pill-text">
                {firstWords(m, 4)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function firstWords(text: string, count: number) {
  const parts = text.split(' ');
  const head = parts.slice(0, count).join(' ');
  return parts.length > count ? `${head.replace(/[.,]$/, '')}…` : head;
}
