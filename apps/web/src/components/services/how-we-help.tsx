'use client';

import { useState } from 'react';
import { LayoutGroup, motion, useReducedMotion } from 'framer-motion';
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

// Icon rotation per item index. Flagship doesn't render an icon, but keeping
// the icon attached to each item makes the swap visually stable.
const ICONS = [Sparkles, BarChart3, FileText, Megaphone, ShieldCheck, Briefcase, Users];

const EASE = { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const };

export function HowWeHelp({ ordinal, flat, detailed }: HowWeHelpProps) {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);

  // Fallback for services without detailed content — original list-grid.
  if (!detailed || detailed.length < 2) {
    return (
      <section className="service-v1-section" data-section-ordinal={ordinal}>
        <SectionHeader eyebrow="How we help" title="Structured advisory, practical execution." />
        <div className="service-v1-list-grid">
          {flat.map((item) => (
            <div key={item}>{item}</div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="service-v1-section service-v1-help" data-section-ordinal={ordinal}>
      <header className="service-v1-help-header">
        <p className="service-v1-help-eyebrow">
          <span aria-hidden="true" className="service-v1-help-eyebrow-rule" />
          <span>How we help</span>
        </p>
        <h2 className="service-v1-help-headline">
          Structured advisory, <em>practical execution.</em>
        </h2>
      </header>

      <LayoutGroup>
        <div className="service-v1-help-bento">
          {detailed.map((item, index) => {
            const isActive = index === activeIndex;
            const Icon = ICONS[index % ICONS.length] ?? Sparkles;
            const ordinalLabel = `●${String(index + 1).padStart(2, '0')}`;
            return (
              <motion.button
                key={item.title}
                layout
                transition={reduceMotion ? { duration: 0 } : EASE}
                type="button"
                disabled={isActive}
                onClick={() => !isActive && setActiveIndex(index)}
                aria-pressed={isActive}
                aria-label={isActive ? `${item.title} (current)` : `Show details for ${item.title}`}
                className={`service-v1-help-card ${
                  isActive ? 'service-v1-help-flagship is-active' : 'service-v1-help-tile'
                }`}
              >
                {isActive ? (
                  <motion.div
                    layout="position"
                    transition={reduceMotion ? { duration: 0 } : EASE}
                    className="service-v1-help-card-inner service-v1-help-card-inner-flag"
                  >
                    {item.badge ? (
                      <p className="service-v1-help-badge">{item.badge}</p>
                    ) : null}
                    <p className="service-v1-help-ord">{ordinalLabel}</p>
                    <h3 className="service-v1-help-flag-title">
                      <em>{item.title}</em>
                    </h3>
                    <p className="service-v1-help-flag-body">{item.body}</p>
                    <ul className="service-v1-help-flag-bullets">
                      {item.bullets.map((b) => (
                        <li key={b}>{b}</li>
                      ))}
                    </ul>
                  </motion.div>
                ) : (
                  <motion.div
                    layout="position"
                    transition={reduceMotion ? { duration: 0 } : EASE}
                    className="service-v1-help-card-inner service-v1-help-card-inner-tile"
                  >
                    <span className="service-v1-help-tile-head">
                      <span className="service-v1-help-ord service-v1-help-ord-light">
                        {ordinalLabel}
                      </span>
                      <Icon aria-hidden="true" size={16} className="service-v1-help-tile-icon" />
                    </span>
                    <h3 className="service-v1-help-tile-title">{item.title}</h3>
                    <p className="service-v1-help-tile-summary">{item.summary}</p>
                    <span className="service-v1-help-tile-cta" aria-hidden="true">
                      <ArrowUpRight size={14} />
                    </span>
                  </motion.div>
                )}
              </motion.button>
            );
          })}
        </div>
      </LayoutGroup>
    </section>
  );
}
