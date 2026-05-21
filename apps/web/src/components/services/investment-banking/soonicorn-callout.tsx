import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import type { Service } from '@/content/site';

// Portfolio companies on the orbital rings. Inner ring = 7, outer ring = 11 = 18 total.
// Mix across mobility, energy, AI, climate, edtech, fintech, aerospace, D2C.
// Highlight one as "live commitment" on each ring (the `highlight` flag) — pure
// stylistic accent.
const INNER = [
  { name: 'Burger Singh',  src: '/brand/portfolio/burger-singh.png', highlight: false },
  { name: 'Kredily',       src: '/brand/portfolio/Kredily.png',      highlight: true  },
  { name: 'Limechat',      src: '/brand/portfolio/Limechat.png',     highlight: false },
  { name: 'Cusmat',        src: '/brand/portfolio/Cusmat.png',       highlight: false },
  { name: 'Wherehouse',    src: '/brand/portfolio/wherehouse.jpg',   highlight: false },
  { name: 'DaveAI',        src: '/brand/portfolio/dave-ai.png',      highlight: false },
  { name: 'Savart',        src: '/brand/portfolio/savart.png',       highlight: false },
];

const OUTER = [
  { name: 'Zypp Electric', src: '/brand/portfolio/zypp.png',         highlight: true  },
  { name: 'Geekster',      src: '/brand/portfolio/Geekster.png',     highlight: false },
  { name: 'Adiabatic',     src: '/brand/portfolio/Adiabatic.png',    highlight: false },
  { name: 'Zingbus',       src: '/brand/portfolio/zingbus.png',      highlight: false },
  { name: 'TSAW',          src: '/brand/portfolio/TSAW.jpg',         highlight: true  },
  { name: 'Pickmywork',    src: '/brand/portfolio/pickmywork.png',   highlight: false },
  { name: 'Skyeair',       src: '/brand/portfolio/skyeair.jpg',      highlight: false },
  { name: 'Brainwired',    src: '/brand/portfolio/brainwired.png',   highlight: false },
  { name: 'Astrophel',     src: '/brand/portfolio/astrophel.png',    highlight: false },
  { name: 'Indrones',      src: '/brand/portfolio/indrones.png',     highlight: false },
  { name: 'Trezi',         src: '/brand/portfolio/trezi.png',        highlight: false },
];

function placeOnRing(count: number, radius: number, index: number): { x: number; y: number } {
  // Distribute evenly starting from the top (12 o'clock).
  const angle = (index / count) * Math.PI * 2 - Math.PI / 2;
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius };
}

export function SoonicornCallout({
  service,
  ordinal,
  hideEyebrow,
}: Readonly<{
  service: Service;
  ordinal?: string;
  /** Hide the section-level "●NN In-house capital..." eyebrow header.
   *  Used by HomeSoonicorn (home page) which supplies its own
   *  Home-canonical eyebrow above this block; the service-page
   *  ordinal convention reads inconsistent on /home. */
  hideEyebrow?: boolean;
}>) {
  const cross = service.crossLink;
  if (!cross) return null;

  const isDev = process.env.NODE_ENV !== 'production';
  if (cross.reviewerStatus !== 'approved' && !isDev) return null;

  return (
    <section
      className="service-v1-section service-v1-section-alt service-v1-soonicorn"
      aria-labelledby="soonicorn-title"
    >
      {cross.reviewerStatus !== 'approved' && isDev ? (
        <p className="service-v1-soonicorn-devbanner">
          DEV ONLY — copy pending reviewer approval. This section will not render in production.
        </p>
      ) : null}

      {hideEyebrow ? null : (
        <header className="service-v1-soonicorn-head">
          <p className="service-v1-soonicorn-eyebrow">
            <span className="service-v1-soonicorn-eyebrow-num">●{ordinal ?? '04'}</span>
            <span aria-hidden="true" className="service-v1-soonicorn-eyebrow-bar" />
            <span>In-house capital, alongside advisory</span>
          </p>
        </header>
      )}

      <article className="service-v1-soonicorn-card">
        {/* LEFT: animated orbital plate */}
        <div className="service-v1-soonicorn-plate" aria-hidden="true">
          <span className="service-v1-soonicorn-plate-reg service-v1-soonicorn-plate-reg-tl" />
          <span className="service-v1-soonicorn-plate-reg service-v1-soonicorn-plate-reg-br" />

          <div className="service-v1-soonicorn-plate-top">
            <span className="service-v1-soonicorn-plate-eyebrow">
              Soonicorn Angel Trust&mdash;I
            </span>
            <span className="service-v1-soonicorn-live">
              <span className="service-v1-soonicorn-live-dot" />
              <span>Fund Active</span>
            </span>
          </div>

          <div className="service-v1-soonicorn-orbits">
            <div className="service-v1-soonicorn-stage">
              {/* rings */}
              <span className="service-v1-soonicorn-ring service-v1-soonicorn-ring-2" />
              <span className="service-v1-soonicorn-ring service-v1-soonicorn-ring-1" />

              {/* core with the Soonicorn icon */}
              <span className="service-v1-soonicorn-core">
                <span className="service-v1-soonicorn-core-ring" />
                <Image
                  src="/brand/soonicorn-icon.png"
                  alt=""
                  width={64}
                  height={64}
                  className="service-v1-soonicorn-core-mark"
                  priority={false}
                />
              </span>

              {/* inner ring satellites */}
              <div className="service-v1-soonicorn-sats service-v1-soonicorn-sats-inner">
                {INNER.map((p, i) => {
                  const { x, y } = placeOnRing(INNER.length, 100, i);
                  return (
                    <span
                      key={p.name}
                      className={`service-v1-soonicorn-sat${p.highlight ? ' is-hot' : ''}`}
                      style={{ left: `${x}px`, top: `${y}px` }}
                    >
                      <Image src={p.src} alt="" width={36} height={36} />
                    </span>
                  );
                })}
              </div>

              {/* outer ring satellites */}
              <div className="service-v1-soonicorn-sats service-v1-soonicorn-sats-outer">
                {OUTER.map((p, i) => {
                  const { x, y } = placeOnRing(OUTER.length, 150, i);
                  return (
                    <span
                      key={p.name}
                      className={`service-v1-soonicorn-sat${p.highlight ? ' is-hot' : ''}`}
                      style={{ left: `${x}px`, top: `${y}px` }}
                    >
                      <Image src={p.src} alt="" width={32} height={32} />
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="service-v1-soonicorn-plate-foot">
            <div>
              <p className="service-v1-soonicorn-plate-val">
                <em>60+</em> companies
              </p>
              <p className="service-v1-soonicorn-plate-lab">Portfolio</p>
            </div>
            <div>
              <p className="service-v1-soonicorn-plate-val">
                <em>18+</em> sectors
              </p>
              <p className="service-v1-soonicorn-plate-lab">Coverage</p>
            </div>
          </div>
        </div>

        {/* RIGHT: copy + CTA */}
        <div className="service-v1-soonicorn-body">
          <p className="service-v1-soonicorn-body-eyebrow">
            <span className="service-v1-soonicorn-eyebrow-num">{cross.brand}</span>
            <span aria-hidden="true" className="service-v1-soonicorn-eyebrow-bar" />
            <span>A Nucleus initiative</span>
          </p>

          <h2 id="soonicorn-title" className="service-v1-soonicorn-title">
            Capital that moves <em>with the advice.</em>
          </h2>

          <p className="service-v1-soonicorn-lede">{cross.body}</p>

          <div className="service-v1-soonicorn-specs">
            <div>
              <p className="service-v1-soonicorn-spec-lab">Stage</p>
              <p className="service-v1-soonicorn-spec-val">Seed to Series A</p>
            </div>
            <div>
              <p className="service-v1-soonicorn-spec-lab">Cheque</p>
              <p className="service-v1-soonicorn-spec-val">
                Up to <em>$1M</em>
              </p>
            </div>
            <div>
              <p className="service-v1-soonicorn-spec-lab">Geography</p>
              <p className="service-v1-soonicorn-spec-val">India-first</p>
            </div>
          </div>

          <div className="service-v1-soonicorn-cta-row">
            <a
              className="service-v1-soonicorn-cta"
              href={cross.href}
              target="_blank"
              rel="noopener noreferrer"
              data-cross-link="soonicorn"
              aria-label={`${cross.ctaLabel} (opens in a new tab)`}
            >
              <span>{cross.ctaLabel}</span>
              <span aria-hidden="true" className="service-v1-soonicorn-cta-arrow">
                <ArrowUpRight size={14} />
              </span>
            </a>
            <span className="service-v1-soonicorn-cta-aside">Or speak with a partner first</span>
          </div>

          <p className="service-v1-soonicorn-disclaimer">
            <strong>Important:</strong> {cross.disclaimer}
          </p>
        </div>
      </article>
    </section>
  );
}
