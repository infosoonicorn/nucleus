'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, FileText } from 'lucide-react';
import Link from 'next/link';
import type { Resource } from '@/content/resources';
import { RequestResourceButton } from './request-resource-button';

type Props = Readonly<{
  ordinal: string;
  serviceSlug: string;
  resources: Resource[];
}>;

const KIND_BADGE_CLASS: Record<string, string> = {
  'Sector report': 'resource-card-badge-sector',
  'Working paper': 'resource-card-badge-working',
  'Advisory note': 'resource-card-badge-advisory',
  'Data sheet': 'resource-card-badge-data',
  Checklist: 'resource-card-badge-checklist',
  Template: 'resource-card-badge-template',
  Guide: 'resource-card-badge-guide',
};

export function ResourceDeck({ ordinal, serviceSlug, resources: allResources }: Props) {
  // Templates are stage-specific sample artefacts surfaced from inside
  // sections like FundraiseStages — keep them out of the headline deck.
  const resources = allResources.filter((r) => r.kind !== 'Template');
  const reduceMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState<{ atStart: boolean; atEnd: boolean }>({
    atStart: true,
    atEnd: false,
  });

  const refreshScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const atStart = el.scrollLeft <= 4;
    const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
    setScrollState({ atStart, atEnd });
  }, []);

  useEffect(() => {
    refreshScrollState();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', refreshScrollState, { passive: true });
    window.addEventListener('resize', refreshScrollState);
    return () => {
      el.removeEventListener('scroll', refreshScrollState);
      window.removeEventListener('resize', refreshScrollState);
    };
  }, [refreshScrollState]);

  function scrollByCards(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    // Compute one card's worth: first child's outer width + gap.
    const firstCard = el.querySelector<HTMLElement>('.resource-card');
    const cardWidth = firstCard?.offsetWidth ?? 320;
    const gap = 20;
    el.scrollBy({ left: direction * (cardWidth + gap), behavior: 'smooth' });
  }

  if (resources.length === 0) return null;

  return (
    <section className="service-v1-section resource-deck-section" aria-labelledby="resource-deck-h">
      <header className="resource-deck-head">
        <div>
          <p className="resource-deck-eyebrow">
            <span className="resource-deck-eyebrow-num">§{ordinal}</span>
            <span className="resource-deck-eyebrow-bar" aria-hidden="true" />
            <span>Resources · Deliverables</span>
          </p>
          <h2 id="resource-deck-h" className="resource-deck-title">
            Checklists, reports, <em>and working papers</em> from the desk.
          </h2>
          <p className="resource-deck-lede">
            Every download is partner-reviewed. Request any of these and a Nucleus partner
            sends the PDF directly — no automated drip.
          </p>
        </div>
        <div className="resource-deck-headside">
          <div className="resource-deck-nav" aria-label="Scroll resources">
            <button
              type="button"
              className="resource-deck-nav-btn"
              aria-label="Scroll left"
              disabled={scrollState.atStart}
              onClick={() => scrollByCards(-1)}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              className="resource-deck-nav-btn"
              aria-label="Scroll right"
              disabled={scrollState.atEnd}
              onClick={() => scrollByCards(1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <Link href={`/reports?service=${serviceSlug}`} className="resource-deck-allcta">
            See all reports →
          </Link>
        </div>
      </header>

      <div ref={trackRef} className="resource-deck-track" role="list">
        {resources.map((r, i) => (
          <motion.article
            role="listitem"
            key={r.slug}
            className="resource-card"
            initial={reduceMotion ? false : { opacity: 0, y: 14 }}
            whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="resource-card-cover" aria-hidden="true">
              <FileText size={26} />
              <span className="resource-card-cover-meta">
                {r.format}
                {r.pages ? ` · ${r.pages} pp` : ''}
              </span>
            </div>
            <div className="resource-card-body">
              <span
                className={`resource-card-badge ${KIND_BADGE_CLASS[r.kind] ?? ''}`}
              >
                {r.kind}
              </span>
              <h3 className="resource-card-title">{r.title}</h3>
              <p className="resource-card-abstract">{r.abstract}</p>
              <div className="resource-card-tags">
                {r.tags.map((t) => (
                  <span key={t} className="resource-card-tag">
                    {t}
                  </span>
                ))}
              </div>
              <div className="resource-card-foot">
                <RequestResourceButton resource={r} label="Get this" />
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
