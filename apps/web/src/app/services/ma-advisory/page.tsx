import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageShell } from '@/components/site-chrome';
import { services } from '@/content/site';
import { ServiceHero } from '@/components/services/service-hero';
import { WhenToEngage } from '@/components/services/when-to-engage';
import { ClientLogos } from '@/components/services/client-logos';
import { HowWeHelp } from '@/components/services/how-we-help';
import { ServiceInsights } from '@/components/services/service-insights';
import { Process } from '@/components/services/process';
import { Proof } from '@/components/services/proof';
import { Faq } from '@/components/services/faq';
import { RelatedServices } from '@/components/services/related-services';
import { ContactBand } from '@/components/services/contact-band';
import { MAMandateVisualizer } from '@/components/services/ma-advisory/mandate-visualizer';
import { ResourceDeck } from '@/components/resources/resource-deck';
import { ServicePageShell } from '@/components/services/service-page-shell';
import { SidebarLatestReports, SidebarCTA } from '@/components/services/sidebar-blocks';
import { TeamBlock } from '@/components/team/team-block';
import { getResourcesForService } from '@/content/resources';
import { getClientsForService } from '@/content/clients';
import { getTeamForService } from '@/content/team';
import { MA_SECTION_ORDINAL } from '@/content/section-ordinals';
import { deriveHeroCards } from '@/components/services/hero-cards';

const SERVICE_SLUG = 'ma-advisory';
const SECTION_ORDINAL = MA_SECTION_ORDINAL;

export async function generateMetadata(): Promise<Metadata> {
  const service = services.find((s) => s.slug === SERVICE_SLUG);
  if (!service) return {};
  return { title: service.seoTitle, description: service.metaDescription };
}

export default function MAAdvisoryPage() {
  const service = services.find((s) => s.slug === SERVICE_SLUG);
  if (!service) notFound();
  const resources = getResourcesForService(service.slug);
  const clients = getClientsForService(service.slug);
  const team = getTeamForService(service.slug);

  return (
    <PageShell>
      <main className="home-v3 service-v1">
        <ServicePageShell
          fullBleed={
            <>
              {/* Identity */}
              <ServiceHero
                ordinal={service.ordinal}
                title={service.title}
                slug={service.slug}
                displayHeadline={service.displayHeadline}
                promise={service.promise}
                cta={service.cta}
                heroCards={deriveHeroCards(service.processDossier)}
                liveStrip={service.heroLive}
              />
              {/* ●01 Track record — counter row + scrolling logo strip */}
              <ClientLogos
                ordinal={SECTION_ORDINAL.clientLogos}
                clients={clients}
                metrics={service.metrics}
              />
            </>
          }
          rightSlot={
            <>
              <TeamBlock team={team} />
              <SidebarLatestReports serviceSlug={service.slug} />
              <SidebarCTA serviceSlug={service.slug} />
            </>
          }
        >
          {/* ●02 Recognition */}
          <WhenToEngage ordinal={SECTION_ORDINAL.whenToEngage} moments={service.whenToEngage} />

          {/* ●03 Bespoke: buy-side / sell-side mandate visualizer */}
          <MAMandateVisualizer ordinal={SECTION_ORDINAL.mandate} />

          {/* ●04 Capabilities */}
          <HowWeHelp
            ordinal={SECTION_ORDINAL.howWeHelp}
            flat={service.howWeHelp}
            detailed={service.howWeHelpDetailed}
          />

          {/* ●05 Engagement model */}
          <Process
            serviceTitle={service.title}
            ordinal={SECTION_ORDINAL.process}
            title={service.processTitle}
            phases={service.process}
            dossier={service.processDossier}
          />

          {/* Evidence — renders only if data exists */}
          <Proof service={service} />

          {/* ●06 Editorial */}
          <ServiceInsights service={service} ordinal={SECTION_ORDINAL.insights} />

          {/* ●07 Resources */}
          <ResourceDeck
            ordinal={SECTION_ORDINAL.resources}
            serviceSlug={service.slug}
            resources={resources}
          />

          {/* ●08 Objection handling */}
          <Faq ordinal={SECTION_ORDINAL.faq} serviceTitle={service.title} faq={service.faq} />

          {/* ●09 Primary close */}
          <ContactBand
            ordinal={SECTION_ORDINAL.contact}
            serviceTitle={service.title}
            promise={service.promise}
            cta={service.cta}
            team={team}
          />

          {/* Soft cross-sell */}
          <RelatedServices currentSlug={service.slug} />
        </ServicePageShell>
      </main>
    </PageShell>
  );
}
