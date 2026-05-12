'use client';

import { motion } from 'framer-motion';
import { industries } from '@/content/site';
import { Reveal } from '@/components/motion-primitives';

export function HomeIndustries() {
  return (
    <section className="home-v3-industries" aria-label="Industries we serve">
      <Reveal>
        <div className="home-v3-section-header">
          <span className="home-v3-section-eyebrow">Industries</span>
          <h2>Built for businesses where finance decisions carry strategic weight.</h2>
        </div>
      </Reveal>
      <ul className="home-v3-industries-list">
        {industries.map((industry, index) => (
          <motion.li
            key={industry}
            className="home-v3-industry-chip"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * 0.05 }}
          >
            <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            {industry}
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
