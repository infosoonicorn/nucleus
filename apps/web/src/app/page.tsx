import { PageShell } from '@/components/site-chrome';
import { HomeHero } from '@/components/home/hero';
import { HomeOrbitalServices } from '@/components/home/orbital-services';
import { HomeProofStrip } from '@/components/home/proof-strip';
import { HomeLifecycle } from '@/components/home/lifecycle';
import { HomeServicesUniverse } from '@/components/home/services-universe';
import { HomeMomentsMarquee } from '@/components/home/moments-marquee';
import { HomeDepth } from '@/components/home/depth';
import { HomeIndustries } from '@/components/home/industries';
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
        <HomeServicesUniverse />
        <HomeMomentsMarquee />
        <HomeDepth />
        <HomeIndustries />
        <HomeTeaserRow />
        <HomeTestimonials />
        <HomeClosingCta />
      </main>
    </PageShell>
  );
}
