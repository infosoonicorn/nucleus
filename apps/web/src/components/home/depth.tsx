'use client';

import { motion } from 'framer-motion';
import { Building2, Newspaper, UsersRound } from 'lucide-react';
import { Reveal } from '@/components/motion-primitives';

const signals = [
  {
    icon: Building2,
    title: 'Soonicorn and AIF operating proof',
    text: 'Nucleus is Investment Manager to Soonicorn Angel Trust-I. The site presents this as fund operations experience, not investment solicitation.',
  },
  {
    icon: Newspaper,
    title: 'Knowledge bank and tools',
    text: 'Insights, checklists and lead magnets are mapped service-wise for editorial review and structured distribution.',
  },
  {
    icon: UsersRound,
    title: 'Partner-visible delivery',
    text: 'Service pages name the relevant experts and keep proof blocks service-specific where verified numbers are pending.',
  },
];

export function HomeDepth() {
  return (
    <section className="home-v3-depth" aria-label="Advisory depth">
      <Reveal>
        <div className="home-v3-section-header">
          <span className="home-v3-section-eyebrow">Advisory depth</span>
          <h2>Capital, controls and compliance handled as connected workstreams.</h2>
          <p>
            The firm’s strength is not one isolated service. It is the ability to connect
            transaction work with risk, tax, assurance, governance and finance operations.
          </p>
        </div>
      </Reveal>

      <div className="home-v3-depth-grid">
        {signals.map((signal, index) => {
          const Icon = signal.icon;

          return (
            <motion.article
              key={signal.title}
              className="home-v3-depth-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
            >
              <span className="home-v3-depth-icon" aria-hidden="true">
                <Icon size={22} />
              </span>
              <h3>{signal.title}</h3>
              <p>{signal.text}</p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
