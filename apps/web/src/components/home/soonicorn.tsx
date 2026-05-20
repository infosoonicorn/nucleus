// Home-page wrapper around the SoonicornCallout block.
//
// Pulls the Investment Banking service (which owns the Soonicorn cross-
// link content in site.ts) and forwards it to the shared component.
// Wraps with a canonical Home-style section header (red-pill eyebrow +
// serif-ish heading) so the block reads consistent with the rest of /home
// instead of carrying its service-page "●NN" ordinal convention. The
// component's internal eyebrow is suppressed via `hideEyebrow`.

import { Reveal } from '@/components/motion-primitives';
import { services } from '@/content/site';
import { SoonicornCallout } from '@/components/services/investment-banking/soonicorn-callout';

export function HomeSoonicorn() {
  const ibService = services.find((s) => s.slug === 'investment-banking');
  if (!ibService) return null;

  return (
    <section
      className="home-v3-soonicorn-wrap"
      aria-label="In-house capital alongside advisory"
    >
      <Reveal>
        <div className="home-v3-section-header">
          <span className="home-v3-section-eyebrow">In-house capital</span>
          <h2>Capital that moves alongside the advice.</h2>
          <p>
            Nucleus is Investment Manager to Soonicorn Angel Trust&mdash;I, a
            SEBI-registered early-stage fund. Founders raising up to US&nbsp;$1M
            can engage with the fund directly when the mandate fits.
          </p>
        </div>
      </Reveal>
      <SoonicornCallout service={ibService} hideEyebrow />
    </section>
  );
}
