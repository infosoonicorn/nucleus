import Image from 'next/image';
import Link from 'next/link';
import { Linkedin, Mail } from 'lucide-react';
import { navigation, services, site } from '@/content/site';
import { articles, getArticleAuthor } from '@/content/articles';
import { SiteNav, type NavLatestArticle } from './site-nav';

function pickLatestArticle(): NavLatestArticle | null {
  const allowDrafts = process.env.NODE_ENV !== 'production';
  const visible = articles.filter((a) =>
    allowDrafts ? true : a.reviewerStatus === 'approved',
  );
  if (visible.length === 0) return null;
  const latest = [...visible].sort((a, b) =>
    b.publishedOn.localeCompare(a.publishedOn),
  )[0];
  let authorName = '';
  try {
    authorName = getArticleAuthor(latest).name;
  } catch {
    authorName = '';
  }
  return {
    slug: latest.slug,
    title: latest.title,
    tag: latest.tag,
    publishedOn: latest.publishedOn,
    readMinutes: latest.readMinutes,
    thumbnailSrc: latest.thumbnailSrc ?? null,
    authorName,
  };
}

export function Header() {
  return <SiteNav latestArticle={pickLatestArticle()} />;
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
