'use client';

import { decisiveMoments } from '@/content/site';
import { Reveal } from '@/components/motion-primitives';

export function HomeMomentsMarquee() {
  const loop = [...decisiveMoments, ...decisiveMoments];

  return (
    <section className="home-v3-moments" aria-label="When clients engage Nucleus">
      <Reveal>
        <div className="home-v3-section-header">
          <span className="home-v3-section-eyebrow">When clients engage</span>
          <h2>The common moments where Nucleus becomes useful.</h2>
        </div>
      </Reveal>
      <div className="home-v3-moments-marquee" aria-hidden="true">
        <div className="home-v3-moments-track">
          {loop.map((moment, index) => (
            <span key={`${moment}-${index}`} className="home-v3-moment-pill">
              <span className="home-v3-moment-dot" />
              {moment}
            </span>
          ))}
        </div>
      </div>
      <ul className="home-v3-moments-list">
        {decisiveMoments.map((moment) => (
          <li key={moment}>{moment}</li>
        ))}
      </ul>
    </section>
  );
}
