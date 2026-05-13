'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, GraduationCap, Newspaper, Sparkles } from 'lucide-react';
import { insightCategories } from '@/content/site';
import { Reveal } from '@/components/motion-primitives';

const careerTracks = [
  'CA articleship',
  'CA / MBA hires',
  'Graduate analyst',
  'Experienced',
];

const insightTags = insightCategories.slice(0, 4);

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
          <header>
            <span className="home-v3-teaser-eyebrow">Careers</span>
            <h3>Career paths across real business work.</h3>
            <p>
              CA articles, CAs, MBAs, graduates and analysts build judgement across audit,
              tax, risk, deals, finance operations and compliance.
            </p>
          </header>
          <ul className="home-v3-teaser-chips">
            {careerTracks.map((track) => (
              <li key={track}>{track}</li>
            ))}
          </ul>
          <Link className="home-v3-teaser-link" href="/careers">
            Explore careers
            <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </article>

        <article
          className={`home-v3-teaser-panel home-v3-teaser-panel-insights ${
            active === 'insights' ? 'is-expanded' : ''
          } ${active === 'careers' ? 'is-shrunk' : ''}`}
          onMouseEnter={() => setActive('insights')}
        >
          <InsightsCanvas />
          <header>
            <span className="home-v3-teaser-eyebrow">Insights</span>
            <h3>Knowledge built around services, not noise.</h3>
            <p>
              Insights and checklists map to services, official sources and reviewer approval
              before publication.
            </p>
          </header>
          <ul className="home-v3-teaser-chips">
            {insightTags.map((category) => (
              <li key={category}>{category}</li>
            ))}
          </ul>
          <Link className="home-v3-teaser-link" href="/insights">
            Read insights
            <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
        </article>
      </Reveal>
    </section>
  );
}

// --- Abstract canvases (used in place of photography we don't yet have approved) ---

function CareersCanvas() {
  return (
    <span className="home-v3-teaser-canvas home-v3-teaser-canvas-careers" aria-hidden="true">
      <span className="home-v3-teaser-canvas-gradient" />
      <span className="home-v3-teaser-canvas-grid" />
      <motion.span
        className="home-v3-teaser-canvas-orb home-v3-teaser-canvas-orb-a"
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.span
        className="home-v3-teaser-canvas-orb home-v3-teaser-canvas-orb-b"
        animate={{ y: [10, -8, 10] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span className="home-v3-teaser-canvas-mark" aria-hidden="true">
        <GraduationCap size={24} />
      </span>
    </span>
  );
}

function InsightsCanvas() {
  return (
    <span className="home-v3-teaser-canvas home-v3-teaser-canvas-insights" aria-hidden="true">
      <span className="home-v3-teaser-canvas-gradient" />
      <span className="home-v3-teaser-canvas-lines" />
      <motion.span
        className="home-v3-teaser-canvas-orb home-v3-teaser-canvas-orb-c"
        animate={{ y: [-8, 12, -8] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span className="home-v3-teaser-canvas-mark home-v3-teaser-canvas-mark-paper" aria-hidden="true">
        <Newspaper size={22} />
      </span>
      <span className="home-v3-teaser-canvas-mark home-v3-teaser-canvas-mark-spark" aria-hidden="true">
        <Sparkles size={16} />
      </span>
    </span>
  );
}
