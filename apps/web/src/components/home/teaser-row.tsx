'use client';

import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { insightCategories } from '@/content/site';
import { Reveal } from '@/components/motion-primitives';

export function HomeTeaserRow() {
  return (
    <section className="home-v3-teaser" aria-label="Careers and Insights teaser">
      <Reveal className="home-v3-teaser-card">
        <span className="home-v3-section-eyebrow">Careers</span>
        <h3>Career paths across real business work.</h3>
        <p>
          CA articles, CAs, MBAs, graduates and analysts build judgement across audit, tax, risk,
          deals, finance operations and compliance.
        </p>
        <Link className="home-v3-teaser-link" href="/careers">
          Explore careers
          <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
      </Reveal>

      <Reveal className="home-v3-teaser-card" delay={0.12}>
        <span className="home-v3-section-eyebrow">Insights</span>
        <h3>Knowledge built around services, not noise.</h3>
        <p>
          Insights and checklists map to services, official sources and reviewer approval before
          publication.
        </p>
        <ul className="home-v3-teaser-chips">
          {insightCategories.slice(0, 4).map((category) => (
            <li key={category}>{category}</li>
          ))}
        </ul>
        <Link className="home-v3-teaser-link" href="/insights">
          Read insights
          <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
      </Reveal>
    </section>
  );
}
