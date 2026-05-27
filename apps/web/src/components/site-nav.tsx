'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { startTransition, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpRight,
  BookOpen,
  Briefcase,
  Building2,
  ChevronDown,
  GraduationCap,
  HeartHandshake,
  Landmark,
  Linkedin,
  Menu,
  Radio,
  Scale,
  ShieldCheck,
  Sparkles,
  Users,
  Wallet,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { site } from '@/content/site';

type ServiceLink = {
  href: string;
  title: string;
  blurb: string;
  icon: LucideIcon;
};

type ServiceGroup = {
  heading: string;
  items: ServiceLink[];
};

const servicesMenu: ServiceGroup[] = [
  {
    heading: 'Transactions',
    items: [
      {
        href: '/services/investment-banking',
        title: 'Investment Banking',
        blurb: 'Fundraising, investor targeting, modelling, deal execution.',
        icon: Sparkles,
      },
      {
        href: '/services/ma-advisory',
        title: 'M&A Advisory',
        blurb: 'Buy-side, sell-side, restructuring, integration support.',
        icon: HeartHandshake,
      },
      {
        href: '/services/valuations',
        title: 'Valuations',
        blurb: 'Reg-grade and transaction-grade valuations across stages.',
        icon: Landmark,
      },
    ],
  },
  {
    heading: 'Assurance & Controls',
    items: [
      {
        href: '/services/assurance',
        title: 'Assurance',
        blurb: 'Statutory audit, IndAS/IFRS reporting, group audits.',
        icon: ShieldCheck,
      },
      {
        href: '/services/risk-advisory',
        title: 'Risk Advisory',
        blurb: 'Internal audit, SOX, ICFR, ERM, controls transformation.',
        icon: ShieldCheck,
      },
    ],
  },
  {
    heading: 'Tax · Compliance · Funds',
    items: [
      {
        href: '/services/tax-regulatory',
        title: 'Tax & Regulatory',
        blurb: 'Direct, indirect, international tax and regulatory advisory.',
        icon: Scale,
      },
      {
        href: '/services/corporate-secretarial',
        title: 'Corporate Secretarial',
        blurb: 'Compliance calendars, ROC, FEMA, governance hygiene.',
        icon: Briefcase,
      },
      {
        href: '/services/finance-outsourcing',
        title: 'Finance Outsourcing',
        blurb: 'Controller, FP&A, accounts payable and close support.',
        icon: Wallet,
      },
      {
        href: '/services/aif-fund-management',
        title: 'AIF & Fund Management',
        blurb: 'Fund accounting, NAV, investor reporting, compliance.',
        icon: Building2,
      },
    ],
  },
];

type SimpleLink = {
  href: string;
  title: string;
  blurb: string;
  icon: LucideIcon;
};

const aboutMenu: { heading: string; items: SimpleLink[] }[] = [
  {
    heading: 'The firm',
    items: [
      {
        href: '/about',
        title: 'About Nucleus',
        blurb: 'Our story, partners, locations and what we believe.',
        icon: Building2,
      },
      {
        href: '/team',
        title: 'Our team',
        blurb: '90+ professionals across audit, tax, deals and advisory.',
        icon: Users,
      },
      {
        href: '/clients',
        title: 'Clients',
        blurb: 'Founders, funds, family offices and corporates we serve.',
        icon: HeartHandshake,
      },
    ],
  },
  {
    heading: 'Join us',
    items: [
      {
        href: '/careers',
        title: 'Careers',
        blurb: 'Open roles across our offices in India.',
        icon: Briefcase,
      },
      {
        href: '/careers/life-at-nucleus',
        title: 'Life at Nucleus',
        blurb: 'How we work, learn, and grow together.',
        icon: GraduationCap,
      },
      {
        href: '/careers/alumni',
        title: 'Alumni',
        blurb: 'Stay connected with the Nucleus network.',
        icon: Users,
      },
    ],
  },
];

type MenuKey = 'about' | 'services' | 'insights' | null;

export type NavLatestArticle = {
  slug: string;
  title: string;
  tag: string;
  publishedOn: string;
  readMinutes: number;
  thumbnailSrc: string | null;
  authorName: string;
};

const insightsServiceList: { href: string; title: string; icon: LucideIcon }[] = [
  { href: '/insights?service=investment-banking', title: 'Investment Banking', icon: Sparkles },
  { href: '/insights?service=ma-advisory', title: 'M&A Advisory', icon: HeartHandshake },
  { href: '/insights?service=valuations', title: 'Valuations', icon: Landmark },
  { href: '/insights?service=assurance', title: 'Assurance', icon: ShieldCheck },
  { href: '/insights?service=risk-advisory', title: 'Risk Advisory', icon: ShieldCheck },
  { href: '/insights?service=tax-regulatory', title: 'Tax & Regulatory', icon: Scale },
  { href: '/insights?service=corporate-secretarial', title: 'Corporate Secretarial', icon: Briefcase },
  { href: '/insights?service=finance-outsourcing', title: 'Finance Outsourcing', icon: Wallet },
  { href: '/insights?service=aif-fund-management', title: 'AIF & Fund Management', icon: Building2 },
];

function formatInsightDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function SiteNav({ latestArticle = null }: { latestArticle?: NavLatestArticle | null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState<MenuKey>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const aboutMenuId = useId();
  const servicesMenuId = useId();
  const insightsMenuId = useId();

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(null);
        setMobileOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Close on route change
  useEffect(() => {
    startTransition(() => {
      setOpen(null);
      setMobileOpen(false);
    });
  }, [pathname]);

  // Lock body scroll when mobile sheet is open
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 140);
  }

  function cancelClose() {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }

  function activate(key: MenuKey) {
    cancelClose();
    setOpen(key);
  }

  const isActive = (href: string) =>
    href === '/'
      ? pathname === '/'
      : pathname === href || pathname.startsWith(`${href}/`);

  const aboutActive = aboutMenu.some((g) => g.items.some((i) => isActive(i.href)));
  const servicesActive = pathname.startsWith('/services');
  const insightsActive = pathname.startsWith('/insights');

  return (
    <header
      ref={headerRef}
      className="site-nav-header"
      onMouseLeave={scheduleClose}
    >
      <div className="site-nav-row">
        <Link className="site-nav-brand" href="/" aria-label="Nucleus Advisors home">
          <Image
            src="/brand/nucleus-logo.png"
            alt="Nucleus Advisors"
            width={181}
            height={60}
            priority
          />
        </Link>

        <nav
          className="site-nav-primary"
          aria-label="Primary navigation"
          onMouseLeave={scheduleClose}
        >
          <NavTrigger
            label="About"
            isOpen={open === 'about'}
            isActive={aboutActive}
            controlsId={aboutMenuId}
            onHover={() => activate('about')}
            onFocus={() => activate('about')}
            onClick={() => setOpen(open === 'about' ? null : 'about')}
          />
          <NavTrigger
            label="Services"
            isOpen={open === 'services'}
            isActive={servicesActive}
            controlsId={servicesMenuId}
            onHover={() => activate('services')}
            onFocus={() => activate('services')}
            onClick={() => setOpen(open === 'services' ? null : 'services')}
          />
          <NavTrigger
            label="Insights"
            isOpen={open === 'insights'}
            isActive={insightsActive}
            controlsId={insightsMenuId}
            onHover={() => activate('insights')}
            onFocus={() => activate('insights')}
            onClick={() => setOpen(open === 'insights' ? null : 'insights')}
          />
          <Link
            href="/resources"
            className={`site-nav-link${isActive('/resources') ? ' is-active' : ''}`}
            onMouseEnter={() => activate(null)}
          >
            <span>Resources</span>
            <span className="site-nav-link-ink" aria-hidden="true" />
          </Link>
        </nav>

        <div className="site-nav-actions">
          <a
            className="site-nav-icon"
            href={site.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <Linkedin aria-hidden="true" size={18} />
          </a>
          <Link className="site-nav-cta" href="/contact">
            Contact
            <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
          <button
            type="button"
            className="site-nav-burger"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            key={open}
            id={
              open === 'about'
                ? aboutMenuId
                : open === 'services'
                  ? servicesMenuId
                  : insightsMenuId
            }
            className="site-nav-mega"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: [0.22, 0.61, 0.36, 1] }}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
            role="menu"
          >
            {open === 'services' ? (
              <ServicesMega groups={servicesMenu} isActive={isActive} />
            ) : open === 'insights' ? (
              <InsightsMega
                services={insightsServiceList}
                latest={latestArticle}
              />
            ) : (
              <AboutMega groups={aboutMenu} isActive={isActive} />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="site-nav-sheet"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
          >
            <MobileGroup heading="About" items={aboutMenu.flatMap((g) => g.items)} />
            <MobileGroup
              heading="Services"
              items={servicesMenu.flatMap((g) =>
                g.items.map((i) => ({
                  href: i.href,
                  title: i.title,
                  blurb: i.blurb,
                  icon: i.icon,
                })),
              )}
            />
            <MobileGroup
              heading="More"
              items={[
                {
                  href: '/insights',
                  title: 'Insights',
                  blurb: 'Articles, signals and sector notes.',
                  icon: Sparkles,
                },
                {
                  href: '/resources',
                  title: 'Resources',
                  blurb: 'Tools, calculators and reference dashboards.',
                  icon: BookOpen,
                },
                {
                  href: '/contact',
                  title: 'Contact',
                  blurb: 'Talk to a partner about your mandate.',
                  icon: ArrowUpRight,
                },
              ]}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavTrigger({
  label,
  isOpen,
  isActive,
  controlsId,
  onHover,
  onFocus,
  onClick,
}: {
  label: string;
  isOpen: boolean;
  isActive: boolean;
  controlsId: string;
  onHover: () => void;
  onFocus: () => void;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`site-nav-link site-nav-trigger${isActive ? ' is-active' : ''}${
        isOpen ? ' is-open' : ''
      }`}
      aria-haspopup="menu"
      aria-expanded={isOpen}
      aria-controls={controlsId}
      onMouseEnter={onHover}
      onFocus={onFocus}
      onClick={onClick}
    >
      <span>{label}</span>
      <ChevronDown
        className="site-nav-chev"
        size={14}
        aria-hidden="true"
      />
      <span className="site-nav-link-ink" aria-hidden="true" />
    </button>
  );
}

function ServicesMega({
  groups,
  isActive,
}: {
  groups: ServiceGroup[];
  isActive: (href: string) => boolean;
}) {
  return (
    <div className="site-nav-mega-inner site-nav-mega-services">
      <div className="site-nav-mega-grid">
        {groups.map((group) => (
          <div className="site-nav-mega-col" key={group.heading}>
            <p className="site-nav-mega-heading">{group.heading}</p>
            <ul>
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`site-nav-card${
                      isActive(item.href) ? ' is-current' : ''
                    }`}
                    role="menuitem"
                  >
                    <span className="site-nav-card-icon">
                      <item.icon size={18} aria-hidden="true" />
                    </span>
                    <span className="site-nav-card-body">
                      <span className="site-nav-card-title">{item.title}</span>
                      <span className="site-nav-card-blurb">{item.blurb}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="site-nav-mega-foot">
        <Link href="/services" className="site-nav-mega-foot-link" role="menuitem">
          All services
          <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
        <Link href="/insights" className="site-nav-mega-foot-link" role="menuitem">
          Latest insights
          <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
        <Link href="/contact" className="site-nav-mega-foot-cta" role="menuitem">
          Talk to a partner
          <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

function InsightsMega({
  services,
  latest,
}: {
  services: { href: string; title: string; icon: LucideIcon }[];
  latest: NavLatestArticle | null;
}) {
  return (
    <div className="site-nav-mega-inner site-nav-mega-insights">
      <div className="site-nav-insights-grid">
        <div className="site-nav-insights-col-services">
          <p className="site-nav-mega-heading">Browse by service</p>
          <ul className="site-nav-insights-services">
            {services.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="site-nav-insights-chip" role="menuitem">
                  <span className="site-nav-insights-chip-icon">
                    <s.icon size={14} aria-hidden="true" />
                  </span>
                  <span>{s.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="site-nav-insights-col-feature">
          <p className="site-nav-mega-heading">Latest</p>
          {latest ? (
            <Link
              href={`/insights/${latest.slug}`}
              className="site-nav-insights-feature"
              role="menuitem"
            >
              <span
                className="site-nav-insights-feature-thumb"
                style={
                  latest.thumbnailSrc
                    ? { backgroundImage: `url(${latest.thumbnailSrc})` }
                    : undefined
                }
                aria-hidden="true"
              >
                {!latest.thumbnailSrc && (
                  <span className="site-nav-insights-feature-thumb-fallback">
                    <BookOpen size={22} aria-hidden="true" />
                  </span>
                )}
              </span>
              <span className="site-nav-insights-feature-body">
                <span className="site-nav-insights-feature-meta">
                  <span className="site-nav-insights-feature-tag">{latest.tag}</span>
                  <span>·</span>
                  <span>{formatInsightDate(latest.publishedOn)}</span>
                  <span>·</span>
                  <span>{latest.readMinutes} min read</span>
                </span>
                <span className="site-nav-insights-feature-title">{latest.title}</span>
                {latest.authorName && (
                  <span className="site-nav-insights-feature-author">
                    by {latest.authorName}
                  </span>
                )}
                <span className="site-nav-insights-feature-cta">
                  Read article
                  <ArrowUpRight size={14} aria-hidden="true" />
                </span>
              </span>
            </Link>
          ) : (
            <div className="site-nav-insights-empty">
              No published insights yet — check back soon.
            </div>
          )}

          <Link
            href="/insights/live-updates"
            className="site-nav-insights-side"
            role="menuitem"
          >
            <span className="site-nav-card-icon">
              <Radio size={18} aria-hidden="true" />
            </span>
            <span className="site-nav-card-body">
              <span className="site-nav-card-title">Live updates</span>
              <span className="site-nav-card-blurb">
                Real-time signals from deals, audits and policy.
              </span>
            </span>
          </Link>
        </div>
      </div>

      <div className="site-nav-mega-foot">
        <Link href="/insights" className="site-nav-mega-foot-link" role="menuitem">
          All insights
          <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
        <Link href="/reports" className="site-nav-mega-foot-link" role="menuitem">
          Sector reports
          <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
        <Link href="/insights#newsletter-heading" className="site-nav-mega-foot-cta" role="menuitem">
          Subscribe
          <ArrowUpRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

function AboutMega({
  groups,
  isActive,
}: {
  groups: { heading: string; items: SimpleLink[] }[];
  isActive: (href: string) => boolean;
}) {
  return (
    <div className="site-nav-mega-inner site-nav-mega-about">
      <div className="site-nav-mega-grid site-nav-mega-grid-2">
        {groups.map((group) => (
          <div className="site-nav-mega-col" key={group.heading}>
            <p className="site-nav-mega-heading">{group.heading}</p>
            <ul>
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`site-nav-card${isActive(item.href) ? ' is-current' : ''}`}
                    role="menuitem"
                  >
                    <span className="site-nav-card-icon">
                      <item.icon size={18} aria-hidden="true" />
                    </span>
                    <span className="site-nav-card-body">
                      <span className="site-nav-card-title">{item.title}</span>
                      <span className="site-nav-card-blurb">{item.blurb}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileGroup({
  heading,
  items,
}: {
  heading: string;
  items: SimpleLink[];
}) {
  return (
    <section className="site-nav-sheet-group">
      <p className="site-nav-sheet-heading">{heading}</p>
      <ul>
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="site-nav-sheet-link">
              <span className="site-nav-card-icon">
                <item.icon size={18} aria-hidden="true" />
              </span>
              <span className="site-nav-card-body">
                <span className="site-nav-card-title">{item.title}</span>
                <span className="site-nav-card-blurb">{item.blurb}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
