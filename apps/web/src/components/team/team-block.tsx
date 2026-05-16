import type { TeamMember } from '@/content/team';
import { TeamCard } from './team-card';

/**
 * Sidebar Team block — header + N stacked TeamCards.
 * Renders nothing when the team list is empty (handled at the page
 * level by checking `getTeamForService` length before passing in).
 */
export function TeamBlock({ team }: Readonly<{ team: TeamMember[] }>) {
  if (team.length === 0) return null;
  return (
    <section className="sidebar-block sidebar-team-block" aria-labelledby="sidebar-team-heading">
      <header className="sidebar-block-head">
        <p className="sidebar-block-eyebrow">Team on this service</p>
        <h2 id="sidebar-team-heading" className="sidebar-block-title">
          The bench.
        </h2>
      </header>
      <div className="sidebar-team-list">
        {team.map((m) => (
          <TeamCard key={m.slug} member={m} />
        ))}
      </div>
    </section>
  );
}
