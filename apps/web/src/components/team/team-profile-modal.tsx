'use client';

import Link from 'next/link';
import { useCallback, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpRight,
  BookOpen,
  Briefcase,
  Clock,
  GraduationCap,
  Linkedin,
  Mail,
  X,
} from 'lucide-react';
import { getFirstName, normalisePastEmployer, type TeamMember } from '@/content/team';
import { articles as allArticles } from '@/content/articles';

const FIRM_EMAIL = 'info@nucleusadvisors.in';

/**
 * Shared "full profile" modal for a TeamMember. Used by both the
 * /team grid (TeamPageCard) and the service-page sidebar (TeamCard).
 * Parent owns the open/close state and passes the member.
 *
 * Renders:
 *   - Hero strip (headshot, role chip, name, expertise pills)
 *   - Facts grid (experience years, qualifications, "Previously")
 *   - Past-employer logo / pill row
 *   - Full bio (paragraphs split on \n\n)
 *   - Cross-link cards to articles authored by this partner
 *   - Pinned action row (Email + LinkedIn) at the bottom
 *
 * Body scrolls natively. data-lenis-prevent so the Lenis wrapper
 * doesn't swallow the wheel events.
 */
export function TeamProfileModal({
  member,
  open,
  onClose,
}: Readonly<{ member: TeamMember; open: boolean; onClose: () => void }>) {
  const titleId = useId();

  // ESC + body-scroll lock while the modal is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const fullBioParagraphs = member.fullBio
    ? member.fullBio.split('\n\n')
    : member.shortBio
    ? [member.shortBio]
    : ['Detailed bio coming soon. Get in touch to learn more about working with this partner.'];

  const allowDrafts = process.env.NODE_ENV !== 'production';
  const articlesByThisPartner = allArticles.filter(
    (a) =>
      a.authorSlug === member.slug &&
      (allowDrafts ? true : a.reviewerStatus === 'approved'),
  );

  const emailHref = `mailto:${member.email ?? FIRM_EMAIL}`;

  const handleClose = useCallback(() => onClose(), [onClose]);

  // Portal target only exists in the browser (SSR-safe — render nothing
  // during the server pass; client takes over on hydration).
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          className="resource-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleClose();
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
              onClick={handleClose}
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
              </div>

              {member.pastEmployers && member.pastEmployers.length > 0 ? (
                <section
                  className="team-page-modal-prev"
                  aria-labelledby={`${titleId}-prev`}
                >
                  <p
                    id={`${titleId}-prev`}
                    className="team-page-modal-prev-label"
                  >
                    <Briefcase size={12} aria-hidden="true" /> Previously worked with
                  </p>
                  <ul className="team-page-modal-prev-list">
                    {member.pastEmployers.map((entry, i) => {
                      const e = normalisePastEmployer(entry);
                      return (
                        <li key={`${e.name}-${i}`} className="team-page-modal-prev-item">
                          {e.src ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={e.src}
                              alt={e.name}
                              className="team-page-modal-prev-logo"
                              loading="lazy"
                            />
                          ) : (
                            <span className="team-page-modal-prev-pill">{e.name}</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ) : null}

              <div className="team-page-modal-body">
                {fullBioParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              {articlesByThisPartner.length > 0 ? (
                <section className="team-page-modal-articles">
                  <header className="team-page-modal-articles-head">
                    <p className="team-page-modal-articles-eyebrow">
                      <BookOpen size={12} aria-hidden="true" /> Writing from{' '}
                      {getFirstName(member.name)}
                    </p>
                    <Link
                      href={`/insights/by/${member.slug}`}
                      onClick={handleClose}
                      className="team-page-modal-articles-archive"
                    >
                      View full archive
                      <ArrowUpRight size={11} aria-hidden="true" />
                    </Link>
                  </header>
                  <div className="team-page-modal-article-cards">
                    {articlesByThisPartner.slice(0, 4).map((a) => (
                      <Link
                        key={a.slug}
                        href={`/insights/${a.slug}`}
                        onClick={handleClose}
                        className="team-page-modal-article-card"
                      >
                        <span className="team-page-modal-article-thumb" aria-hidden="true">
                          {a.thumbnailSrc ? (
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
                aria-label={member.email ? `Email ${member.name}` : `Email Nucleus about ${member.name}`}
                title={member.email ?? `Email Nucleus about ${getFirstName(member.name)}`}
              >
                <Mail size={16} />
              </a>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
