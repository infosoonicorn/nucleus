import { PageShell } from '@/components/site-chrome';
import { HomeHero } from '@/components/home/hero';
import { HomeOrbitalServices } from '@/components/home/orbital-services';
import { HomeProofStrip } from '@/components/home/proof-strip';
import { HomeLifecycle } from '@/components/home/lifecycle';
import { HomeDeliverables } from '@/components/home/deliverables';
import { HomeMomentsMarquee } from '@/components/home/moments-marquee';
import { HomeDepth } from '@/components/home/depth';
import { HomeBuiltFor } from '@/components/home/archetypes';
import { HomeTeaserRow } from '@/components/home/teaser-row';
import { HomeTestimonials } from '@/components/home/testimonials';
import { HomeClosingCta } from '@/components/home/closing-cta';

export default function Home() {
  return (
    <PageShell>
      <main className="home-v3">
        <HomeHero />
        <HomeOrbitalServices />
        <HomeProofStrip />
        <HomeLifecycle />
        <HomeDeliverables />
        <HomeMomentsMarquee />
        <HomeDepth />
        <HomeBuiltFor />
        <HomeTeaserRow />
        <HomeTestimonials />
        <HomeClosingCta />
      </main>
    </PageShell>
  );
}
