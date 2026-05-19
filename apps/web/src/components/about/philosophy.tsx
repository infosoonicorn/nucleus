import { Reveal } from '@/components/motion-primitives';

export function AboutPhilosophy() {
  return (
    <section className="about-philosophy" aria-label="How Nucleus runs mandates">
      <Reveal>
        <div className="about-philosophy-inner">
          <span className="about-philosophy-rule" aria-hidden="true" />
          <p className="about-philosophy-eyebrow">Philosophy</p>
          <p className="about-philosophy-quote">
            We don&rsquo;t put a generalist on a specialist&rsquo;s work.
          </p>
          <p className="about-philosophy-body">
            Each discipline at Nucleus has its own partner. The audit partner
            runs your audit. The tax partner runs your tax. The deal partner
            runs your raise. What changes at Nucleus is that they coordinate
            — the audit partner reads the deal memo, the tax partner sits in
            the diligence call, the fundraise gets built on a clean
            compliance base. The right partner for the work, every time.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
