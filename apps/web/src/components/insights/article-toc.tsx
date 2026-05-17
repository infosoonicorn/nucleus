'use client';

import { useEffect, useState } from 'react';

export type TocHeading = Readonly<{ level: 2 | 3; text: string; id: string }>;

/**
 * Sticky table-of-contents that auto-tracks the currently-visible
 * section while the reader scrolls. Renders nothing if the article has
 * fewer than two headings (no point on short pieces).
 *
 * Implementation: a rAF-throttled scroll listener walks the heading
 * elements in document order and picks the LAST one whose top has
 * crossed below the active threshold (~120px under viewport top, just
 * below the reading-progress bar and any sticky chrome). This is more
 * reliable than IntersectionObserver because IO only fires on
 * intersection-state changes — when no heading is currently inside the
 * active zone (long sections between headings, or once the reader has
 * scrolled past everything into the references/author-bio), IO would
 * leave the highlight stuck on whatever was last seen. The scroll
 * handler always recomputes from the live DOM and stays in sync even
 * under Lenis smooth-scroll.
 */
export function ArticleTOC({ headings }: Readonly<{ headings: readonly TocHeading[] }>) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    if (headings.length === 0) return;

    let raf = 0;
    const THRESHOLD_PX = 120;

    const compute = () => {
      raf = 0;
      let current: string | null = headings[0]?.id ?? null;
      for (const h of headings) {
        const el = document.getElementById(h.id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        if (top <= THRESHOLD_PX) current = h.id;
        else break; // headings are in document order, no need to keep scanning
      }
      setActiveId((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(compute);
    };

    // Seed initial active heading from current scroll position so the
    // highlight is right immediately after hydration, not just after
    // the first scroll event.
    compute();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <section className="sidebar-block article-toc-block" aria-labelledby="article-toc-heading">
      <header className="sidebar-block-head">
        <p className="sidebar-block-eyebrow">In this article</p>
        <h2 id="article-toc-heading" className="sidebar-block-title">
          Contents
        </h2>
      </header>
      <ul className="article-toc-list">
        {headings.map((h) => (
          <li
            key={h.id}
            className={`article-toc-item article-toc-item-${h.level}${
              activeId === h.id ? ' is-active' : ''
            }`}
          >
            <a href={`#${h.id}`} className="article-toc-link">
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
