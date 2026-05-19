'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowUpRight, BookOpen } from 'lucide-react';

export type InsightCard = {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  publishedOn: string;
  readMinutes: number;
  thumbnailSrc: string | null;
  authorName: string;
};

function formatHumanDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

const gridVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

export function HomeInsightsGrid({
  cards,
}: Readonly<{ cards: InsightCard[] }>) {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? 'visible' : 'hidden';

  return (
    <motion.ul
      className="home-v3-insights-grid"
      variants={gridVariants}
      initial={initial}
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      {cards.map((card) => (
        <motion.li
          key={card.slug}
          className="home-v3-insight-cell"
          variants={cardVariants}
        >
          <InsightCardView card={card} />
        </motion.li>
      ))}
    </motion.ul>
  );
}

function InsightCardView({ card }: Readonly<{ card: InsightCard }>) {
  return (
    <Link href={`/insights/${card.slug}`} className="home-v3-insight-link">
      <span className="home-v3-insight-thumb" aria-hidden="true">
        {card.thumbnailSrc ? (
          <Image
            src={card.thumbnailSrc}
            alt=""
            fill
            sizes="(max-width: 560px) 100vw, (max-width: 960px) 50vw, 280px"
            className="home-v3-insight-thumb-img"
          />
        ) : (
          <span className="home-v3-insight-thumb-fallback">
            <BookOpen size={24} aria-hidden="true" />
          </span>
        )}
        <span className="home-v3-insight-tag-over" aria-hidden="true">
          {card.tag}
        </span>
      </span>

      <div className="home-v3-insight-body">
        <span className="home-v3-insight-meta">
          <span>{card.readMinutes} min read</span>
          <span aria-hidden="true">·</span>
          <span>{formatHumanDate(card.publishedOn)}</span>
        </span>
        <h3 className="home-v3-insight-title">{card.title}</h3>
        <span className="home-v3-insight-author">
          {card.authorName ? `by ${card.authorName}` : 'by Nucleus Advisors'}
        </span>
        <span className="home-v3-insight-cta" aria-hidden="true">
          Read article
          <ArrowUpRight size={14} />
        </span>
      </div>
    </Link>
  );
}
