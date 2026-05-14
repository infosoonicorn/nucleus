import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { services, type Service } from '@/content/site';
import { SectionHeader } from '@/components/sections';

export function RelatedServices({ service }: Readonly<{ service: Service }>) {
  const related = services.filter((item) => item.slug !== service.slug).slice(0, 3);
  return (
    <section className="service-v1-section">
      <SectionHeader eyebrow="Related services" title="Adjacent workstreams often connect." />
      <div className="service-v1-related-grid">
        {related.map((item) => (
          <Link className="service-v1-related-card" href={`/services/${item.slug}`} key={item.slug}>
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
            <span className="service-v1-card-link">
              View service
              <ArrowRight aria-hidden="true" size={16} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
