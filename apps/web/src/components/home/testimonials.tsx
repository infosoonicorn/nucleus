'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { motion, type PanInfo } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { testimonials, type Testimonial } from '@/content/site';
import { Reveal } from '@/components/motion-primitives';

const isDev = process.env.NODE_ENV !== 'production';

function getVisibleCount(width: number): number {
  if (width >= 1280) return 3;
  if (width >= 768) return 2;
  return 1;
}

function subscribeToWindowResize(callback: () => void) {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
}

function getWindowWidthClient() {
  return window.innerWidth;
}

function getWindowWidthServer() {
  return 1024;
}

function useWindowWidth() {
  return useSyncExternalStore(
    subscribeToWindowResize,
    getWindowWidthClient,
    getWindowWidthServer,
  );
}

function Avatar({ name, photo }: Readonly<{ name: string; photo?: string }>) {
  const initials = name
    .split(' ')
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (photo) {
    return (
      <span className="home-v3-testimonial-avatar">
        <Image src={photo} alt="" width={48} height={48} />
      </span>
    );
  }

  return (
    <span
      className="home-v3-testimonial-avatar home-v3-testimonial-avatar-fallback"
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

function EmptyState() {
  return (
    <div className="home-v3-testimonial-empty" role="note">
      <Quote aria-hidden="true" size={28} />
      <div>
        <strong>Awaiting consented client quotes.</strong>
        <p>
          The section will appear here once partner-approved testimonials are added to
          <code> apps/web/src/content/site.ts</code>. We don&apos;t ship placeholder names.
        </p>
      </div>
    </div>
  );
}

function SectionHeader() {
  return (
    <Reveal>
      <div className="home-v3-section-header">
        <span className="home-v3-section-eyebrow">Voice of clients</span>
        <h2>What clients say after the work lands.</h2>
        <p>
          Testimonials below are published only with written client consent. Each is mapped
          to a partner and a specific engagement before it appears on the public site.
        </p>
      </div>
    </Reveal>
  );
}

function TestimonialCard({ item }: Readonly<{ item: Testimonial }>) {
  return (
    <article className="home-v3-testimonial-card">
      <Quote
        className="home-v3-testimonial-card-quote"
        size={56}
        aria-hidden="true"
      />
      <blockquote>
        <p>&ldquo;{item.quote}&rdquo;</p>
        <footer className="home-v3-testimonial-footer">
          <Avatar name={item.authorName} photo={item.authorPhoto} />
          <span>
            <cite className="home-v3-testimonial-name">{item.authorName}</cite>
            <span className="home-v3-testimonial-role">
              {item.authorRole}
              {item.authorCompany ? `, ${item.authorCompany}` : ''}
            </span>
          </span>
        </footer>
      </blockquote>
    </article>
  );
}

function Slider({ items }: Readonly<{ items: Testimonial[] }>) {
  const windowWidth = useWindowWidth();
  const [rawIndex, setRawIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    reduceMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  const baseVisible = getVisibleCount(windowWidth);
  const visibleCount = Math.min(baseVisible, items.length);
  const maxIndex = Math.max(0, items.length - visibleCount);
  // Derive a safe index so the renderer always stays in range even if rawIndex
  // was set before a viewport change shrank maxIndex. This avoids a
  // setState-in-effect clamp.
  const currentIndex = Math.min(Math.max(rawIndex, 0), maxIndex);
  const canGoNext = currentIndex < maxIndex;
  const canGoPrev = currentIndex > 0;

  useEffect(() => {
    if (!isAutoPlaying || reduceMotionRef.current) return;
    if (items.length <= visibleCount) return;

    autoPlayRef.current = setInterval(() => {
      setRawIndex((prev) => {
        const safePrev = Math.min(Math.max(prev, 0), maxIndex);
        if (safePrev >= maxIndex) {
          setDirection(-1);
          return Math.max(safePrev - 1, 0);
        }
        if (safePrev <= 0) {
          setDirection(1);
          return Math.min(safePrev + 1, maxIndex);
        }
        return safePrev + direction;
      });
    }, 4800);

    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [isAutoPlaying, items.length, visibleCount, maxIndex, direction]);

  useEffect(() => {
    return () => {
      if (resumeRef.current) clearTimeout(resumeRef.current);
    };
  }, []);

  function pauseAutoPlay() {
    setIsAutoPlaying(false);
    if (resumeRef.current) clearTimeout(resumeRef.current);
    resumeRef.current = setTimeout(() => setIsAutoPlaying(true), 8000);
  }

  function goNext() {
    if (!canGoNext) return;
    setDirection(1);
    setRawIndex(Math.min(currentIndex + 1, maxIndex));
    pauseAutoPlay();
  }

  function goPrev() {
    if (!canGoPrev) return;
    setDirection(-1);
    setRawIndex(Math.max(currentIndex - 1, 0));
    pauseAutoPlay();
  }

  function goTo(index: number) {
    setDirection(index > currentIndex ? 1 : -1);
    setRawIndex(Math.min(Math.max(index, 0), maxIndex));
    pauseAutoPlay();
  }

  function handleDragEnd(_event: unknown, info: PanInfo) {
    const threshold = 60;
    if (info.offset.x < -threshold && canGoNext) goNext();
    else if (info.offset.x > threshold && canGoPrev) goPrev();
  }

  const slideWidthPercent = 100 / visibleCount;
  const trackOffset = `-${currentIndex * slideWidthPercent}%`;

  return (
    <div className="home-v3-testimonials-slider">
      <div className="home-v3-testimonials-controls">
        <button
          type="button"
          className="home-v3-testimonials-arrow"
          onClick={goPrev}
          disabled={!canGoPrev}
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="home-v3-testimonials-arrow"
          onClick={goNext}
          disabled={!canGoNext}
          aria-label="Next testimonial"
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="home-v3-testimonials-viewport">
        <motion.ul
          className="home-v3-testimonials-track"
          animate={{ x: trackOffset }}
          transition={{ type: 'spring', stiffness: 70, damping: 20 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          onDragEnd={handleDragEnd}
        >
          {items.map((item, index) => (
            <li
              key={`${item.authorName}-${index}`}
              className="home-v3-testimonials-slide"
              style={{ flexBasis: `${slideWidthPercent}%` }}
            >
              <TestimonialCard item={item} />
            </li>
          ))}
        </motion.ul>
      </div>

      {maxIndex > 0 ? (
        <div className="home-v3-testimonials-dots" role="tablist" aria-label="Testimonial pagination">
          {Array.from({ length: maxIndex + 1 }, (_, dotIndex) => (
            <button
              key={dotIndex}
              type="button"
              role="tab"
              aria-selected={dotIndex === currentIndex}
              aria-label={`Show testimonial group ${dotIndex + 1}`}
              className={`home-v3-testimonials-dot${dotIndex === currentIndex ? ' is-active' : ''}`}
              onClick={() => goTo(dotIndex)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function HomeTestimonials() {
  const items = testimonials;
  const hasReal = items.length > 0;

  if (!hasReal && !isDev) return null;

  return (
    <section className="home-v3-testimonials" aria-label="What clients say">
      <SectionHeader />
      {hasReal ? <Slider items={items} /> : <EmptyState />}
    </section>
  );
}
