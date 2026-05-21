import Link from 'next/link';
import { CLIENTS, type ServiceSlug } from '@/content/clients-roster';
import { macroForClient, macroTitle } from '@/content/industry-taxonomy';

type Props = Readonly<{
  serviceSlug: ServiceSlug;
  /** How many logos go into the scroll strip. Default 12 (two swipes of 6). */
  stripCount?: number;
}>;

/**
 * "Businesses we've worked with" — compact horizontal scroller for a
 * single service page. Six cells visible at desktop width; user swipes
 * or scrolls horizontally for the rest. A `See all N →` link below
 * jumps to the filtered clients hub when the practice has more
 * companies than fit in the strip.
 *
 * Placed inline in the main column (NOT full-bleed) right before
 * `<ServiceInsights>`. Track-record metrics live separately at the
 * top of the page via `<TrackRecordBand>`.
 */
export function ServiceClients({ serviceSlug, stripCount = 12 }: Props) {
  const all = CLIENTS.filter((c) => c.services.includes(serviceSlug));
  if (all.length === 0) return null;

  // Sort: clients for whom this service is the primary (only) engagement
  // surface first. Within that tier, alphabetical. Deterministic.
  all.sort(
    (a, b) =>
      a.services.length - b.services.length || a.name.localeCompare(b.name),
  );

  const strip = all.slice(0, stripCount);
  const total = all.length;
  const hasMore = total > strip.length;

  return (
    <section className="businesses-strip-section" aria-labelledby="businesses-strip-title">
      <header className="businesses-strip-head">
        <h2 id="businesses-strip-title" className="businesses-strip-title">
          Businesses we&rsquo;ve <em>worked with</em>
        </h2>
        <p className="businesses-strip-count">
          {total} {total === 1 ? 'company' : 'companies'}
          {hasMore ? ` · scrolling ${strip.length}` : ''}
        </p>
      </header>

      <div className="businesses-strip-scroller" tabIndex={0} aria-label="Client logos — scroll horizontally">
        <ul className="businesses-strip-track">
          {strip.map((c) => {
            const macroSlug = macroForClient(c.slug, c.industrySlug);
            const industry = macroTitle(macroSlug);
            return (
              <li
                key={c.slug + '-' + c.industrySlug}
                className="businesses-strip-cell"
                title={`${c.name} · ${industry}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={c.logoSrc}
                  alt={c.name}
                  className="businesses-strip-logo"
                  loading="lazy"
                  decoding="async"
                />
              </li>
            );
          })}
        </ul>
      </div>

      {hasMore ? (
        <div className="businesses-strip-more">
          <Link
            href={`/clients?service=${serviceSlug}`}
            className="businesses-strip-more-link"
          >
            See all {total} companies in this practice →
          </Link>
        </div>
      ) : null}
    </section>
  );
}
