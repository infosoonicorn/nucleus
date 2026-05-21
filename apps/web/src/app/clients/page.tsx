import type { Metadata } from 'next';
import Link from 'next/link';
import { PageShell } from '@/components/site-chrome';
import { services } from '@/content/site';
import { CLIENTS, type ServiceSlug } from '@/content/clients-roster';
import { MACRO_INDUSTRIES, macroForClient, macroTitle } from '@/content/industry-taxonomy';

// Augment each client with a macro-industry slug. Keep the raw sub-sector
// title around for the hover-tooltip context.
const ENRICHED = CLIENTS.map((c) => ({
  ...c,
  macroSlug: macroForClient(c.slug, c.industrySlug),
  subSectorTitle: c.industry, // the raw sub-sector e.g. "Drone Tech"
  industryTitle: macroTitle(macroForClient(c.slug, c.industrySlug)),
}));

export const metadata: Metadata = {
  title: 'Clients — Nucleus Advisors',
  description:
    'Companies Nucleus has advised, audited, or helped raise capital. Filter by service line or industry.',
};

type SearchParams = Promise<{ service?: string | string[]; industry?: string | string[] }>;

function pickFirst(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

function isService(s: string | undefined): s is ServiceSlug {
  return !!s && services.some((svc) => svc.slug === s);
}

const SERVICE_TITLE: Record<ServiceSlug, string> = Object.fromEntries(
  services.map((s) => [s.slug, s.title]),
) as Record<ServiceSlug, string>;

const INDUSTRY_TITLE: Record<string, string> = Object.fromEntries(
  MACRO_INDUSTRIES.map((m) => [m.slug, m.title]),
);

function chipUrl(
  params: { service?: string; industry?: string; toggle?: 'service' | 'industry'; value?: string },
): string {
  const next = new URLSearchParams();
  let svc = params.service;
  let ind = params.industry;
  if (params.toggle === 'service') {
    svc = svc === params.value ? undefined : params.value;
  }
  if (params.toggle === 'industry') {
    ind = ind === params.value ? undefined : params.value;
  }
  if (svc) next.set('service', svc);
  if (ind) next.set('industry', ind);
  const qs = next.toString();
  return qs ? `/clients?${qs}` : '/clients';
}

export default async function ClientsHubPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const raw = await searchParams;
  const rawService = pickFirst(raw.service);
  const rawIndustry = pickFirst(raw.industry);
  const activeService = isService(rawService) ? rawService : undefined;
  const activeIndustry = rawIndustry && INDUSTRY_TITLE[rawIndustry] ? rawIndustry : undefined;

  // Filter
  const filtered = ENRICHED.filter((c) => {
    if (activeService && !c.services.includes(activeService)) return false;
    if (activeIndustry && c.macroSlug !== activeIndustry) return false;
    return true;
  });

  // Service counts (respect active industry — toggling a service shows
  // every match within the currently-selected industry).
  const serviceCounts: Record<ServiceSlug, number> = {} as Record<ServiceSlug, number>;
  for (const svc of services) serviceCounts[svc.slug as ServiceSlug] = 0;
  for (const c of ENRICHED) {
    if (activeIndustry && c.macroSlug !== activeIndustry) continue;
    for (const s of c.services) serviceCounts[s] = (serviceCounts[s] ?? 0) + 1;
  }

  // Industry counts (respect active service).
  const industryCounts: Record<string, number> = {};
  for (const c of ENRICHED) {
    if (activeService && !c.services.includes(activeService)) continue;
    industryCounts[c.macroSlug] = (industryCounts[c.macroSlug] ?? 0) + 1;
  }
  const industriesSorted = Object.entries(industryCounts)
    .filter(([, n]) => n > 0)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  const totalAcross = ENRICHED.length;

  return (
    <PageShell>
      <main className="home-v3 service-v1">
        <section className="hub-hero">
          <p className="hub-eyebrow">Clients</p>
          <h1 className="hub-title">
            Companies we&rsquo;ve <em>worked with</em>.
          </h1>
          <p className="hub-lede">
            {totalAcross}{' '}companies across our nine service lines. Filter by service
            to see who we&rsquo;ve delivered for, by industry to see depth in a sector,
            or combine both.
          </p>
        </section>

        <section className="clients-filterbar" aria-label="Filter clients">
          <div className="clients-filter-row">
            <span className="clients-filter-label">Service</span>
            <FilterChip
              href={chipUrl({ industry: activeIndustry })}
              active={!activeService}
              label="All services"
              count={
                activeIndustry
                  ? ENRICHED.filter((c) => c.macroSlug === activeIndustry).length
                  : totalAcross
              }
            />
            {services
              .map((svc) => ({
                slug: svc.slug as ServiceSlug,
                title: svc.title,
                count: serviceCounts[svc.slug as ServiceSlug] ?? 0,
              }))
              .filter((s) => s.count > 0 || s.slug === activeService)
              .sort((a, b) => b.count - a.count || a.title.localeCompare(b.title))
              .map((s) => (
                <FilterChip
                  key={s.slug}
                  href={chipUrl({
                    service: activeService,
                    industry: activeIndustry,
                    toggle: 'service',
                    value: s.slug,
                  })}
                  active={activeService === s.slug}
                  label={s.title}
                  count={s.count}
                />
              ))}
          </div>

          <details className="clients-filter-row clients-filter-industry" open={!!activeIndustry}>
            <summary>
              <span className="clients-filter-label">Industry</span>
              <span className="clients-filter-summary-hint">
                {activeIndustry
                  ? INDUSTRY_TITLE[activeIndustry]
                  : `All ${industriesSorted.length} industries`}
              </span>
            </summary>
            <div className="clients-filter-industry-chips">
              <FilterChip
                href={chipUrl({ service: activeService })}
                active={!activeIndustry}
                label="All industries"
                count={activeService ? filtered.length : totalAcross}
              />
              {industriesSorted.map(([slug, count]) => (
                <FilterChip
                  key={slug}
                  href={chipUrl({
                    service: activeService,
                    industry: activeIndustry,
                    toggle: 'industry',
                    value: slug,
                  })}
                  active={activeIndustry === slug}
                  label={INDUSTRY_TITLE[slug]}
                  count={count}
                />
              ))}
            </div>
          </details>

          {(activeService || activeIndustry) && (
            <div className="clients-filter-active">
              <span className="clients-filter-active-label">Showing</span>
              <strong>{filtered.length}</strong>
              <span>
                {filtered.length === 1 ? 'company' : 'companies'}
                {activeService ? ` in ${SERVICE_TITLE[activeService]}` : ''}
                {activeIndustry ? ` × ${INDUSTRY_TITLE[activeIndustry]}` : ''}
              </span>
              <Link href="/clients" className="clients-filter-clear">
                Clear filters →
              </Link>
            </div>
          )}
        </section>

        <section className="clients-grid-section">
          {filtered.length === 0 ? (
            <div className="hub-empty">
              <p>No companies match this combination.</p>
              <Link href="/clients" className="hub-empty-reset">
                Clear filters
              </Link>
            </div>
          ) : (
            <ul className="clients-roster-grid">
              {filtered.map((c) => (
                <li key={c.slug + '-' + c.macroSlug} className="client-card">
                  <div className="client-card-logo">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.logoSrc}
                      alt={c.name}
                      className="client-card-logo-img"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <div className="client-card-body">
                    <p className="client-card-name">{c.name}</p>
                    <p className="client-card-meta">
                      <Link
                        href={chipUrl({
                          service: activeService,
                          toggle: 'industry',
                          value: c.macroSlug,
                        })}
                        className={`client-card-meta-link client-card-industry${activeIndustry === c.macroSlug ? ' is-active' : ''}`}
                        title={
                          c.subSectorTitle && c.subSectorTitle !== c.industryTitle
                            ? `Sub-sector: ${c.subSectorTitle}`
                            : c.industryTitle
                        }
                      >
                        {c.industryTitle}
                      </Link>
                      {c.services.length > 0 && (
                        <>
                          <span className="client-card-meta-sep" aria-hidden="true">·</span>
                          {c.services.map((svc, i) => (
                            <span key={svc} className="client-card-service-wrap">
                              {i > 0 && (
                                <span className="client-card-meta-sep" aria-hidden="true">·</span>
                              )}
                              <Link
                                href={chipUrl({
                                  industry: activeIndustry,
                                  toggle: 'service',
                                  value: svc,
                                })}
                                className={`client-card-meta-link client-card-service${activeService === svc ? ' is-active' : ''}`}
                                title={
                                  c.rawServiceLabels.length
                                    ? `Engagements: ${c.rawServiceLabels.join(', ')}`
                                    : SERVICE_TITLE[svc]
                                }
                              >
                                {SERVICE_TITLE[svc]}
                              </Link>
                            </span>
                          ))}
                        </>
                      )}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </PageShell>
  );
}

function FilterChip({
  href,
  active,
  label,
  count,
}: Readonly<{ href: string; active: boolean; label: string; count: number }>) {
  return (
    <Link
      href={href}
      className={`clients-chip ${active ? 'is-active' : ''}`}
      aria-current={active ? 'page' : undefined}
    >
      <span>{label}</span>
      <span className="clients-chip-count">{count}</span>
    </Link>
  );
}
