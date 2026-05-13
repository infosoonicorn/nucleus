'use client';

import Link from 'next/link';
import { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  FileCheck2,
  Landmark,
  LineChart,
  ShieldCheck,
} from 'lucide-react';
import { FadeIn, Magnetic, Reveal, WordReveal } from '@/components/motion-primitives';
import { LottieSlot } from '@/components/lottie-slot';

const coverage = [
  { label: 'Transactions', icon: Landmark, line: 'Capital, M&A, restructuring' },
  { label: 'Controls', icon: ShieldCheck, line: 'IFC, internal audit, risk' },
  { label: 'Valuations', icon: LineChart, line: 'ESOP, FDI, transaction' },
  { label: 'Reporting', icon: FileCheck2, line: 'Assurance, Ind AS, MIS' },
];

const flow = ['Incorporate', 'Operate', 'Raise', 'Control', 'Transact', 'Report'];

const TRACK_SPRING = { stiffness: 90, damping: 18, mass: 0.6 };

export function HomeHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Normalized cursor (-1..1) within the hero section
  const normX = useMotionValue(0);
  const normY = useMotionValue(0);
  // Raw pixel cursor for the section-level spotlight
  const pointerX = useMotionValue(-9999);
  const pointerY = useMotionValue(-9999);
  // Raw pixel cursor relative to the canvas for its inner spotlight
  const canvasPointerX = useMotionValue(-9999);
  const canvasPointerY = useMotionValue(-9999);
  // Spotlight visibility
  const spotlightOpacity = useMotionValue(0);
  const canvasSpotlightOpacity = useMotionValue(0);

  // Spring smoothing for parallax + tilt
  const smoothX = useSpring(normX, TRACK_SPRING);
  const smoothY = useSpring(normY, TRACK_SPRING);

  // Layer translations + tilt mappings
  const auroraRedX = useTransform(smoothX, [-1, 1], [-50, 50]);
  const auroraRedY = useTransform(smoothY, [-1, 1], [-30, 30]);
  const auroraNavyX = useTransform(smoothX, [-1, 1], [40, -40]);
  const auroraNavyY = useTransform(smoothY, [-1, 1], [30, -30]);
  const gridShiftX = useTransform(smoothX, [-1, 1], [-12, 12]);
  const gridShiftY = useTransform(smoothY, [-1, 1], [-8, 8]);
  const copyX = useTransform(smoothX, [-1, 1], [-8, 8]);
  const copyY = useTransform(smoothY, [-1, 1], [-6, 6]);
  const flowX = useTransform(smoothX, [-1, 1], [-12, 12]);
  const canvasRotateY = useTransform(smoothX, [-1, 1], [-10, 10]);
  const canvasRotateX = useTransform(smoothY, [-1, 1], [7, -7]);

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

    const canvas = canvasRef.current;
    if (canvas) {
      const cRect = canvas.getBoundingClientRect();
      const cx = event.clientX - cRect.left;
      const cy = event.clientY - cRect.top;
      canvasPointerX.set(cx);
      canvasPointerY.set(cy);
      const inside =
        cx >= 0 && cx <= cRect.width && cy >= 0 && cy <= cRect.height;
      canvasSpotlightOpacity.set(inside ? 1 : 0);
    }
  }

  function handleLeave() {
    if (reduceMotion) return;
    normX.set(0);
    normY.set(0);
    spotlightOpacity.set(0);
    canvasSpotlightOpacity.set(0);
  }

  return (
    <section
      ref={sectionRef}
      className="home-v3-hero"
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

      <div className="home-v3-hero-grid">
        <motion.div
          className="home-v3-hero-copy"
          style={{ x: copyX, y: copyY }}
        >
          <FadeIn duration={0.7}>
            <p className="home-v3-eyebrow">
              <span aria-hidden="true" />
              Full-spectrum advisory firm
            </p>
          </FadeIn>

          <h1 className="home-v3-headline">
            <span className="home-v3-sr-only">From incorporation to listing readiness.</span>
            <span className="home-v3-headline-row" aria-hidden="true">
              <WordReveal text="From incorporation" />
            </span>
            <span
              className="home-v3-headline-row home-v3-headline-row-em"
              aria-hidden="true"
            >
              <WordReveal text="to listing readiness." delay={0.35} />
            </span>
          </h1>

          <FadeIn delay={0.95} duration={0.9}>
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

          <Reveal delay={1.35} y={20}>
            <motion.div
              className="home-v3-hero-flow"
              role="list"
              aria-label="Lifecycle stages"
              style={{ x: flowX }}
            >
              {flow.map((step, index) => (
                <span key={step} role="listitem" style={{ animationDelay: `${index * 140}ms` }}>
                  <em aria-hidden="true">{String(index + 1).padStart(2, '0')}</em>
                  {step}
                </span>
              ))}
            </motion.div>
          </Reveal>
        </motion.div>

        <motion.div
          ref={canvasRef}
          className="home-v3-hero-canvas-wrap"
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
          style={{
            rotateX: canvasRotateX,
            rotateY: canvasRotateY,
            transformPerspective: 1200,
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="home-v3-canvas-shell">
            <motion.div
              className="home-v3-canvas-spotlight"
              style={{
                x: canvasPointerX,
                y: canvasPointerY,
                opacity: canvasSpotlightOpacity,
              }}
              aria-hidden="true"
            />
            <div className="home-v3-canvas-frame" aria-hidden="true">
              <LottieSlot
                src="/lottie/nucleus-hero.json"
                className="home-v3-canvas-lottie"
                ariaLabel="Nucleus advisory motion accent"
              />
            </div>
            <header className="home-v3-canvas-header">
              <span>Advisory coverage</span>
              <strong>Setup → Scale → Listing</strong>
            </header>
            <ul className="home-v3-canvas-grid">
              {coverage.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.li
                    key={item.label}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      ease: [0.22, 1, 0.36, 1],
                      delay: 0.6 + index * 0.08,
                    }}
                    style={{ transform: `translateZ(${24 + index * 4}px)` }}
                  >
                    <span className="home-v3-canvas-icon">
                      <Icon aria-hidden="true" size={18} />
                    </span>
                    <div>
                      <strong>{item.label}</strong>
                      <em>{item.line}</em>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
            <footer className="home-v3-canvas-footer">
              <span className="home-v3-canvas-pulse" aria-hidden="true" />
              Live across 5 offices · 9 service lines
            </footer>
          </div>
        </motion.div>
      </div>
    </section>
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
