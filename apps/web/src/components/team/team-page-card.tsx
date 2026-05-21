'use client';

import { useState } from 'react';
import { Linkedin, Mail } from 'lucide-react';
import { getFirstName, type TeamMember } from '@/content/team';
import { TeamProfileModal } from './team-profile-modal';

const FIRM_EMAIL = 'info@nucleusadvisors.in';

/**
 * Compact team-member card used on the `/team` page.
 *
 * Horizontal layout: small headshot left, name + role + expertise +
 * action row right. Click anywhere on the card opens the shared
 * TeamProfileModal. Icon buttons (LinkedIn + Email) sit in their own
 * row at the bottom and stop event propagation so they don't also
 * trigger the modal.
 */
export function TeamPageCard({ member }: Readonly<{ member: TeamMember }>) {
  const [open, setOpen] = useState(false);

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
              {member.expertise.map((e) => (
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
            title={member.email ?? `Email Nucleus about ${getFirstName(member.name)}`}
          >
            <Mail size={14} />
          </a>
        </div>
      </div>

      <TeamProfileModal member={member} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
