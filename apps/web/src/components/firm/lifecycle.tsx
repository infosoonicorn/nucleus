'use client';

import Link from 'next/link';
import { useRef, useSyncExternalStore } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { lifecycle, services } from '@/content/site';
import { Reveal } from '@/components/motion-primitives';

// Map each lifecycle stage to the Nucleus practices that typically lead it.
// Slugs reference services in site.ts so the cards deep-link into the service detail pages.
const STAGE_SERVICES: string[][] = [
  ['corporate-secretarial'], // Incorporation and early compliance
  ['finance-outsourcing', 'tax-regulatory'], // First finance stack
  ['investment-banking', 'valuations'], // Fundraising and investor readiness
  ['risk-advisory', 'tax-regulatory', 'assurance'], // Growth and control building
  ['ma-advisory', 'valuations', 'corporate-secretarial'], // Transactions and restructuring
  ['risk-advisory'], // Scale and listing readiness
];

function findService(slug: string) {
  return services.find((service) => service.slug === slug);
}

function subscribeToResize(callback: () => void) {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}
function getViewportWidthClient() {
  return window.innerWidth;
}
function getViewportWidthServer() {
  return 1280;
}
function useViewportWidth() {
  return useSyncExternalStore(
    subscribeToResize,
    getViewportWidthClient,
    getViewportWidthServer,
  );
}

const subscribeNoop = () => () => {};
const getClientSnapshotTrue = () => true;
const getServerSnapshotFalse = () => false;
function useHasMounted() {
  return useSyncExternalStore(subscribeNoop, getClientSnapshotTrue, getServerSnapshotFalse);
}

export function FirmLifecycle() {
  return (
    <section className="home-v3-lifecycle" id="business-lifecycle" aria-label="Business lifecycle">
      <Reveal>
        <div className="home-v3-section-header">
          <span className="home-v3-section-eyebrow">Business lifecycle</span>
          <h2>The moments where outside judgement matters.</h2>
          <p>
            Nucleus organises around the decisions founders, boards and finance teams cannot
            improvise — capital, controls, compliance, reporting and transactions.
          </p>
        </div>
      </Reveal>

      <LifecycleBody />
    </section>
  );
}

function LifecycleBody() {
  const mounted = useHasMounted();
  const viewportWidth = useViewportWidth();

  // Below the lg breakpoint, render a stacked card list (no horizontal scroll).
  // Above lg, render the scroll-driven horizontal stacking journey.
  const isCompact = viewportWidth < 1024;

  if (!mounted || isCompact) {
    return <LifecycleStack />;
  }

  return <LifecycleJourney viewportWidth={viewportWidth} />;
}

function LifecycleStack() {
  return (
    <ol className="home-v3-lifecycle-stack" aria-label="Lifecycle stages">
      {lifecycle.map((item, index) => (
        <motion.li
          key={item.title}
          className="home-v3-lifecycle-stack-card"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.06 }}
        >
          <span className="home-v3-lifecycle-step">Stage {String(index + 1).padStart(2, '0')}</span>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
          <LifecycleStageLinks slugs={STAGE_SERVICES[index] ?? []} />
        </motion.li>
      ))}
    </ol>
  );
}

function LifecycleJourney({ viewportWidth }: Readonly<{ viewportWidth: number }>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: scrollRef });

  // Card width: roughly two cards visible side by side at the end of the journey,
  // with each new card sliding in from the right and stacking.
  const cardWidth = Math.min(Math.max(viewportWidth * 0.46, 520), 640);
  const peek = 88; // how much of the previous card peeks behind the next

  return (
    <div ref={scrollRef} className="home-v3-lifecycle-scroll">
      <div className="home-v3-lifecycle-sticky">
        <div className="home-v3-lifecycle-track">
          {lifecycle.map((item, index) => (
            <JourneyCard
              key={item.title}
              item={item}
              index={index}
              total={lifecycle.length}
              cardWidth={cardWidth}
              peek={peek}
              viewportWidth={viewportWidth}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
        <ProgressRail
          total={lifecycle.length}
          scrollYProgress={scrollYProgress}
        />
      </div>
    </div>
  );
}

type JourneyCardProps = {
  item: (typeof lifecycle)[number];
  index: number;
  total: number;
  cardWidth: number;
  peek: number;
  viewportWidth: number;
  scrollYProgress: MotionValue<number>;
};

function JourneyCard({
  item,
  index,
  total,
  cardWidth,
  peek,
  viewportWidth,
  scrollYProgress,
}: JourneyCardProps) {
  // Each card animates during its full scroll segment, with a slight overlap into
  // the previous segment so successive cards feel connected rather than discrete.
  const segment = 1 / total;
  const overlap = 0.25; // 25% of a segment of overlap with the previous card
  const start = index === 0 ? 0 : Math.max(0, (index - overlap) * segment);
  const end = (index + 1) * segment;

  // Natural flex position of this card is `cardWidth * index` (after gap=0 baseline).
  // We want it to come to rest at `peek * index` so each subsequent card overlaps
  // the previous by (cardWidth - peek) pixels.
  const finalTranslate = peek * index;
  const fromOffscreen = viewportWidth;

  const x = useTransform(
    scrollYProgress,
    [start, end],
    [index === 0 ? finalTranslate : fromOffscreen, finalTranslate],
  );

  return (
    <motion.article
      className="home-v3-lifecycle-card"
      style={{
        x,
        width: cardWidth,
        zIndex: 10 + index,
      }}
    >
      <header className="home-v3-lifecycle-card-head">
        <span className="home-v3-lifecycle-card-step">
          Stage {String(index + 1).padStart(2, '0')}
        </span>
        <span className="home-v3-lifecycle-card-meter" aria-hidden="true">
          <span style={{ width: `${((index + 1) / total) * 100}%` }} />
        </span>
      </header>
      <h3>{item.title}</h3>
      <p>{item.text}</p>
      <LifecycleStageLinks slugs={STAGE_SERVICES[index] ?? []} />
    </motion.article>
  );
}

function LifecycleStageLinks({ slugs }: Readonly<{ slugs: string[] }>) {
  if (slugs.length === 0) return null;

  return (
    <footer className="home-v3-lifecycle-card-footer">
      <span className="home-v3-lifecycle-card-footer-label">Practices that lead</span>
      <div>
        {slugs.map((slug) => {
          const service = findService(slug);
          if (!service) return null;
          return (
            <Link
              key={slug}
              className="home-v3-lifecycle-card-pill"
              href={`/services/${slug}`}
            >
              {service.title}
              <ArrowUpRight aria-hidden="true" size={12} />
            </Link>
          );
        })}
      </div>
    </footer>
  );
}

function ProgressRail({
  total,
  scrollYProgress,
}: Readonly<{ total: number; scrollYProgress: MotionValue<number> }>) {
  const fill = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div className="home-v3-lifecycle-rail" aria-hidden="true">
      <div className="home-v3-lifecycle-rail-track">
        <motion.span className="home-v3-lifecycle-rail-fill" style={{ width: fill }} />
      </div>
      <ol className="home-v3-lifecycle-rail-ticks">
        {Array.from({ length: total }, (_, i) => (
          <li key={i}>
            <span>{String(i + 1).padStart(2, '0')}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
