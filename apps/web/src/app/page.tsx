import { PageShell } from '@/components/site-chrome';
import { HomeHero } from '@/components/home/hero';
import { HomeOrbitalServices } from '@/components/home/orbital-services';
import { HomeProofStrip } from '@/components/home/proof-strip';
import { HomeSoonicorn } from '@/components/home/soonicorn';
import { HomeInsights } from '@/components/home/insights';
import { HomeTeaserRow } from '@/components/home/teaser-row';
// import { HomeTestimonials } from '@/components/home/testimonials';
// ^ "Voice of clients" section hidden for now per partner direction.
// Re-add the import + the <HomeTestimonials /> render below when
// consented testimonials land in site.ts.
import { HomeClosingCta } from '@/components/home/closing-cta';

export default function Home() {
  return (
    <PageShell>
      <main className="home-v3">
        <HomeHero />
        <HomeOrbitalServices />
        <HomeProofStrip />
        <HomeSoonicorn />
        <HomeInsights />
        <HomeTeaserRow />
        {/* <HomeTestimonials />  — hidden for now; see import note above. */}
        <HomeClosingCta />
      </main>
    </PageShell>
  );
}
