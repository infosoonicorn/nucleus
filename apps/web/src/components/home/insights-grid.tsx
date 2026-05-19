'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowUpRight, BookOpen, Clock } from 'lucide-react';

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

const featuredVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const thumbVariants: Variants = {
  hidden: { scale: 1.08, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
  },
};

const sideVariants: Variants = {
  hidden: { opacity: 0, x: 28 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export function HomeInsightsGrid({
  featured,
  side,
}: Readonly<{ featured: InsightCard; side: InsightCard[] }>) {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? 'visible' : 'hidden';

  return (
    <motion.div
      className="home-v3-insights-grid"
      variants={gridVariants}
      initial={initial}
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      <FeaturedCard card={featured} thumbVariants={thumbVariants} />

      <motion.ul className="home-v3-insights-side" variants={gridVariants}>
        {side.map((card) => (
          <motion.li
            key={card.slug}
            className="home-v3-insights-side-item"
            variants={sideVariants}
          >
            <SideCard card={card} />
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
}

function FeaturedCard({
  card,
  thumbVariants,
}: Readonly<{ card: InsightCard; thumbVariants: Variants }>) {
  return (
    <motion.article
      className="home-v3-insight-featured"
      variants={featuredVariants}
    >
      <Link href={`/insights/${card.slug}`} className="home-v3-insight-featured-link">
        <span className="home-v3-insight-thumb home-v3-insight-thumb-large" aria-hidden="true">
          {card.thumbnailSrc ? (
            <motion.span
              className="home-v3-insight-thumb-image"
              style={{ backgroundImage: `url(${card.thumbnailSrc})` }}
              variants={thumbVariants}
            />
          ) : (
            <motion.span
              className="home-v3-insight-thumb-fallback"
              variants={thumbVariants}
            >
              <BookOpen size={32} aria-hidden="true" />
            </motion.span>
          )}
          <span className="home-v3-insight-featured-badge" aria-hidden="true">
            Featured
          </span>
        </span>

        <div className="home-v3-insight-featured-body">
          <span className="home-v3-insight-meta">
            <span className="home-v3-insight-tag">{card.tag}</span>
            <span aria-hidden="true">·</span>
            <span className="home-v3-insight-readtime">
              <Clock size={12} aria-hidden="true" />
              {card.readMinutes} min read
            </span>
            <span aria-hidden="true">·</span>
            <span>{formatHumanDate(card.publishedOn)}</span>
          </span>
          <h3 className="home-v3-insight-title home-v3-insight-title-large">
            {card.title}
          </h3>
          <p className="home-v3-insight-excerpt">{card.excerpt}</p>
          <span className="home-v3-insight-author">
            {card.authorName ? `by ${card.authorName}` : 'by Nucleus Advisors'}
          </span>
          <span className="home-v3-insight-cta" aria-hidden="true">
            Read article
            <ArrowUpRight size={15} />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

function SideCard({ card }: Readonly<{ card: InsightCard }>) {
  return (
    <Link href={`/insights/${card.slug}`} className="home-v3-insight-side-link">
      <span className="home-v3-insight-thumb home-v3-insight-thumb-small" aria-hidden="true">
        {card.thumbnailSrc ? (
          <Image
            src={card.thumbnailSrc}
            alt=""
            fill
            sizes="(max-width: 960px) 100vw, 220px"
            className="home-v3-insight-thumb-img"
          />
        ) : (
          <span className="home-v3-insight-thumb-fallback">
            <BookOpen size={20} aria-hidden="true" />
          </span>
        )}
      </span>
      <div className="home-v3-insight-side-body">
        <span className="home-v3-insight-meta">
          <span className="home-v3-insight-tag">{card.tag}</span>
          <span aria-hidden="true">·</span>
          <span>{card.readMinutes} min</span>
          <span aria-hidden="true">·</span>
          <span>{formatHumanDate(card.publishedOn)}</span>
        </span>
        <h3 className="home-v3-insight-title">{card.title}</h3>
        <span className="home-v3-insight-author">
          {card.authorName ? `by ${card.authorName}` : 'by Nucleus Advisors'}
        </span>
      </div>
    </Link>
  );
}
