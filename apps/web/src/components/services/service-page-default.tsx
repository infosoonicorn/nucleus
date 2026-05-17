import type { Service } from '@/content/site';
import { getClientsForService } from '@/content/clients';
import { getTeamForService } from '@/content/team';
import { ServiceHero } from './service-hero';
import { WhenToEngage } from './when-to-engage';
import { ClientLogos } from './client-logos';
import { HowWeHelp } from './how-we-help';
import { Deliverables } from './deliverables';
import { ServiceInsights } from './service-insights';
import { Process } from './process';
import { Proof } from './proof';
import { IndustryReports } from './industry-reports';
import { Faq } from './faq';
import { LeadMagnet } from './lead-magnet';
import { RelatedServices } from './related-services';
import { ContactBand } from './contact-band';

export function ServicePageDefault({ service }: Readonly<{ service: Service }>) {
  const clients = getClientsForService(service.slug);
  return (
    <main className="home-v3 service-v1">
      <ServiceHero
        ordinal={service.ordinal}
        title={service.title}
        slug={service.slug}
        displayHeadline={service.displayHeadline}
        promise={service.promise}
        cta={service.cta}
      />
      <WhenToEngage ordinal={service.ordinal} moments={service.whenToEngage} />
      {/* Renders nothing when no clients are tagged for this service slug. */}
      <ClientLogos ordinal={service.ordinal} clients={clients} metrics={service.metrics} />
      <HowWeHelp
        ordinal={service.ordinal}
        flat={service.howWeHelp}
        detailed={service.howWeHelpDetailed}
      />
      <Deliverables service={service} />
      <ServiceInsights service={service} />
      <Process
        serviceTitle={service.title}
        ordinal={service.ordinal}
        title={service.processTitle}
        phases={service.process}
        dossier={service.processDossier}
      />
      <Proof service={service} />
      <IndustryReports ordinal={service.ordinal} serviceSlug={service.slug} />
      <Faq ordinal={service.ordinal} serviceTitle={service.title} faq={service.faq} />
      <LeadMagnet slug={service.slug} leadMagnet={service.leadMagnet} />
      <ContactBand
        ordinal={service.ordinal}
        serviceTitle={service.title}
        promise={service.promise}
        cta={service.cta}
        team={getTeamForService(service.slug)}
      />
      <RelatedServices currentSlug={service.slug} />
    </main>
  );
}
