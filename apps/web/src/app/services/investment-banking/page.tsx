import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageShell } from '@/components/site-chrome';
import { services } from '@/content/site';
import { ServiceHero } from '@/components/services/service-hero';
import { WhenToEngage } from '@/components/services/when-to-engage';
import { HowWeHelp } from '@/components/services/how-we-help';
import { ServiceInsights } from '@/components/services/service-insights';
import { Process } from '@/components/services/process';
import { Proof } from '@/components/services/proof';
import { KnowledgeBank } from '@/components/services/knowledge-bank';
import { Faq } from '@/components/services/faq';
import { LeadMagnet } from '@/components/services/lead-magnet';
import { RelatedServices } from '@/components/services/related-services';
import { ContactBand } from '@/components/services/contact-band';
import { FundraiseStages } from '@/components/services/investment-banking/fundraise-stages';
import { SoonicornCallout } from '@/components/services/investment-banking/soonicorn-callout';

const SERVICE_SLUG = 'investment-banking';

export async function generateMetadata(): Promise<Metadata> {
  const service = services.find((s) => s.slug === SERVICE_SLUG);
  if (!service) return {};
  return { title: service.seoTitle, description: service.metaDescription };
}

export default function InvestmentBankingPage() {
  const service = services.find((s) => s.slug === SERVICE_SLUG);
  if (!service) notFound();

  return (
    <PageShell>
      <main className="home-v3 service-v1">
        <ServiceHero service={service} />
        <WhenToEngage ordinal={service.ordinal} moments={service.whenToEngage} />
        <FundraiseStages />
        <HowWeHelp
          ordinal={service.ordinal}
          flat={service.howWeHelp}
          detailed={service.howWeHelpDetailed}
        />
        <SoonicornCallout service={service} />
        <ServiceInsights service={service} />
        <Process service={service} />
        <Proof service={service} />
        <KnowledgeBank service={service} />
        <Faq service={service} />
        <LeadMagnet slug={service.slug} leadMagnet={service.leadMagnet} />
        <RelatedServices service={service} />
        <ContactBand service={service} />
      </main>
    </PageShell>
  );
}
