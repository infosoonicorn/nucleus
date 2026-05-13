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
import { ArrowRight, ArrowUp, ArrowUpRight, ChevronDown } from 'lucide-react';
import { FadeIn, Magnetic, WordReveal } from '@/components/motion-primitives';

const TRACK_SPRING = { stiffness: 90, damping: 18, mass: 0.6 };
const PARTICLE_COUNT = 28;

export function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  // Cursor parallax (atmosphere layers)
  const normX = useMotionValue(0);
  const normY = useMotionValue(0);
  const pointerX = useMotionValue(-9999);
  const pointerY = useMotionValue(-9999);
  const spotlightOpacity = useMotionValue(0);

  const smoothX = useSpring(normX, TRACK_SPRING);
  const smoothY = useSpring(normY, TRACK_SPRING);

  const auroraRedX = useTransform(smoothX, [-1, 1], [-60, 60]);
  const auroraRedY = useTransform(smoothY, [-1, 1], [-40, 40]);
  const auroraNavyX = useTransform(smoothX, [-1, 1], [40, -40]);
  const auroraNavyY = useTransform(smoothY, [-1, 1], [30, -30]);
  const gridShiftX = useTransform(smoothX, [-1, 1], [-10, 10]);
  const gridShiftY = useTransform(smoothY, [-1, 1], [-6, 6]);

  // Scroll-driven exit — content lifts + fades; auroras drift further as user
  // scrolls out, creating a "tunneling into the next section" feel.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const contentScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.5, 0]);
  const shapesY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

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
      className="home-v3-hero home-v3-hero-dark home-v3-hero-fullscreen"
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

      <ElegantShapes reduceMotion={!!reduceMotion} shapesY={shapesY} />
      <ParticleStream reduceMotion={!!reduceMotion} />

      <motion.div
        className="home-v3-hero-stage"
        style={{ y: contentY, scale: contentScale, opacity: contentOpacity }}
      >
        <FadeIn duration={0.55}>
          <p className="home-v3-hero-tag">
            <ArrowUp size={14} aria-hidden="true" strokeWidth={2.5} />
            Always upward
          </p>
        </FadeIn>

        <FadeIn duration={0.65} delay={0.18}>
          <p className="home-v3-eyebrow home-v3-eyebrow-on-dark">
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

        <FadeIn delay={0.95} duration={0.9}>
          <p className="home-v3-lede home-v3-lede-on-dark">
            Nucleus Advisors helps founders, boards, investors, promoters and finance teams
            move through capital, controls, compliance, reporting and transaction decisions
            with clarity.
          </p>
        </FadeIn>

        <FadeIn delay={1.2} duration={0.7}>
          <div className="home-v3-cta-row home-v3-hero-cta-row">
            <Magnetic strength={0.18}>
              <Link className="home-v3-button home-v3-button-primary" href="/contact">
                Start a conversation
                <ArrowRight aria-hidden="true" size={18} />
              </Link>
            </Magnetic>
            <Link className="home-v3-button home-v3-button-ghost-light" href="/services">
              Explore services
              <ArrowUpRight aria-hidden="true" size={18} />
            </Link>
          </div>
        </FadeIn>
      </motion.div>

      <ScrollCue opacity={cueOpacity} reduceMotion={!!reduceMotion} />
    </section>
  );
}

// ----- background layers -----

function ElegantShapes({
  reduceMotion,
  shapesY,
}: Readonly<{ reduceMotion: boolean; shapesY: MotionValue<number> }>) {
  // Five rotated capsule shapes drift gently, layered behind content. Each
  // shape bobs on its own loop; the whole group also parallaxes on scroll.
  const shapes = [
    { className: 'home-v3-hero-shape-1', range: [-14, 18], rotate: 12, duration: 13 },
    { className: 'home-v3-hero-shape-2', range: [16, -10], rotate: -15, duration: 11 },
    { className: 'home-v3-hero-shape-3', range: [-10, 14], rotate: -8, duration: 14 },
    { className: 'home-v3-hero-shape-4', range: [12, -8], rotate: 20, duration: 9 },
    { className: 'home-v3-hero-shape-5', range: [-8, 12], rotate: -22, duration: 10 },
  ];

  return (
    <motion.div
      className="home-v3-hero-shapes"
      style={{ y: shapesY }}
      aria-hidden="true"
    >
      {shapes.map((shape) => (
        <motion.span
          key={shape.className}
          className={`home-v3-hero-shape ${shape.className}`}
          initial={reduceMotion ? undefined : { opacity: 0, y: -120, rotate: shape.rotate - 12 }}
          animate={
            reduceMotion
              ? { opacity: 0.7 }
              : {
                  opacity: 0.85,
                  rotate: shape.rotate,
                  y: shape.range,
                }
          }
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  opacity: { duration: 1.6, ease: [0.22, 1, 0.36, 1] },
                  rotate: { duration: 1.6, ease: [0.22, 1, 0.36, 1] },
                  y: {
                    duration: shape.duration,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: 1.4,
                  },
                }
          }
        />
      ))}
    </motion.div>
  );
}

type Particle = {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  rise: number;
  tone: 'red' | 'cream';
};

function ParticleStream({ reduceMotion }: Readonly<{ reduceMotion: boolean }>) {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: PARTICLE_COUNT }).map((_, index) => {
      const seed = (index * 9301 + 49297) % 233280;
      const r = seed / 233280;
      const r2 = ((index * 17) % 13) / 13;
      const r3 = ((index * 31) % 7) / 7;
      // Spread across the full hero width
      const left = 4 + r * 92;
      const size = 1.4 + r2 * 2.8;
      const duration = 5 + r3 * 4;
      const delay = (index / PARTICLE_COUNT) * duration;
      // Particles rise nearly the full hero height
      const rise = 620 + r * 160;
      const tone: Particle['tone'] = index % 5 === 0 ? 'red' : 'cream';
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
            opacity: [0, 0.75, 0.75, 0],
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

function ScrollCue({
  opacity,
  reduceMotion,
}: Readonly<{ opacity: MotionValue<number>; reduceMotion: boolean }>) {
  return (
    <motion.div
      className="home-v3-hero-scrollcue"
      style={{ opacity }}
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 0.65 }}
      transition={{ duration: 0.7, delay: 1.9, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden="true"
    >
      <motion.span
        className="home-v3-hero-scrollcue-chev"
        animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown size={20} strokeWidth={2.2} aria-hidden="true" />
      </motion.span>
      <span>Scroll to see how we organise</span>
    </motion.div>
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
