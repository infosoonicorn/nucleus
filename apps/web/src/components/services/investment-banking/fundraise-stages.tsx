'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { getResourceBySlug } from '@/content/resources';
import { RequestResourceButton } from '@/components/resources/request-resource-button';

type Stage = {
  ordinal: string;
  name: string;
  weeks: string;
  nucleusDoes: string;
  deliverable: string;
  resourceSlug: string;     // matching entry in apps/web/src/content/resources.ts
};

const STAGES: Stage[] = [
  {
    ordinal: '01',
    name: 'Readiness',
    weeks: 'Weeks 1–2',
    nucleusDoes: 'Data-room scoping, governance review, gap analysis before any investor sees a page.',
    deliverable: 'Fundraise readiness report',
    resourceSlug: 'ib-stage-readiness-report',
  },
  {
    ordinal: '02',
    name: 'Modelling',
    weeks: 'Weeks 3–4',
    nucleusDoes: 'Three-statement build with sensitivity tabs and base / bull / bear scenarios, tied back to actuals.',
    deliverable: 'Financial model',
    resourceSlug: 'ib-stage-financial-model',
  },
  {
    ordinal: '03',
    name: 'Storytelling',
    weeks: 'Weeks 5–7',
    nucleusDoes: 'Narrative work, sector framing, FAQ pack written for the analyst who reads on Saturday morning.',
    deliverable: 'Investor deck and IM',
    resourceSlug: 'ib-stage-investor-deck-im',
  },
  {
    ordinal: '04',
    name: 'Outreach',
    weeks: 'Weeks 8–12',
    nucleusDoes: 'Investor mapping, sequenced introductions, calendar choreography across funds.',
    deliverable: 'Investor target list',
    resourceSlug: 'ib-stage-investor-target-list',
  },
  {
    ordinal: '05',
    name: 'Diligence',
    weeks: 'Weeks 10–14',
    nucleusDoes: 'Document marshalling, Q&A management, issue tracker driven to accountable closure.',
    deliverable: 'Diligence checklist and data room',
    resourceSlug: 'ib-stage-diligence-pack',
  },
  {
    ordinal: '06',
    name: 'Close',
    weeks: 'Weeks 14–16',
    nucleusDoes: 'Term sheet negotiation, signing coordination, ninety-day post-wire handover.',
    deliverable: 'Transaction workplan',
    resourceSlug: 'ib-stage-transaction-workplan',
  },
];

const AUTOPLAY_MS = 4200;
const RESUME_AFTER_USER_MS = 8000;

type FundraiseStagesProps = Readonly<{
  /** Section ordinal shown in the eyebrow (`§NN`). Defaults to '01' for
   *  backwards compat — IB page now passes its own section number. */
  ordinal?: string;
}>;

export function FundraiseStages({ ordinal = '01' }: FundraiseStagesProps = {}) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const advance = useCallback(() => {
    setActive((i) => (i + 1) % STAGES.length);
  }, []);

  useEffect(() => {
    if (reduceMotion || !playing) return;
    const id = setInterval(advance, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [reduceMotion, playing, advance]);

  useEffect(() => () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }, []);

  function userJump(next: number, focus = false) {
    const safe = ((next % STAGES.length) + STAGES.length) % STAGES.length;
    setActive(safe);
    setPlaying(false);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPlaying(true), RESUME_AFTER_USER_MS);
    if (focus) dotRefs.current[safe]?.focus();
  }

  function handleKey(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      userJump(active + 1, true);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      userJump(active - 1, true);
    }
  }

  // Reduced-motion fallback: flat six-card grid (no autoplay, no animation).
  if (reduceMotion) {
    return (
      <section className="service-v1-section service-v1-fundraise service-v1-fundraise-reduced">
        <FundraiseHeader ordinal={ordinal} />
        <ol className="service-v1-fundraise-grid">
          {STAGES.map((stage) => (
            <li key={stage.ordinal}>
              <div className="service-v1-fundraise-grid-head">
                <span className="service-v1-fundraise-ordinal">{stage.ordinal}</span>
                <h3>{stage.name}</h3>
                <span className="service-v1-fundraise-weeks">{stage.weeks}</span>
              </div>
              <p className="service-v1-fundraise-label">What Nucleus does</p>
              <p>{stage.nucleusDoes}</p>
              <p className="service-v1-fundraise-label">Deliverable</p>
              <p className="service-v1-fundraise-deliverable">
                <span aria-hidden="true">→ </span>
                {stage.deliverable}
              </p>
            </li>
          ))}
        </ol>
      </section>
    );
  }

  const fillPct = STAGES.length > 1 ? (active / (STAGES.length - 1)) * 100 : 0;
  const stage = STAGES[active];

  return (
    <section className="service-v1-section service-v1-fundraise">
      <FundraiseHeader ordinal={ordinal} />

      <div className="service-v1-fundraise-track-wrap">
        <div className="service-v1-fundraise-track-line" aria-hidden="true">
          <span
            className="service-v1-fundraise-track-fill"
            style={{ width: `${fillPct}%` }}
          />
        </div>
        <div
          role="tablist"
          aria-label="Fundraise stages"
          className="service-v1-fundraise-track"
          onKeyDown={handleKey}
        >
          {STAGES.map((s, index) => {
            const state =
              index < active ? 'is-past' : index === active ? 'is-active' : 'is-future';
            return (
              <button
                role="tab"
                key={s.ordinal}
                ref={(el) => {
                  dotRefs.current[index] = el;
                }}
                type="button"
                aria-label={s.name}
                aria-selected={index === active}
                aria-controls="fundraise-panel"
                tabIndex={index === active ? 0 : -1}
                onClick={() => userJump(index, false)}
                className={`service-v1-fundraise-dot ${state}`}
              >
                <span className="service-v1-fundraise-dot-mark" aria-hidden="true">
                  <span className="service-v1-fundraise-dot-inner" />
                </span>
                <span className="service-v1-fundraise-dot-ord">{s.ordinal}</span>
                <span className="service-v1-fundraise-dot-name">{s.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        role="tabpanel"
        id="fundraise-panel"
        aria-live="polite"
        className="service-v1-fundraise-panel"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={stage.ordinal}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="service-v1-fundraise-panel-inner"
          >
            <div className="service-v1-fundraise-panel-text">
              <div className="service-v1-fundraise-panel-head">
                <h3>
                  <span className="service-v1-fundraise-ordinal">{stage.ordinal}</span>{' '}
                  <span className="service-v1-fundraise-panel-name">{stage.name}</span>
                </h3>
                <span className="service-v1-fundraise-weeks">{stage.weeks}</span>
              </div>
              <div className="service-v1-fundraise-panel-grid">
                <div>
                  <p className="service-v1-fundraise-label">What Nucleus does</p>
                  <p className="service-v1-fundraise-body">{stage.nucleusDoes}</p>
                </div>
                <div>
                  <p className="service-v1-fundraise-label">Deliverable</p>
                  <p className="service-v1-fundraise-deliverable">
                    <span aria-hidden="true">→ </span>
                    {stage.deliverable}
                  </p>
                </div>
              </div>
            </div>

            <DocPreview stage={stage} />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="service-v1-fundraise-controls">
        <p className="service-v1-fundraise-now">
          Now: <span>{stage.ordinal} — {stage.name}</span>
        </p>
        <div className="service-v1-fundraise-btns">
          <button
            type="button"
            className="service-v1-fundraise-btn"
            aria-label="Previous stage"
            onClick={() => userJump(active - 1)}
          >
            <ChevronLeft size={14} />
          </button>
          <button
            type="button"
            className="service-v1-fundraise-btn"
            aria-label={playing ? 'Pause autoplay' : 'Resume autoplay'}
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? <Pause size={12} /> : <Play size={12} />}
          </button>
          <button
            type="button"
            className="service-v1-fundraise-btn"
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

function FundraiseHeader({ ordinal }: Readonly<{ ordinal: string }>) {
  return (
    <header className="service-v1-fundraise-header">
      <p className="service-v1-fundraise-eyebrow">
        <span>§{ordinal}</span>
        <span aria-hidden="true" className="service-v1-fundraise-eyebrow-rule" />
        <span>Fundraise</span>
      </p>
      <h2 className="service-v1-fundraise-headline">
        From idea to{' '}
        <em>closed round,</em>
        <br />
        in <em>six deliberate steps.</em>
      </h2>
    </header>
  );
}

/**
 * DocPreview — the stacked-document mockup on the right of the active
 * stage panel. The whole stack is now a clickable trigger that opens
 * the resource-request modal so visitors can ask for a redacted sample
 * of that stage's actual artefact. A visible "→ Request sample" chip
 * sits at the top-right of the front card so the affordance is
 * unmistakable, not just a hover surprise.
 *
 * Falls back to a non-interactive `aside` (the old behaviour) if no
 * matching entry in resources.ts is found — defensive only, the static
 * STAGES table above always provides a valid slug.
 */
function DocPreview({ stage }: Readonly<{ stage: Stage }>) {
  // Stable mock-content line widths per stage so the preview feels like a real
  // document, not a random skeleton. Seed from ordinal so each stage is distinct.
  const lines = useMemo(() => {
    const seed = parseInt(stage.ordinal, 10);
    return Array.from({ length: 4 }).map((_, i) => {
      const base = ((seed * 53 + i * 17) % 35) + 55; // 55–90% widths
      return base;
    });
  }, [stage.ordinal]);

  const cardStack = (
    <>
      <span className="service-v1-fundraise-doc service-v1-fundraise-doc-back-2" />
      <span className="service-v1-fundraise-doc service-v1-fundraise-doc-back-1" />
      <span className="service-v1-fundraise-doc service-v1-fundraise-doc-front">
        <span className="service-v1-fundraise-doc-corner" />
        <span className="service-v1-fundraise-doc-cta">
          Request sample
          <ArrowRight size={12} aria-hidden="true" />
        </span>
        <span className="service-v1-fundraise-doc-eyebrow">Nucleus Advisors · Confidential</span>
        <span className="service-v1-fundraise-doc-title">{stage.deliverable}</span>
        <span className="service-v1-fundraise-doc-meta">
          {stage.weeks} · §{stage.ordinal}
        </span>
        <span className="service-v1-fundraise-doc-rule" />
        <span className="service-v1-fundraise-doc-lines">
          {lines.map((w, i) => (
            <span
              key={i}
              className="service-v1-fundraise-doc-line"
              style={{ width: `${w}%` }}
            />
          ))}
        </span>
        <span className="service-v1-fundraise-doc-sig">
          <span className="service-v1-fundraise-doc-sig-line" />
          <span className="service-v1-fundraise-doc-sig-lab">Prepared by Nucleus</span>
        </span>
      </span>
    </>
  );

  const resource = getResourceBySlug(stage.resourceSlug);
  if (!resource) {
    return (
      <aside className="service-v1-fundraise-doc-wrap" aria-hidden="true">
        {cardStack}
      </aside>
    );
  }
  return (
    <RequestResourceButton
      resource={resource}
      className="service-v1-fundraise-doc-wrap service-v1-fundraise-doc-trigger"
    >
      {cardStack}
    </RequestResourceButton>
  );
}
