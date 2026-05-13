'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, GraduationCap, Newspaper } from 'lucide-react';
import { Reveal } from '@/components/motion-primitives';

// Short, comparable labels so both panels read with the same density.
const careerTracks = [
  'CA articleship',
  'CA / MBA',
  'Graduate',
  'Experienced',
];

const insightTracks = [
  'Deals & M&A',
  'Risk & IFC',
  'GST & Tax',
  'Assurance',
];

type Panel = 'careers' | 'insights';

export function HomeTeaserRow() {
  const [active, setActive] = useState<Panel | null>(null);

  return (
    <section
      className="home-v3-teaser"
      aria-label="Careers and Insights"
      onMouseLeave={() => setActive(null)}
    >
      <Reveal className="home-v3-teaser-frame">
        <article
          className={`home-v3-teaser-panel home-v3-teaser-panel-careers ${
            active === 'careers' ? 'is-expanded' : ''
          } ${active === 'insights' ? 'is-shrunk' : ''}`}
          onMouseEnter={() => setActive('careers')}
        >
          <CareersCanvas />
          <div className="home-v3-teaser-body">
            <header>
              <span className="home-v3-teaser-eyebrow">Careers</span>
              <h3>Career paths across real business work.</h3>
              <p>
                CA articles, CAs, MBAs, graduates and analysts build judgement across audit,
                tax, risk, deals, finance operations and compliance.
              </p>
            </header>
            <ul className="home-v3-teaser-chips" aria-label="Career tracks">
              {careerTracks.map((track) => (
                <li key={track}>{track}</li>
              ))}
            </ul>
            <Link className="home-v3-teaser-link" href="/careers">
              Explore careers
              <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </article>

        <article
          className={`home-v3-teaser-panel home-v3-teaser-panel-insights ${
            active === 'insights' ? 'is-expanded' : ''
          } ${active === 'careers' ? 'is-shrunk' : ''}`}
          onMouseEnter={() => setActive('insights')}
        >
          <InsightsCanvas />
          <div className="home-v3-teaser-body">
            <header>
              <span className="home-v3-teaser-eyebrow">Insights</span>
              <h3>Knowledge built around services, not noise.</h3>
              <p>
                Insights and checklists map to services, official sources and reviewer approval
                before publication.
              </p>
            </header>
            <ul className="home-v3-teaser-chips" aria-label="Insight tracks">
              {insightTracks.map((track) => (
                <li key={track}>{track}</li>
              ))}
            </ul>
            <Link className="home-v3-teaser-link" href="/insights">
              Read insights
              <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </article>
      </Reveal>
    </section>
  );
}

// --- Abstract canvases. Both share the same warm-paper foundation with a
// brand-color accent and a single iconic mark, so the two panels feel like
// siblings instead of stylistic opposites. ---

function CareersCanvas() {
  return (
    <span className="home-v3-teaser-canvas home-v3-teaser-canvas-careers" aria-hidden="true">
      <span className="home-v3-teaser-canvas-gradient" />
      <span className="home-v3-teaser-canvas-grid" />
      <motion.span
        className="home-v3-teaser-canvas-orb home-v3-teaser-canvas-orb-a"
        animate={{ y: [-12, 10, -12] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        className="home-v3-teaser-canvas-orb home-v3-teaser-canvas-orb-b"
        animate={{ y: [10, -8, 10] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span className="home-v3-teaser-canvas-mark" aria-hidden="true">
        <GraduationCap size={20} />
      </span>
      <span className="home-v3-teaser-canvas-corner" aria-hidden="true">
        Talent
      </span>
    </span>
  );
}

function InsightsCanvas() {
  return (
    <span className="home-v3-teaser-canvas home-v3-teaser-canvas-insights" aria-hidden="true">
      <span className="home-v3-teaser-canvas-gradient" />
      <span className="home-v3-teaser-canvas-grid" />
      <motion.span
        className="home-v3-teaser-canvas-orb home-v3-teaser-canvas-orb-a"
        animate={{ y: [-10, 12, -10] }}
        transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        className="home-v3-teaser-canvas-orb home-v3-teaser-canvas-orb-b"
        animate={{ y: [12, -6, 12] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span className="home-v3-teaser-canvas-mark" aria-hidden="true">
        <Newspaper size={20} />
      </span>
      <span className="home-v3-teaser-canvas-corner" aria-hidden="true">
        Editorial
      </span>
    </span>
  );
}
