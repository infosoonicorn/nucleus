'use client';

import { useRef, useState, type KeyboardEvent } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, MapPin } from 'lucide-react';
import { offices } from '@/content/offices';

const PANEL_TRANSITION = {
  duration: 0.36,
  ease: [0.22, 1, 0.36, 1] as const,
};

export function AboutOffices() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const active = offices[activeIndex];

  function focusTab(index: number) {
    const safe = ((index % offices.length) + offices.length) % offices.length;
    setActiveIndex(safe);
    tabRefs.current[safe]?.focus();
  }

  function handleKey(event: KeyboardEvent<HTMLUListElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      event.preventDefault();
      focusTab(activeIndex + 1);
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      event.preventDefault();
      focusTab(activeIndex - 1);
    } else if (event.key === 'Home') {
      event.preventDefault();
      focusTab(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      focusTab(offices.length - 1);
    }
  }

  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(
    active.mapsQuery,
  )}&output=embed`;

  return (
    <section className="about-offices" aria-labelledby="about-offices-heading">
      <div className="about-offices-header">
        <p className="home-v3-section-eyebrow about-offices-eyebrow">Offices</p>
        <h2 id="about-offices-heading" className="about-offices-heading">
          Five offices across India.
        </h2>
        <p className="about-offices-sub">
          Pick an office to see the location, address and photographs.
        </p>
      </div>

      <div className="about-offices-grid">
        <nav className="about-offices-list" aria-label="Nucleus offices">
          <ul
            role="tablist"
            aria-orientation="vertical"
            onKeyDown={handleKey}
          >
            {offices.map((office, i) => {
              const isActive = i === activeIndex;
              const tabId = `office-tab-${office.slug}`;
              return (
                <li key={office.slug} role="presentation">
                  <button
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={tabId}
                    aria-selected={isActive}
                    aria-controls="office-panel"
                    tabIndex={isActive ? 0 : -1}
                    className={`about-offices-list-item${
                      isActive ? ' is-active' : ''
                    }`}
                    onClick={() => setActiveIndex(i)}
                  >
                    {isActive ? (
                      <motion.span
                        layoutId="about-offices-active-bar"
                        className="about-offices-list-bar"
                        aria-hidden="true"
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 32,
                        }}
                      />
                    ) : null}
                    <span className="about-offices-list-text">
                      <span className="about-offices-list-city">{office.city}</span>
                      <span className="about-offices-list-state">{office.state}</span>
                    </span>
                    {office.isHq ? (
                      <span
                        className="about-offices-list-hq"
                        aria-label="Headquarters"
                      >
                        HQ
                      </span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div
          id="office-panel"
          role="tabpanel"
          aria-labelledby={`office-tab-${active.slug}`}
          className="about-offices-panel"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.slug}
              className="about-offices-panel-inner"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={PANEL_TRANSITION}
            >
              <div className="about-offices-map-frame">
                <iframe
                  key={active.slug}
                  title={`Map of Nucleus Advisors ${active.city} office`}
                  src={mapSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="about-offices-meta">
                <div className="about-offices-meta-row">
                  <MapPin size={16} aria-hidden="true" />
                  <div className="about-offices-meta-text">
                    {active.address && active.address.length > 0 ? (
                      active.address.map((line) => (
                        <span key={line}>{line}</span>
                      ))
                    ) : (
                      <span className="about-offices-meta-pending">
                        {active.city}, {active.state}, India · address coming
                        soon
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <ul
                className="about-offices-photos"
                aria-label={`${active.city} office photographs`}
              >
                {Array.from({ length: 3 }).map((_, i) => {
                  const photo = active.photos?.[i];
                  return (
                    <li
                      key={i}
                      className={`about-offices-photo${
                        photo ? '' : ' is-placeholder'
                      }`}
                    >
                      {photo ? (
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          sizes="(max-width: 760px) 33vw, 220px"
                          className="about-offices-photo-img"
                        />
                      ) : (
                        <div className="about-offices-photo-empty">
                          <Camera size={20} aria-hidden="true" />
                          <span>Photo · {active.city}</span>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
