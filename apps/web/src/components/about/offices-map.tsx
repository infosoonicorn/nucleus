import { Reveal } from '@/components/motion-primitives';

type Office = {
  slug: string;
  name: string;
  state: string;
  cx: number;
  cy: number;
};

const OFFICES: Office[] = [
  { slug: 'gurugram', name: 'Gurugram', state: 'Haryana', cx: 265, cy: 255 },
  { slug: 'faridabad', name: 'Faridabad', state: 'Haryana', cx: 285, cy: 275 },
  { slug: 'jaipur', name: 'Jaipur', state: 'Rajasthan', cx: 237, cy: 296 },
  { slug: 'bhatinda', name: 'Bhatinda', state: 'Punjab', cx: 217, cy: 217 },
  { slug: 'bangalore', name: 'Bangalore', state: 'Karnataka', cx: 280, cy: 631 },
];

// Hand-authored simplified India outline. Single closed path; inherits
// `currentColor` so the CSS controls the fill. Not topographic-grade
// — recognizable shape for the office-map context. Tune later if needed.
const INDIA_PATH =
  'M 235 175 L 270 155 L 305 165 L 335 180 L 365 195 L 395 200 L 415 215 L 440 235 L 465 260 L 485 290 L 500 320 L 510 355 L 515 395 L 510 435 L 495 470 L 478 500 L 455 525 L 425 545 L 400 560 L 370 575 L 345 595 L 320 615 L 295 640 L 280 670 L 270 700 L 262 730 L 258 760 L 245 740 L 232 710 L 218 675 L 205 640 L 192 605 L 180 568 L 170 532 L 165 495 L 162 458 L 165 420 L 173 385 L 183 350 L 195 318 L 205 285 L 215 250 L 222 215 L 228 190 Z';

export function AboutOfficesMap() {
  return (
    <section className="about-offices" aria-label="Nucleus offices across India">
      <Reveal>
        <div className="about-offices-header">
          <p className="about-offices-eyebrow">Offices</p>
          <h2 className="about-offices-heading">Five offices across India.</h2>
          <p className="about-offices-sub">
            Where Nucleus partners and their teams work — coordinated as one bench.
          </p>
        </div>
      </Reveal>

      <div className="about-offices-grid">
        <div className="about-offices-map" aria-hidden="true">
          <svg
            viewBox="0 0 800 800"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid meet"
          >
            <path className="about-offices-map-outline" d={INDIA_PATH} />
            {OFFICES.map((o) => (
              <circle
                key={o.slug}
                className="about-offices-dot"
                data-office={o.slug}
                cx={o.cx}
                cy={o.cy}
                r="8"
              />
            ))}
          </svg>
        </div>

        <ul className="about-offices-list">
          {OFFICES.map((o) => (
            <li key={o.slug} className="about-offices-city" data-office={o.slug}>
              <span className="about-offices-city-name">{o.name}</span>
              <span className="about-offices-city-state">{o.state}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
