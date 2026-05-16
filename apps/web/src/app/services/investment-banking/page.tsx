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
              {/* 1. Identity */}
              <ServiceHero service={service} />
              {/* 2. Recognition — "is this for me?" */}
              <WhenToEngage ordinal={service.ordinal} moments={service.whenToEngage} />
              {/* 2.5 Track record — scrolling client/founder logo strip */}
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
          {/* 3. What we deliver — capabilities */}
          <HowWeHelp
            ordinal={service.ordinal}
            flat={service.howWeHelp}
            detailed={service.howWeHelpDetailed}
          />

          {/* 4. What unfolds — the six-step fundraise journey */}
          <FundraiseStages />

          {/* 5. How we engage — partner-led mandate dossier */}
          <Process
            serviceTitle={service.title}
            ordinal={service.ordinal}
            title={service.processTitle}
            phases={service.process}
            dossier={service.processDossier}
          />

          {/* 6. Differentiator — in-house Soonicorn fund */}
          <SoonicornCallout service={service} />

          {/* 7. Evidence */}
          <Proof service={service} />

          {/* 8. Read deeper — editorial */}
          <ServiceInsights service={service} />

          {/* 9. Resources — unified downloads (checklist + industry reports). */}
          <ResourceDeck
            ordinal={service.ordinal}
            serviceSlug={service.slug}
            resources={resources}
          />

          {/* 10. Objection handling */}
          <Faq ordinal={service.ordinal} serviceTitle={service.title} faq={service.faq} />

          {/* 11. Cross-sell */}
          <RelatedServices service={service} />

          {/* 12. Final CTA */}
          <ContactBand service={service} />
        </ServicePageShell>
      </main>
    </PageShell>
  );
}
