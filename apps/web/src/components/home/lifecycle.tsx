'use client';

import { motion } from 'framer-motion';
import { lifecycle } from '@/content/site';
import { Reveal } from '@/components/motion-primitives';

export function HomeLifecycle() {
  return (
    <section className="home-v3-lifecycle" id="business-lifecycle" aria-label="Business lifecycle">
      <Reveal>
        <div className="home-v3-section-header">
          <span className="home-v3-section-eyebrow">Business lifecycle</span>
          <h2>The moments where outside judgement matters.</h2>
          <p>
            Nucleus organises around the decisions founders, boards and finance teams cannot
            improvise — capital, controls, compliance, reporting and transactions.
          </p>
        </div>
      </Reveal>

      <ol className="home-v3-lifecycle-grid">
        {lifecycle.map((item, index) => (
          <motion.li
            key={item.title}
            className="home-v3-lifecycle-card"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1], delay: index * 0.07 }}
          >
            <span className="home-v3-lifecycle-step">{String(index + 1).padStart(2, '0')}</span>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
            <span className="home-v3-lifecycle-rule" aria-hidden="true" />
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
