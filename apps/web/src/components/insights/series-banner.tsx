import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import type { Article } from '@/content/articles';

/**
 * Series banner shown at the top of an article reader when the
 * article is part of a series (`seriesKey` set). Renders the series
 * title, the position of the current article ("Part 2 of 4"), and
 * a clickable list of sibling parts in order.
 *
 * The banner renders nothing when only one article in the series is
 * approved yet — a 1-of-1 banner reads as broken.
 */
export function SeriesBanner({
  current,
  parts,
}: Readonly<{ current: Article; parts: readonly Article[] }>) {
  if (parts.length < 2) return null;

  const currentIndex = parts.findIndex((p) => p.slug === current.slug);
  const total = parts.length;
  const seriesTitle = current.seriesTitle ?? 'Series';

  return (
    <aside className="series-banner" aria-label={`Series: ${seriesTitle}`}>
      <header className="series-banner-head">
        <p className="series-banner-eyebrow">
          Part {currentIndex + 1} of {total}
        </p>
        <h2 className="series-banner-title">{seriesTitle}</h2>
      </header>
      <ol className="series-banner-parts">
        {parts.map((part, i) => {
          const isCurrent = part.slug === current.slug;
          const order = i + 1;
          return (
            <li
              key={part.slug}
              className={`series-banner-part${isCurrent ? ' is-current' : ''}`}
            >
              {isCurrent ? (
                <span className="series-banner-part-link">
                  <span className="series-banner-part-num">
                    <CheckCircle2 size={12} aria-hidden="true" />
                  </span>
                  <span className="series-banner-part-text">
                    <span className="series-banner-part-label">Part {order}</span>
                    <span className="series-banner-part-title">{part.title}</span>
                  </span>
                </span>
              ) : (
                <Link href={`/insights/${part.slug}`} className="series-banner-part-link">
                  <span className="series-banner-part-num">{order}</span>
                  <span className="series-banner-part-text">
                    <span className="series-banner-part-label">Part {order}</span>
                    <span className="series-banner-part-title">{part.title}</span>
                  </span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </aside>
  );
}
