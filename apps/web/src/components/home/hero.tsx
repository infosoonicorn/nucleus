'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, FileCheck2, Landmark, LineChart, ShieldCheck } from 'lucide-react';
import { FadeIn, Magnetic, Reveal, WordReveal } from '@/components/motion-primitives';
import { LottieSlot } from '@/components/lottie-slot';

const coverage = [
  { label: 'Transactions', icon: Landmark, line: 'Capital, M&A, restructuring' },
  { label: 'Controls', icon: ShieldCheck, line: 'IFC, internal audit, risk' },
  { label: 'Valuations', icon: LineChart, line: 'ESOP, FDI, transaction' },
  { label: 'Reporting', icon: FileCheck2, line: 'Assurance, Ind AS, MIS' },
];

const flow = ['Incorporate', 'Operate', 'Raise', 'Control', 'Transact', 'Report'];

export function HomeHero() {
  return (
    <section className="home-v3-hero" aria-label="Nucleus Advisors lifecycle positioning">
      <div className="home-v3-hero-glow" aria-hidden="true" />
      <div className="home-v3-hero-grid">
        <div className="home-v3-hero-copy">
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
            <span className="home-v3-headline-row home-v3-headline-row-em" aria-hidden="true">
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
            <div className="home-v3-hero-flow" role="list" aria-label="Lifecycle stages">
              {flow.map((step, index) => (
                <span key={step} role="listitem" style={{ animationDelay: `${index * 140}ms` }}>
                  <em aria-hidden="true">{String(index + 1).padStart(2, '0')}</em>
                  {step}
                </span>
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.4} y={36} className="home-v3-hero-canvas">
          <div className="home-v3-canvas-shell">
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
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.6 + index * 0.08 }}
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
        </Reveal>
      </div>
    </section>
  );
}
