import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PageShell } from '@/components/site-chrome';
import { clients } from '@/content/clients';
import { services } from '@/content/site';

export const metadata: Metadata = {
  title: 'Clients — Nucleus Advisors',
  description:
    'Founders and companies Nucleus Advisors has worked with, grouped by service line.',
};

type SearchParams = Promise<{ service?: string | string[] }>;

function pickFirst(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function ClientsHubPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const raw = await searchParams;
  const serviceFilter = pickFirst(raw.service);

  // Build "service slug → clients" map from the central clients list.
  // Only services that have at least one tagged client get a section.
  const grouped: { service: (typeof services)[number]; entries: typeof clients }[] = services
    .map((svc) => ({
      service: svc,
      entries: clients.filter((c) => c.serviceSlugs.includes(svc.slug)),
    }))
    .filter((g) => g.entries.length > 0)
    .filter((g) => (serviceFilter ? g.service.slug === serviceFilter : true));

  const totalClientsAcross = clients.length;
  const totalShown = grouped.reduce((n, g) => n + g.entries.length, 0);

  return (
    <PageShell>
      <main className="home-v3 service-v1">
        <section className="hub-hero">
          <p className="hub-eyebrow">Clients</p>
          <h1 className="hub-title">
            Founders we&rsquo;ve <em>worked with</em>.
          </h1>
          <p className="hub-lede">
            Companies Nucleus has advised or invested in, grouped by service line. One
            company can appear under more than one service when it&rsquo;s worked with us
            on multiple workstreams.
          </p>
        </section>

        <section className="hub-filters" aria-label="Filter clients">
          <div className="hub-filter-row">
            <span className="hub-filter-label">Service —</span>
            <FilterChip
              href="/clients"
              active={!serviceFilter}
              label={`All · ${totalClientsAcross}`}
            />
            {services
              .map((s) => ({
                slug: s.slug,
                title: s.title,
                count: clients.filter((c) => c.serviceSlugs.includes(s.slug)).length,
              }))
              .filter((s) => s.count > 0)
              .sort((a, b) => b.count - a.count)
              .map((s) => (
                <FilterChip
                  key={s.slug}
                  href={`/clients?service=${s.slug}`}
                  active={serviceFilter === s.slug}
                  label={`${s.title} · ${s.count}`}
                />
              ))}
          </div>
        </section>

        <section className="hub-grid-section">
          {grouped.length === 0 ? (
            <div className="hub-empty">
              <p>No clients tagged for this service yet.</p>
              <Link href="/clients" className="hub-empty-reset">
                Clear filter
              </Link>
            </div>
          ) : (
            <div className="clients-hub-groups">
              {grouped.map((g) => (
                <section key={g.service.slug} className="clients-hub-group">
                  <header className="clients-hub-group-head">
                    <div>
                      <p className="clients-hub-group-eyebrow">
                        <span className="clients-hub-group-eyebrow-bar" aria-hidden="true" />
                        <span>{g.service.title}</span>
                      </p>
                      <p className="clients-hub-group-count">
                        {g.entries.length} {g.entries.length === 1 ? 'company' : 'companies'}
                      </p>
                    </div>
                    <Link
                      href={`/services/${g.service.slug}`}
                      className="clients-hub-group-link"
                    >
                      Visit {g.service.title} →
                    </Link>
                  </header>

                  <ul className="clients-hub-grid">
                    {g.entries.map((c) => (
                      <li key={`${g.service.slug}-${c.slug}`} className="clients-hub-cell">
                        <div className="clients-hub-logo-wrap" aria-hidden="true">
                          <Image
                            src={c.logoSrc}
                            alt=""
                            width={120}
                            height={48}
                            className="clients-hub-logo"
                            sizes="120px"
                          />
                        </div>
                        <p className="clients-hub-name">{c.name}</p>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}

          {!serviceFilter ? (
            <p className="clients-hub-footnote">
              Showing {totalShown} {totalShown === 1 ? 'tagging' : 'taggings'} across{' '}
              {grouped.length} {grouped.length === 1 ? 'service line' : 'service lines'}.
            </p>
          ) : null}
        </section>
      </main>
    </PageShell>
  );
}

function FilterChip({
  href,
  active,
  label,
}: Readonly<{ href: string; active: boolean; label: string }>) {
  return (
    <Link
      href={href}
      className={`hub-chip ${active ? 'is-active' : ''}`}
      aria-current={active ? 'page' : undefined}
    >
      {label}
    </Link>
  );
}
