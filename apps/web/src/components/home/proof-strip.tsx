'use client';

import { motion } from 'framer-motion';
import { CountUp, Reveal } from '@/components/motion-primitives';

const proof = [
  { value: 8, suffix: '', label: 'Partners' },
  { value: 90, suffix: '+', label: 'Team members' },
  { value: 130, suffix: '+', label: 'Clients served' },
  { value: 50, suffix: '+', label: 'Deals closed' },
  { value: 5, suffix: '', label: 'Offices' },
  { value: 100, suffix: '+', label: 'Years combined experience' },
];

export function HomeProofStrip() {
  return (
    <section className="home-v3-proof" aria-label="Firm proof points">
      <Reveal>
        <div className="home-v3-proof-header">
          <span className="home-v3-proof-eyebrow">By the numbers</span>
          <h2>The depth behind the advisory.</h2>
        </div>
      </Reveal>
      <div className="home-v3-proof-grid">
        {proof.map((item, index) => (
          <motion.div
            key={item.label}
            className="home-v3-proof-cell"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.06 }}
          >
            <span className="home-v3-proof-value">
              <CountUp to={item.value} suffix={item.suffix} />
            </span>
            <span className="home-v3-proof-label">{item.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
