import type { Metadata } from 'next';
import { PageShell } from '@/components/site-chrome';
import { ComingSoon } from '@/components/coming-soon';
import { getComingSoonInsights } from '@/components/coming-soon-data';

export const metadata: Metadata = {
  title: 'Alumni | Nucleus Advisors',
  description:
    'The Nucleus Advisors alumni network — coming soon. Approved journeys and reconnect pathways for former Nucleus colleagues across audit, transactions, tax and advisory.',
};

export default function AlumniPage() {
  return (
    <PageShell>
      <ComingSoon
        eyebrow="Alumni"
        title="Once Nucleus, always part of the network."
        body="A home for former Nucleus colleagues — where they are now, what they are building, and how to reconnect. We will populate the alumni wall only with approved stories and explicit consent."
        insights={getComingSoonInsights()}
      />
    </PageShell>
  );
}
