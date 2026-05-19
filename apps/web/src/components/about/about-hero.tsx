import { Reveal } from '@/components/motion-primitives';

export function AboutHero() {
  return (
    <section className="about-hero" aria-label="About Nucleus Advisors">
      <Reveal>
        <div className="about-hero-inner">
          <p className="about-hero-eyebrow">About</p>
          <h1 className="about-hero-headline">
            We&rsquo;re built for the decisions that matter.
          </h1>
          <p className="about-hero-lede">
            Nucleus Advisors is a senior-led firm covering audit, tax,
            transactions and advisory. We work with founders before the
            round, with boards through the listing, and with families across
            generations — connecting transaction work, controls, compliance
            and reporting as one decision surface.
          </p>
          <p className="about-hero-established">
            <em>Established 2019.</em> Headquartered in Gurugram, with offices across India.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
