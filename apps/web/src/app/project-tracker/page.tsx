import fs from 'node:fs';
import path from 'node:path';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock3,
  Gauge,
  Layers3,
} from 'lucide-react';

type TrackerStatus = 'complete' | 'in-progress' | 'blocked' | 'not-started';

type TrackerItem = {
  status: TrackerStatus;
  text: string;
  acceptance: string[];
};

type TrackerSection = {
  title: string;
  items: TrackerItem[];
};

type TrackerTrack = {
  title: string;
  sections: TrackerSection[];
};

type TrackerStats = {
  total: number;
  complete: number;
  inProgress: number;
  blocked: number;
  notStarted: number;
};

export const metadata: Metadata = {
  title: 'Project Tracker | Nucleus Advisors',
  description: 'Internal project tracker for the Nucleus Advisors website and platform build.',
  robots: {
    index: false,
    follow: false,
  },
};

function findTrackerPath() {
  const candidates = [
    path.join(process.cwd(), 'docs/project-tracker.md'),
    path.join(process.cwd(), '../../docs/project-tracker.md'),
    path.join(process.cwd(), '../docs/project-tracker.md'),
  ];

  const trackerPath = candidates.find((candidate) => fs.existsSync(candidate));

  if (!trackerPath) {
    throw new Error('Could not find docs/project-tracker.md');
  }

  return trackerPath;
}

function statusFromToken(token: string): TrackerStatus {
  if (token === 'x') return 'complete';
  if (token === '~') return 'in-progress';
  if (token === '!') return 'blocked';
  return 'not-started';
}

function parseTracker(markdown: string) {
  const lines = markdown.split('\n');
  const tracks: TrackerTrack[] = [];
  const dashboardRows: string[][] = [];
  const openInputs: TrackerItem[] = [];
  let currentTrack: TrackerTrack | null = null;
  let currentSection: TrackerSection | null = null;
  let currentItem: TrackerItem | null = null;
  let inExecutiveDashboard = false;
  let inOpenInputs = false;

  for (const line of lines) {
    if (line.startsWith('## ')) {
      const title = line.replace(/^##\s+/, '').trim();
      inExecutiveDashboard = title === 'Executive Dashboard';
      inOpenInputs = title === 'Open Inputs Needed From Vijay/Team';
      currentTrack = null;
      currentSection = null;
      currentItem = null;

      if (
        title.startsWith('Phase ') ||
        title === 'Open Inputs Needed From Vijay/Team' ||
        title === 'Deferred / Later Ideas'
      ) {
        currentTrack = {
          title,
          sections: [],
        };
        tracks.push(currentTrack);
      }

      continue;
    }

    if (line.startsWith('### ')) {
      currentSection = {
        title: line.replace(/^###\s+/, '').trim(),
        items: [],
      };
      currentTrack?.sections.push(currentSection);
      currentItem = null;
      inExecutiveDashboard = false;
      continue;
    }

    if (inExecutiveDashboard && line.startsWith('|') && !line.includes('---')) {
      const cells = line
        .split('|')
        .map((cell) => cell.trim())
        .filter(Boolean);

      if (cells.length === 3 && cells[0] !== 'Area') {
        dashboardRows.push(cells);
      }
      continue;
    }

    const itemMatch = line.match(/^-\s+\[( |x|~|!)\]\s+(.+)$/);
    if (itemMatch) {
      currentItem = {
        status: statusFromToken(itemMatch[1]),
        text: itemMatch[2].trim(),
        acceptance: [],
      };

      if (inOpenInputs) {
        openInputs.push(currentItem);
      } else if (currentSection) {
        currentSection.items.push(currentItem);
      } else if (currentTrack) {
        currentSection = {
          title: 'Track Checklist',
          items: [currentItem],
        };
        currentTrack.sections.push(currentSection);
      }
      continue;
    }

    const acceptanceMatch = line.match(/^\s+-\s+Acceptance:\s+(.+)$/);
    if (acceptanceMatch && currentItem) {
      currentItem.acceptance.push(acceptanceMatch[1].trim());
      continue;
    }

    const neededMatch = line.match(/^\s+-\s+Needed for:\s+(.+)$/);
    if (neededMatch && currentItem) {
      currentItem.acceptance.push(`Needed for: ${neededMatch[1].trim()}`);
    }
  }

  return { dashboardRows, tracks, openInputs };
}

function calculateStats(tracks: TrackerTrack[]) {
  return tracks.reduce<TrackerStats>(
    (stats, section) => {
      for (const page of section.sections) {
        for (const item of page.items) {
          stats.total += 1;
          stats.complete += item.status === 'complete' ? 1 : 0;
          stats.inProgress += item.status === 'in-progress' ? 1 : 0;
          stats.blocked += item.status === 'blocked' ? 1 : 0;
          stats.notStarted += item.status === 'not-started' ? 1 : 0;
        }
      }

      return stats;
    },
    { total: 0, complete: 0, inProgress: 0, blocked: 0, notStarted: 0 },
  );
}

function calculateSectionStats(section: TrackerSection) {
  return section.items.reduce<TrackerStats>(
    (stats, item) => {
      stats.total += 1;
      stats.complete += item.status === 'complete' ? 1 : 0;
      stats.inProgress += item.status === 'in-progress' ? 1 : 0;
      stats.blocked += item.status === 'blocked' ? 1 : 0;
      stats.notStarted += item.status === 'not-started' ? 1 : 0;
      return stats;
    },
    { total: 0, complete: 0, inProgress: 0, blocked: 0, notStarted: 0 },
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getNextItems(tracks: TrackerTrack[]) {
  const priority: Record<TrackerStatus, number> = {
    blocked: 0,
    'in-progress': 1,
    'not-started': 2,
    complete: 3,
  };

  return tracks
    .flatMap((track) =>
      track.sections.flatMap((section) =>
        section.items.map((item) => ({
          ...item,
          track: track.title,
          section: section.title,
        })),
      ),
    )
    .filter((item) => item.status !== 'complete')
    .sort((a, b) => priority[a.status] - priority[b.status])
    .slice(0, 8);
}

function statusLabel(status: TrackerStatus) {
  const labels: Record<TrackerStatus, string> = {
    complete: 'Complete',
    'in-progress': 'In progress',
    blocked: 'Blocked',
    'not-started': 'Not started',
  };

  return labels[status];
}

function StatusIcon({ status }: { status: TrackerStatus }) {
  if (status === 'complete') return <CheckCircle2 aria-hidden="true" size={18} />;
  if (status === 'in-progress') return <Clock3 aria-hidden="true" size={18} />;
  if (status === 'blocked') return <AlertTriangle aria-hidden="true" size={18} />;
  return <Circle aria-hidden="true" size={18} />;
}

function visibleDashboardStatus(rawStatus: string): TrackerStatus {
  if (rawStatus.includes('[x]')) return 'complete';
  if (rawStatus.includes('[~]')) return 'in-progress';
  if (rawStatus.includes('[!]')) return 'blocked';
  return 'not-started';
}

export default function ProjectTrackerPage() {
  const trackerPath = findTrackerPath();
  const markdown = fs.readFileSync(trackerPath, 'utf8');
  const { dashboardRows, tracks, openInputs } = parseTracker(markdown);
  const visibleTracks = tracks.filter((track) =>
    track.sections.some((section) => section.items.length > 0),
  );
  const stats = calculateStats(visibleTracks);
  const completion = stats.total > 0 ? Math.round((stats.complete / stats.total) * 100) : 0;
  const nextItems = getNextItems(visibleTracks);

  return (
    <main className="tracker-page">
      <section className="tracker-hero">
        <div className="tracker-shell">
          <div className="tracker-nav">
            <Link href="/" className="tracker-home-link">
              Nucleus Advisors
            </Link>
            <span>Internal project dashboard</span>
          </div>

          <div className="tracker-hero-grid">
            <div>
              <p className="tracker-kicker">Project Tracker</p>
              <h1>One place to see what is built, what is left, and what is blocked.</h1>
              <p className="tracker-intro">
                This dashboard renders the live checklist from <code>docs/project-tracker.md</code>.
                Update the Markdown file after each meaningful completion so the whole team has the
                same view of progress.
              </p>
            </div>

            <div className="tracker-score-card" aria-label={`Overall completion ${completion}%`}>
              <Gauge aria-hidden="true" size={34} />
              <strong>{completion}%</strong>
              <span>Checklist completion</span>
              <div className="tracker-progress-bar">
                <span style={{ width: `${completion}%` }} />
              </div>
            </div>
          </div>

          <div className="tracker-stat-grid">
            <div className="tracker-stat">
              <span>Total tasks</span>
              <strong>{stats.total}</strong>
            </div>
            <div className="tracker-stat tracker-stat-complete">
              <span>Complete</span>
              <strong>{stats.complete}</strong>
            </div>
            <div className="tracker-stat tracker-stat-progress">
              <span>In progress</span>
              <strong>{stats.inProgress}</strong>
            </div>
            <div className="tracker-stat tracker-stat-blocked">
              <span>Blocked</span>
              <strong>{stats.blocked}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="tracker-content">
        <div className="tracker-dashboard-grid">
          {dashboardRows.map(([area, rawStatus, completionSignal]) => {
            const status = visibleDashboardStatus(rawStatus);

            return (
              <article className={`tracker-dashboard-card status-${status}`} key={area}>
                <div>
                  <StatusIcon status={status} />
                  <span>{statusLabel(status)}</span>
                </div>
                <h2>{area}</h2>
                <p>{completionSignal}</p>
              </article>
            );
          })}
        </div>

        <section className="tracker-next-panel" aria-labelledby="next-up-title">
          <div className="tracker-section-heading">
            <ArrowRight aria-hidden="true" size={22} />
            <h2 id="next-up-title">Next Up</h2>
          </div>
          <div className="tracker-next-grid">
            {nextItems.map((item) => (
              <article className={`tracker-next-card status-${item.status}`} key={`${item.track}-${item.text}`}>
                <div>
                  <StatusIcon status={item.status} />
                  <span>{statusLabel(item.status)}</span>
                </div>
                <strong>{item.text}</strong>
                <p>
                  {item.track} · {item.section}
                </p>
              </article>
            ))}
          </div>
        </section>

        {openInputs.length > 0 ? (
          <section className="tracker-open-inputs" aria-labelledby="open-inputs-title">
            <div className="tracker-section-heading">
              <AlertTriangle aria-hidden="true" size={20} />
              <h2 id="open-inputs-title">Open Inputs Needed</h2>
            </div>
            <div className="tracker-input-grid">
              {openInputs.map((item) => (
                <article className="tracker-input-card" key={item.text}>
                  <strong>{item.text}</strong>
                  {item.acceptance.map((acceptance) => (
                    <p key={acceptance}>{acceptance}</p>
                  ))}
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <section className="tracker-section-list" aria-labelledby="detailed-checklist-title">
          <div className="tracker-section-heading">
            <Layers3 aria-hidden="true" size={22} />
            <h2 id="detailed-checklist-title">Tracks And Pages</h2>
          </div>

          <div className="tracker-workspace">
            <aside className="tracker-track-nav" aria-label="Tracker tracks">
              {visibleTracks.map((track) => {
                const trackStats = calculateStats([track]);
                const trackCompletion =
                  trackStats.total > 0 ? Math.round((trackStats.complete / trackStats.total) * 100) : 0;

                return (
                  <a href={`#${slugify(track.title)}`} key={track.title}>
                    <span>{track.title}</span>
                    <strong>{trackCompletion}%</strong>
                  </a>
                );
              })}
            </aside>

            <div className="tracker-track-pages">
              {visibleTracks.map((track) => {
                const trackStats = calculateStats([track]);
                const trackCompletion =
                  trackStats.total > 0 ? Math.round((trackStats.complete / trackStats.total) * 100) : 0;

                return (
                  <article className="tracker-track-card" id={slugify(track.title)} key={track.title}>
                    <header className="tracker-track-header">
                      <div>
                        <h3>{track.title}</h3>
                        <p>
                          {trackStats.complete} of {trackStats.total} complete · {trackStats.notStarted}{' '}
                          not started · {trackStats.blocked} blocked
                        </p>
                      </div>
                      <span>{trackCompletion}%</span>
                    </header>

                    <div className="tracker-mini-progress">
                      <span style={{ width: `${trackCompletion}%` }} />
                    </div>

                    <div className="tracker-page-grid">
                      {track.sections
                        .filter((section) => section.items.length > 0)
                        .map((section) => {
                          const sectionStats = calculateSectionStats(section);
                          const sectionCompletion =
                            sectionStats.total > 0
                              ? Math.round((sectionStats.complete / sectionStats.total) * 100)
                              : 0;

                          return (
                            <section className="tracker-section-card" key={section.title}>
                              <header>
                                <div>
                                  <h4>{section.title}</h4>
                                  <p>
                                    {sectionStats.complete} of {sectionStats.total} complete
                                  </p>
                                </div>
                                <span>{sectionCompletion}%</span>
                              </header>

                              <div className="tracker-mini-progress">
                                <span style={{ width: `${sectionCompletion}%` }} />
                              </div>

                              <div className="tracker-task-list">
                                {section.items.map((item) => (
                                  <details
                                    className={`tracker-task status-${item.status}`}
                                    key={item.text}
                                    open={item.status !== 'complete'}
                                  >
                                    <summary className="tracker-task-main">
                                      <StatusIcon status={item.status} />
                                      <span>
                                        <strong>{item.text}</strong>
                                        <em>{statusLabel(item.status)}</em>
                                      </span>
                                    </summary>
                                    {item.acceptance.length > 0 ? (
                                      <ul>
                                        {item.acceptance.map((acceptance) => (
                                          <li key={acceptance}>{acceptance}</li>
                                        ))}
                                      </ul>
                                    ) : null}
                                  </details>
                                ))}
                              </div>
                            </section>
                          );
                        })}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
