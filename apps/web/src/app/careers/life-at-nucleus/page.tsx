import type { Metadata } from 'next';
import { PageShell } from '@/components/site-chrome';
import { ComingSoon } from '@/components/coming-soon';
import { getComingSoonInsights } from '@/components/coming-soon-data';

export const metadata: Metadata = {
  title: 'Life at Nucleus | Nucleus Advisors',
  description:
    'Life at Nucleus — coming soon. Culture, learning moments and team stories from across our offices, told only through approved imagery and real voices.',
};

export default function LifeAtNucleusPage() {
  return (
    <PageShell>
      <ComingSoon
        eyebrow="Life at Nucleus"
        title="The texture of how we actually work together."
        body="First days, learning moments, offsites, late-night deal rooms and the small rituals that hold a partner-led firm together. We are gathering approved imagery and team voices before this lives on the website."
        insights={getComingSoonInsights()}
      />
    </PageShell>
  );
}
