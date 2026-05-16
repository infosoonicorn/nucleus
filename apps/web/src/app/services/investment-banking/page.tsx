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
import { FundraiseStages } from '@/components/services/investment-banking/fundraise-stages';
import { SoonicornCallout } from '@/components/services/investment-banking/soonicorn-callout';
import { ResourceDeck } from '@/components/resources/resource-deck';
import { ServicePageShell } from '@/components/services/service-page-shell';
import { SidebarLatestReports, SidebarCTA } from '@/components/services/sidebar-blocks';
import { TeamBlock } from '@/components/team/team-block';
import { getResourcesForService } from '@/content/resources';
import { getClientsForService } from '@/content/clients';
import { getTeamForService } from '@/content/team';

const SERVICE_SLUG = 'investment-banking';

export async function generateMetadata(): Promise<Metadata> {
  const service = services.find((s) => s.slug === SERVICE_SLUG);
  if (!service) return {};
  return { title: service.seoTitle, description: service.metaDescription };
}

export default function InvestmentBankingPage() {
  const service = services.find((s) => s.slug === SERVICE_SLUG);
  if (!service) notFound();
  const resources = getResourcesForService(service.slug);
  const clients = getClientsForService(service.slug);
  const team = getTeamForService(service.slug);

  return (
    <PageShell>
      <main className="home-v3 service-v1">
        {/* Right sidebar (sticky on desktop ≥1100px, inlined into the
            main flow below 1100px). Hero + ClientLogos render
            full-width via `fullBleed`; everything else lives in the
            narrower main column alongside the sidebar. */}
        <ServicePageShell
          fullBleed={
            <>
              {/* 1. Identity — hero stays full-width for impact */}
              <ServiceHero service={service} />
              {/* 2. Track record — scrolling client/founder logo strip
                   (moved above WhenToEngage so visitors see proof early) */}
              <ClientLogos ordinal={service.ordinal} clients={clients} />
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
          {/* 3. Recognition — "is this for me?" (now in 2-col main column,
              sidebar visible to its right) */}
          <WhenToEngage ordinal={service.ordinal} moments={service.whenToEngage} />

          {/* 4. What we deliver — capabilities */}
          <HowWeHelp
            ordinal={service.ordinal}
            flat={service.howWeHelp}
            detailed={service.howWeHelpDetailed}
          />

          {/* 5. What unfolds — the six-step fundraise journey */}
          <FundraiseStages />

          {/* 6. How we engage — partner-led mandate dossier */}
          <Process
            serviceTitle={service.title}
            ordinal={service.ordinal}
            title={service.processTitle}
            phases={service.process}
            dossier={service.processDossier}
          />

          {/* 7. Differentiator — in-house Soonicorn fund */}
          <SoonicornCallout service={service} />

          {/* 8. Evidence */}
          <Proof service={service} />

          {/* 9. Read deeper — editorial */}
          <ServiceInsights service={service} />

          {/* 10. Resources — unified downloads (checklist + industry reports). */}
          <ResourceDeck
            ordinal={service.ordinal}
            serviceSlug={service.slug}
            resources={resources}
          />

          {/* 11. Objection handling */}
          <Faq ordinal={service.ordinal} serviceTitle={service.title} faq={service.faq} />

          {/* 12. Cross-sell */}
          <RelatedServices service={service} />

          {/* 13. Final CTA */}
          <ContactBand service={service} />
        </ServicePageShell>
      </main>
    </PageShell>
  );
}
