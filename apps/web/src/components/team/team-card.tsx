'use client';

import { useCallback, useEffect, useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Linkedin, Mail, UserSquare, X } from 'lucide-react';
import type { TeamMember } from '@/content/team';

/**
 * Compact team card for the right sidebar. Three actions:
 *   • Email   → mailto: link
 *   • LinkedIn → external link (hidden if no URL)
 *   • Read profile → opens a modal with the full bio
 *
 * Headshot photo falls back to an initials monogram when no
 * `headshotSrc` is set on the member entry.
 */
export function TeamCard({ member }: Readonly<{ member: TeamMember }>) {
  const [open, setOpen] = useState(false);
  const titleId = useId();

  const close = useCallback(() => setOpen(false), []);

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

  const paragraphs = member.fullBio.split('\n\n');

  return (
    <>
      <article className="team-card">
        <div className="team-card-head">
          <span className="team-card-avatar" aria-hidden="true">
            {member.headshotSrc ? (
              // Plain <img> on purpose — these are small avatars; next/image
              // adds machinery we don't need for a 56×56 thumbnail.
              // eslint-disable-next-line @next/next/no-img-element
              <img src={member.headshotSrc} alt="" />
            ) : (
              <span className="team-card-monogram">{member.initials}</span>
            )}
          </span>
          <div className="team-card-meta">
            <p className="team-card-name">{member.name}</p>
            <p className="team-card-role">{member.role}</p>
          </div>
        </div>
        <p className="team-card-bio">{member.shortBio}</p>
        <div className="team-card-actions">
          <a
            href={`mailto:${member.email}`}
            className="team-card-iconbtn"
            aria-label={`Email ${member.name}`}
            title={`Email ${member.name}`}
          >
            <Mail size={14} />
          </a>
          {member.linkedinUrl ? (
            <a
              href={member.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="team-card-iconbtn"
              aria-label={`${member.name} on LinkedIn`}
              title="LinkedIn"
            >
              <Linkedin size={14} />
            </a>
          ) : null}
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="team-card-profilebtn"
            aria-haspopup="dialog"
          >
            <UserSquare size={13} aria-hidden="true" />
            Read profile
          </button>
        </div>
      </article>

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
              className="resource-modal team-modal"
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

              <div className="team-modal-head">
                <span className="team-modal-avatar" aria-hidden="true">
                  {member.headshotSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={member.headshotSrc} alt="" />
                  ) : (
                    <span className="team-modal-monogram">{member.initials}</span>
                  )}
                </span>
                <div>
                  <p className="resource-modal-eyebrow">{member.role}</p>
                  <h2 id={titleId} className="resource-modal-title">
                    {member.name}
                  </h2>
                </div>
              </div>

              <div className="team-modal-body">
                {paragraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>

              <div className="team-modal-actions">
                <a href={`mailto:${member.email}`} className="resource-cta resource-cta-primary">
                  <Mail size={14} aria-hidden="true" />
                  Email {member.name.split(' ')[0]}
                </a>
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
