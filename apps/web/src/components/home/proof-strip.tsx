'use client';

import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { CountUp, Reveal } from '@/components/motion-primitives';
import { proof, proofAsOf } from '@/content/site';

export function HomeProofStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 85%', 'end 35%'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 22,
    mass: 0.6,
  });
  const railWidth = useTransform(smoothProgress, [0, 1], ['0%', '100%']);

  return (
    <section className="home-v3-proof" aria-label="Firm proof points" ref={sectionRef}>
      <Reveal>
        <div className="home-v3-proof-header">
          <div className="home-v3-proof-header-row">
            <span className="home-v3-proof-eyebrow">By the numbers</span>
            <span className="home-v3-proof-asof">
              <span aria-hidden="true" className="home-v3-proof-asof-dot" />
              As at <time dateTime={proofAsOf.iso}>{proofAsOf.label}</time>
            </span>
          </div>
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
            <span className="home-v3-proof-index" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="home-v3-proof-value">
              <CountUp to={item.value} suffix={item.suffix} />
            </span>
            <span className="home-v3-proof-label">{item.label}</span>
          </motion.div>
        ))}
      </div>

      <div className="home-v3-proof-rail" aria-hidden="true">
        <motion.span className="home-v3-proof-rail-fill" style={{ width: railWidth }} />
      </div>
    </section>
  );
}
