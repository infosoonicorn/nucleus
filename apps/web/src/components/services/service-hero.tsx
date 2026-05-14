import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Service } from '@/content/site';
import { FadeIn, Magnetic, WordReveal } from '@/components/motion-primitives';

export function ServiceHero({ service }: Readonly<{ service: Service }>) {
  const headline = service.displayHeadline ?? service.title;
  return (
    <section className="service-v1-hero" aria-label={`${service.title} hero`}>
      <div className="service-v1-hero-stage">
        <FadeIn duration={0.55}>
          <p className="home-v3-eyebrow">
            <span aria-hidden="true" />
            §{service.ordinal} / {service.title}
          </p>
        </FadeIn>
        <h1 className="service-v1-headline home-v3-headline-display">
          <span className="home-v3-sr-only">{headline}</span>
          <span className="home-v3-headline-row" aria-hidden="true">
            <WordReveal text={headline} />
          </span>
        </h1>
        <FadeIn delay={0.7} duration={0.7}>
          <p className="service-v1-lede">{service.promise}</p>
        </FadeIn>
        <FadeIn delay={0.95} duration={0.6}>
          <div className="home-v3-cta-row">
            <Magnetic strength={0.18}>
              <Link
                className="home-v3-button home-v3-button-primary"
                href={`/contact?intent=${service.slug}`}
              >
                {service.cta}
                <ArrowRight aria-hidden="true" size={18} />
              </Link>
            </Magnetic>
            <Link className="home-v3-button home-v3-button-ghost" href="/services">
              All services
              <ArrowUpRight aria-hidden="true" size={18} />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
