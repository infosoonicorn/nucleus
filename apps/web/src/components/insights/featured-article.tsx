'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, ChevronLeft, ChevronRight, Clock, Pause, Play } from 'lucide-react';

/**
 * Minimal article shape carried over from the server. Keeps the
 * carousel component decoupled from the full Article + TeamMember
 * types — only the fields actually rendered.
 */
export type FeaturedItem = Readonly<{
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  readMinutes: number;
  isNew: boolean;
  thumbnailSrc?: string;
  author: Readonly<{
    name: string;
    role: string;
    initials: string;
    headshotSrc?: string;
  }>;
}>;

/**
 * "Start here" carousel — up to 5 elevated articles cycling through
 * the top of /insights. Netflix-style: large landscape cards, auto-
 * advance every 7 seconds, pause on hover or when the user takes
 * manual control, prev/next arrows, dot indicators, keyboard
 * (arrow-key) navigation when the carousel has focus.
 *
 * Selection happens in the server page (insights/page.tsx); this
 * component just renders whatever it's handed. Caller is responsible
 * for filtering featured slugs out of the grid below so the same
 * piece doesn't appear twice.
 *
 * If only one item is passed, the rotation chrome (arrows + dots +
 * play/pause) disappears and it renders like the original single-
 * card FeaturedArticle.
 */
export function FeaturedArticle({
  items,
}: Readonly<{ items: readonly FeaturedItem[] }>) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  // Track whether user has interrupted — once they click prev/next or
  // pause, we stop auto-advancing to respect their intent.
  const [userControl, setUserControl] = useState(false);
  const containerRef = useRef<HTMLElement | null>(null);

  const count = items.length;
  const showChrome = count > 1;

  const goTo = useCallback(
    (next: number) => {
      if (count === 0) return;
      const normalized = ((next % count) + count) % count;
      setIndex(normalized);
    },
    [count],
  );

  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  // Auto-advance every 7 seconds when not paused and user hasn't
  // taken manual control.
  useEffect(() => {
    if (!showChrome || isPaused || userControl) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, 7000);
    return () => window.clearInterval(id);
  }, [showChrome, isPaused, userControl, count]);

  // Respect prefers-reduced-motion: stop auto-advance for users who
  // dislike movement. Subscribe so a mid-session OS-level toggle also
  // takes effect. They can still click through manually.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setIsPaused((prev) => (mq.matches ? true : prev));
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  // Keyboard navigation when carousel has focus.
  useEffect(() => {
    if (!showChrome) return;
    const el = containerRef.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setUserControl(true);
        next();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setUserControl(true);
        prev();
      }
    };
    el.addEventListener('keydown', onKey);
    return () => el.removeEventListener('keydown', onKey);
  }, [showChrome, next, prev]);

  if (count === 0) return null;

  return (
    <section
      ref={containerRef}
      className="hub-featured hub-featured-carousel"
      aria-labelledby="hub-featured-heading"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      tabIndex={showChrome ? 0 : -1}
    >
      <div className="hub-featured-viewport">
      <div
        className="hub-featured-track"
        // Slide via translateX. Step matches the slide width + gap so
        // the active card sits flush against the viewport's left edge
        // and ~14% of the next slide peeks on the right (signal to the
        // visitor that there's more to scroll). The CSS uses a 84% slide
        // + 2% gap on desktop, 92% + 3% on mobile — calc() with a CSS
        // var keeps the JS-side step in sync.
        style={{ transform: `translateX(calc(${index} * var(--slide-step, -86%)))` }}
        aria-live="polite"
      >
        {items.map((article, i) => {
          const isActive = i === index;
          return (
            <div
              key={article.slug}
              className="hub-featured-slide"
              aria-hidden={!isActive}
              // inert isn't widely supported in all React types yet — we
              // gate keyboard reach via tabIndex on the inner link below.
            >
              <Link
                href={`/insights/${article.slug}`}
                className="hub-featured-card"
                tabIndex={isActive ? 0 : -1}
              >
                <span className="hub-featured-thumb" aria-hidden="true">
                  {article.thumbnailSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={article.thumbnailSrc}
                      alt=""
                      loading={i === 0 ? 'eager' : 'lazy'}
                    />
                  ) : (
                    <span className="hub-featured-thumb-placeholder">
                      <span className="hub-featured-thumb-tag">{article.tag}</span>
                      <span className="hub-featured-thumb-brand">
                        Nucleus <em>Insights</em>
                      </span>
                    </span>
                  )}
                </span>
                <div className="hub-featured-body">
                  <p className="hub-featured-eyebrow">
                    Start here
                    {article.isNew ? (
                      <span
                        className="hub-featured-new"
                        aria-label="Published in the last 3 weeks"
                      >
                        New
                      </span>
                    ) : null}
                  </p>
                  <h2
                    id={i === 0 ? 'hub-featured-heading' : undefined}
                    className="hub-featured-title"
                  >
                    {article.title}
                  </h2>
                  <p className="hub-featured-excerpt">{article.excerpt}</p>
                  <div className="hub-featured-foot">
                    <span className="hub-featured-author">
                      <span className="hub-featured-avatar" aria-hidden="true">
                        {article.author.headshotSrc ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={article.author.headshotSrc} alt="" />
                        ) : (
                          article.author.initials
                        )}
                      </span>
                      <span>
                        <span className="hub-featured-name">{article.author.name}</span>
                        <span className="hub-featured-role">{article.author.role}</span>
                      </span>
                    </span>
                    <span className="hub-featured-meta">
                      <Clock size={12} aria-hidden="true" />
                      {article.readMinutes} min read
                    </span>
                  </div>
                  <span className="hub-featured-cta" aria-hidden="true">
                    Read the piece
                    <ArrowUpRight size={14} />
                  </span>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
      </div>

      {showChrome ? (
        <>
          <button
            type="button"
            className="hub-featured-nav hub-featured-nav-prev"
            onClick={() => {
              setUserControl(true);
              prev();
            }}
            aria-label="Previous featured article"
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="hub-featured-nav hub-featured-nav-next"
            onClick={() => {
              setUserControl(true);
              next();
            }}
            aria-label="Next featured article"
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>

          <div className="hub-featured-controls" role="tablist" aria-label="Featured articles">
            <button
              type="button"
              className="hub-featured-playpause"
              onClick={() => {
                setUserControl(true);
                setIsPaused((p) => !p);
              }}
              aria-label={isPaused ? 'Resume auto-rotate' : 'Pause auto-rotate'}
              title={isPaused ? 'Resume' : 'Pause'}
            >
              {isPaused ? (
                <Play size={11} aria-hidden="true" />
              ) : (
                <Pause size={11} aria-hidden="true" />
              )}
            </button>
            <div className="hub-featured-dots">
              {items.map((it, i) => (
                <button
                  key={it.slug}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Go to featured article ${i + 1} of ${count}: ${it.title}`}
                  className={`hub-featured-dot${i === index ? ' is-active' : ''}`}
                  onClick={() => {
                    setUserControl(true);
                    goTo(i);
                  }}
                />
              ))}
            </div>
          </div>
        </>
      ) : null}
    </section>
  );
}
