'use client';

import { useEffect, useState } from 'react';

/**
 * Slim red bar pinned to the top of the viewport that fills as the
 * reader scrolls through the page. Pure presentational signal — no
 * pointer-events, ignored by AT. Listens to passive scroll only.
 */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const compute = () => {
      const d = document.documentElement;
      const max = d.scrollHeight - d.clientHeight;
      const pct = max > 0 ? (d.scrollTop / max) * 100 : 0;
      setProgress(Math.min(100, Math.max(0, pct)));
    };
    compute();
    window.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute, { passive: true });
    return () => {
      window.removeEventListener('scroll', compute);
      window.removeEventListener('resize', compute);
    };
  }, []);

  return (
    <div className="article-progress" aria-hidden="true">
      <div className="article-progress-bar" style={{ width: `${progress}%` }} />
    </div>
  );
}
