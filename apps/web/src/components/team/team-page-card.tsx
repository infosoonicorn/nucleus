'use client';

import Link from 'next/link';
import { useCallback, useEffect, useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, BookOpen, Briefcase, GraduationCap, Linkedin, Mail, X } from 'lucide-react';
import type { TeamMember } from '@/content/team';
import { articles as allArticles, getArticleAuthor } from '@/content/articles';

/**
 * Large team-member card used on the `/team` page.
 *
 * The card itself displays headshot + name + role + expertise pills.
 * Clicking opens a modal with the full bio, qualifications, past
 * employers, years of experience, and the list of articles by the
 * partner. The modal also surfaces a deep link to `/team/<slug>` for
 * direct sharing.
 *
 * Reuses the same modal pattern as the sidebar TeamCard so the visual
 * language stays consistent across the site. The two components stay
 * separate because the sidebar variant is sized for ~280px column
 * width while this one anchors a 320px+ grid card with photo at top.
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

  return (
    <>
      <button
        type="button"
        className="team-page-card"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-label={`Read profile of ${member.name}`}
      >
        <span className="team-page-card-photo" aria-hidden="true">
          {member.headshotSrc ? (
            // Plain <img> on purpose; team headshots are small JPGs.
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
            {member.expertise.map((e) => (
              <li key={e} className="team-page-card-pill">
                {e}
              </li>
            ))}
          </ul>
          <p className="team-page-card-meta">
            {member.experienceYears ? `${member.experienceYears}+ yrs experience` : null}
            {member.experienceYears && member.qualifications && member.qualifications.length > 0
              ? ' · '
              : null}
            {member.qualifications && member.qualifications.length > 0
              ? member.qualifications.join(', ')
              : null}
          </p>
        </div>
        <span className="team-page-card-cta" aria-hidden="true">
          Read profile
          <ArrowUpRight size={14} />
        </span>
      </button>

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
                    <BookOpen size={12} aria-hidden="true" /> Writing
                  </p>
                  <ul>
                    {articlesByThisPartner.slice(0, 4).map((a) => (
                      <li key={a.slug}>
                        <Link href={`/insights/${a.slug}`} onClick={close}>
                          <span>{a.title}</span>
                          <span className="team-page-modal-articles-meta">
                            {getArticleAuthor(a).role} · {a.readMinutes} min
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              <div className="team-page-modal-actions">
                <Link
                  href={`/team/${member.slug}`}
                  className="resource-cta resource-cta-primary"
                  onClick={close}
                >
                  Full profile
                  <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
                {member.email ? (
                  <a
                    href={`mailto:${member.email}`}
                    className="resource-cta resource-cta-ghost"
                  >
                    <Mail size={14} aria-hidden="true" />
                    Email {member.name.split(' ').slice(-1)[0]}
                  </a>
                ) : null}
                {member.linkedinUrl ? (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="resource-cta resource-cta-ghost"
                  >
                    <Linkedin size={14} aria-hidden="true" />
                    LinkedIn
                  </a>
                ) : null}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
