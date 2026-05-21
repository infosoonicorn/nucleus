'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Compass, Mail, Sparkles } from 'lucide-react';

export type ComingSoonInsight = {
  slug: string;
  title: string;
  tag: string;
  readMinutes: number;
  publishedOn: string;
};

type Props = {
  eyebrow: string;
  title: string;
  body: string;
  insights: ComingSoonInsight[];
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: 0.08 * i, ease: 'easeOut' as const },
  }),
};

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function ComingSoon({ eyebrow, title, body, insights }: Props) {
  const prefersReducedMotion = useReducedMotion();
  const featured = insights[0];
  const secondary = insights.slice(1, 3);

  return (
    <main className="coming-soon-page">
      <section className="coming-soon-hero" aria-labelledby="coming-soon-title">
        <div className="coming-soon-orbit" aria-hidden="true">
          <motion.span
            className="coming-soon-orbit-ring coming-soon-orbit-ring-1"
            animate={prefersReducedMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 42, repeat: Infinity, ease: 'linear' }}
          />
          <motion.span
            className="coming-soon-orbit-ring coming-soon-orbit-ring-2"
            animate={prefersReducedMotion ? undefined : { rotate: -360 }}
            transition={{ duration: 64, repeat: Infinity, ease: 'linear' }}
          />
          <motion.span
            className="coming-soon-orbit-ring coming-soon-orbit-ring-3"
            animate={prefersReducedMotion ? undefined : { rotate: 360 }}
            transition={{ duration: 90, repeat: Infinity, ease: 'linear' }}
          />
          <motion.span
            className="coming-soon-orbit-core"
            animate={prefersReducedMotion ? undefined : { scale: [1, 1.15, 1], opacity: [0.85, 1, 0.85] }}
            transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="coming-soon-hero-content">
          <motion.p
            className="coming-soon-pill"
            initial="hidden"
            animate="visible"
            custom={0}
            variants={fadeUp}
          >
            <motion.span
              className="coming-soon-pill-dot"
              animate={prefersReducedMotion ? undefined : { opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              aria-hidden="true"
            />
            <span className="coming-soon-pill-label">{eyebrow}</span>
            <span className="coming-soon-pill-sep" aria-hidden="true">·</span>
            <span className="coming-soon-pill-status">Coming soon</span>
          </motion.p>

          <motion.h1
            id="coming-soon-title"
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeUp}
          >
            {title}
          </motion.h1>

          <motion.p
            className="coming-soon-body"
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUp}
          >
            {body}
          </motion.p>

        </div>
      </section>

      <section className="coming-soon-fallback" aria-label="While you wait">
        <motion.div
          className="coming-soon-fallback-head"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' as const }}
        >
          <p className="coming-soon-fallback-eyebrow">While you are here</p>
          <h2>Three ways to get to know Nucleus today.</h2>
        </motion.div>

        <div className="coming-soon-fallback-grid">
          <motion.article
            className="coming-soon-card coming-soon-card-feature"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            
            transition={{ duration: 0.65, delay: 0.05, ease: 'easeOut' as const }}
          >
            <div className="coming-soon-card-icon" aria-hidden="true">
              <Sparkles size={18} strokeWidth={1.8} />
            </div>
            <p className="coming-soon-card-eyebrow">Latest insights</p>
            {featured ? (
              <>
                <h3>
                  <Link href={`/insights/${featured.slug}`}>{featured.title}</Link>
                </h3>
                <p className="coming-soon-card-meta">
                  {featured.tag} · {featured.readMinutes} min read · {formatDate(featured.publishedOn)}
                </p>
                {secondary.length > 0 && (
                  <ul className="coming-soon-card-list">
                    {secondary.map((a) => (
                      <li key={a.slug}>
                        <Link href={`/insights/${a.slug}`}>
                          <span>{a.title}</span>
                          <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <p className="coming-soon-card-body">
                Long-form pieces on transactions, valuation, audit, tax and the regulatory
                shifts shaping Indian finance.
              </p>
            )}
            <Link className="coming-soon-card-link" href="/insights">
              Read all insights
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </motion.article>

          <motion.article
            className="coming-soon-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            
            transition={{ duration: 0.65, delay: 0.12, ease: 'easeOut' as const }}
          >
            <div className="coming-soon-card-icon" aria-hidden="true">
              <Compass size={18} strokeWidth={1.8} />
            </div>
            <p className="coming-soon-card-eyebrow">Our work</p>
            <h3>See how Nucleus advises across the lifecycle.</h3>
            <p className="coming-soon-card-body">
              Investment banking, M&amp;A, valuations, assurance, tax, risk advisory, fund
              services and finance outsourcing — one partner-led team.
            </p>
            <Link className="coming-soon-card-link" href="/services">
              Explore services
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </motion.article>

          <motion.article
            className="coming-soon-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            
            transition={{ duration: 0.65, delay: 0.19, ease: 'easeOut' as const }}
          >
            <div className="coming-soon-card-icon" aria-hidden="true">
              <Mail size={18} strokeWidth={1.8} />
            </div>
            <p className="coming-soon-card-eyebrow">Get in touch</p>
            <h3>Tell us why this section matters to you.</h3>
            <p className="coming-soon-card-body">
              Hiring interest, alumni reconnect, partnership notes — we read every message
              and route it to the right partner.
            </p>
            <Link className="coming-soon-card-link" href="/contact">
              Contact Nucleus
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </motion.article>
        </div>
      </section>
    </main>
  );
}
