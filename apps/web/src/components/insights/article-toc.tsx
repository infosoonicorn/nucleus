'use client';

import { useEffect, useState } from 'react';

export type TocHeading = Readonly<{ level: 2 | 3; text: string; id: string }>;

/**
 * Sticky table-of-contents that auto-tracks the currently-visible
 * section while the reader scrolls. Renders nothing if the article has
 * fewer than two headings (no point on short pieces).
 *
 * Scroll tracking uses an IntersectionObserver tuned with a top margin
 * matching the reading-progress bar height and a bottom margin of 60%
 * so a section is considered "active" while its heading sits roughly
 * in the upper third of the viewport — matches what a reader's eye is
 * actually on, not what's technically intersecting.
 */
export function ArticleTOC({ headings }: Readonly<{ headings: readonly TocHeading[] }>) {
  const [activeId, setActiveId] = useState<string | null>(headings[0]?.id ?? null);

  useEffect(() => {
    if (headings.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-88px 0px -60% 0px', threshold: 0 },
    );
    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
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
