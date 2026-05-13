'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { decisiveMoments } from '@/content/site';
import { Reveal } from '@/components/motion-primitives';

const ROTATE_INTERVAL_MS = 5400;

export function HomeMomentsMarquee() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const total = decisiveMoments.length;
  const current = decisiveMoments[index] ?? '';
  const words = current.split(' ');

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, ROTATE_INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, total]);

  function pauseBriefly() {
    setPaused(true);
    setTimeout(() => setPaused(false), 9000);
  }

  function goPrev() {
    setIndex((prev) => (prev - 1 + total) % total);
    pauseBriefly();
  }

  function goNext() {
    setIndex((prev) => (prev + 1) % total);
    pauseBriefly();
  }

  function goTo(target: number) {
    setIndex(target);
    pauseBriefly();
  }

  return (
    <section
      ref={sectionRef}
      className="home-v3-moments"
      aria-label="When clients engage Nucleus"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <span className="home-v3-moments-bg" aria-hidden="true" />

      <Reveal>
        <div className="home-v3-section-header">
          <span className="home-v3-section-eyebrow">When clients engage</span>
          <h2>The decision moments where Nucleus becomes useful.</h2>
        </div>
      </Reveal>

      <div className="home-v3-moments-stage" aria-live="polite">
        <span className="home-v3-moments-counter">
          <Compass aria-hidden="true" size={14} />
          {String(index + 1).padStart(2, '0')}
          <span aria-hidden="true">/</span>
          {String(total).padStart(2, '0')}
        </span>

        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={index}
            className="home-v3-moments-display"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            {words.map((word, wIndex) => (
              <motion.span
                key={`${index}-${wIndex}`}
                initial={{ y: '105%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                  delay: wIndex * 0.05,
                }}
                className="home-v3-moments-word"
              >
                {word}
                {wIndex < words.length - 1 ? ' ' : ''}
              </motion.span>
            ))}
          </motion.p>
        </AnimatePresence>

        <div className="home-v3-moments-progress" aria-hidden="true">
          <motion.span
            key={`progress-${index}-${paused}`}
            className="home-v3-moments-progress-fill"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: paused ? 0 : 1 }}
            transition={{
              duration: paused ? 0 : ROTATE_INTERVAL_MS / 1000,
              ease: 'linear',
            }}
            style={{ transformOrigin: '0% 50%' }}
          />
        </div>

        <div className="home-v3-moments-nav">
          <button
            type="button"
            className="home-v3-moments-arrow"
            onClick={goPrev}
            aria-label="Previous decision moment"
          >
            <ChevronLeft aria-hidden="true" size={18} />
          </button>
          <button
            type="button"
            className="home-v3-moments-arrow"
            onClick={goNext}
            aria-label="Next decision moment"
          >
            <ChevronRight aria-hidden="true" size={18} />
          </button>
        </div>
      </div>

      <ul className="home-v3-moments-rail" role="tablist" aria-label="Decision moments">
        {decisiveMoments.map((moment, i) => (
          <li key={moment}>
            <button
              type="button"
              role="tab"
              aria-selected={i === index}
              className={`home-v3-moments-pill${i === index ? ' is-active' : ''}`}
              onClick={() => goTo(i)}
            >
              <span className="home-v3-moments-pill-index" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="home-v3-moments-pill-text">
                {firstWords(moment, 4)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function firstWords(text: string, count: number) {
  const parts = text.split(' ');
  const head = parts.slice(0, count).join(' ');
  return parts.length > count ? `${head.replace(/[.,]$/, '')}…` : head;
}
