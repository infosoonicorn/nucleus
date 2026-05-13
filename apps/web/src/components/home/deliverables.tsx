'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { services } from '@/content/site';
import { Reveal } from '@/components/motion-primitives';

type DeliverableShowcase = {
  serviceSlug: string;
  practice: string;
  title: string;
  summary: string;
  meta: string;
};

// Each entry is a representative artifact the practice actually delivers.
// Titles come from the service `deliverables[]` array in site.ts.
const showcase: DeliverableShowcase[] = [
  {
    serviceSlug: 'investment-banking',
    practice: 'Investment Banking',
    title: 'Fundraise readiness report',
    summary:
      'Capital story, financial model summary, investor target list and diligence gaps.',
    meta: 'Pre-raise · 18–32 pp',
  },
  {
    serviceSlug: 'ma-advisory',
    practice: 'M&A Advisory',
    title: 'Information memorandum',
    summary:
      'Business overview, operating economics, growth plan and transaction structure.',
    meta: 'Sell-side · 40–60 pp',
  },
  {
    serviceSlug: 'risk-advisory',
    practice: 'Risk Advisory',
    title: 'Risk and control matrix',
    summary:
      'Process-wise risk register with control design, owners and testing cadence.',
    meta: 'IFC / ICFR · ongoing',
  },
  {
    serviceSlug: 'tax-regulatory',
    practice: 'Tax & Regulatory',
    title: 'Compliance calendar',
    summary:
      'Direct tax, GST, transfer pricing and regulatory filings sequenced by entity.',
    meta: 'Annual · per entity',
  },
  {
    serviceSlug: 'assurance',
    practice: 'Assurance',
    title: 'Audit readiness checklist',
    summary:
      'Schedules, PBC requests, judgemental areas and review notes ahead of statutory audit.',
    meta: 'Pre-audit · quarterly',
  },
  {
    serviceSlug: 'valuations',
    practice: 'Valuations',
    title: 'Valuation report',
    summary:
      'Valuation conclusion, methodology, assumptions pack and compliance schedules.',
    meta: 'Per event · 25–45 pp',
  },
  {
    serviceSlug: 'finance-outsourcing',
    practice: 'Finance Outsourcing',
    title: 'Monthly MIS pack',
    summary:
      'P&L, cash burn, runway, AR/AP, vendor concentration and KPI commentary.',
    meta: 'Monthly · per entity',
  },
  {
    serviceSlug: 'corporate-secretarial',
    practice: 'Corporate Secretarial',
    title: 'Statutory registers & ROC tracker',
    summary:
      'Up-to-date registers, charge ledger, board/shareholder records and filing status.',
    meta: 'Ongoing · annual review',
  },
  {
    serviceSlug: 'aif-fund-management',
    practice: 'AIF & Fund Management',
    title: 'AIF setup workplan',
    summary:
      'Sponsor/trustee/IM setup, regulatory steps, investor onboarding and operations SOPs.',
    meta: 'Setup · once-off',
  },
];

const serviceMap = Object.fromEntries(services.map((s) => [s.slug, s]));

export function HomeDeliverables() {
  return (
    <section className="home-v3-deliverables" aria-label="Sample deliverables across practices">
      <Reveal>
        <div className="home-v3-section-header home-v3-section-header-on-dark">
          <span className="home-v3-section-eyebrow home-v3-section-eyebrow-light">
            What we leave behind
          </span>
          <h2>Sample deliverables across nine practices.</h2>
          <p>
            Each Nucleus engagement produces something tangible — a report, a model, a
            register, a checklist. Here is the artifact each practice is best known for.
          </p>
        </div>
      </Reveal>

      <div className="home-v3-deliverables-grid">
        {showcase.map((item, index) => (
          <DeliverableCard key={item.serviceSlug} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}

type CardProps = {
  item: DeliverableShowcase;
  index: number;
};

function DeliverableCard({ item, index }: Readonly<CardProps>) {
  const service = serviceMap[item.serviceSlug];
  const Icon = service?.icon;
  const accent = index % 2 === 0 ? 'red' : 'navy';

  return (
    <motion.article
      className={`home-v3-deliverable home-v3-deliverable-${accent}`}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: (index % 3) * 0.08 }}
    >
      <Link href={`/services/${item.serviceSlug}`} className="home-v3-deliverable-link">
        <div className="home-v3-deliverable-paper" aria-hidden="true">
          <span className="home-v3-deliverable-paper-stripe" />
          <span className="home-v3-deliverable-paper-monogram">N.</span>
          <span className="home-v3-deliverable-paper-doctype">DELIVERABLE</span>
          <span className="home-v3-deliverable-paper-title">{item.title}</span>
          <span className="home-v3-deliverable-paper-body">
            <span />
            <span />
            <span style={{ width: '64%' }} />
            <span style={{ width: '78%' }} />
          </span>
          <span className="home-v3-deliverable-paper-stats">
            <span>
              <em>Practice</em>
              <strong>{item.practice}</strong>
            </span>
            <span>
              <em>Cadence</em>
              <strong>{item.meta}</strong>
            </span>
          </span>
          <span className="home-v3-deliverable-paper-foot">
            <span className="home-v3-deliverable-paper-sig" />
            <span className="home-v3-deliverable-paper-stamp" />
          </span>
          <span className="home-v3-deliverable-paper-back" />
          <span className="home-v3-deliverable-paper-back home-v3-deliverable-paper-back-deep" />
        </div>

        <footer className="home-v3-deliverable-foot">
          <span className="home-v3-deliverable-foot-meta">
            {Icon ? (
              <span className="home-v3-deliverable-foot-icon" aria-hidden="true">
                <Icon size={14} />
              </span>
            ) : null}
            {item.practice}
          </span>
          <span className="home-v3-deliverable-foot-cta">
            View practice
            <ArrowUpRight aria-hidden="true" size={14} />
          </span>
        </footer>
        <p className="home-v3-deliverable-summary">{item.summary}</p>
      </Link>
    </motion.article>
  );
}
