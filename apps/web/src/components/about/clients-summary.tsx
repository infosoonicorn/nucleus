import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/motion-primitives';
import { clients } from '@/content/clients';

// How many logos to surface on the About-page summary strip.
// /clients has the full list filterable by service line.
const FEATURED_LIMIT = 12;

export function AboutClients() {
  const featured = clients.slice(0, FEATURED_LIMIT);

  if (featured.length === 0) return null;

  return (
    <section className="about-clients" aria-labelledby="about-clients-heading">
      <Reveal>
        <div className="about-clients-inner">
          <header className="about-clients-header">
            <p className="about-clients-eyebrow">Clients</p>
            <h2 id="about-clients-heading" className="about-clients-heading">
              Founders, funds, family offices and corporates &mdash; on both sides of the table.
            </h2>
            <p className="about-clients-sub">
              From series-stage startups to listed companies, from AIFs to family
              offices and banks &mdash; the Nucleus bench has worked across India&rsquo;s
              operating and financial economy. A selection of the firms we have
              helped is below.
            </p>
          </header>

          <ul className="about-clients-grid" aria-label="Selection of Nucleus clients">
            {featured.map((c) => (
              <li className="about-clients-logo" key={c.slug}>
                <Image
                  src={c.logoSrc}
                  alt={c.logoAlt}
                  width={160}
                  height={64}
                  sizes="160px"
                  className="about-clients-logo-img"
                />
              </li>
            ))}
          </ul>

          <div className="about-clients-foot">
            <Link className="about-clients-more" href="/clients">
              See the full client list
              <ArrowUpRight aria-hidden="true" size={16} />
            </Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
