import { clientSegments } from '@/content/site';
import { Reveal } from '@/components/motion-primitives';

export function WhoWeServe() {
  return (
    <section className="home-v3-builtfor" aria-label="Who Nucleus serves">
      <Reveal>
        <div className="home-v3-section-header">
          <span className="home-v3-section-eyebrow">Who we serve</span>
          <h2>Built for both sides of the capital table.</h2>
          <p>
            Operating businesses and financial institutions — across audit, tax,
            transactions and advisory, with the same partner-led bench.
          </p>
        </div>
      </Reveal>

      <Reveal>
        <div className="builtfor-columns">
          {clientSegments.map((segment) => (
            <div className="builtfor-column" key={segment.slug}>
              <p className="builtfor-column-label">{segment.label}</p>
              <ul className="builtfor-list">
                {segment.items.map((item) => (
                  <li key={item.slug} className="builtfor-item">
                    <span className="builtfor-item-icon" aria-hidden="true">
                      <item.icon size={18} />
                    </span>
                    <div className="builtfor-item-body">
                      <span className="builtfor-item-name">{item.name}</span>
                      <span className="builtfor-item-context">{item.context}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
