'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { services } from '@/content/site';
import { SectionHeader } from '@/components/sections';

/**
 * RelatedServices — animated card row with the three closest service
 * lines to the one being viewed. Each card has:
 *   • §NN ordinal at top-left + service icon badge at top-right
 *   • Service title + summary
 *   • "View service" CTA with a sliding arrow
 * Hover state inverts the surface (dark navy → vivid red gradient,
 * cream text) and slides the arrow. Staggered fade-up entrance via
 * framer-motion, respects prefers-reduced-motion.
 */
export function RelatedServices({
  currentSlug,
}: Readonly<{ currentSlug: string }>) {
  const reduceMotion = useReducedMotion();
  const related = services.filter((item) => item.slug !== currentSlug).slice(0, 3);
  if (related.length === 0) return null;

  return (
    <section className="service-v1-section service-v1-related">
      <SectionHeader
        eyebrow="Related services"
        title="Adjacent workstreams often connect."
      />
      <div className="related-grid">
        {related.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.slug}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{
                duration: 0.55,
                delay: Math.min(i * 0.1, 0.35),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Link className="related-card" href={`/services/${item.slug}`}>
                {/* Layered red fill that slides up on hover */}
                <span className="related-card-fill" aria-hidden="true" />
                <span className="related-card-glow" aria-hidden="true" />

                <div className="related-card-content">
                  <header className="related-card-head">
                    <span className="related-card-num">§{item.ordinal}</span>
                    <span className="related-card-icon" aria-hidden="true">
                      <Icon size={18} strokeWidth={1.75} />
                    </span>
                  </header>

                  <h3 className="related-card-title">{item.title}</h3>
                  <p className="related-card-summary">{item.summary}</p>

                  <span className="related-card-cta">
                    <span>View service</span>
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
