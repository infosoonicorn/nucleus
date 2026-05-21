import type { Metadata } from 'next';
import { PageShell } from '@/components/site-chrome';
import { ComingSoon } from '@/components/coming-soon';
import { getComingSoonInsights } from '@/components/coming-soon-data';

export const metadata: Metadata = {
  title: 'Careers | Nucleus Advisors',
  description:
    'Careers at Nucleus Advisors — coming soon. Tracks for CA articles, analysts, MBAs and experienced professionals across audit, transactions, tax, risk and finance operations.',
};

export default function CareersPage() {
  return (
    <PageShell>
      <ComingSoon
        eyebrow="Careers"
        title="A serious place to learn the craft of advisory."
        body="Articleship, analyst, CA, MBA and experienced tracks across investment banking, M&A, valuations, audit, tax, risk and finance operations. The full careers experience — open roles, application flow and team stories — is being built now."
        insights={getComingSoonInsights()}
      />
    </PageShell>
  );
}
