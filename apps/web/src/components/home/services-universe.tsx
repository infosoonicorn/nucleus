'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { services } from '@/content/site';
import { Reveal } from '@/components/motion-primitives';

export function HomeServicesUniverse() {
  return (
    <section className="home-v3-services" aria-label="Service universe">
      <Reveal>
        <div className="home-v3-section-header home-v3-section-header-on-dark">
          <span className="home-v3-section-eyebrow home-v3-section-eyebrow-light">Services</span>
          <h2>A connected advisory universe.</h2>
          <p>
            Nine service lines covering capital, transactions, controls, tax, assurance,
            valuations, finance operations, secretarial work and AIF/fund operations.
          </p>
        </div>
      </Reveal>

      <div className="home-v3-services-grid">
        {services.map((service, index) => {
          const Icon = service.icon;

          return (
            <motion.div
              key={service.slug}
              className="home-v3-service-card-wrap"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: (index % 3) * 0.08 }}
            >
              <Link className="home-v3-service-card" href={`/services/${service.slug}`}>
                <span className="home-v3-service-icon" aria-hidden="true">
                  <Icon size={22} />
                </span>
                <span className="home-v3-service-number">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3>{service.title}</h3>
                <p>{service.summary}</p>
                <span className="home-v3-service-link">
                  Explore service
                  <ArrowUpRight aria-hidden="true" size={16} />
                </span>
                <span className="home-v3-service-glow" aria-hidden="true" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
