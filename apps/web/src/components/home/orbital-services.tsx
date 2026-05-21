'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ArrowRight, Link2, Sparkles } from 'lucide-react';
import { services } from '@/content/site';
import { getTeamForService } from '@/content/team';

const subscribeNoop = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function useHasMounted() {
  return useSyncExternalStore(subscribeNoop, getClientSnapshot, getServerSnapshot);
}

const RELATED: Record<string, string[]> = {
  'investment-banking': ['ma-advisory', 'valuations'],
  'ma-advisory': ['investment-banking', 'valuations', 'corporate-secretarial'],
  'risk-advisory': ['assurance', 'finance-outsourcing'],
  'tax-regulatory': ['corporate-secretarial', 'assurance'],
  'assurance': ['risk-advisory', 'tax-regulatory'],
  'valuations': ['investment-banking', 'ma-advisory'],
  'finance-outsourcing': ['assurance', 'risk-advisory'],
  'corporate-secretarial': ['ma-advisory', 'aif-fund-management', 'tax-regulatory'],
  'aif-fund-management': ['corporate-secretarial', 'investment-banking'],
};

// Build the orbital data once at module load. Experts are derived from
// team.ts via getTeamForService(slug) so adding / removing a team
// member or editing their serviceSlugs propagates here automatically
// — no second list to maintain. Deliverables count from each service's
// deliverables[] array, which is itself the source of truth for what
// the practice ships.
const orbitItems = services.map((service, idx) => ({
  id: idx + 1,
  slug: service.slug,
  title: service.title,
  summary: service.summary,
  icon: service.icon,
  deliverables: service.deliverables.length,
  experts: getTeamForService(service.slug).length,
  relatedIds: (RELATED[service.slug] ?? [])
    .map((slug) => services.findIndex((s) => s.slug === slug) + 1)
    .filter((id) => id > 0),
}));

export function HomeOrbitalServices() {
  const mounted = useHasMounted();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [pulse, setPulse] = useState<Record<number, boolean>>({});
  const [rotationAngle, setRotationAngle] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);
  const [radius, setRadius] = useState(220);
  const containerRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    reduceMotionRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const adjust = () => {
      const w = window.innerWidth;
      if (w < 520) setRadius(120);
      else if (w < 780) setRadius(160);
      else setRadius(220);
    };
    adjust();
    window.addEventListener('resize', adjust);
    return () => window.removeEventListener('resize', adjust);
  }, []);

  useEffect(() => {
    if (!autoRotate || reduceMotionRef.current) return;
    const t = setInterval(() => {
      setRotationAngle((prev) => (prev + 0.25) % 360);
    }, 50);
    return () => clearInterval(t);
  }, [autoRotate]);

  function handleContainerClick(event: React.MouseEvent<HTMLDivElement>) {
    if (event.target === containerRef.current || event.target === orbitRef.current) {
      setExpandedId(null);
      setActiveId(null);
      setPulse({});
      setAutoRotate(true);
    }
  }

  function toggle(id: number) {
    if (expandedId === id) {
      setExpandedId(null);
      setActiveId(null);
      setPulse({});
      setAutoRotate(true);
      return;
    }
    setExpandedId(id);
    setActiveId(id);
    setAutoRotate(false);
    const related = orbitItems.find((item) => item.id === id)?.relatedIds ?? [];
    setPulse(Object.fromEntries(related.map((r) => [r, true])));
    const nodeIndex = orbitItems.findIndex((item) => item.id === id);
    const target = (nodeIndex / orbitItems.length) * 360;
    setRotationAngle(270 - target);
  }

  function calcPosition(index: number, total: number) {
    const angle = ((index / total) * 360 + rotationAngle) % 360;
    const rad = (angle * Math.PI) / 180;
    const x = radius * Math.cos(rad);
    const y = radius * Math.sin(rad);
    const zIndex = Math.round(100 + 50 * Math.cos(rad));
    const opacity = Math.max(0.45, Math.min(1, 0.45 + 0.55 * ((1 + Math.sin(rad)) / 2)));
    return { x, y, zIndex, opacity };
  }

  function isRelated(id: number) {
    if (!activeId) return false;
    return orbitItems.find((item) => item.id === activeId)?.relatedIds.includes(id) ?? false;
  }

  return (
    <section className="home-v3-orbital" aria-label="Service constellation">
      <span className="home-v3-orbital-glow" aria-hidden="true" />
      <div className="home-v3-orbital-header">
        <span className="home-v3-section-eyebrow home-v3-section-eyebrow-light">
          Practice constellation
        </span>
        <h2>Nine practices, connected by judgement.</h2>
        <p>
          Each Nucleus practice is its own discipline. The strength is how often they show up
          together on the same client decision. Click a node to see what it does and how it
          connects.
        </p>
      </div>

      <div
        ref={containerRef}
        className="home-v3-orbital-stage"
        onClick={handleContainerClick}
      >
        <div ref={orbitRef} className="home-v3-orbital-canvas">
          <div className="home-v3-orbital-core" aria-hidden="true">
            <span className="home-v3-orbital-core-ring home-v3-orbital-core-ring-a" />
            <span className="home-v3-orbital-core-ring home-v3-orbital-core-ring-b" />
            <span className="home-v3-orbital-core-inner">
              <Image
                src="/brand/nucleus-mark.png"
                alt=""
                width={133}
                height={144}
                className="home-v3-orbital-core-logo"
                priority
              />
            </span>
          </div>
          <div
            className="home-v3-orbital-track"
            style={{ width: radius * 2, height: radius * 2 }}
            aria-hidden="true"
          />

          {mounted ? null : (
            <ul className="home-v3-orbital-fallback" aria-label="Practice areas">
              {orbitItems.map((item) => (
                <li key={item.id}>
                  <a href={`/services/${item.slug}`}>{item.title}</a>
                </li>
              ))}
            </ul>
          )}

          {mounted &&
            orbitItems.map((item, idx) => {
            const pos = calcPosition(idx, orbitItems.length);
            const isExpanded = expandedId === item.id;
            const isRel = isRelated(item.id);
            const isPulsing = pulse[item.id];
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="home-v3-orbital-node"
                style={{
                  transform: `translate(${pos.x}px, ${pos.y}px)`,
                  zIndex: isExpanded ? 200 : pos.zIndex,
                  opacity: isExpanded ? 1 : pos.opacity,
                }}
              >
                <span
                  className={`home-v3-orbital-node-aura ${isPulsing ? 'is-pulsing' : ''}`}
                  aria-hidden="true"
                />
                <button
                  type="button"
                  className={`home-v3-orbital-node-button ${isExpanded ? 'is-expanded' : ''} ${
                    isRel ? 'is-related' : ''
                  }`}
                  aria-label={`${item.title} — open practice card`}
                  aria-expanded={isExpanded}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggle(item.id);
                  }}
                >
                  <Icon size={16} aria-hidden="true" />
                </button>
                <span
                  className={`home-v3-orbital-node-label ${isExpanded ? 'is-expanded' : ''}`}
                >
                  {item.title}
                </span>

                {isExpanded ? (
                  <article className="home-v3-orbital-card">
                    <span className="home-v3-orbital-card-tether" aria-hidden="true" />
                    <header className="home-v3-orbital-card-head">
                      <span className="home-v3-orbital-card-badge">
                        Practice {String(item.id).padStart(2, '0')}
                      </span>
                    </header>
                    <h3>{item.title}</h3>
                    <p>{item.summary}</p>
                    <div className="home-v3-orbital-card-meta">
                      <span className="home-v3-orbital-card-meta-icon" aria-hidden="true">
                        <Sparkles size={11} />
                      </span>
                      <span>{item.experts} {item.experts === 1 ? 'expert' : 'experts'}</span>
                      <span className="home-v3-orbital-card-meta-rule" aria-hidden="true" />
                      <span>{item.deliverables} {item.deliverables === 1 ? 'deliverable' : 'deliverables'}</span>
                    </div>

                    {item.relatedIds.length > 0 ? (
                      <div className="home-v3-orbital-card-related">
                        <h4>
                          <Link2 size={11} aria-hidden="true" />
                          Works alongside
                        </h4>
                        <div>
                          {item.relatedIds.map((rid) => {
                            const rel = orbitItems.find((x) => x.id === rid);
                            if (!rel) return null;
                            return (
                              <button
                                key={rid}
                                type="button"
                                className="home-v3-orbital-card-related-pill"
                                onClick={(event) => {
                                  event.stopPropagation();
                                  toggle(rid);
                                }}
                              >
                                {rel.title}
                                <ArrowRight size={10} aria-hidden="true" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}

                    <a
                      className="home-v3-orbital-card-cta"
                      href={`/services/${item.slug}`}
                      onClick={(event) => event.stopPropagation()}
                    >
                      Explore practice
                      <ArrowRight size={13} aria-hidden="true" />
                    </a>
                  </article>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
