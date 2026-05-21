'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from 'framer-motion';
import {
  ArrowUpRight,
  ArrowUp,
  Briefcase,
  Building2,
  HeartHandshake,
  Landmark,
  Linkedin,
  Mail,
  MapPin,
  Scale,
  ShieldCheck,
  Sparkles,
  Wallet,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { navigation, services, site } from '@/content/site';

type Col = {
  heading: string;
  items: { href: string; label: string; icon?: LucideIcon }[];
};

const serviceIcon: Record<string, LucideIcon> = {
  'investment-banking': Sparkles,
  'ma-advisory': HeartHandshake,
  valuations: Landmark,
  assurance: ShieldCheck,
  'risk-advisory': ShieldCheck,
  'tax-regulatory': Scale,
  'corporate-secretarial': Briefcase,
  'finance-outsourcing': Wallet,
  'aif-fund-management': Building2,
};

const serviceItems = services.map((s) => ({
  href: `/services/${s.slug}`,
  label: s.title,
  icon: serviceIcon[s.slug],
}));

const columns: Col[] = [
  {
    heading: 'Services',
    items: serviceItems.slice(0, Math.ceil(serviceItems.length / 2)),
  },
  {
    heading: 'More services',
    items: serviceItems.slice(Math.ceil(serviceItems.length / 2)),
  },
  {
    heading: 'Company',
    // Downloads hidden until the resources experience is fine-tuned.
    items: [...navigation.map((n) => ({ href: n.href, label: n.label }))],
  },
];

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

const rise = {
  hidden: { opacity: 0, y: 18 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 0.61, 0.36, 1] as const },
  },
};

export function SiteFooter() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const prefersReducedMotion = useReducedMotion();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    function onScroll() {
      setShowTop(window.scrollY > 600);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const year = new Date().getFullYear();

  function backToTop() {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }

  return (
    <motion.footer
      ref={ref}
      className="site-footer-v2"
      variants={stagger}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      aria-labelledby="site-footer-heading"
    >
      <h2 id="site-footer-heading" className="sr-only">
        Nucleus Advisors footer
      </h2>

      <div className="site-footer-v2-inner">
        <motion.div className="site-footer-v2-lede" variants={rise}>
          <Link href="/" className="site-footer-v2-brand" aria-label="Nucleus Advisors home">
            <Image
              src="/brand/nucleus-logo.png"
              alt="Nucleus Advisors"
              width={181}
              height={60}
              priority={false}
            />
          </Link>
          <p className="site-footer-v2-tagline">
            Full-spectrum advisory for transactions, controls, compliance, reporting and growth
            decisions.
          </p>
          <Link href="/contact" className="site-footer-v2-cta">
            Start a conversation
            <ArrowUpRight aria-hidden="true" size={16} />
          </Link>

          <div className="site-footer-v2-meta">
            <div className="site-footer-v2-meta-row">
              <MapPin aria-hidden="true" size={14} />
              <span>{site.locations.join(' · ')}</span>
            </div>
            <div className="site-footer-v2-icons">
              <a
                href={`mailto:${site.email}`}
                className="site-footer-v2-icon"
                aria-label={`Email ${site.email}`}
              >
                <Mail aria-hidden="true" size={16} />
              </a>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noreferrer"
                className="site-footer-v2-icon"
                aria-label="LinkedIn"
              >
                <Linkedin aria-hidden="true" size={16} />
              </a>
            </div>
          </div>
        </motion.div>

        <div className="site-footer-v2-grid">
          {columns.map((col) => (
            <motion.div key={col.heading} className="site-footer-v2-col" variants={rise}>
              <p className="site-footer-v2-heading">{col.heading}</p>
              <ul>
                {col.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link href={item.href} className="site-footer-v2-link">
                        {Icon ? (
                          <span className="site-footer-v2-link-icon" aria-hidden="true">
                            <Icon size={14} />
                          </span>
                        ) : (
                          <span className="site-footer-v2-link-dot" aria-hidden="true" />
                        )}
                        <span>{item.label}</span>
                        <ArrowUpRight
                          aria-hidden="true"
                          size={14}
                          className="site-footer-v2-link-arrow"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          ))}

          <motion.div className="site-footer-v2-col" variants={rise}>
            <p className="site-footer-v2-heading">Contact</p>
            <ul>
              <li>
                <a href={`mailto:${site.email}`} className="site-footer-v2-link">
                  <span className="site-footer-v2-link-icon" aria-hidden="true">
                    <Mail size={14} />
                  </span>
                  <span>{site.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={site.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="site-footer-v2-link"
                >
                  <span className="site-footer-v2-link-icon" aria-hidden="true">
                    <Linkedin size={14} />
                  </span>
                  <span>LinkedIn</span>
                  <ArrowUpRight
                    aria-hidden="true"
                    size={14}
                    className="site-footer-v2-link-arrow"
                  />
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div className="site-footer-v2-marquee" variants={rise} aria-hidden="true">
          <div className="site-footer-v2-marquee-track" data-reduced={prefersReducedMotion ? 'true' : 'false'}>
            {Array.from({ length: 2 }).map((_, group) => (
              <div className="site-footer-v2-marquee-group" key={group}>
                {[
                  'Investment Banking',
                  'M&A Advisory',
                  'Valuations',
                  'Assurance',
                  'Risk Advisory',
                  'Tax & Regulatory',
                  'Corporate Secretarial',
                  'Finance Outsourcing',
                  'AIF & Fund Management',
                ].map((label) => (
                  <span key={`${group}-${label}`} className="site-footer-v2-marquee-item">
                    <span className="site-footer-v2-marquee-dot" aria-hidden="true" />
                    {label}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="site-footer-v2-bottom" variants={rise}>
          <span>© {year} Nucleus Advisors. All rights reserved.</span>
          <span className="site-footer-v2-bottom-note">
            Policy pages will appear here once approved legal copy is finalised.
          </span>
        </motion.div>
      </div>

      <AnimatePresence>
        {showTop && (
          <motion.button
            type="button"
            className="site-footer-v2-top"
            onClick={backToTop}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            aria-label="Back to top"
          >
            <ArrowUp aria-hidden="true" size={16} />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.footer>
  );
}
