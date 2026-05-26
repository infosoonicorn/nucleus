'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { FadeIn } from '@/components/motion-primitives';

// People-only journey of the firm — partners as they joined, with the
// capability they brought (pills) and any micro-context that the pills
// can't convey (e.g. "Day 1 with the founding team"). Office milestones
// were intentionally pulled out per partner direction; the closing
// "how it started vs how it's going" image carries the footprint story.
type Pill = string;

type JourneyEntry = {
  year: string;                   // visible year stamp (e.g. "2019")
  yearIsCont?: boolean;           // hide year visually when it duplicates the row above
  isToday?: boolean;              // pulsing red dot for the last entry
  isFounded?: boolean;            // render the Nucleus logo banner above the bubble
  partner?: {
    slug: string;                 // /team/{slug}.jpg
    name: string;                 // includes CA/CS honorific
    micro?: string;               // optional contextual subline
  };
  milestone?: {                   // firm milestone instead of a partner row
    key: string;                  // unique key (slug-like)
    logoSrc: string;              // logo path under /public
    logoAlt: string;
    title: string;                // headline (e.g. 'Soonicorn Ventures launches.')
    micro?: string;               // optional subline
  };
  pills: Pill[];                  // capabilities this person / milestone brought
};

const ENTRIES: JourneyEntry[] = [
  {
    year: '2011',
    partner: {
      slug: 'pravesh-goel',
      name: 'CA Pravesh Goel',
      micro: 'Independent practice begins',
    },
    pills: ['Risk Advisory', 'Tax & Regulatory', 'Assurance'],
  },
  {
    year: '2017',
    partner: {
      slug: 'vijay-singh-rathore',
      name: 'CA Vijay Singh Rathore',
      micro: 'Joins with expertise of capital markets',
    },
    pills: ['Investment Banking', 'Valuations'],
  },
  {
    year: '2019',
    isFounded: true,
    partner: {
      slug: 'hemendra-chauhan',
      name: 'CA Hemendra Chauhan',
      micro: 'Day 1 with the founding team',
    },
    pills: ['GST'],
  },
  {
    year: '2020',
    partner: { slug: 'neha-rathore', name: 'CS Neha Rathore' },
    pills: ['Corporate Secretarial', 'AIF & Fund Mgmt'],
  },
  {
    year: '2020',
    yearIsCont: true,
    partner: { slug: 'abhishek-gupta', name: 'CA Abhishek Gupta' },
    pills: ['Assurance'],
  },
  {
    year: '2021',
    partner: { slug: 'ashish-gupta', name: 'CA Ashish Gupta' },
    pills: ['Risk Advisory'],
  },
  {
    year: '2022',
    milestone: {
      key: 'soonicorn-ventures',
      logoSrc: '/brand/soonicorn-ventures.png',
      logoAlt: 'Soonicorn Ventures',
      title: 'Soonicorn Ventures launches — M&A Advisory enters the firm.',
      micro: 'Dedicated buy-side, sell-side and restructuring practice.',
    },
    pills: ['M&A Advisory'],
  },
  {
    year: '2022',
    yearIsCont: true,
    partner: { slug: 'rajat-singla', name: 'CA Rajat Singla' },
    pills: ['Tax & Regulatory'],
  },
  {
    year: '2022',
    yearIsCont: true,
    partner: { slug: 'geetanjali-virmani', name: 'Geetanjali Virmani' },
    pills: ['Finance Outsourcing'],
  },
  {
    year: '2026',
    isToday: true,
    partner: {
      slug: 'aakash-kalra',
      name: 'CA Aakash Kalra',
      micro: 'Deepens M&A with Pravesh Goel',
    },
    pills: ['M&A Advisory'],
  },
];

export function AboutJourney() {
  const reduceMotion = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);

  // Scroll-linked vertical fill behind the dots — navy at the top, red
  // by the end. Grows as the user reads down through the timeline.
  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ['start 70%', 'end 30%'],
  });
  const fillHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section className="about-journey" aria-label="Nucleus journey">
      <div className="about-journey-inner">
        <FadeIn>
          <header className="about-journey-header">
            <p className="about-journey-eyebrow">Our journey</p>
            <h2 className="about-journey-title">
              Fifteen years of people compounding into a firm.
            </h2>
          </header>
        </FadeIn>

        <div ref={railRef} className="about-journey-rail">
          <span className="about-journey-axis" aria-hidden="true" />
          {!reduceMotion ? (
            <motion.span
              className="about-journey-axis-fill"
              style={{ height: fillHeight }}
              aria-hidden="true"
            />
          ) : null}

          {ENTRIES.map((entry, i) => (
            <motion.div
              key={`${entry.year}-${entry.partner?.slug ?? entry.milestone?.key ?? i}`}
              className={`about-journey-entry${entry.isToday ? ' is-today' : ''}${entry.isFounded ? ' is-founded' : ''}`}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{
                duration: 0.55,
                delay: (i % 3) * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <span
                className={`about-journey-year${entry.yearIsCont ? ' is-cont' : ''}`}
                aria-hidden={entry.yearIsCont || undefined}
              >
                {entry.year}
              </span>

              <span className="about-journey-dot-col">
                <span className="about-journey-dot" aria-hidden="true" />
              </span>

              <div className="about-journey-body">
                {entry.isFounded ? (
                  <div className="about-journey-founded">
                    <div className="about-journey-founded-mark">
                      <Image
                        src="/brand/nucleus-logo.png"
                        alt="Nucleus Advisors logo"
                        width={140}
                        height={64}
                        priority={false}
                      />
                    </div>
                    <div className="about-journey-founded-text">
                      <p className="about-journey-founded-label">Incorporated</p>
                      <p className="about-journey-founded-title">
                        Nucleus Advisors is formally established.
                      </p>
                      <p className="about-journey-founded-sub">
                        A slim founding team takes the practice and makes it a firm.
                      </p>
                    </div>
                  </div>
                ) : null}

                {entry.partner ? (
                  <div className="about-journey-person">
                    <span className="about-journey-avatar">
                      <Image
                        src={`/team/${entry.partner.slug}.jpg`}
                        alt=""
                        width={38}
                        height={38}
                      />
                    </span>
                    <span className="about-journey-person-text">
                      <span className="about-journey-person-name">
                        {entry.partner.name}
                      </span>
                      {entry.partner.micro ? (
                        <span className="about-journey-person-micro">
                          {entry.partner.micro}
                        </span>
                      ) : null}
                    </span>
                  </div>
                ) : entry.milestone ? (
                  <div className="about-journey-person about-journey-milestone">
                    <span className="about-journey-avatar about-journey-milestone-mark">
                      <Image
                        src={entry.milestone.logoSrc}
                        alt={entry.milestone.logoAlt}
                        width={38}
                        height={38}
                      />
                    </span>
                    <span className="about-journey-person-text">
                      <span className="about-journey-person-name">
                        {entry.milestone.title}
                      </span>
                      {entry.milestone.micro ? (
                        <span className="about-journey-person-micro">
                          {entry.milestone.micro}
                        </span>
                      ) : null}
                    </span>
                  </div>
                ) : null}

                <div className="about-journey-pills">
                  {entry.pills.map((pill) => (
                    <span key={pill} className="about-journey-pill">
                      {pill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <FadeIn delay={0.2}>
          <div className="about-journey-closing">
            <p className="about-journey-closing-eyebrow">From a handful to a firm</p>
            <h3 className="about-journey-closing-title">
              A handful of founders. A floor full of specialists.
            </h3>
            <div className="about-journey-closing-card">
              <Image
                src="/about/team-growth.png"
                alt="Nucleus Advisors team — founding group in 2019 on top, current 2026 team below."
                width={1280}
                height={720}
                sizes="(max-width: 720px) 100vw, 880px"
              />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
