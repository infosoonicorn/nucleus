'use client';

import Link from 'next/link';
import { useMemo, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import { ArrowRight, ArrowUp, ArrowUpRight } from 'lucide-react';
import { FadeIn, Magnetic, WordReveal } from '@/components/motion-primitives';
import { services } from '@/content/site';

const TRACK_SPRING = { stiffness: 90, damping: 18, mass: 0.6 };
const PARTICLE_COUNT = 22;

// Lifecycle order — maps the 9 practices to the journey the headline names:
// "from incorporation to listing readiness." Slugs are matched against
// services[] so this list stays in sync with site.ts ordering.
const LIFECYCLE_ORDER: string[] = [
  'corporate-secretarial',
  'finance-outsourcing',
  'tax-regulatory',
  'assurance',
  'risk-advisory',
  'valuations',
  'investment-banking',
  'ma-advisory',
  'aif-fund-management',
];

export function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // Cursor parallax — kept, but tuned down for the lighter palette.
  const normX = useMotionValue(0);
  const normY = useMotionValue(0);
  const pointerX = useMotionValue(-9999);
  const pointerY = useMotionValue(-9999);
  const spotlightOpacity = useMotionValue(0);

  const smoothX = useSpring(normX, TRACK_SPRING);
  const smoothY = useSpring(normY, TRACK_SPRING);

  const auroraRedX = useTransform(smoothX, [-1, 1], [-40, 40]);
  const auroraRedY = useTransform(smoothY, [-1, 1], [-26, 26]);
  const auroraNavyX = useTransform(smoothX, [-1, 1], [28, -28]);
  const auroraNavyY = useTransform(smoothY, [-1, 1], [20, -20]);
  const gridShiftX = useTransform(smoothX, [-1, 1], [-8, 8]);
  const gridShiftY = useTransform(smoothY, [-1, 1], [-5, 5]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65, 1], [1, 0.55, 0]);

  function handleMove(event: React.MouseEvent<HTMLElement>) {
    if (reduceMotion) return;
    const node = sectionRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const localX = event.clientX - rect.left;
    const localY = event.clientY - rect.top;
    pointerX.set(localX);
    pointerY.set(localY);
    normX.set((localX / rect.width) * 2 - 1);
    normY.set((localY / rect.height) * 2 - 1);
    spotlightOpacity.set(1);
  }

  function handleLeave() {
    if (reduceMotion) return;
    normX.set(0);
    normY.set(0);
    spotlightOpacity.set(0);
  }

  return (
    <section
      ref={sectionRef}
      className="home-v3-hero home-v3-hero-light home-v3-hero-fullscreen"
      aria-label="Nucleus Advisors lifecycle positioning"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <HeroAtmosphere
        auroraRedX={auroraRedX}
        auroraRedY={auroraRedY}
        auroraNavyX={auroraNavyX}
        auroraNavyY={auroraNavyY}
        gridShiftX={gridShiftX}
        gridShiftY={gridShiftY}
        pointerX={pointerX}
        pointerY={pointerY}
        spotlightOpacity={spotlightOpacity}
      />

      <ParticleStream reduceMotion={!!reduceMotion} />

      <motion.div
        className="home-v3-hero-split"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="home-v3-hero-text">
          <FadeIn duration={0.55}>
            <p className="home-v3-hero-tag home-v3-hero-tag-light">
              <ArrowUp size={14} aria-hidden="true" strokeWidth={2.5} />
              Always upward
            </p>
          </FadeIn>

          <FadeIn duration={0.65} delay={0.15}>
            <p className="home-v3-eyebrow">
              <span aria-hidden="true" />
              Full-spectrum advisory firm
            </p>
          </FadeIn>

          <h1 className="home-v3-headline home-v3-headline-display">
            <span className="home-v3-sr-only">From incorporation to listing readiness.</span>
            <span className="home-v3-headline-row" aria-hidden="true">
              <WordReveal text="From incorporation" />
            </span>
            <span
              className="home-v3-headline-row home-v3-headline-row-em-light"
              aria-hidden="true"
            >
              <WordReveal text="to listing readiness." delay={0.35} />
            </span>
          </h1>

          <FadeIn delay={0.9} duration={0.85}>
            <p className="home-v3-lede">
              Nucleus Advisors helps founders, boards, investors, promoters and finance teams
              move through capital, controls, compliance, reporting and transaction decisions
              with clarity.
            </p>
          </FadeIn>

          <FadeIn delay={1.15} duration={0.7}>
            <div className="home-v3-cta-row">
              <Magnetic strength={0.18}>
                <Link className="home-v3-button home-v3-button-primary" href="/contact">
                  Start a conversation
                  <ArrowRight aria-hidden="true" size={18} />
                </Link>
              </Magnetic>
              <Link className="home-v3-button home-v3-button-ghost" href="/services">
                Explore services
                <ArrowUpRight aria-hidden="true" size={18} />
              </Link>
            </div>
          </FadeIn>
        </div>

        <FadeIn duration={0.9} delay={0.45}>
          <LifecycleLadder reduceMotion={!!reduceMotion} />
        </FadeIn>
      </motion.div>
    </section>
  );
}

// ----- Lifecycle ladder (right column) -----
//
// Visual story for the headline: nine practice icons arrayed along a vertical
// path from "Incorporation" at the top to "Listing readiness" at the bottom.
// A glowing dot travels down the path on a loop, reinforcing the "always
// upward" / always-in-motion brand cue but in the journey direction.
function LifecycleLadder({ reduceMotion }: Readonly<{ reduceMotion: boolean }>) {
  const stops = useMemo(() => {
    return LIFECYCLE_ORDER.map((slug, idx) => {
      const svc = services.find((s) => s.slug === slug);
      if (!svc) return null;
      return {
        slug,
        title: svc.title,
        Icon: svc.icon,
        idx,
      };
    }).filter(Boolean) as Array<{
      slug: string;
      title: string;
      Icon: React.ComponentType<{ size?: number; strokeWidth?: number; 'aria-hidden'?: boolean }>;
      idx: number;
    }>;
  }, []);

  const total = stops.length;

  return (
    <div className="home-v3-ladder" aria-hidden="true">
      <span className="home-v3-ladder-axis" />
      {!reduceMotion ? <span className="home-v3-ladder-traveler" /> : null}

      <span className="home-v3-ladder-stage home-v3-ladder-stage-top">
        <span className="home-v3-ladder-stage-dot" />
        Incorporation
      </span>

      <ul className="home-v3-ladder-list">
        {stops.map((stop, idx) => {
          const Icon = stop.Icon;
          return (
            <li
              key={stop.slug}
              className="home-v3-ladder-stop"
              style={{ animationDelay: `${0.6 + idx * 0.08}s` }}
            >
              <span className="home-v3-ladder-stop-dot">
                <Icon size={14} strokeWidth={2} aria-hidden />
              </span>
              <span className="home-v3-ladder-stop-label">{stop.title}</span>
            </li>
          );
        })}
      </ul>

      <span className="home-v3-ladder-stage home-v3-ladder-stage-bottom">
        <span className="home-v3-ladder-stage-dot home-v3-ladder-stage-dot-end" />
        Listing readiness
      </span>

      <span className="home-v3-sr-only">
        Nine practices across the company lifecycle, from incorporation to listing readiness.
      </span>
      <span style={{ display: 'none' }}>{total}</span>
    </div>
  );
}

// ----- background layers -----

type Particle = {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  rise: number;
  tone: 'red' | 'ink';
};

function ParticleStream({ reduceMotion }: Readonly<{ reduceMotion: boolean }>) {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: PARTICLE_COUNT }).map((_, index) => {
      const seed = (index * 9301 + 49297) % 233280;
      const r = seed / 233280;
      const r2 = ((index * 17) % 13) / 13;
      const r3 = ((index * 31) % 7) / 7;
      const left = 4 + r * 92;
      const size = 1.2 + r2 * 2.2;
      const duration = 6 + r3 * 4;
      const delay = (index / PARTICLE_COUNT) * duration;
      const rise = 580 + r * 180;
      const tone: Particle['tone'] = index % 4 === 0 ? 'red' : 'ink';
      return { id: index, left, size, delay, duration, rise, tone };
    });
  }, []);

  if (reduceMotion) return null;

  return (
    <ul className="home-v3-hero-particles" aria-hidden="true">
      {particles.map((p) => (
        <motion.li
          key={p.id}
          className={`home-v3-hero-particle home-v3-hero-particle-${p.tone}`}
          style={{ left: `${p.left}%`, width: p.size, height: p.size * 1.6 }}
          initial={{ y: 0, opacity: 0 }}
          animate={{
            y: -p.rise,
            opacity: [0, 0.55, 0.55, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeOut',
            times: [0, 0.15, 0.8, 1],
          }}
        />
      ))}
    </ul>
  );
}

type AtmosphereProps = {
  auroraRedX: MotionValue<number>;
  auroraRedY: MotionValue<number>;
  auroraNavyX: MotionValue<number>;
  auroraNavyY: MotionValue<number>;
  gridShiftX: MotionValue<number>;
  gridShiftY: MotionValue<number>;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  spotlightOpacity: MotionValue<number>;
};

function HeroAtmosphere({
  auroraRedX,
  auroraRedY,
  auroraNavyX,
  auroraNavyY,
  gridShiftX,
  gridShiftY,
  pointerX,
  pointerY,
  spotlightOpacity,
}: Readonly<AtmosphereProps>) {
  return (
    <div className="home-v3-hero-atmosphere" aria-hidden="true">
      <motion.div
        className="home-v3-hero-svg-grid"
        style={{ x: gridShiftX, y: gridShiftY }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="hero-grid"
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
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </motion.div>

      <motion.span
        className="home-v3-hero-aurora home-v3-hero-aurora-red"
        style={{ x: auroraRedX, y: auroraRedY }}
      />
      <motion.span
        className="home-v3-hero-aurora home-v3-hero-aurora-navy"
        style={{ x: auroraNavyX, y: auroraNavyY }}
      />

      <motion.span
        className="home-v3-hero-spotlight"
        style={{ x: pointerX, y: pointerY, opacity: spotlightOpacity }}
      />

      <span className="home-v3-hero-corner home-v3-hero-corner-tl" />
      <span className="home-v3-hero-corner home-v3-hero-corner-tr" />
      <span className="home-v3-hero-corner home-v3-hero-corner-bl" />
      <span className="home-v3-hero-corner home-v3-hero-corner-br" />
    </div>
  );
}
