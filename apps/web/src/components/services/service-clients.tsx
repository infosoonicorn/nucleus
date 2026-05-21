import Link from 'next/link';
import { CLIENTS, type ServiceSlug } from '@/content/clients-roster';
import { macroForClient, macroTitle } from '@/content/industry-taxonomy';

type Props = Readonly<{
  serviceSlug: ServiceSlug;
}>;

/**
 * "Businesses we've worked with" — auto-scrolling marquee band placed
 * inline on every service page right before <ServiceInsights>.
 *
 * Brand spec:
 *   - Eyebrow with bullet + label (matches the rest of the service page)
 *   - Newsreader heading with italic emphasis on "worked with"
 *   - Solid-white strip behind the logos so client logos with white
 *     backgrounds (most of them) land seamlessly without grey halos
 *   - CSS-only marquee (no JS) — duplicated track for seamless loop;
 *     pauses on hover/focus; respects prefers-reduced-motion
 *   - 'See all N companies →' link below the strip → /clients hub
 *
 * The component is universal — every service-page composition uses
 * the same render. Sort puts single-service clients first so the IB
 * page surfaces fundraising portfolio names before multi-service ones.
 */
export function ServiceClients({ serviceSlug }: Props) {
  const all = CLIENTS.filter((c) => c.services.includes(serviceSlug));
  if (all.length === 0) return null;

  all.sort(
    (a, b) =>
      a.services.length - b.services.length || a.name.localeCompare(b.name),
  );
  const total = all.length;

  return (
    <section
      className="service-v1-section businesses-band-section"
      aria-labelledby="businesses-band-title"
    >
      <header className="businesses-band-head">
        <p className="businesses-band-eyebrow">
          <span className="businesses-band-eyebrow-bar" aria-hidden="true" />
          <span>Businesses on the desk</span>
        </p>
        <h2 id="businesses-band-title" className="businesses-band-title">
          Businesses we&rsquo;ve <em>worked with</em>.
        </h2>
      </header>

      <div className="businesses-band-strip" aria-label={`${total} client logos`}>
        <div className="businesses-band-track">
          {all.map((c) => (
            <LogoCell key={c.slug + '-' + c.industrySlug} client={c} />
          ))}
          {/* Duplicated for seamless CSS loop. aria-hidden so screen
              readers don't announce the same companies twice. */}
          {all.map((c) => (
            <LogoCell key={c.slug + '-' + c.industrySlug + '-dup'} client={c} ariaHidden />
          ))}
        </div>
      </div>

      <div className="businesses-band-more">
        <Link
          href={`/clients?service=${serviceSlug}`}
          className="businesses-band-more-link"
        >
          See all {total} {total === 1 ? 'company' : 'companies'} in this practice →
        </Link>
      </div>
    </section>
  );
}

function LogoCell({
  client,
  ariaHidden = false,
}: Readonly<{
  client: (typeof CLIENTS)[number];
  ariaHidden?: boolean;
}>) {
  const macroSlug = macroForClient(client.slug, client.industrySlug);
  const industry = macroTitle(macroSlug);
  return (
    <div
      className="businesses-band-cell"
      aria-hidden={ariaHidden || undefined}
      title={`${client.name} · ${industry}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={client.logoSrc}
        alt={ariaHidden ? '' : client.name}
        className="businesses-band-logo"
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}
