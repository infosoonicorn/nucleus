import Image from 'next/image';
import type { Client } from '@/content/clients';
import type { Metric } from '@/content/site';
import { TrackRecordMetrics } from './track-record-metrics';

type Props = Readonly<{
  ordinal: string;
  clients: Client[];
  /** Optional 4-metric counter row rendered between the title and the
   *  logo marquee. Skipped when not supplied. */
  metrics?: Metric[];
}>;

/**
 * Client logo marquee — server component. CSS-only infinite scroll
 * (no JS overhead), pauses on hover, fades at the edges with a mask,
 * and respects prefers-reduced-motion (falls back to a wrapping grid).
 *
 * The track is duplicated in the DOM so the keyframe can translate
 * exactly -50% for a seamless loop regardless of card count (works
 * for 7 to 25 logos as documented in clients.ts).
 */
export function ClientLogos({ ordinal, clients, metrics }: Props) {
  if (clients.length === 0 && (!metrics || metrics.length === 0)) return null;

  // Duplicate the list so the marquee loops seamlessly. aria-hidden on
  // the duplicate so screen readers don't announce every logo twice.
  return (
    <section
      className="service-v1-section client-logos-section"
      aria-labelledby="client-logos-eyebrow"
      data-section-ordinal={ordinal}
    >
      <header className="client-logos-head">
        <p id="client-logos-eyebrow" className="client-logos-eyebrow">
          <span className="client-logos-eyebrow-bar" aria-hidden="true" />
          <span>Track record</span>
        </p>
      </header>

      {metrics && metrics.length > 0 ? <TrackRecordMetrics metrics={metrics} /> : null}

      <p className="client-logos-strip-label">Founders we&rsquo;ve worked with</p>

      <div className="client-logos-marquee" aria-label="Client logos">
        <div className="client-logos-track">
          {clients.map((c) => (
            <LogoCell key={c.slug} client={c} />
          ))}
          {clients.map((c) => (
            <LogoCell key={`${c.slug}-dup`} client={c} ariaHidden />
          ))}
        </div>
      </div>
    </section>
  );
}

function LogoCell({ client, ariaHidden = false }: Readonly<{ client: Client; ariaHidden?: boolean }>) {
  return (
    <div
      className="client-logos-cell"
      aria-hidden={ariaHidden || undefined}
      title={client.name}
    >
      <Image
        src={client.logoSrc}
        alt={ariaHidden ? '' : client.logoAlt}
        width={160}
        height={64}
        className="client-logos-img"
        sizes="160px"
        loading="lazy"
      />
    </div>
  );
}
