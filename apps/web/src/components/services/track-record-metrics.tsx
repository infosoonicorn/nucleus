'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import type { Metric } from '@/content/site';

type Props = Readonly<{ metrics: Metric[] }>;

/**
 * TrackRecordMetrics — 4-metric counter row.
 *
 * Each cell animates from 0 to its target value with an ease-out cubic
 * curve when the row scrolls into view (once, never re-triggers).
 * Reduced-motion users get the final value immediately.
 *
 * Reusable across all service lines via `Service.metrics` in site.ts.
 */
export function TrackRecordMetrics({ metrics }: Props) {
  if (metrics.length === 0) return null;
  return (
    <div className="track-metrics" role="group" aria-label="Track record metrics">
      {metrics.map((m, i) => (
        <MetricCell key={`${m.label}-${i}`} metric={m} index={i} />
      ))}
    </div>
  );
}

function MetricCell({ metric, index }: Readonly<{ metric: Metric; index: number }>) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [v, setV] = useState<number>(reduceMotion ? metric.value : 0);

  useEffect(() => {
    // Reduced-motion: jump straight to the final value, no rAF.
    if (reduceMotion) return;
    // Small delay before the count starts so the row is laid out before
    // animation begins. (IntersectionObserver was unreliable inside the
    // service-page-shell — falling back to a simple on-mount trigger.
    // The metrics live high on the page so users always see the count.)
    const startDelay = 280;
    const duration = 1100 + index * 90;
    let raf = 0;
    let started = 0;
    const tick = (now: number) => {
      if (!started) started = now;
      const t = Math.min(1, (now - started) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setV(Math.round(metric.value * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    const timer = window.setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, startDelay);
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [reduceMotion, metric.value, index]);

  // Final value text for accessibility — screen readers shouldn't read
  // the count-up sequence, just the final number.
  const finalText = `${metric.prefix ?? ''}${metric.value}${metric.suffix ?? ''}`;

  return (
    <div ref={ref} className="track-metric">
      <p className="track-metric-value" aria-label={finalText}>
        <span aria-hidden="true">
          {metric.prefix}
          {v}
          {metric.suffix}
        </span>
      </p>
      <p className="track-metric-label">{metric.label}</p>
    </div>
  );
}
