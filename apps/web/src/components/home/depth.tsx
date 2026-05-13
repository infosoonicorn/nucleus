'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowUpRight,
  Building2,
  ClipboardCheck,
  FileCheck2,
  ShieldCheck,
  TrendingUp,
  UsersRound,
} from 'lucide-react';
import { Reveal } from '@/components/motion-primitives';

const soonicornPoints = [
  {
    icon: Building2,
    label: 'Investment Manager',
    text: 'to Soonicorn Angel Trust-I, a SEBI-registered Category I Angel Fund.',
  },
  {
    icon: ShieldCheck,
    label: 'Compliance discipline',
    text: 'across drawdowns, unit certificates, KYC and investor onboarding.',
  },
  {
    icon: UsersRound,
    label: 'Sponsor and trustee coordination',
    text: 'with documented processes and review cadences.',
  },
];

const aifCapabilities = [
  {
    icon: ClipboardCheck,
    title: 'Setup and structuring',
    text: 'AIF structure design, sponsor/trustee/investment manager coordination, registration support.',
  },
  {
    icon: FileCheck2,
    title: 'Filings and compliance',
    text: 'Regulatory calendar, periodic returns, SEBI/RBI filings and audit-ready records.',
  },
  {
    icon: TrendingUp,
    title: 'Fund operations',
    text: 'Drawdowns, unit certificates, NAV support, investor reporting and portfolio monitoring.',
  },
];

export function HomeDepth() {
  return (
    <section className="home-v3-depth" aria-label="AIF operating proof">
      <Reveal>
        <div className="home-v3-section-header">
          <span className="home-v3-section-eyebrow">AIF operating proof</span>
          <h2>Fund operations, run with auditable discipline.</h2>
          <p>
            Nucleus is Investment Manager to Soonicorn Angel Trust-I. The same operating
            discipline powers the AIF setup, compliance and filing work the firm delivers for
            other sponsors and platforms.
          </p>
        </div>
      </Reveal>

      <div className="home-v3-depth-grid">
        <motion.article
          className="home-v3-depth-soonicorn"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="home-v3-depth-soonicorn-glow" aria-hidden="true" />
          <header>
            <span className="home-v3-depth-soonicorn-badge">Flagship proof</span>
            <h3>Soonicorn Angel Trust-I</h3>
            <p>
              The fund Nucleus manages day-to-day — used here as evidence of operating
              experience, not as a fundraising message.
            </p>
          </header>
          <ul className="home-v3-depth-soonicorn-list">
            {soonicornPoints.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.li
                  key={item.label}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.2 + index * 0.1,
                  }}
                >
                  <span className="home-v3-depth-soonicorn-iconbox" aria-hidden="true">
                    <Icon size={16} />
                  </span>
                  <div>
                    <strong>{item.label}</strong>
                    <span>{item.text}</span>
                  </div>
                </motion.li>
              );
            })}
          </ul>
          <footer>
            <Link href="/services/aif-fund-management" className="home-v3-depth-soonicorn-cta">
              See the AIF &amp; Fund Management practice
              <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </footer>
        </motion.article>

        <motion.div
          className="home-v3-depth-capabilities"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
        >
          <header className="home-v3-depth-capabilities-head">
            <span className="home-v3-section-eyebrow">For other sponsors</span>
            <h3>What we run for AIF clients.</h3>
          </header>
          <ul>
            {aifCapabilities.map((capability, index) => {
              const Icon = capability.icon;
              return (
                <motion.li
                  key={capability.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{
                    duration: 0.6,
                    ease: [0.22, 1, 0.36, 1],
                    delay: 0.3 + index * 0.1,
                  }}
                >
                  <span className="home-v3-depth-capability-icon" aria-hidden="true">
                    <Icon size={18} />
                  </span>
                  <div>
                    <strong>{capability.title}</strong>
                    <span>{capability.text}</span>
                  </div>
                  <span className="home-v3-depth-capability-rule" aria-hidden="true" />
                </motion.li>
              );
            })}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
