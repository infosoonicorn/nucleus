'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { FadeIn, Magnetic, WordReveal } from '@/components/motion-primitives';

/** Primitive subset of Service the hero needs — no function fields,
 *  so the prop can cross the server→client boundary cleanly. */
/** A single floating card on the right side of the hero. */
export type HeroCard = Readonly<{
  ordinal: string;       // "●01" — shown as eyebrow
  label: string;         // "Mandate" — short verb/noun summarising the phase
  meta: string;          // "Weeks 1–2" — small label beneath
  stamp?: string;        // optional red pill on the front of the card (e.g. "CLOSED")
}>;

export type ServiceHeroProps = Readonly<{
  ordinal: string;
  title: string;
  slug: string;
  displayHeadline?: string;
  promise: string;
  cta: string;
  /** Exactly 3 cards stacked on the right. Each service derives its own
   *  from its processDossier phases so the hero teases what's coming
   *  below. Falls back to nothing if omitted. */
  heroCards?: HeroCard[];
  /** Short editorial strip beneath the CTAs, e.g.
   *  "Partner-led mandates · $3M–$50M · India + cross-border".
   *  Per-service — hides if omitted. */
  liveStrip?: string;
}>;

/**
 * ServiceHero — animated 2-column hero for service pages.
 *
 *   Desktop (≥900px): | content 1.4fr | floating mandate-card stack 1fr |
 *   Mobile  (<900px): single column, the card stack hides.
 *
 * Animated chrome (CSS + framer-motion):
 *  • Dual-radial aurora background drifting over 18s
 *  • Paper-grain dot overlay
 *  • Word-reveal on the headline (already from motion-primitives)
 *  • Live-availability strip with pulsing red dot
 *  • Three "mandate document" cards on the right that fade-in
 *    rotated and offset, then float gently in a 7s loop
 *
 * Respects prefers-reduced-motion.
 */
export function ServiceHero({
  ordinal,
  title,
  slug,
  displayHeadline,
  promise,
  cta,
  heroCards,
  liveStrip,
}: ServiceHeroProps) {
  const reduceMotion = useReducedMotion();
  const headline = displayHeadline ?? title;

  // Per-service phase preview cards, derived from processDossier by the
  // caller. Each card gets a fixed CSS class for its position in the
  // stack + a rotation pair for the entrance animation.
  const stackStyles = [
    { cls: 'svc-hero-card-1', initialRot: -8, finalRot: -4 },
    { cls: 'svc-hero-card-2', initialRot:  6, finalRot:  3 },
    { cls: 'svc-hero-card-3', initialRot: -3, finalRot: -1 },
  ];
  const cards = (heroCards ?? []).slice(0, 3).map((card, i) => ({
    ...card,
    ...stackStyles[i],
  }));

  return (
    <section className="svc-hero" aria-label={`${title} hero`}>
      <span className="svc-hero-aurora" aria-hidden="true" />
      <span className="svc-hero-grain" aria-hidden="true" />

      <div className="svc-hero-grid">
        <div className="svc-hero-content">
          <FadeIn duration={0.55}>
            <p className="home-v3-eyebrow">
              <span aria-hidden="true" />
              {title}
            </p>
          </FadeIn>

          <h1 className="svc-hero-headline home-v3-headline-display">
            <span className="home-v3-sr-only">{headline}</span>
            <span className="home-v3-headline-row" aria-hidden="true">
              <WordReveal text={headline} />
            </span>
          </h1>

          <FadeIn delay={0.7} duration={0.7}>
            <p className="svc-hero-lede">{promise}</p>
          </FadeIn>

          <FadeIn delay={0.95} duration={0.6}>
            <div className="svc-hero-actions">
              <Magnetic strength={0.18}>
                <Link
                  className="home-v3-button home-v3-button-primary"
                  href={`/contact?intent=${slug}`}
                >
                  {cta}
                  <ArrowRight aria-hidden="true" size={18} />
                </Link>
              </Magnetic>
              <Link className="home-v3-button home-v3-button-ghost" href="/services">
                All services
                <ArrowUpRight aria-hidden="true" size={18} />
              </Link>
            </div>
          </FadeIn>

          {liveStrip ? (
            <FadeIn delay={1.15} duration={0.5}>
              <div className="svc-hero-live">
                <span className="svc-hero-livedot" aria-hidden="true" />
                <span>{liveStrip}</span>
              </div>
            </FadeIn>
          ) : null}
        </div>

        {cards.length === 0 ? null : (
        <div className="svc-hero-stack" aria-hidden="true">
          {cards.map((c, i) => (
            <motion.div
              key={`${c.ordinal}-${c.label}`}
              className={`svc-hero-card ${c.cls}`}
              initial={
                reduceMotion ? false : { opacity: 0, y: 28, rotate: c.initialRot }
              }
              animate={
                reduceMotion
                  ? undefined
                  : {
                      opacity: 1,
                      rotate: c.finalRot,
                      y: [0, -6, 0],
                    }
              }
              transition={
                reduceMotion
                  ? undefined
                  : {
                      opacity: { duration: 0.55, delay: 0.4 + i * 0.13, ease: [0.22, 1, 0.36, 1] },
                      rotate: { duration: 0.7, delay: 0.4 + i * 0.13, ease: [0.22, 1, 0.36, 1] },
                      y: {
                        duration: 6.5,
                        delay: 0.9 + i * 0.4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      },
                    }
              }
            >
              {c.stamp ? <span className="svc-hero-card-stamp">{c.stamp}</span> : null}
              <span className="svc-hero-card-eyebrow">{c.label}</span>
              <p className="svc-hero-card-meta">{c.meta}</p>
              <span className="svc-hero-card-line" aria-hidden="true" />
              <span className="svc-hero-card-line svc-hero-card-line-half" aria-hidden="true" />
            </motion.div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}
