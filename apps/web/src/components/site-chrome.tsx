import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Linkedin, Mail } from 'lucide-react';
import { navigation, services, site } from '@/content/site';

export function Header() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="Nucleus Advisors home">
        <Image src="/brand/nucleus-logo.png" alt="" width={181} height={60} priority />
      </Link>
      <nav className="primary-nav" aria-label="Primary navigation">
        {navigation.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="header-actions">
        <a className="icon-link" href={site.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
          <Linkedin aria-hidden="true" size={18} />
        </a>
        <Link className="button button-small" href="/contact">
          Contact
          <ArrowUpRight aria-hidden="true" size={16} />
        </Link>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <Image src="/brand/nucleus-logo.png" alt="Nucleus Advisors" width={181} height={60} />
          <p>
            Full-spectrum advisory for transactions, controls, compliance, reporting and growth
            decisions.
          </p>
        </div>
        <div className="footer-grid">
          <div>
            <h2>Services</h2>
            {services.slice(0, 5).map((service) => (
              <Link key={service.slug} href={`/services/${service.slug}`}>
                {service.title}
              </Link>
            ))}
          </div>
          <div>
            <h2>More Services</h2>
            {services.slice(5).map((service) => (
              <Link key={service.slug} href={`/services/${service.slug}`}>
                {service.title}
              </Link>
            ))}
          </div>
          <div>
            <h2>Company</h2>
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
            <Link href="/downloads">Downloads</Link>
          </div>
          <div>
            <h2>Contact</h2>
            <a href={`mailto:${site.email}`}>
              <Mail aria-hidden="true" size={15} />
              {site.email}
            </a>
            <a href={site.linkedin} target="_blank" rel="noreferrer">
              <Linkedin aria-hidden="true" size={15} />
              LinkedIn
            </a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© 2026 Nucleus Advisors</span>
        <span>Policy placeholders will be added with approved legal copy.</span>
      </div>
    </footer>
  );
}

export function PageShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
