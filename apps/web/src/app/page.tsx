import { PageShell } from '@/components/site-chrome';
import { HomeHero } from '@/components/home/hero';
import { HomeOrbitalServices } from '@/components/home/orbital-services';
import { HomeProofStrip } from '@/components/home/proof-strip';
import { HomeDepth } from '@/components/home/depth';
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
        <HomeDepth />
        <HomeTeaserRow />
        <HomeTestimonials />
        <HomeClosingCta />
      </main>
    </PageShell>
  );
}
