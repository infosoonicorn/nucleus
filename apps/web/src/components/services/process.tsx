'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import type { ProcessDossier } from '@/content/site';
import { SectionHeader } from '@/components/sections';

type ProcessProps = Readonly<{
  serviceTitle: string;
  ordinal: string;
  title?: string;
  phases?: { name: string; text: string }[];
  dossier?: ProcessDossier;
}>;

const GENERIC_PHASES = [
  { name: 'Diagnose', text: 'Scope the issue, identify decision owners, agree the workplan.' },
  { name: 'Structure', text: 'Build the model, assemble evidence, sequence the workstream.' },
  { name: 'Execute', text: 'Run the workstream, manage information, track issues to closure.' },
  { name: 'Report', text: 'Convert findings into management-ready action and next steps.' },
];

const AUTOPLAY_MS = 4200;
const RESUME_AFTER_USER_MS = 8000;

export function Process({ serviceTitle, ordinal, title, phases, dossier }: ProcessProps) {
  if (dossier) {
    return <DossierProcess ordinal={ordinal} title={title ?? 'Process'} dossier={dossier} />;
  }

  const usedPhases = phases ?? GENERIC_PHASES;
  return (
    <section className="service-v1-section service-v1-section-alt">
      <SectionHeader
        eyebrow="Process"
        title={title ?? `A clear engagement path for ${serviceTitle}.`}
      />
      <div className="service-v1-timeline">
        {usedPhases.map((phase, index) => (
          <div key={phase.name}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{phase.name}</h3>
            <p>{phase.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function DossierProcess({
  ordinal,
  title,
  dossier,
}: Readonly<{ ordinal: string; title: string; dossier: ProcessDossier }>) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stages = dossier.phases;
  const stagesLen = stages.length;

  const advance = useCallback(() => {
    setActive((i) => (i + 1) % stagesLen);
  }, [stagesLen]);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(advance, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [playing, advance]);

  function userJump(next: number) {
    setActive(((next % stagesLen) + stagesLen) % stagesLen);
    setPlaying(false);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPlaying(true), RESUME_AFTER_USER_MS);
  }

  useEffect(() => () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }, []);

  const currentStage = stages[active];
  const fillPct = ((active + 1) / stagesLen) * 100;

  return (
    <section className="service-v1-section service-v1-section-alt service-v1-dossier">
      <header className="service-v1-dossier-head">
        <div>
          <p className="service-v1-dossier-eyebrow">
            <span className="service-v1-dossier-eyebrow-num">●{ordinal}</span>
            <span aria-hidden="true" className="service-v1-dossier-eyebrow-bar" />
            <span>Process · Investment Banking</span>
          </p>
          <h2 className="service-v1-dossier-title">
            From <em>mandate</em>, to <em>wire</em>
            <span className="service-v1-dossier-title-stop">.</span>
          </h2>
        </div>
        <div className="service-v1-dossier-headside">
          <div className="service-v1-dossier-headmeta">
            <span className="service-v1-dossier-livedot" aria-hidden="true" />
            <span>{dossier.fileBadge}</span>
          </div>
        </div>
      </header>

      <article className="service-v1-dossier-card" aria-label={title}>
        <span className="service-v1-dossier-reg service-v1-dossier-reg-tl" />
        <span className="service-v1-dossier-reg service-v1-dossier-reg-tr" />
        <span className="service-v1-dossier-reg service-v1-dossier-reg-bl" />
        <span className="service-v1-dossier-reg service-v1-dossier-reg-br" />

        <header className="service-v1-dossier-cardhead">
          <div>
            <p className="service-v1-dossier-doc-eyebrow">{dossier.fileLabel}</p>
            <p className="service-v1-dossier-doc-title">{dossier.projectName}</p>
          </div>
          <div className="service-v1-dossier-doc-meta">
            <span>{dossier.engagementType}</span>
            <span>{dossier.partnerLabel}</span>
            <span className="service-v1-dossier-chip">
              <span className="service-v1-dossier-chip-pulse" aria-hidden="true" />
              <span>{currentStage.ordinal} · in review</span>
            </span>
          </div>
        </header>

        <div className="service-v1-dossier-entries">
          {stages.map((s, i) => {
            const state = i === active ? 'is-active' : i < active ? 'is-done' : 'is-pending';
            const statusText = i < active ? 'Signed' : i === active ? 'In review' : 'Pending';
            return (
              <button
                key={s.ordinal}
                type="button"
                onClick={() => userJump(i)}
                className={`service-v1-dossier-entry ${state}`}
                aria-pressed={i === active}
                aria-label={`Stage ${s.ordinal}: ${s.name}`}
              >
                <span className="service-v1-dossier-marker">
                  <span className="service-v1-dossier-marker-n">{s.ordinal}</span>
                  <span className="service-v1-dossier-statusbox">
                    <span className="service-v1-dossier-statusbox-glyph" />
                    <span>{statusText}</span>
                  </span>
                </span>

                <span className="service-v1-dossier-body">
                  <span className="service-v1-dossier-name">{s.name}</span>
                  <span className="service-v1-dossier-desc">{s.desc}</span>
                  <span className="service-v1-dossier-list">
                    {s.items.map((it) => (
                      <span key={it} className="service-v1-dossier-list-item">
                        {it}
                      </span>
                    ))}
                  </span>
                  <span className="service-v1-dossier-deliv">
                    <span>Deliverable —</span>
                    <span className="service-v1-dossier-deliv-val">{s.deliv}</span>
                  </span>
                  {state === 'is-active' ? (
                    <span className="service-v1-dossier-review">
                      <span className="service-v1-dossier-review-pulse" aria-hidden="true" />
                      <span>Partner review in progress</span>
                    </span>
                  ) : null}
                </span>

                <span className="service-v1-dossier-margin">
                  <span className="service-v1-dossier-stamp" aria-hidden="true">
                    <span className="service-v1-dossier-stamp-top">PARTNER</span>
                    <span className="service-v1-dossier-stamp-line">{s.stampLine}</span>
                    <span className="service-v1-dossier-stamp-bot">
                      NUCLEUS · {s.weeks.replace(/Weeks\s*/, 'WK ')}
                    </span>
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Engagement-file footer (location line / file note / partner
            signature) removed — it was decorative chrome that didn't
            add information beyond the dossier header above. */}
      </article>

      <div className="service-v1-dossier-controls">
        {/* "Now: NN — Name" indicator removed — repeated info that's
            already shown in each entry's status box above. */}
        <div className="service-v1-dossier-bar" aria-hidden="true">
          <span className="service-v1-dossier-fill" style={{ width: `${fillPct}%` }} />
        </div>
        <div className="service-v1-dossier-btns">
          <button
            type="button"
            className="service-v1-dossier-btn"
            aria-label="Previous stage"
            onClick={() => userJump(active - 1)}
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            className="service-v1-dossier-btn"
            aria-label={playing ? 'Pause autoplay' : 'Resume autoplay'}
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? <Pause size={12} /> : <Play size={12} />}
          </button>
          <button
            type="button"
            className="service-v1-dossier-btn"
            aria-label="Next stage"
            onClick={() => userJump(active + 1)}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
