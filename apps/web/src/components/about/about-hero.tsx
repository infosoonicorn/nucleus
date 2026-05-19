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
          <p className="about-hero-proof">
            <span>8 partners</span>
            <span aria-hidden="true">·</span>
            <span>90+ team</span>
            <span aria-hidden="true">·</span>
            <span>130+ clients</span>
            <span aria-hidden="true">·</span>
            <span>50+ deals advised</span>
            <span aria-hidden="true">·</span>
            <span>5 offices across India</span>
          </p>
        </div>
      </Reveal>
    </section>
  );
}
