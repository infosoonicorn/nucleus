import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import type { Service } from '@/content/site';

export function SoonicornCallout({ service }: Readonly<{ service: Service }>) {
  const cross = service.crossLink;
  if (!cross) return null;

  const isDev = process.env.NODE_ENV !== 'production';
  if (cross.reviewerStatus !== 'approved' && !isDev) return null;

  return (
    <section className="service-v1-section service-v1-section-alt service-v1-soonicorn">
      {cross.reviewerStatus !== 'approved' && isDev ? (
        <p className="service-v1-soonicorn-devbanner">
          DEV ONLY — copy pending reviewer approval. This section will not render in production.
        </p>
      ) : null}
      <div className="service-v1-soonicorn-card">
        <div className="service-v1-soonicorn-brand">
          <Image
            src={cross.logoPath}
            alt={`${cross.brand} wordmark`}
            width={220}
            height={62}
            priority={false}
          />
          <p className="home-v3-eyebrow">{cross.eyebrow}</p>
          <h2>{cross.title}</h2>
        </div>
        <div className="service-v1-soonicorn-body">
          <p>{cross.body}</p>
          <a
            className="home-v3-button home-v3-button-primary"
            href={cross.href}
            target="_blank"
            rel="noopener noreferrer"
            data-cross-link="soonicorn"
            aria-label={`${cross.ctaLabel} (opens soonicornventures.com in a new tab)`}
          >
            {cross.ctaLabel}
            <ArrowUpRight aria-hidden="true" size={18} />
          </a>
          <p className="service-v1-soonicorn-disclaimer">{cross.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}
