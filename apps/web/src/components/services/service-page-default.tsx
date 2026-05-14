import type { Service } from '@/content/site';
import { ServiceHero } from './service-hero';
import { WhenToEngage } from './when-to-engage';
import { HowWeHelp } from './how-we-help';
import { Deliverables } from './deliverables';
import { ServiceInsights } from './service-insights';
import { Process } from './process';
import { Proof } from './proof';
import { KnowledgeBank } from './knowledge-bank';
import { Faq } from './faq';
import { LeadMagnet } from './lead-magnet';
import { RelatedServices } from './related-services';
import { ContactBand } from './contact-band';

export function ServicePageDefault({ service }: Readonly<{ service: Service }>) {
  return (
    <main className="home-v3 service-v1">
      <ServiceHero service={service} />
      <WhenToEngage ordinal={service.ordinal} moments={service.whenToEngage} />
      <HowWeHelp
        ordinal={service.ordinal}
        flat={service.howWeHelp}
        detailed={service.howWeHelpDetailed}
      />
      <Deliverables service={service} />
      <ServiceInsights service={service} />
      <Process service={service} />
      <Proof service={service} />
      <KnowledgeBank service={service} />
      <Faq service={service} />
      <LeadMagnet slug={service.slug} leadMagnet={service.leadMagnet} />
      <RelatedServices service={service} />
      <ContactBand service={service} />
    </main>
  );
}
