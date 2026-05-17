'use client';

import { useState } from 'react';
import { Linkedin, Mail, UserSquare } from 'lucide-react';
import type { TeamMember } from '@/content/team';
import { TeamProfileModal } from './team-profile-modal';

/**
 * Compact team card for the right sidebar on service pages. Three
 * actions:
 *   • Email      → mailto: link (hidden if no email on record)
 *   • LinkedIn   → external link (hidden if no URL)
 *   • Read profile → opens the shared TeamProfileModal (the same rich
 *                    popup that the /team grid uses, with expertise
 *                    pills, past-employer logos, full bio, and
 *                    cross-link cards to articles authored by this
 *                    partner)
 *
 * Headshot photo falls back to an initials monogram when no
 * `headshotSrc` is set on the member entry.
 */
export function TeamCard({ member }: Readonly<{ member: TeamMember }>) {
  const [open, setOpen] = useState(false);

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
        <p className="team-card-bio">
          {member.shortBio ?? `${member.role} at Nucleus Advisors.`}
        </p>
        <div className="team-card-actions">
          {member.email ? (
            <a
              href={`mailto:${member.email}`}
              className="team-card-iconbtn"
              aria-label={`Email ${member.name}`}
              title={`Email ${member.name}`}
            >
              <Mail size={14} />
            </a>
          ) : null}
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

      <TeamProfileModal member={member} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
