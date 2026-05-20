// Thin Home-page wrapper around the SoonicornCallout block.
// Pulls the Investment Banking service (which owns the Soonicorn cross-
// link content in site.ts) and forwards it to the shared component.
// Used on the homepage so the "In-house capital, alongside advisory"
// story surfaces firm-wide, not just on the IB service page.
import { services } from '@/content/site';
import { SoonicornCallout } from '@/components/services/investment-banking/soonicorn-callout';

export function HomeSoonicorn() {
  const ibService = services.find((s) => s.slug === 'investment-banking');
  if (!ibService) return null;
  return <SoonicornCallout service={ibService} ordinal="04" />;
}
