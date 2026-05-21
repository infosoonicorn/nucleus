'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, Mail } from 'lucide-react';
import type { TeamMember } from '@/content/team';

type Props = Readonly<{
  ordinal: string;
  serviceTitle: string;
  promise: string;
  cta: string;
  /** Optional team — first member's email is used for the inline mailto.
   *  Partner avatars stack at the bottom of the band. */
  team?: TeamMember[];
}>;

/**
 * ContactBand — final CTA on every service page.
 *
 * Visual: dark navy plinth with an aurora red glow seeping in from
 * the top-left, animated dot-grain overlay, italic-red emphasis on
 * the service title. Below: partner avatar stack + pulsing live dot
 * promising a 48h reply, primary action button, and an inline email
 * fallback link (uses the first partner's email when team data is
 * supplied).
 *
 * Animates in once on scroll via framer-motion; respects
 * prefers-reduced-motion.
 */
export function ContactBand({
  ordinal,
  serviceTitle,
  promise,
  cta,
  team = [],
}: Props) {
  const reduceMotion = useReducedMotion();
  const partners = team.slice(0, 3); // avatar stack — at most 3
  const primaryEmail = team[0]?.email;

  return (
    <motion.section
      className="contact-band"
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Aurora glow + dot-grain overlay — pure decoration */}
      <span className="contact-band-aurora" aria-hidden="true" />
      <span className="contact-band-grain" aria-hidden="true" />

      <div className="contact-band-content">
        <p className="contact-band-eyebrow">
          <span aria-hidden="true" className="contact-band-eyebrow-bar" />
          <span>Talk to the desk</span>
        </p>

        <h2 className="contact-band-title">
          Talk to Nucleus about <em>{serviceTitle}</em>
          <span className="contact-band-title-stop">.</span>
        </h2>

        <p className="contact-band-promise">{promise}</p>

        <div className="contact-band-meta">
          {partners.length > 0 ? (
            <div className="contact-band-team" aria-label="Partners on this service">
              <span className="contact-band-team-stack">
                {partners.map((m) => (
                  <span
                    key={m.slug}
                    className="contact-band-team-avatar"
                    title={`${m.name} · ${m.role}`}
                    aria-hidden="true"
                  >
                    {m.initials}
                  </span>
                ))}
              </span>
              <span className="contact-band-team-meta">
                <span className="contact-band-livedot" aria-hidden="true" />
                <span>Partner-led reply within 48 hours</span>
              </span>
            </div>
          ) : (
            <span className="contact-band-team-meta">
              <span className="contact-band-livedot" aria-hidden="true" />
              <span>Partner-led reply within 48 hours</span>
            </span>
          )}
        </div>

        <div className="contact-band-actions">
          <Link className="contact-band-btn-primary" href="/contact">
            {cta}
            <ArrowUpRight aria-hidden="true" size={16} />
          </Link>
          {primaryEmail ? (
            <a
              className="contact-band-btn-email"
              href={`mailto:${primaryEmail}`}
            >
              <Mail size={14} aria-hidden="true" />
              <span>or email a partner directly</span>
            </a>
          ) : null}
        </div>
      </div>
    </motion.section>
  );
}
