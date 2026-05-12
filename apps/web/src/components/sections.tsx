import Link from 'next/link';
import { ArrowRight, Download, Mail } from 'lucide-react';
import { proof, services, site, type Service } from '@/content/site';

export function Eyebrow({ children }: Readonly<{ children: React.ReactNode }>) {
  return <p className="eyebrow">{children}</p>;
}

export function SectionHeader({
  eyebrow,
  title,
  text,
}: Readonly<{ eyebrow?: string; title: string; text?: string }>) {
  return (
    <div className="section-header">
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2>{title}</h2>
      {text ? <p>{text}</p> : null}
    </div>
  );
}

export function ProofBar() {
  return (
    <div className="proof-bar" aria-label="Firm proof">
      {proof.map((item) => (
        <div key={item.label}>
          <strong>{item.value}</strong>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export function ServiceGrid({ limit }: Readonly<{ limit?: number }>) {
  const visibleServices = typeof limit === 'number' ? services.slice(0, limit) : services;

  return (
    <div className="service-grid">
      {visibleServices.map((service) => {
        const Icon = service.icon;

        return (
          <Link className="service-card" href={`/services/${service.slug}`} key={service.slug}>
            <span className="service-icon">
              <Icon aria-hidden="true" size={22} />
            </span>
            <h3>{service.title}</h3>
            <p>{service.summary}</p>
            <span className="card-link">
              Explore service
              <ArrowRight aria-hidden="true" size={16} />
            </span>
          </Link>
        );
      })}
    </div>
  );
}

export function ContactBand({
  title = 'Start a conversation with Nucleus Advisors.',
  text = 'Tell us what decision, transaction, compliance issue or finance operating challenge you are working through.',
}: Readonly<{ title?: string; text?: string }>) {
  return (
    <section className="contact-band">
      <div>
        <Eyebrow>Contact</Eyebrow>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      <div className="band-actions">
        <Link className="button" href="/contact">
          Start a conversation
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
        <a className="button button-ghost" href={`mailto:${site.email}`}>
          <Mail aria-hidden="true" size={18} />
          {site.email}
        </a>
      </div>
    </section>
  );
}

export function LeadMagnet({ service }: Readonly<{ service: Service }>) {
  return (
    <section className="lead-magnet">
      <span className="service-icon">
        <Download aria-hidden="true" size={22} />
      </span>
      <div>
        <Eyebrow>Lead magnet</Eyebrow>
        <h2>{service.leadMagnet}</h2>
        <p>
          Phase 1 presents the downloadable asset as a structured CTA. Capture, storage and gated
          delivery move into Phase 1.5.
        </p>
      </div>
      <Link className="button" href="/contact">
        {service.cta}
        <ArrowRight aria-hidden="true" size={18} />
      </Link>
    </section>
  );
}
