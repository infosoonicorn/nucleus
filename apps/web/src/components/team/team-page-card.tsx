'use client';

import Link from 'next/link';
import { useCallback, useEffect, useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, BookOpen, Briefcase, Clock, GraduationCap, Linkedin, Mail, X } from 'lucide-react';
import type { TeamMember } from '@/content/team';
import { articles as allArticles } from '@/content/articles';

const FIRM_EMAIL = 'info@nucleusadvisors.in';

/**
 * Compact team-member card used on the `/team` page.
 *
 * Horizontal layout: small headshot on the left, name + role + 3
 * expertise pills + action row on the right. Action row has two
 * icon buttons (LinkedIn + Email) that are always present visually.
 * Email falls back to the firm general inbox when the partner's
 * personal address isn't on file yet.
 *
 * Clicking anywhere on the card OPENS the bio modal. The icon
 * buttons stop propagation so clicking Email or LinkedIn doesn't
 * also open the modal.
 *
 * The modal itself is scroll-aware: max-height capped to viewport,
 * body scrolls independently. Long bios no longer get clipped.
 */
export function TeamPageCard({ member }: Readonly<{ member: TeamMember }>) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const close = useCallback(() => setOpen(false), []);

  // ESC + body-scroll-lock while the modal is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  const fullBioParagraphs = member.fullBio
    ? member.fullBio.split('\n\n')
    : member.shortBio
    ? [member.shortBio]
    : ['Detailed bio coming soon. Get in touch to learn more about working with this partner.'];

  // Articles authored by this partner — used in the modal for cross-link.
  // Drafts surface in dev only; production filters to approved.
  const allowDrafts = process.env.NODE_ENV !== 'production';
  const articlesByThisPartner = allArticles.filter(
    (a) =>
      a.authorSlug === member.slug && (allowDrafts ? true : a.reviewerStatus === 'approved'),
  );

  // Universal email destination: personal if set, firm fallback otherwise.
  // No /contact form route — the user explicitly asked for a mailto link.
  const emailHref = `mailto:${member.email ?? FIRM_EMAIL}`;
  const emailAria = member.email
    ? `Email ${member.name}`
    : `Email Nucleus Advisors about ${member.name}`;

  return (
    <>
      <div className="team-page-card">
        <button
          type="button"
          className="team-page-card-trigger"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-label={`Read profile of ${member.name}`}
        >
          <span
            className="team-page-card-photo"
            data-slug={member.slug}
            aria-hidden="true"
          >
            {member.headshotSrc ? (
              // Plain <img>; small JPGs, next/image is overkill.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={member.headshotSrc} alt="" loading="lazy" />
            ) : (
              <span className="team-page-card-monogram">{member.initials}</span>
            )}
          </span>
          <div className="team-page-card-body">
            <p className="team-page-card-role">{member.role}</p>
            <h3 className="team-page-card-name">{member.name}</h3>
            <ul className="team-page-card-expertise" aria-label="Expertise">
              {member.expertise.slice(0, 3).map((e) => (
                <li key={e} className="team-page-card-pill">
                  {e}
                </li>
              ))}
            </ul>
            <p className="team-page-card-meta">
              {member.experienceYears ? `${member.experienceYears}+ yrs` : null}
              {member.experienceYears && member.qualifications && member.qualifications.length > 0
                ? ' · '
                : null}
              {member.qualifications && member.qualifications.length > 0
                ? member.qualifications.join(', ')
                : null}
            </p>
          </div>
        </button>
        <div className="team-page-card-actions" onClick={(e) => e.stopPropagation()}>
          {member.linkedinUrl ? (
            <a
              href={member.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="team-page-card-iconbtn"
              aria-label={`${member.name} on LinkedIn`}
              title="LinkedIn"
            >
              <Linkedin size={14} />
            </a>
          ) : (
            <span
              className="team-page-card-iconbtn team-page-card-iconbtn-disabled"
              aria-disabled="true"
              title="LinkedIn profile pending"
            >
              <Linkedin size={14} />
            </span>
          )}
          <a
            href={emailHref}
            className="team-page-card-iconbtn"
            aria-label={emailAria}
            title={member.email ?? `Email Nucleus about ${member.name.split(' ').slice(-1)[0]}`}
          >
            <Mail size={14} />
          </a>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="resource-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="resource-modal team-page-modal"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                onClick={close}
                className="resource-modal-close"
                aria-label="Close"
              >
                <X size={16} />
              </button>

              <div className="team-page-modal-scroll" data-lenis-prevent>
                <header className="team-page-modal-head">
                  <span className="team-page-modal-photo" aria-hidden="true">
                    {member.headshotSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={member.headshotSrc} alt="" />
                    ) : (
                      <span className="team-page-modal-monogram">{member.initials}</span>
                    )}
                  </span>
                  <div className="team-page-modal-head-meta">
                    <p className="resource-modal-eyebrow">{member.role}</p>
                    <h2 id={titleId} className="resource-modal-title">
                      {member.name}
                    </h2>
                    <ul className="team-page-card-expertise" aria-label="Expertise">
                      {member.expertise.map((e) => (
                        <li key={e} className="team-page-card-pill">
                          {e}
                        </li>
                      ))}
                    </ul>
                  </div>
                </header>

                <div className="team-page-modal-facts">
                  {member.experienceYears ? (
                    <div className="team-page-modal-fact">
                      <span className="team-page-modal-fact-label">Experience</span>
                      <span className="team-page-modal-fact-value">
                        {member.experienceYears}+ years
                      </span>
                    </div>
                  ) : null}
                  {member.qualifications && member.qualifications.length > 0 ? (
                    <div className="team-page-modal-fact">
                      <span className="team-page-modal-fact-label">
                        <GraduationCap size={11} aria-hidden="true" /> Qualifications
                      </span>
                      <span className="team-page-modal-fact-value">
                        {member.qualifications.join(', ')}
                      </span>
                    </div>
                  ) : null}
                  {member.pastEmployers && member.pastEmployers.length > 0 ? (
                    <div className="team-page-modal-fact">
                      <span className="team-page-modal-fact-label">
                        <Briefcase size={11} aria-hidden="true" /> Previously
                      </span>
                      <span className="team-page-modal-fact-value">
                        {member.pastEmployers.join(', ')}
                      </span>
                    </div>
                  ) : null}
                </div>

                <div className="team-page-modal-body">
                  {fullBioParagraphs.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>

                {articlesByThisPartner.length > 0 ? (
                  <section className="team-page-modal-articles">
                    <p className="team-page-modal-articles-eyebrow">
                      <BookOpen size={12} aria-hidden="true" /> Writing from{' '}
                      {member.name.split(' ').slice(-1)[0]}
                    </p>
                    <div className="team-page-modal-article-cards">
                      {articlesByThisPartner.slice(0, 4).map((a) => (
                        <Link
                          key={a.slug}
                          href={`/insights/${a.slug}`}
                          onClick={close}
                          className="team-page-modal-article-card"
                        >
                          <span className="team-page-modal-article-thumb" aria-hidden="true">
                            {a.thumbnailSrc ? (
                              // Small JPG thumbs, next/image not needed.
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={a.thumbnailSrc} alt="" loading="lazy" />
                            ) : (
                              <span className="team-page-modal-article-thumb-fallback">
                                {a.tag}
                              </span>
                            )}
                          </span>
                          <span className="team-page-modal-article-meta">
                            <span className="team-page-modal-article-tag">{a.tag}</span>
                            <span className="team-page-modal-article-title">{a.title}</span>
                            <span className="team-page-modal-article-foot">
                              <Clock size={11} aria-hidden="true" />
                              {a.readMinutes} min read
                              <ArrowUpRight size={12} aria-hidden="true" />
                            </span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </section>
                ) : null}
              </div>

              <div className="team-page-modal-actions">
                {member.linkedinUrl ? (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="team-page-card-iconbtn"
                    aria-label={`${member.name} on LinkedIn`}
                    title="LinkedIn"
                  >
                    <Linkedin size={16} />
                  </a>
                ) : (
                  <span
                    className="team-page-card-iconbtn team-page-card-iconbtn-disabled"
                    aria-disabled="true"
                    title="LinkedIn profile pending"
                  >
                    <Linkedin size={16} />
                  </span>
                )}
                <a
                  href={emailHref}
                  className="team-page-card-iconbtn"
                  aria-label={emailAria}
                  title={
                    member.email ?? `Email Nucleus about ${member.name.split(' ').slice(-1)[0]}`
                  }
                >
                  <Mail size={16} />
                </a>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
