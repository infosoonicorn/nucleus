'use client';

import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import { site } from '@/content/site';
import { Magnetic, Reveal } from '@/components/motion-primitives';

export function HomeClosingCta() {
  return (
    <section className="home-v3-closing" aria-label="Contact Nucleus Advisors">
      <span className="home-v3-closing-glow" aria-hidden="true" />
      <Reveal className="home-v3-closing-inner">
        <span className="home-v3-section-eyebrow home-v3-section-eyebrow-light">Contact</span>
        <h2>Start a conversation with Nucleus Advisors.</h2>
        <p>
          Tell us what decision, transaction, compliance issue or finance operating challenge you
          are working through. A partner will respond within one working day.
        </p>
        <div className="home-v3-closing-actions">
          <Magnetic strength={0.18}>
            <Link className="home-v3-button home-v3-button-primary" href="/contact">
              Start a conversation
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </Magnetic>
          <a className="home-v3-button home-v3-button-ghost-light" href={`mailto:${site.email}`}>
            <Mail aria-hidden="true" size={18} />
            {site.email}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
