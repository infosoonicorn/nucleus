import type { Service } from '@/content/site';
import { getClientsForService } from '@/content/clients';
import { getTeamForService } from '@/content/team';
import { getResourcesForService } from '@/content/resources';
import { DEFAULT_SECTION_ORDINAL } from '@/content/section-ordinals';
import { PageShell } from '@/components/site-chrome';
import { ServiceHero } from './service-hero';
import { deriveHeroCards } from './hero-cards';
import { WhenToEngage } from './when-to-engage';
import { ClientLogos } from './client-logos';
import { HowWeHelp } from './how-we-help';
import { ServiceInsights } from './service-insights';
import { Process } from './process';
import { Proof } from './proof';
import { Faq } from './faq';
import { RelatedServices } from './related-services';
import { ContactBand } from './contact-band';
import { ServicePageShell } from './service-page-shell';
import { SidebarLatestReports, SidebarCTA } from './sidebar-blocks';
import { TeamBlock } from '@/components/team/team-block';
import { ResourceDeck } from '@/components/resources/resource-deck';

/**
 * Default service-page composition — used by every service that
 * doesn't have a bespoke route. Matches the Investment Banking layout
 * (2-col shell with sticky team/reports/CTA sidebar, animated hero,
 * track-record metric row, resource deck, fancy contact band) so
 * every service page reads as the same brand.
 *
 * Section order:
 *   Hero (fullBleed)        — identity
 *   ●01 Track record        — metrics + client logos (fullBleed)
 *   ●02 When to engage      — main column · sidebar visible from here
 *   ●03 How we help         — capabilities
 *   ●04 Process             — engagement dossier (when present)
 *   ●05 Insights            — long-form articles
 *   ●06 Resources           — deck of downloadables
 *   ●07 FAQs
 *   ●08 Talk to the desk    — primary close
 *   Related services        — soft cross-sell
 *
 * Each section renders nothing when its data is empty, so a service
 * page surfaces only what's been filled in.
 */
export function ServicePageDefault({ service }: Readonly<{ service: Service }>) {
  const clients = getClientsForService(service.slug);
  const team = getTeamForService(service.slug);
  const resources = getResourcesForService(service.slug);
  const ord = DEFAULT_SECTION_ORDINAL;

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
                ordinal={ord.clientLogos}
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
          <WhenToEngage ordinal={ord.whenToEngage} moments={service.whenToEngage} />

          {/* ●03 Capabilities */}
          <HowWeHelp
            ordinal={ord.howWeHelp}
            flat={service.howWeHelp}
            detailed={service.howWeHelpDetailed}
          />

          {/* ●04 Engagement model */}
          <Process
            serviceTitle={service.title}
            ordinal={ord.process}
            title={service.processTitle}
            phases={service.process}
            dossier={service.processDossier}
          />

          {/* Evidence — only renders when data exists */}
          <Proof service={service} />

          {/* ●05 Editorial */}
          <ServiceInsights service={service} ordinal={ord.insights} />

          {/* ●06 Downloads — unified deck (renders nothing if no resources) */}
          <ResourceDeck
            ordinal={ord.resources}
            serviceSlug={service.slug}
            resources={resources}
          />

          {/* ●07 Objection handling */}
          <Faq ordinal={ord.faq} serviceTitle={service.title} faq={service.faq} />

          {/* ●08 Primary close */}
          <ContactBand
            ordinal={ord.contact}
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
