import type { Metric } from '@/content/site';
import { TrackRecordMetrics } from './track-record-metrics';

type Props = Readonly<{
  ordinal: string;
  metrics?: Metric[];
}>;

/**
 * The ●NN Track record band — eyebrow + 4-metric counter row.
 * Renders nothing if no metrics are supplied (e.g. on a service line
 * that hasn't filled in counters yet).
 */
export function TrackRecordBand({ ordinal, metrics }: Props) {
  if (!metrics || metrics.length === 0) return null;
  return (
    <section
      className="service-v1-section client-logos-section"
      aria-labelledby="track-record-eyebrow"
      data-section-ordinal={ordinal}
    >
      <header className="client-logos-head">
        <p id="track-record-eyebrow" className="client-logos-eyebrow">
          <span className="client-logos-eyebrow-bar" aria-hidden="true" />
          <span>Track record</span>
        </p>
      </header>
      <TrackRecordMetrics metrics={metrics} />
    </section>
  );
}
