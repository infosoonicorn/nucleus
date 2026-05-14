'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowUpRight,
  BarChart3,
  Briefcase,
  FileText,
  Megaphone,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import type { HelpItem } from '@/content/site';
import { SectionHeader } from '@/components/sections';

type HowWeHelpProps = Readonly<{
  ordinal: string;
  flat: string[];                            // legacy flat list (other 8 services)
  detailed?: HelpItem[];                     // rich bento payload (IB and any service that opts in)
}>;

// Icon rotation per grid slot. Order is deterministic so the bento looks the
// same across renders. Flagship card doesn't render an icon.
const GRID_ICONS = [BarChart3, FileText, Megaphone, ShieldCheck, Briefcase, Users];

const SPRING = { type: 'spring' as const, stiffness: 320, damping: 32 };

export function HowWeHelp({ ordinal, flat, detailed }: HowWeHelpProps) {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  // Fallback for services without detailed content — original list-grid.
  if (!detailed || detailed.length < 2) {
    return (
      <section className="service-v1-section">
        <SectionHeader eyebrow="How we help" title="Structured advisory, practical execution." />
        <div className="service-v1-list-grid">
          {flat.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </section>
    );
  }

  const flagship = detailed[activeIndex];
  const gridItems = detailed
    .map((item, originalIndex) => ({ item, originalIndex }))
    .filter(({ originalIndex }) => originalIndex !== activeIndex);

  return (
    <section className="service-v1-section service-v1-help">
      <header className="service-v1-help-header">
        <p className="service-v1-help-eyebrow">
          <span>§{ordinal}</span>
          <span aria-hidden="true" className="service-v1-help-eyebrow-rule" />
          <span>How we help</span>
        </p>
        <h2 className="service-v1-help-headline">
          Structured advisory, <em>practical execution.</em>
        </h2>
      </header>

      <div className="service-v1-help-bento">
        <motion.article
          key={`flag-${activeIndex}`}
          layoutId={reduceMotion ? undefined : `help-card-${flagship.title}`}
          transition={reduceMotion ? { duration: 0 } : SPRING}
          className="service-v1-help-card service-v1-help-flagship"
        >
          {flagship.badge ? <p className="service-v1-help-badge">{flagship.badge}</p> : null}
          <p className="service-v1-help-ord">
            §{String(activeIndex + 1).padStart(2, '0')}
          </p>
          <h3 className="service-v1-help-flag-title">
            <em>{flagship.title}</em>
          </h3>
          <p className="service-v1-help-flag-body">{flagship.body}</p>
          <ul className="service-v1-help-flag-bullets">
            {flagship.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </motion.article>

        <div className="service-v1-help-grid">
          {gridItems.map(({ item, originalIndex }, slot) => {
            const Icon = GRID_ICONS[slot % GRID_ICONS.length] ?? Sparkles;
            return (
              <motion.button
                key={`grid-${originalIndex}`}
                layoutId={reduceMotion ? undefined : `help-card-${item.title}`}
                transition={reduceMotion ? { duration: 0 } : SPRING}
                type="button"
                onClick={() => setActiveIndex(originalIndex)}
                className="service-v1-help-card service-v1-help-tile"
                aria-label={`Show details for ${item.title}`}
              >
                <span className="service-v1-help-tile-head">
                  <span className="service-v1-help-ord service-v1-help-ord-light">
                    §{String(originalIndex + 1).padStart(2, '0')}
                  </span>
                  <Icon aria-hidden="true" size={16} className="service-v1-help-tile-icon" />
                </span>
                <h3 className="service-v1-help-tile-title">{item.title}</h3>
                <p className="service-v1-help-tile-summary">{item.summary}</p>
                <span className="service-v1-help-tile-cta" aria-hidden="true">
                  <ArrowUpRight size={14} />
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
