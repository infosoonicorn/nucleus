'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Pause, Play } from 'lucide-react';

type ActorRow = Readonly<{
  actor: 'Nucleus' | 'Client' | 'Counsel';
  tasks: string[];
}>;

type Mandate = Readonly<{
  key: 'buy' | 'sell';
  label: string;
  posture: string;             // short editorial sub-line in the tab header
  promise: string;             // 1-2 sentence pitch shown when tab opens
  timeline: { weeks: string; phase: string; brief: string }[];
  inflections: { title: string; body: string }[];
  actors: ActorRow[];
}>;

const MANDATES: Mandate[] = [
  {
    key: 'buy',
    label: 'Buy-side',
    posture: 'You know what you want to acquire',
    promise:
      'You know what you want to acquire. We help you find it, calibrate the price, run the diligence and negotiate to a close — without the strategic intent leaking before you are ready.',
    timeline: [
      { weeks: 'Weeks 1–3',  phase: 'Scope & screen',       brief: 'Investment thesis, target universe, shortlist.' },
      { weeks: 'Weeks 4–8',  phase: 'Approach & dialogue',  brief: 'Approach letters, exploratory meetings, IOI / NBO.' },
      { weeks: 'Weeks 9–14', phase: 'Diligence & terms',    brief: 'DD coordination, valuation triangulation, term sheet.' },
      { weeks: 'Weeks 15–20', phase: 'Close & integrate',    brief: 'SPA negotiation, CP tracking, signing, 60-day handover.' },
    ],
    inflections: [
      {
        title: 'First approach letter',
        body: 'One shot to make the introduction land. Tone, channel, named sender — calibrated to the target\'s board posture, not boilerplate.',
      },
      {
        title: 'IOI / NBO calibration',
        body: 'When to engage on price seriously vs walk away. We model the implied multiples three ways before any number is committed in writing.',
      },
      {
        title: 'Diligence twist',
        body: 'Every buy-side has the moment something surfaces in DD that wasn\'t in the IM. We pre-write the response paths so it doesn\'t derail momentum.',
      },
      {
        title: 'Sign to close',
        body: 'Twenty to forty CPs to track without losing pace. We run the issue tracker and the close calendar — the seller\'s lawyer never sets the rhythm.',
      },
    ],
    actors: [
      {
        actor: 'Nucleus',
        tasks: [
          'Target screening + shortlist',
          'Approach + bilateral diligence',
          'Valuation triangulation',
          'Term sheet + SPA commercial review',
          'CP tracker + close coordination',
        ],
      },
      {
        actor: 'Client',
        tasks: [
          'Strategic-fit calls',
          'Management interactions',
          'Final pricing decisions',
          'Post-close integration ownership',
        ],
      },
      {
        actor: 'Counsel',
        tasks: [
          'SPA / SHA drafting',
          'Reps & warranties',
          'Regulatory filings',
          'Closing mechanics',
        ],
      },
    ],
  },
  {
    key: 'sell',
    label: 'Sell-side',
    posture: 'You are considering an exit',
    promise:
      'You are considering an exit. We design and run the process so the best outcome shows up at the closing table — not the highest first bid, the one that actually closes.',
    timeline: [
      { weeks: 'Weeks 1–4',  phase: 'Process design',       brief: 'Teaser, CIM, data-room build, buyer mapping.' },
      { weeks: 'Weeks 5–10', phase: 'Outreach & first bids', brief: 'Bilateral approaches, NDAs, IOIs, shortlist.' },
      { weeks: 'Weeks 11–16', phase: 'Diligence & final bids', brief: 'Diligence access, Q&A management, NBOs.' },
      { weeks: 'Weeks 17–24', phase: 'Negotiation & close',   brief: 'SPA negotiation, signing, wire, handover.' },
    ],
    inflections: [
      {
        title: 'Teaser vs CIM',
        body: 'What to reveal at each stage. Too much in the teaser kills the auction; too little wastes everyone\'s time. We size the disclosure to the buyer pool.',
      },
      {
        title: 'Initial bids to shortlist',
        body: 'Pick 3–5 buyers who actually compete. The wrong shortlist looks democratic and produces one bid; the right shortlist produces three real ones.',
      },
      {
        title: 'Data-room control',
        body: 'Q&A management keeps diligence on the calendar. Information goes to all bidders simultaneously, on our cadence — never the buyer\'s.',
      },
      {
        title: 'Final bids to definitive',
        body: 'The highest bid isn\'t always the one that closes. We pick by certainty-of-close × value × cultural fit — and brief the founder on the trade-off explicitly.',
      },
    ],
    actors: [
      {
        actor: 'Nucleus',
        tasks: [
          'Process design + buyer map',
          'Teaser + CIM build',
          'Data-room + Q&A management',
          'Bid evaluation + recommendation',
          'SPA commercial negotiation',
        ],
      },
      {
        actor: 'Client',
        tasks: [
          'Management presentation prep',
          'Key information sessions',
          'Final bid selection',
          'Cultural-fit conversations',
        ],
      },
      {
        actor: 'Counsel',
        tasks: [
          'Process NDA',
          'SPA negotiation',
          'Reps & warranties insurance',
          'Regulatory + closing',
        ],
      },
    ],
  },
];

const AUTOPLAY_MS = 9000;
const RESUME_AFTER_USER_MS = 12000;

type Props = Readonly<{
  ordinal: string;
}>;

export function MAMandateVisualizer({ ordinal }: Props) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<'buy' | 'sell'>('buy');
  const [playing, setPlaying] = useState(true);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const advance = useCallback(() => {
    setActive((k) => (k === 'buy' ? 'sell' : 'buy'));
  }, []);

  useEffect(() => {
    if (reduceMotion || !playing) return;
    const id = window.setInterval(advance, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, playing, advance]);

  useEffect(() => () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }, []);

  function userPick(next: 'buy' | 'sell') {
    setActive(next);
    setPlaying(false);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setPlaying(true), RESUME_AFTER_USER_MS);
  }

  const mandate = MANDATES.find((m) => m.key === active)!;

  return (
    <section className="service-v1-section ma-mandate" aria-labelledby="ma-mandate-heading">
      <header className="ma-mandate-head">
        <p className="ma-mandate-eyebrow">
          <span aria-hidden="true" className="ma-mandate-eyebrow-bar" />
          <span>Two mandates · two postures</span>
        </p>
        <h2 id="ma-mandate-heading" className="ma-mandate-title">
          How we run a <em>buy-side</em> versus a <em>sell-side</em>.
        </h2>
      </header>

      {/* Tab toggle */}
      <div className="ma-mandate-tabs" role="tablist" aria-label="Mandate type">
        {MANDATES.map((m) => (
          <button
            key={m.key}
            type="button"
            role="tab"
            aria-selected={m.key === active}
            aria-controls="ma-mandate-panel"
            tabIndex={m.key === active ? 0 : -1}
            onClick={() => userPick(m.key)}
            className={`ma-mandate-tab ${m.key === active ? 'is-active' : ''}`}
          >
            <span className="ma-mandate-tab-label">{m.label}</span>
            <span className="ma-mandate-tab-posture">{m.posture}</span>
          </button>
        ))}
        <button
          type="button"
          className="ma-mandate-playbtn"
          aria-label={playing ? 'Pause autoplay' : 'Resume autoplay'}
          onClick={() => setPlaying((p) => !p)}
        >
          {playing ? <Pause size={12} /> : <Play size={12} />}
        </button>
      </div>

      {/* Animated panel */}
      <div id="ma-mandate-panel" role="tabpanel" className="ma-mandate-panel-wrap">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={mandate.key}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="ma-mandate-panel"
          >
            <p className="ma-mandate-promise">{mandate.promise}</p>

            <div className="ma-mandate-cols">
              {/* Timeline */}
              <div className="ma-mandate-col">
                <p className="ma-mandate-collabel">Timeline</p>
                <ol className="ma-mandate-timeline">
                  {mandate.timeline.map((t, i) => (
                    <li key={`${mandate.key}-tl-${i}`} className="ma-mandate-timeline-step">
                      <span className="ma-mandate-timeline-dot" aria-hidden="true" />
                      <div>
                        <p className="ma-mandate-timeline-weeks">{t.weeks}</p>
                        <p className="ma-mandate-timeline-phase">{t.phase}</p>
                        <p className="ma-mandate-timeline-brief">{t.brief}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Inflections */}
              <div className="ma-mandate-col">
                <p className="ma-mandate-collabel">Key inflections</p>
                <ul className="ma-mandate-inflections">
                  {mandate.inflections.map((inf, i) => (
                    <li key={`${mandate.key}-inf-${i}`} className="ma-mandate-inflection">
                      <p className="ma-mandate-inflection-title">
                        <span className="ma-mandate-inflection-num">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        {inf.title}
                      </p>
                      <p className="ma-mandate-inflection-body">{inf.body}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Who does what */}
            <div className="ma-mandate-actors">
              <p className="ma-mandate-collabel">Who does what</p>
              <div className="ma-mandate-actors-grid">
                {mandate.actors.map((a) => (
                  <div key={`${mandate.key}-${a.actor}`} className="ma-mandate-actor">
                    <p className="ma-mandate-actor-name">{a.actor}</p>
                    <ul className="ma-mandate-actor-tasks">
                      {a.tasks.map((t) => (
                        <li key={t}>
                          <ArrowRight size={11} aria-hidden="true" />
                          <span>{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
