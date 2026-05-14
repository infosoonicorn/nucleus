'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';

type Stage = {
  ordinal: string;
  name: string;
  weeks: string;
  nucleusDoes: string;
  deliverable: string;
};

const STAGES: Stage[] = [
  {
    ordinal: '01',
    name: 'Readiness',
    weeks: 'Weeks 1–2',
    nucleusDoes: 'Readiness assessment, data-room scoping, governance review.',
    deliverable: 'Fundraise readiness report',
  },
  {
    ordinal: '02',
    name: 'Modelling',
    weeks: 'Weeks 3–4',
    nucleusDoes: '3-statement model, sensitivity tabs, base/bull/bear scenarios.',
    deliverable: 'Financial model',
  },
  {
    ordinal: '03',
    name: 'Storytelling',
    weeks: 'Weeks 5–7',
    nucleusDoes: 'Narrative-first investor deck, IM, sector framing.',
    deliverable: 'Investor deck and IM',
  },
  {
    ordinal: '04',
    name: 'Outreach',
    weeks: 'Weeks 8–12',
    nucleusDoes: 'Investor mapping, target list, intro coordination.',
    deliverable: 'Investor target list',
  },
  {
    ordinal: '05',
    name: 'Diligence',
    weeks: 'Weeks 10–14',
    nucleusDoes: 'DD pack, Q&A management, issue tracker for accountable closure.',
    deliverable: 'Diligence checklist and data room',
  },
  {
    ordinal: '06',
    name: 'Close',
    weeks: 'Weeks 14–16',
    nucleusDoes: 'Term sheet review, transaction workplan, signing coordination.',
    deliverable: 'Transaction workplan',
  },
];

export function FundraiseStages() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  const stageIndex = useTransform(scrollYProgress, (v) => {
    const clamped = Math.max(0, Math.min(0.9999, v));
    return Math.floor(clamped * STAGES.length);
  });
  const [active, setActive] = useState(0);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    if (reduceMotion) return;
    return stageIndex.on('change', (v) =>
      setActive(Math.max(0, Math.min(STAGES.length - 1, v))),
    );
  }, [reduceMotion, stageIndex]);

  function jumpTo(next: number, focus = true) {
    const safe = Math.max(0, Math.min(STAGES.length - 1, next));
    setActive(safe);
    if (focus) dotRefs.current[safe]?.focus();
  }

  function handleKey(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      jumpTo(active + 1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      jumpTo(active - 1);
    }
  }

  // Reduced-motion / no-scroll fallback: flat six-card grid (same as before).
  if (reduceMotion) {
    return (
      <section className="service-v1-section service-v1-fundraise service-v1-fundraise-reduced">
        <FundraiseHeader />
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
    <div ref={containerRef} className="service-v1-fundraise-host">
      <div className="service-v1-fundraise-sticky">
        <section className="service-v1-section service-v1-fundraise">
          <FundraiseHeader />

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
                    aria-selected={index === active}
                    aria-controls="fundraise-panel"
                    tabIndex={index === active ? 0 : -1}
                    onClick={() => jumpTo(index, false)}
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

          <div className="service-v1-fundraise-rule" aria-hidden="true" />

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
        </section>
      </div>
    </div>
  );
}

function FundraiseHeader() {
  return (
    <header className="service-v1-fundraise-header">
      <p className="service-v1-fundraise-eyebrow">
        <span>§01</span>
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

  return (
    <aside className="service-v1-fundraise-doc-wrap" aria-hidden="true">
      <div className="service-v1-fundraise-doc service-v1-fundraise-doc-back-2" />
      <div className="service-v1-fundraise-doc service-v1-fundraise-doc-back-1" />
      <article className="service-v1-fundraise-doc service-v1-fundraise-doc-front">
        <div className="service-v1-fundraise-doc-corner" />
        <p className="service-v1-fundraise-doc-eyebrow">Nucleus Advisors · Confidential</p>
        <h4 className="service-v1-fundraise-doc-title">{stage.deliverable}</h4>
        <p className="service-v1-fundraise-doc-meta">
          {stage.weeks} · §{stage.ordinal}
        </p>
        <div className="service-v1-fundraise-doc-rule" />
        <div className="service-v1-fundraise-doc-lines">
          {lines.map((w, i) => (
            <span
              key={i}
              className="service-v1-fundraise-doc-line"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
        <div className="service-v1-fundraise-doc-sig">
          <span className="service-v1-fundraise-doc-sig-line" />
          <span className="service-v1-fundraise-doc-sig-lab">Prepared by Nucleus</span>
        </div>
      </article>
    </aside>
  );
}
