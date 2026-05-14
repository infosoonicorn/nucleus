import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Service } from '@/content/site';

export function ContactBand({ service }: Readonly<{ service: Service }>) {
  return (
    <section className="service-v1-contact-band">
      <div>
        <h2>Talk to Nucleus about {service.title}.</h2>
        <p>{service.promise}</p>
      </div>
      <Link className="home-v3-button home-v3-button-primary" href="/contact">
        {service.cta}
        <ArrowRight aria-hidden="true" size={18} />
      </Link>
    </section>
  );
}
