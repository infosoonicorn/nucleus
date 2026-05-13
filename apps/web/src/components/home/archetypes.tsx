'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';
import { clientArchetypes, type ClientArchetype } from '@/content/site';
import { Reveal } from '@/components/motion-primitives';

function handleSpotlight(event: React.MouseEvent<HTMLElement>) {
  const node = event.currentTarget;
  const rect = node.getBoundingClientRect();
  node.style.setProperty('--mx', `${event.clientX - rect.left}px`);
  node.style.setProperty('--my', `${event.clientY - rect.top}px`);
}

// Comma-separated value lines are also the natural bullet points for the
// featured card's larger surface.
function splitBullets(valueLine: string): string[] {
  return valueLine
    .replace(/\.$/, '')
    .split(/,\s*|\s+and\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1));
}

type ArchetypeCardProps = {
  archetype: ClientArchetype;
  index: number;
};

function FeaturedCard({ archetype, index }: Readonly<ArchetypeCardProps>) {
  const Icon = archetype.icon;
  const bullets = splitBullets(archetype.valueLine);

  return (
    <motion.article
      className="home-v3-archetype home-v3-archetype-featured"
      onMouseMove={handleSpotlight}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: index * 0.07 }}
    >
      <span className="home-v3-archetype-border" aria-hidden="true" />
      <span className="home-v3-archetype-spotlight" aria-hidden="true" />

      <header className="home-v3-archetype-head">
        <span className="home-v3-archetype-icon" aria-hidden="true">
          <Icon size={26} />
        </span>
        <span className="home-v3-archetype-number" aria-hidden="true">
          Featured · {String(index + 1).padStart(2, '0')}
        </span>
      </header>

      <div className="home-v3-archetype-body">
        <h3>{archetype.name}</h3>
        <p>Operating reality the Nucleus bench is built around.</p>
      </div>

      <ul className="home-v3-archetype-bullets">
        {bullets.map((bullet) => (
          <li key={bullet}>
            <span className="home-v3-archetype-bullets-dot" aria-hidden="true" />
            {bullet}
          </li>
        ))}
      </ul>

      <footer className="home-v3-archetype-foot" aria-hidden="true">
        <span>Explore practice</span>
        <ArrowUpRight size={15} />
      </footer>
    </motion.article>
  );
}

function SupportingCard({ archetype, index }: Readonly<ArchetypeCardProps>) {
  const Icon = archetype.icon;

  return (
    <motion.article
      className="home-v3-archetype"
      onMouseMove={handleSpotlight}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: index * 0.07 }}
    >
      <span className="home-v3-archetype-border" aria-hidden="true" />
      <span className="home-v3-archetype-spotlight" aria-hidden="true" />

      <header className="home-v3-archetype-head">
        <span className="home-v3-archetype-icon" aria-hidden="true">
          <Icon size={20} />
        </span>
        <span className="home-v3-archetype-number" aria-hidden="true">
          {String(index + 1).padStart(2, '0')}
        </span>
      </header>

      <div className="home-v3-archetype-body">
        <h3>{archetype.name}</h3>
        <p>{archetype.valueLine}</p>
      </div>

      <footer className="home-v3-archetype-foot" aria-hidden="true">
        <span>Explore practice</span>
        <ArrowUpRight size={14} />
      </footer>
    </motion.article>
  );
}

function ArchetypeTieback() {
  return (
    <motion.aside
      className="home-v3-archetype-tieback"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: 0.36 }}
    >
      <span className="home-v3-archetype-tieback-rail" aria-hidden="true" />
      <span className="home-v3-archetype-tieback-glow" aria-hidden="true" />
      <span className="home-v3-archetype-tieback-icon" aria-hidden="true">
        <Sparkles size={18} />
      </span>
      <div>
        <span className="home-v3-archetype-tieback-eyebrow">Cross-archetype thesis</span>
        <strong>All five contexts. One partner-led bench.</strong>
        <p>
          Every Nucleus engagement maps to one of these operating contexts — different
          metrics, different rhythms, the same disciplined judgement.
        </p>
      </div>
    </motion.aside>
  );
}

export function HomeBuiltFor() {
  const [featured, ...rest] = clientArchetypes;

  return (
    <section className="home-v3-builtfor" aria-label="Built for these client archetypes">
      <Reveal>
        <div className="home-v3-section-header">
          <span className="home-v3-section-eyebrow">Built for</span>
          <h2>Where finance decisions carry strategic weight.</h2>
          <p>
            Nucleus&rsquo; bench is configured for five operating contexts. Different metrics,
            different rhythms, the same disciplined judgement underneath.
          </p>
        </div>
      </Reveal>

      <div className="home-v3-builtfor-grid">
        <FeaturedCard archetype={featured} index={0} />
        {rest.map((archetype, idx) => (
          <SupportingCard
            key={archetype.slug}
            archetype={archetype}
            index={idx + 1}
          />
        ))}
        <ArchetypeTieback />
      </div>
    </section>
  );
}
