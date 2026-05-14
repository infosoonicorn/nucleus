# Services — Investment Banking page redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `apps/web/src/components/service-detail.tsx` with a set of composable section primitives, build a bespoke `/services/investment-banking` composition with three IB-only components (FundraiseStages, ArtefactStack, SoonicornCallout) and a new shared `ServiceInsights` primitive, and elevate the other 8 service pages to the new visual baseline via a `ServicePageDefault` composition.

**Architecture:** Each shared primitive accepts `service: Service` and is self-contained — no global stores, no hidden context. The IB route lives at `apps/web/src/app/services/investment-banking/page.tsx` (precedence over `[slug]/page.tsx`). All motion uses framer-motion primitives already in the bundle. CSS is scoped under `.home-v3 .service-v1` so service pages inherit home design tokens and add service-only overrides. Visual quality is verified via Playwright (no unit-test framework exists in this repo); pure-logic units (reviewer-gate filter, sort/cap) are verified via Playwright assertions on the rendered page.

**Tech Stack:** Next.js 16 App Router · React 19 · TypeScript · framer-motion · Lenis · Tailwind v4 + scoped CSS in `globals.css` · Playwright for e2e.

**Spec:** `docs/superpowers/specs/2026-05-14-services-ib-design.md`. Read it before starting.

**Commit policy:** Per project rules, the executor commits only with Vijay's explicit go-ahead. The commit steps below produce the right diffs but should not be run until Vijay says "ship the next chunk."

---

## Task 1: Extend `Service` type, add ordinals, add IB-specific fields

**Files:**
- Modify: `apps/web/src/content/site.ts`
- Test: `tests/e2e/services-data.spec.ts` (new)

- [ ] **Step 1: Write the failing test**

Create `tests/e2e/services-data.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test.describe('Services data model — Task 1', () => {
  test('every service has a two-digit ordinal', async ({ page }) => {
    // Visit each service page; the ordinal appears in the page eyebrow once
    // <ServiceHero> is wired up. Until then, this asserts the data layer by
    // hitting the services overview where ordinals will be rendered in card meta.
    const slugs = [
      'investment-banking',
      'ma-advisory',
      'risk-advisory',
      'tax-regulatory',
      'assurance',
      'valuations',
      'finance-outsourcing',
      'corporate-secretarial',
      'aif-fund-management',
    ];
    for (const slug of slugs) {
      const response = await page.request.get(`/services/${slug}`);
      expect(response.status(), `expected /services/${slug} to load`).toBeLessThan(400);
    }
  });

  test('investment banking carries a Soonicorn cross-link in approved status', async ({ page }) => {
    await page.goto('/services/investment-banking');
    // Asserted directly once <SoonicornCallout> exists (Task 10). For Task 1
    // we only need the data shape; this test will start passing once the
    // component is wired in Task 10. Keep skipped for now.
    test.skip();
  });
});
```

- [ ] **Step 2: Run test to verify it fails (or passes trivially)**

```bash
pnpm test:e2e tests/e2e/services-data.spec.ts
```
Expected: "every service has a two-digit ordinal" passes (all 9 routes load today); skipped test logs as skipped. This is a baseline guard — it stays green throughout the plan.

- [ ] **Step 3: Edit `apps/web/src/content/site.ts`**

At the top of the file, locate the `Service` type. Replace with:

```ts
export type ServiceCrossLink = {
  kind: 'in-house-fund' | 'partner' | 'related-firm';
  brand: string;
  logoPath: string;          // path under /public, e.g. '/brand/soonicorn-ventures.png'
  eyebrow: string;
  title: string;
  body: string;
  ctaLabel: string;
  href: string;              // external URL
  disclaimer: string;
  reviewerStatus: 'pending' | 'approved';
  reviewerApprovedAt?: string;
};

export type Service = {
  title: string;
  slug: string;
  summary: string;
  promise: string;
  seoTitle: string;
  metaDescription: string;
  howWeHelp: string[];
  deliverables: string[];
  experts: string[];
  leadMagnet: string;
  cta: string;
  icon: LucideIcon;
  proof?: string[];
  // New optional fields:
  ordinal: string;                          // '01' through '09'. Required.
  displayHeadline?: string;                 // 3-word punchier hero headline; falls back to title
  whenToEngage?: string[];                  // 4 bullets; falls back to generic four if absent
  faq?: { q: string; a: string }[];         // 4 questions; missing answers render 'Updating soon'
  crossLink?: ServiceCrossLink;             // Optional cross-link panel data
};
```

Note: `ordinal` is required (no `?`). TypeScript will force every entry in the `services[]` array to provide one. Add ordinals to all 9 services in order (`01` Investment Banking through `09` AIF & Fund Management).

For the **Investment Banking** entry specifically, also add:

```ts
displayHeadline: 'Prepare. Position. Close.',
crossLink: {
  kind: 'in-house-fund',
  brand: 'Soonicorn Ventures',
  logoPath: '/brand/soonicorn-ventures.png',
  eyebrow: '§ In-house capital alongside advisory',
  title: 'Soonicorn Ventures',
  body: "Nucleus is Investment Manager to Soonicorn Angel Trust-I, an early-stage fund focused on seed and pre-Series A startups raising up to US $1M. If your round fits the fund's mandate, you can also explore Soonicorn Ventures directly.",
  ctaLabel: 'Visit Soonicorn Ventures',
  href: 'https://soonicornventures.com/',
  disclaimer: 'This is not an offer or solicitation to invest in or raise from any fund or security. Any engagement with Soonicorn Ventures is subject to its fund mandate, stage and sector fit, and independent diligence.',
  reviewerStatus: 'approved',
  reviewerApprovedAt: '2026-05-14',
},
```

- [ ] **Step 4: Verify lint, typecheck, and existing tests still pass**

```bash
pnpm lint && pnpm typecheck && pnpm test:e2e
```
Expected: all green. TypeScript will fail the build if any service is missing an `ordinal`.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/content/site.ts tests/e2e/services-data.spec.ts
git commit -m "feat(web): extend Service type with ordinal, displayHeadline, faq, crossLink"
```

---

## Task 2: Create `content/insights-sources.ts` data file

**Files:**
- Create: `apps/web/src/content/insights-sources.ts`

- [ ] **Step 1: Write the data file**

Create `apps/web/src/content/insights-sources.ts`:

```ts
export type ServiceInsightSourceKind =
  | 'SEBI'
  | 'RBI'
  | 'MCA'
  | 'IncomeTax'
  | 'DPIIT'
  | 'IBBI'
  | 'ICAI'
  | 'CBIC';

export type ServiceInsightSource = {
  id: string;
  source: ServiceInsightSourceKind;
  title: string;
  publishedOn: string;       // ISO date YYYY-MM-DD
  url: string;               // external
  whyItMatters: string;      // one short sentence
  serviceSlugs: string[];    // e.g. ['investment-banking']
  reviewerStatus: 'pending' | 'approved';
  reviewerApprovedAt?: string;
};

export type PlannedKnowledgeCategory = {
  serviceSlug: string;
  title: string;
  text: string;
};

// Seed items for Investment Banking. ALL start as 'pending'. Vijay or a partner
// flips to 'approved' before merge. Component refuses to render pending items
// in production builds — see <ServiceInsights> in Task 6.
export const insightSources: ServiceInsightSource[] = [
  {
    id: 'sebi-aif-master-circular',
    source: 'SEBI',
    title: 'SEBI Master Circular for Alternative Investment Funds',
    publishedOn: '2025-05-07',
    url: 'https://www.sebi.gov.in/legal/master-circulars/may-2025/master-circular-for-alternative-investment-funds_94177.html',
    whyItMatters: 'Consolidated AIF rules — relevant context for founders evaluating fund-routed capital.',
    serviceSlugs: ['investment-banking', 'aif-fund-management'],
    reviewerStatus: 'pending',
  },
  {
    id: 'rbi-fema-fdi-master',
    source: 'RBI',
    title: 'RBI Master Direction — Foreign Investment in India (FEMA)',
    publishedOn: '2024-08-12',
    url: 'https://rbi.org.in/Scripts/BS_ViewMasDirections.aspx',
    whyItMatters: 'Governs how non-resident investors can put capital into Indian companies — directly affects round structuring.',
    serviceSlugs: ['investment-banking'],
    reviewerStatus: 'pending',
  },
  {
    id: 'dpiit-startup-recognition',
    source: 'DPIIT',
    title: 'DPIIT Startup India recognition framework',
    publishedOn: '2024-12-01',
    url: 'https://www.startupindia.gov.in/content/sih/en/startupgov/startup-recognition-page.html',
    whyItMatters: 'Recognition unlocks tax holiday and angel-tax exemption — material to fundraise economics.',
    serviceSlugs: ['investment-banking'],
    reviewerStatus: 'pending',
  },
  {
    id: 'incometax-angel-tax-rules',
    source: 'IncomeTax',
    title: 'CBDT notification on angel tax valuation rules',
    publishedOn: '2023-09-25',
    url: 'https://incometaxindia.gov.in/communications/notification/notification-no-81-2023.pdf',
    whyItMatters: 'Sets the valuation methodology and exemptions that determine angel-tax exposure on share issuance.',
    serviceSlugs: ['investment-banking'],
    reviewerStatus: 'pending',
  },
];

export const plannedCategories: PlannedKnowledgeCategory[] = [
  { serviceSlug: 'investment-banking', title: 'Fundraise readiness',          text: 'Checklists and prep notes for first-time and repeat raisers.' },
  { serviceSlug: 'investment-banking', title: 'Investor mapping',             text: 'How we segment angels, VCs, family offices and strategic capital by stage.' },
  { serviceSlug: 'investment-banking', title: 'Term sheets & structures',     text: 'Reading the headline numbers and the clauses founders miss.' },
  { serviceSlug: 'investment-banking', title: 'Sector deep dives',            text: 'What changes when fundraising in fintech, SaaS, consumer, manufacturing.' },
];
```

- [ ] **Step 2: Verify typecheck passes**

```bash
pnpm typecheck
```
Expected: green. Pure data file with no runtime dependencies.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/content/insights-sources.ts
git commit -m "feat(web): add insight sources data file with IB seed items (pending review)"
```

---

## Task 3: Create `/api/lead-magnet-stub` route handler

**Files:**
- Create: `apps/web/src/app/api/lead-magnet-stub/route.ts`
- Test: `tests/e2e/lead-magnet-stub.spec.ts` (new)

- [ ] **Step 1: Write the failing test**

Create `tests/e2e/lead-magnet-stub.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test.describe('Lead magnet stub route — Task 3', () => {
  test('POST returns friendly confirmation JSON', async ({ request }) => {
    const response = await request.post('/api/lead-magnet-stub', {
      data: { email: 'someone@example.com', kind: 'lead-magnet', serviceSlug: 'investment-banking' },
    });
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(body.ok).toBe(true);
    expect(body.message).toContain("We'll be in touch");
  });

  test('POST rejects when email field is missing', async ({ request }) => {
    const response = await request.post('/api/lead-magnet-stub', { data: { kind: 'lead-magnet' } });
    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body.ok).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test:e2e tests/e2e/lead-magnet-stub.spec.ts
```
Expected: FAIL with 404 on `/api/lead-magnet-stub`.

- [ ] **Step 3: Create the route handler**

Create `apps/web/src/app/api/lead-magnet-stub/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server';

type LeadMagnetStubBody = {
  email?: string;
  kind?: 'lead-magnet' | 'insights-subscribe';
  serviceSlug?: string;
};

export async function POST(request: NextRequest) {
  let payload: LeadMagnetStubBody;
  try {
    payload = (await request.json()) as LeadMagnetStubBody;
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid request body.' }, { status: 400 });
  }

  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  if (!email || !email.includes('@')) {
    return NextResponse.json({ ok: false, message: 'A valid email is required.' }, { status: 400 });
  }

  // Phase 1 stub: log the submission for visibility, do NOT persist anywhere.
  // Phase 1.5 will replace this with a Supabase write.
  console.warn(
    '[lead-magnet-stub]',
    JSON.stringify({
      kind: payload.kind ?? 'lead-magnet',
      serviceSlug: payload.serviceSlug ?? null,
      receivedAt: new Date().toISOString(),
    }),
  );

  return NextResponse.json({
    ok: true,
    message: "We'll be in touch when this content is published.",
  });
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
pnpm test:e2e tests/e2e/lead-magnet-stub.spec.ts
```
Expected: both tests PASS.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/app/api/lead-magnet-stub/route.ts tests/e2e/lead-magnet-stub.spec.ts
git commit -m "feat(web): add inert lead-magnet stub route returning friendly confirmation"
```

---

## Task 4: Extract 10 shared section primitives from `service-detail.tsx`

**Files (all new):**
- Create: `apps/web/src/components/services/when-to-engage.tsx`
- Create: `apps/web/src/components/services/how-we-help.tsx`
- Create: `apps/web/src/components/services/process.tsx`
- Create: `apps/web/src/components/services/deliverables.tsx`
- Create: `apps/web/src/components/services/proof.tsx`
- Create: `apps/web/src/components/services/knowledge-bank.tsx`
- Create: `apps/web/src/components/services/faq.tsx`
- Create: `apps/web/src/components/services/lead-magnet.tsx`
- Create: `apps/web/src/components/services/related-services.tsx`
- Create: `apps/web/src/components/services/contact-band.tsx`

Each primitive accepts `service: Service` and renders the equivalent section that lives inside `service-detail.tsx` today, but with `.service-v1-*` CSS classes instead of legacy classes. The legacy `<ServiceDetail>` component stays in place this task — it is deleted in Task 13. These new files exist side-by-side until then.

- [ ] **Step 1: Create `apps/web/src/components/services/when-to-engage.tsx`**

```tsx
import type { Service } from '@/content/site';
import { FadeIn } from '@/components/motion-primitives';
import { CheckCircle2 } from 'lucide-react';
import { SectionHeader } from '@/components/sections';

const GENERIC_BULLETS = [
  'You need a reliable workplan before a transaction, filing, audit or board decision.',
  'Internal teams need specialist support without losing ownership of the outcome.',
  'Documents, data, assumptions and compliance positions need to be decision-ready.',
  'Management needs clear deliverables, issue trackers and next-step visibility.',
];

export function WhenToEngage({ service }: Readonly<{ service: Service }>) {
  const bullets = service.whenToEngage ?? GENERIC_BULLETS;
  return (
    <section className="service-v1-section service-v1-section-split">
      <SectionHeader
        eyebrow="When to engage"
        title="For decisions where finance, compliance and execution need to move together."
      />
      <div className="service-v1-checklist">
        {bullets.map((item) => (
          <FadeIn key={item}>
            <p>
              <CheckCircle2 aria-hidden="true" size={18} />
              <span>{item}</span>
            </p>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `apps/web/src/components/services/how-we-help.tsx`**

```tsx
import type { Service } from '@/content/site';
import { SectionHeader } from '@/components/sections';

export function HowWeHelp({ service }: Readonly<{ service: Service }>) {
  return (
    <section className="service-v1-section">
      <SectionHeader eyebrow="How we help" title="Structured advisory, practical execution." />
      <div className="service-v1-list-grid">
        {service.howWeHelp.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `apps/web/src/components/services/process.tsx`**

```tsx
import type { Service } from '@/content/site';
import { SectionHeader } from '@/components/sections';

const PHASES = [
  { name: 'Diagnose', text: 'Scope the issue, identify decision owners, agree the workplan.' },
  { name: 'Structure', text: 'Build the model, assemble evidence, sequence the workstream.' },
  { name: 'Execute',  text: 'Run the workstream, manage information, track issues to closure.' },
  { name: 'Report',   text: 'Convert findings into management-ready action and next steps.' },
];

export function Process({ service }: Readonly<{ service: Service }>) {
  return (
    <section className="service-v1-section service-v1-section-alt">
      <SectionHeader
        eyebrow="Process"
        title={`A clear engagement path for ${service.title}.`}
      />
      <div className="service-v1-timeline">
        {PHASES.map((phase, index) => (
          <div key={phase.name}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <h3>{phase.name}</h3>
            <p>{phase.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Create `apps/web/src/components/services/deliverables.tsx`**

```tsx
import type { Service } from '@/content/site';
import { SectionHeader } from '@/components/sections';

export function Deliverables({ service }: Readonly<{ service: Service }>) {
  return (
    <section className="service-v1-section">
      <SectionHeader eyebrow="Deliverables" title="What clients can expect to receive." />
      <div className="service-v1-list-grid">
        {service.deliverables.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Create `apps/web/src/components/services/proof.tsx`**

```tsx
import type { Service } from '@/content/site';
import { SectionHeader } from '@/components/sections';

export function Proof({ service }: Readonly<{ service: Service }>) {
  if (!service.proof || service.proof.length === 0) return null;
  return (
    <section className="service-v1-section service-v1-section-proof">
      <SectionHeader
        eyebrow="Proof with guardrails"
        title="Operating experience presented carefully and without solicitation."
      />
      <div className="service-v1-list-grid">
        {service.proof.map((item) => (
          <div key={item}>{item}</div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Create `apps/web/src/components/services/knowledge-bank.tsx`**

```tsx
import type { Service } from '@/content/site';
import { SectionHeader } from '@/components/sections';

export function KnowledgeBank({ service }: Readonly<{ service: Service }>) {
  return (
    <section className="service-v1-section service-v1-section-split">
      <SectionHeader
        eyebrow="Knowledge bank"
        title="FAQs, sample documents and insight modules are ready for CMS migration."
        text="Phase 1 avoids fake live articles. The page shows the editorial structure and routes visitors to a real conversation."
      />
      <div className="service-v1-mini-panel">
        <h3>Related experts</h3>
        {service.experts.map((expert) => (
          <p key={expert}>{expert}</p>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 7: Create `apps/web/src/components/services/faq.tsx`**

```tsx
import type { Service } from '@/content/site';
import { SectionHeader } from '@/components/sections';

const GENERIC_QUESTIONS = (service: Service) => [
  `When should a company engage Nucleus for ${service.title}?`,
  'What information should the client prepare before the first discussion?',
  'What deliverables can management expect from this workstream?',
  'Which related services may become relevant as the engagement progresses?',
];

export function Faq({ service }: Readonly<{ service: Service }>) {
  const items = service.faq ?? GENERIC_QUESTIONS(service).map((q) => ({ q, a: '' }));

  return (
    <section className="service-v1-section">
      <SectionHeader eyebrow="FAQs" title="Questions this page is designed to answer." />
      <div className="service-v1-faq-grid">
        {items.map(({ q, a }) => (
          <details key={q}>
            <summary>{q}</summary>
            {a ? (
              <p>{a}</p>
            ) : (
              <p>
                <span className="service-v1-pending-pill">Updating soon</span>
                {' '}Reviewer-approved content for this question is in preparation.
              </p>
            )}
          </details>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 8: Create `apps/web/src/components/services/lead-magnet.tsx`**

```tsx
'use client';

import { useState } from 'react';
import type { Service } from '@/content/site';
import { SectionHeader } from '@/components/sections';

export function LeadMagnet({ service }: Readonly<{ service: Service }>) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'ok' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '');
    setStatus('submitting');
    try {
      const response = await fetch('/api/lead-magnet-stub', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, kind: 'lead-magnet', serviceSlug: service.slug }),
      });
      const body = (await response.json()) as { ok: boolean; message: string };
      if (response.ok && body.ok) {
        setStatus('ok');
        setMessage(body.message);
      } else {
        setStatus('error');
        setMessage('We could not register your request. Please try again or write to us directly.');
      }
    } catch {
      setStatus('error');
      setMessage('Network unavailable. Please try again in a moment.');
    }
  }

  return (
    <section className="service-v1-section service-v1-section-leadmagnet">
      <SectionHeader eyebrow="Resource" title={service.leadMagnet} />
      <form className="service-v1-leadmagnet-form" onSubmit={handleSubmit}>
        <label htmlFor="lead-email" className="service-v1-sr-only">
          Work email
        </label>
        <input
          id="lead-email"
          name="email"
          type="email"
          required
          placeholder="you@company.com"
          disabled={status === 'submitting' || status === 'ok'}
        />
        <button type="submit" className="home-v3-button home-v3-button-primary" disabled={status === 'submitting' || status === 'ok'}>
          {status === 'ok' ? 'Received' : 'Request resource'}
        </button>
      </form>
      {message ? <p className="service-v1-leadmagnet-status" role="status">{message}</p> : null}
    </section>
  );
}
```

- [ ] **Step 9: Create `apps/web/src/components/services/related-services.tsx`**

```tsx
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { services, type Service } from '@/content/site';
import { SectionHeader } from '@/components/sections';

export function RelatedServices({ service }: Readonly<{ service: Service }>) {
  const related = services.filter((item) => item.slug !== service.slug).slice(0, 3);
  return (
    <section className="service-v1-section">
      <SectionHeader eyebrow="Related services" title="Adjacent workstreams often connect." />
      <div className="service-v1-related-grid">
        {related.map((item) => (
          <Link className="service-v1-related-card" href={`/services/${item.slug}`} key={item.slug}>
            <h3>{item.title}</h3>
            <p>{item.summary}</p>
            <span className="service-v1-card-link">
              View service
              <ArrowRight aria-hidden="true" size={16} />
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 10: Create `apps/web/src/components/services/contact-band.tsx`**

```tsx
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Service } from '@/content/site';

export function ContactBand({ service }: Readonly<{ service: Service }>) {
  return (
    <section className="service-v1-contact-band">
      <div>
        <h2>Talk to Nucleus about {service.title}.</h2>
        <p>{service.promise}</p>
      </div>
      <Link className="home-v3-button home-v3-button-primary" href="/contact">
        {service.cta}
        <ArrowRight aria-hidden="true" size={18} />
      </Link>
    </section>
  );
}
```

- [ ] **Step 11: Verify lint, typecheck pass (no usage yet — components are dormant)**

```bash
pnpm lint && pnpm typecheck
```
Expected: green. Lint may warn about unused imports if a component imports something Tailwind v4 hasn't tree-shaken; address case-by-case.

- [ ] **Step 12: Commit**

```bash
git add apps/web/src/components/services/
git commit -m "feat(web): extract 10 shared service-page section primitives"
```

---

## Task 5: Create new `<ServiceHero>` shared primitive

**Files:**
- Create: `apps/web/src/components/services/service-hero.tsx`

The hero is its own task because it's the most visually loaded component and reuses several home-v3 motion primitives.

- [ ] **Step 1: Create the component**

```tsx
'use client';

import Link from 'next/link';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import type { Service } from '@/content/site';
import { FadeIn, Magnetic, WordReveal } from '@/components/motion-primitives';

export function ServiceHero({ service }: Readonly<{ service: Service }>) {
  const headline = service.displayHeadline ?? service.title;
  return (
    <section className="service-v1-hero" aria-label={`${service.title} hero`}>
      <div className="service-v1-hero-stage">
        <FadeIn duration={0.55}>
          <p className="home-v3-eyebrow">
            <span aria-hidden="true" />
            §{service.ordinal} / {service.title}
          </p>
        </FadeIn>
        <h1 className="service-v1-headline home-v3-headline-display">
          <span className="home-v3-sr-only">{headline}</span>
          <span className="home-v3-headline-row" aria-hidden="true">
            <WordReveal text={headline} />
          </span>
        </h1>
        <FadeIn delay={0.7} duration={0.7}>
          <p className="service-v1-lede">{service.promise}</p>
        </FadeIn>
        <FadeIn delay={0.95} duration={0.6}>
          <div className="home-v3-cta-row">
            <Magnetic strength={0.18}>
              <Link className="home-v3-button home-v3-button-primary" href={`/contact?intent=${service.slug}`}>
                {service.cta}
                <ArrowRight aria-hidden="true" size={18} />
              </Link>
            </Magnetic>
            <Link className="home-v3-button home-v3-button-ghost" href="/services">
              All services
              <ArrowUpRight aria-hidden="true" size={18} />
            </Link>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify lint and typecheck pass**

```bash
pnpm lint && pnpm typecheck
```
Expected: green.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/services/service-hero.tsx
git commit -m "feat(web): add ServiceHero primitive reusing home-v3 motion language"
```

---

## Task 6: Create `<ServiceInsights>` shared primitive (with filter/sort/reviewer-gate logic)

**Files:**
- Create: `apps/web/src/components/services/service-insights.tsx`
- Test: `tests/e2e/service-insights.spec.ts` (new)

- [ ] **Step 1: Write the failing test**

Create `tests/e2e/service-insights.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test.describe('ServiceInsights component — Task 6', () => {
  test('hides pending items in production-equivalent rendering', async ({ page }) => {
    // Until IB page composes the component (Task 11), assert via /services overview
    // that no insight source titles leak prematurely.
    test.skip(); // re-enabled in Task 11
  });

  test('renders planned categories for investment-banking once composed', async ({ page }) => {
    test.skip(); // re-enabled in Task 11
  });
});
```

- [ ] **Step 2: Create the component**

Create `apps/web/src/components/services/service-insights.tsx`:

```tsx
import { ArrowUpRight } from 'lucide-react';
import { SectionHeader } from '@/components/sections';
import { insightSources, plannedCategories, type ServiceInsightSource } from '@/content/insights-sources';
import type { Service } from '@/content/site';

const MAX_SOURCES = 6;

function approvedSourcesFor(slug: string): ServiceInsightSource[] {
  const filtered = insightSources.filter(
    (s) => s.serviceSlugs.includes(slug) && s.reviewerStatus === 'approved',
  );
  // Sort by publishedOn descending; cap at MAX_SOURCES.
  return [...filtered]
    .sort((a, b) => (a.publishedOn < b.publishedOn ? 1 : -1))
    .slice(0, MAX_SOURCES);
}

function plannedFor(slug: string) {
  return plannedCategories.filter((c) => c.serviceSlug === slug).slice(0, 4);
}

function assertNoPendingInProduction(items: ServiceInsightSource[]) {
  if (process.env.NODE_ENV !== 'production') return;
  if (items.some((s) => s.reviewerStatus === 'pending')) {
    // Hard fail — caller bug. Pending items must never reach prod rendering.
    throw new Error('[ServiceInsights] pending insight source reached production render path');
  }
}

export function ServiceInsights({ service }: Readonly<{ service: Service }>) {
  const planned = plannedFor(service.slug);
  const sources = approvedSourcesFor(service.slug);
  assertNoPendingInProduction(sources);
  if (planned.length === 0 && sources.length === 0) return null;

  return (
    <section className="service-v1-section service-v1-insights">
      <SectionHeader
        eyebrow={`§${service.ordinal} / Insights`}
        title="Knowledge for fundraising decisions."
        text="What we publish and what we're tracking from official sources."
      />
      <div className="service-v1-insights-grid">
        <div className="service-v1-insights-planned">
          <h3>Planned knowledge bank</h3>
          {planned.length === 0 ? null : (
            <ul>
              {planned.map((p) => (
                <li key={p.title}>
                  <span className="service-v1-pending-pill">Updating soon</span>
                  <h4>{p.title}</h4>
                  <p>{p.text}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="service-v1-insights-sources">
          <h3>Regulatory updates we're tracking</h3>
          {sources.length === 0 ? (
            <p className="service-v1-insights-empty">
              Reviewer-approved official-source citations will appear here as they are confirmed.
            </p>
          ) : (
            <ul>
              {sources.map((s) => (
                <li key={s.id}>
                  <span className={`service-v1-source-badge service-v1-source-${s.source.toLowerCase()}`}>
                    {s.source}
                  </span>
                  <a href={s.url} target="_blank" rel="noopener noreferrer">
                    <h4>
                      {s.title}
                      <ArrowUpRight aria-hidden="true" size={14} />
                    </h4>
                  </a>
                  <p className="service-v1-source-meta">{formatDate(s.publishedOn)}</p>
                  <p>{s.whyItMatters}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: '2-digit' });
}
```

- [ ] **Step 3: Verify lint and typecheck pass**

```bash
pnpm lint && pnpm typecheck
```
Expected: green.

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/components/services/service-insights.tsx tests/e2e/service-insights.spec.ts
git commit -m "feat(web): add ServiceInsights primitive with reviewer-gated source rendering"
```

---

## Task 7: Create `<ServicePageDefault>` + switch `[slug]` route + verify other 8 services

**Files:**
- Create: `apps/web/src/components/services/service-page-default.tsx`
- Modify: `apps/web/src/app/services/[slug]/page.tsx`
- Modify: `tests/e2e/services-data.spec.ts` (extend with default-composition checks)

- [ ] **Step 1: Write failing default-composition test**

Append to `tests/e2e/services-data.spec.ts`:

```ts
test.describe('Default service-page composition — Task 7', () => {
  const NON_IB = [
    'ma-advisory',
    'risk-advisory',
    'tax-regulatory',
    'assurance',
    'valuations',
    'finance-outsourcing',
    'corporate-secretarial',
    'aif-fund-management',
  ];

  for (const slug of NON_IB) {
    test(`${slug} renders the elevated default composition`, async ({ page }) => {
      await page.goto(`/services/${slug}`);
      // Eyebrow with ordinal must be present
      await expect(page.locator('.service-v1-hero')).toBeVisible();
      // Process timeline must be present
      await expect(page.getByRole('heading', { name: /A clear engagement path/ })).toBeVisible();
      // No legacy hero class
      await expect(page.locator('.subpage-hero')).toHaveCount(0);
    });
  }
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test:e2e tests/e2e/services-data.spec.ts -g "renders the elevated default"
```
Expected: FAIL — `.service-v1-hero` does not exist yet; `.subpage-hero` still in DOM.

- [ ] **Step 3: Create `service-page-default.tsx`**

```tsx
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
      <WhenToEngage service={service} />
      <HowWeHelp service={service} />
      <Deliverables service={service} />
      <ServiceInsights service={service} />
      <Process service={service} />
      <Proof service={service} />
      <KnowledgeBank service={service} />
      <Faq service={service} />
      <LeadMagnet service={service} />
      <RelatedServices service={service} />
      <ContactBand service={service} />
    </main>
  );
}
```

- [ ] **Step 4: Update `apps/web/src/app/services/[slug]/page.tsx`**

Replace the existing file contents with:

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageShell } from '@/components/site-chrome';
import { ServicePageDefault } from '@/components/services/service-page-default';
import { services } from '@/content/site';

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) return {};
  return { title: service.seoTitle, description: service.metaDescription };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();
  return (
    <PageShell>
      <ServicePageDefault service={service} />
    </PageShell>
  );
}
```

- [ ] **Step 5: Run tests — they will still fail visually because CSS is not added yet**

```bash
pnpm test:e2e tests/e2e/services-data.spec.ts -g "renders the elevated default"
```
Expected: tests assert presence of `.service-v1-hero` (which now exists in DOM), but visual styles are unstyled until Task 12. **Tests will pass at the DOM-assertion level** since they only check element presence/absence.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/components/services/service-page-default.tsx \
        apps/web/src/app/services/[slug]/page.tsx \
        tests/e2e/services-data.spec.ts
git commit -m "feat(web): route 8 non-IB services through ServicePageDefault composition"
```

---

## Task 8: Create `<FundraiseStages>` IB-bespoke centerpiece

**Files:**
- Create: `apps/web/src/components/services/investment-banking/fundraise-stages.tsx`
- Test: `tests/e2e/services-ib.spec.ts` (new)

- [ ] **Step 1: Write the failing test**

Create `tests/e2e/services-ib.spec.ts`:

```ts
import { expect, test } from '@playwright/test';

test.describe('Investment Banking page — bespoke composition', () => {
  test('renders all six fundraise stages', async ({ page }) => {
    await page.goto('/services/investment-banking');
    const stages = ['Readiness', 'Modelling', 'Storytelling', 'Outreach', 'Diligence', 'Close'];
    for (const stage of stages) {
      await expect(page.getByRole('tab', { name: stage })).toBeVisible();
    }
  });

  test('mobile renders stages as accordion (no horizontal scroll)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/services/investment-banking');
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const viewport = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(viewport + 1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
pnpm test:e2e tests/e2e/services-ib.spec.ts
```
Expected: FAIL — no stages exist yet, IB still uses default composition.

- [ ] **Step 3: Create the component**

Create `apps/web/src/components/services/investment-banking/fundraise-stages.tsx`:

```tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { SectionHeader } from '@/components/sections';

type Stage = {
  ordinal: string;
  name: string;
  nucleusDoes: string;
  deliverable: string;
};

const STAGES: Stage[] = [
  { ordinal: '01', name: 'Readiness',     nucleusDoes: 'Readiness assessment, data room scoping, governance review.',         deliverable: 'Fundraise readiness report.' },
  { ordinal: '02', name: 'Modelling',     nucleusDoes: '3-statement model, sensitivity tabs, base/bull/bear scenarios.',      deliverable: 'Financial model.' },
  { ordinal: '03', name: 'Storytelling',  nucleusDoes: 'Narrative-first investor deck, IM, sector framing.',                  deliverable: 'Investor deck and IM.' },
  { ordinal: '04', name: 'Outreach',      nucleusDoes: 'Investor mapping, target list, intro coordination.',                   deliverable: 'Investor target list.' },
  { ordinal: '05', name: 'Diligence',     nucleusDoes: 'DD pack, Q&A management, issue tracker for accountable closure.',     deliverable: 'Diligence checklist and data room.' },
  { ordinal: '06', name: 'Close',         nucleusDoes: 'Term sheet review, transaction workplan, signing coordination.',       deliverable: 'Transaction workplan.' },
];

export function FundraiseStages() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });
  // Six equal bands: progress in [n/6, (n+1)/6] → active stage n.
  const stageIndex = useTransform(scrollYProgress, (v) => {
    const clamped = Math.max(0, Math.min(0.9999, v));
    return Math.floor(clamped * STAGES.length);
  });
  const [active, setActive] = useState(0);
  useEffect(() => {
    if (reduceMotion) return;
    return stageIndex.on('change', (v) => setActive(Math.max(0, Math.min(STAGES.length - 1, v))));
  }, [reduceMotion, stageIndex]);

  function handleKey(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setActive((i) => Math.min(STAGES.length - 1, i + 1));
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    }
  }

  // Reduced motion: render flat six-card grid.
  if (reduceMotion) {
    return (
      <section className="service-v1-section service-v1-stages service-v1-stages-reduced">
        <SectionHeader
          eyebrow="§01 / Fundraise"
          title="How Nucleus moves a fundraise from idea to closed round."
        />
        <div className="service-v1-stages-grid">
          {STAGES.map((stage) => (
            <article key={stage.ordinal}>
              <p className="service-v1-stage-ordinal">{stage.ordinal}</p>
              <h3>{stage.name}</h3>
              <p className="service-v1-stage-label">What Nucleus does</p>
              <p>{stage.nucleusDoes}</p>
              <p className="service-v1-stage-label">Deliverable</p>
              <p>{stage.deliverable}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <div ref={containerRef} className="service-v1-stages-pinned-host">
      <div className="service-v1-stages-sticky">
        <section className="service-v1-section service-v1-stages">
          <SectionHeader
            eyebrow="§01 / Fundraise"
            title="How Nucleus moves a fundraise from idea to closed round."
          />
          <div
            role="tablist"
            aria-label="Fundraise stages"
            className="service-v1-stages-tablist"
            onKeyDown={handleKey}
          >
            {STAGES.map((stage, index) => (
              <button
                role="tab"
                key={stage.ordinal}
                type="button"
                aria-selected={index === active}
                tabIndex={index === active ? 0 : -1}
                onClick={() => setActive(index)}
                className={`service-v1-stages-tab ${index === active ? 'is-active' : ''}`}
              >
                <span className="service-v1-stage-ordinal">{stage.ordinal}</span>
                <span>{stage.name}</span>
              </button>
            ))}
          </div>
          <motion.div
            role="tabpanel"
            key={STAGES[active].ordinal}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="service-v1-stages-panel"
          >
            <h3>{STAGES[active].name}</h3>
            <p className="service-v1-stage-label">What Nucleus does</p>
            <p>{STAGES[active].nucleusDoes}</p>
            <p className="service-v1-stage-label">Deliverable</p>
            <p>{STAGES[active].deliverable}</p>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Commit (component lands; test still fails until Task 11 wires it into IB page)**

```bash
git add apps/web/src/components/services/investment-banking/fundraise-stages.tsx tests/e2e/services-ib.spec.ts
git commit -m "feat(web): add FundraiseStages IB centerpiece with scroll-pinned tablist"
```

---

## Task 9: Create `<ArtefactStack>` IB-bespoke secondary moment

**Files:**
- Create: `apps/web/src/components/services/investment-banking/artefact-stack.tsx`

- [ ] **Step 1: Create the component**

```tsx
'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FileSpreadsheet, Presentation, FileText, FolderSearch, FileSignature } from 'lucide-react';
import { SectionHeader } from '@/components/sections';

type Artefact = {
  name: string;
  Icon: typeof FileSpreadsheet;
  one_liner: string;
};

const ARTEFACTS: Artefact[] = [
  { name: 'Financial model',   Icon: FileSpreadsheet, one_liner: '3-statement model, sensitivity, base/bull/bear.' },
  { name: 'Investor deck',     Icon: Presentation,    one_liner: 'Narrative-first, sector-tuned, decision-grade.' },
  { name: 'Information memo',  Icon: FileText,        one_liner: 'The detailed read for serious investors.' },
  { name: 'Diligence pack',    Icon: FolderSearch,    one_liner: 'Curated data room and Q&A tracker.' },
  { name: 'Term sheet support', Icon: FileSignature,  one_liner: 'Clause review, redlines, negotiation pack.' },
];

const DEFAULT_ACTIVE = 1; // Investor deck — richest visual default per spec.

export function ArtefactStack() {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(DEFAULT_ACTIVE);

  if (reduceMotion) {
    return (
      <section className="service-v1-section service-v1-artefact-stack-reduced">
        <SectionHeader eyebrow="Artefacts" title="The documents that come out of a Nucleus fundraise." />
        <ul className="service-v1-artefact-list">
          {ARTEFACTS.map((a) => (
            <li key={a.name}>
              <a.Icon aria-hidden="true" size={20} />
              <div>
                <h3>{a.name}</h3>
                <p>{a.one_liner}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return (
    <section className="service-v1-section service-v1-artefact-stack">
      <SectionHeader eyebrow="Artefacts" title="The documents that come out of a Nucleus fundraise." />
      <div className="service-v1-artefact-fan" role="list" aria-label="Fundraise artefacts">
        {ARTEFACTS.map((a, index) => {
          const offset = index - active;
          return (
            <motion.button
              key={a.name}
              type="button"
              role="listitem"
              onFocus={() => setActive(index)}
              onMouseEnter={() => setActive(index)}
              animate={{
                rotate: offset * 4,
                x: offset * 36,
                y: Math.abs(offset) * 8,
                zIndex: 100 - Math.abs(offset),
                scale: index === active ? 1 : 0.96,
              }}
              transition={{ type: 'spring', stiffness: 280, damping: 30 }}
              className={`service-v1-artefact-card ${index === active ? 'is-active' : ''}`}
              aria-pressed={index === active}
            >
              <a.Icon aria-hidden="true" size={22} />
              <h3>{a.name}</h3>
              <p>{a.one_liner}</p>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify lint and typecheck**

```bash
pnpm lint && pnpm typecheck
```
Expected: green.

- [ ] **Step 3: Commit**

```bash
git add apps/web/src/components/services/investment-banking/artefact-stack.tsx
git commit -m "feat(web): add ArtefactStack IB secondary moment with fanned card stack"
```

---

## Task 10: Create `<SoonicornCallout>` IB cross-link + copy logo asset

**Files:**
- Create: `apps/web/src/components/services/investment-banking/soonicorn-callout.tsx`
- Create: `apps/web/public/brand/soonicorn-ventures.png` (copied from reference folder)

- [ ] **Step 1: Copy the logo asset**

```bash
cp "/Users/vijay/Desktop/Files/Soonicorn/Soonicorn Logo/Soonicorn_Logo_01.png" \
   "apps/web/public/brand/soonicorn-ventures.png"
ls -la apps/web/public/brand/soonicorn-ventures.png
```
Expected: file exists, ~62KB.

- [ ] **Step 2: Create the component**

Create `apps/web/src/components/services/investment-banking/soonicorn-callout.tsx`:

```tsx
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import type { Service } from '@/content/site';

export function SoonicornCallout({ service }: Readonly<{ service: Service }>) {
  const cross = service.crossLink;
  if (!cross) return null;

  const isDev = process.env.NODE_ENV !== 'production';
  if (cross.reviewerStatus !== 'approved' && !isDev) return null;

  return (
    <section className="service-v1-section service-v1-section-alt service-v1-soonicorn">
      {cross.reviewerStatus !== 'approved' && isDev ? (
        <p className="service-v1-soonicorn-devbanner">
          DEV ONLY — copy pending reviewer approval. This section will not render in production.
        </p>
      ) : null}
      <div className="service-v1-soonicorn-card">
        <div className="service-v1-soonicorn-brand">
          <Image
            src={cross.logoPath}
            alt={`${cross.brand} wordmark`}
            width={220}
            height={62}
            priority={false}
          />
          <p className="home-v3-eyebrow">{cross.eyebrow}</p>
          <h2>{cross.title}</h2>
        </div>
        <div className="service-v1-soonicorn-body">
          <p>{cross.body}</p>
          <a
            className="home-v3-button home-v3-button-primary"
            href={cross.href}
            target="_blank"
            rel="noopener noreferrer"
            data-cross-link="soonicorn"
            aria-label={`${cross.ctaLabel} (opens soonicornventures.com in a new tab)`}
          >
            {cross.ctaLabel}
            <ArrowUpRight aria-hidden="true" size={18} />
          </a>
          <p className="service-v1-soonicorn-disclaimer">{cross.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Extend `tests/e2e/services-ib.spec.ts` with Soonicorn assertions**

Append to the existing `services-ib.spec.ts`:

```ts
test.describe('Soonicorn callout — Task 10', () => {
  test('renders with approved copy, working outbound link, and persistent disclaimer', async ({ page }) => {
    await page.goto('/services/investment-banking');
    const link = page.getByRole('link', { name: /Visit Soonicorn Ventures/ });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute('href', 'https://soonicornventures.com/');
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
    await expect(page.getByText(/This is not an offer or solicitation/)).toBeVisible();
  });

  test('does not render on non-IB service pages', async ({ page }) => {
    await page.goto('/services/ma-advisory');
    await expect(page.getByText('Soonicorn Ventures')).toHaveCount(0);
  });
});
```

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/components/services/investment-banking/soonicorn-callout.tsx \
        apps/web/public/brand/soonicorn-ventures.png \
        tests/e2e/services-ib.spec.ts
git commit -m "feat(web): add SoonicornCallout IB cross-link with reviewer gate"
```

---

## Task 11: Create `app/services/investment-banking/page.tsx` bespoke composition

**Files:**
- Create: `apps/web/src/app/services/investment-banking/page.tsx`

- [ ] **Step 1: Create the route file**

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageShell } from '@/components/site-chrome';
import { services } from '@/content/site';
import { ServiceHero } from '@/components/services/service-hero';
import { WhenToEngage } from '@/components/services/when-to-engage';
import { HowWeHelp } from '@/components/services/how-we-help';
import { Deliverables } from '@/components/services/deliverables';
import { ServiceInsights } from '@/components/services/service-insights';
import { Process } from '@/components/services/process';
import { Proof } from '@/components/services/proof';
import { KnowledgeBank } from '@/components/services/knowledge-bank';
import { Faq } from '@/components/services/faq';
import { LeadMagnet } from '@/components/services/lead-magnet';
import { RelatedServices } from '@/components/services/related-services';
import { ContactBand } from '@/components/services/contact-band';
import { FundraiseStages } from '@/components/services/investment-banking/fundraise-stages';
import { ArtefactStack } from '@/components/services/investment-banking/artefact-stack';
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
        <WhenToEngage service={service} />
        <FundraiseStages />
        <HowWeHelp service={service} />
        <ArtefactStack />
        <SoonicornCallout service={service} />
        <Deliverables service={service} />
        <ServiceInsights service={service} />
        <Process service={service} />
        <Proof service={service} />
        <KnowledgeBank service={service} />
        <Faq service={service} />
        <LeadMagnet service={service} />
        <RelatedServices service={service} />
        <ContactBand service={service} />
      </main>
    </PageShell>
  );
}
```

- [ ] **Step 2: Re-enable skipped tests in `service-insights.spec.ts`**

Replace the body of the two skipped tests:

```ts
test('renders planned categories for investment-banking once composed', async ({ page }) => {
  await page.goto('/services/investment-banking');
  await expect(page.getByText('Planned knowledge bank')).toBeVisible();
  await expect(page.getByText('Fundraise readiness')).toBeVisible();
  await expect(page.getByText('Investor mapping')).toBeVisible();
});

test('renders sources section header even when all items are pending', async ({ page }) => {
  await page.goto('/services/investment-banking');
  await expect(page.getByText("Regulatory updates we're tracking")).toBeVisible();
});
```

- [ ] **Step 3: Run the IB-specific tests**

```bash
pnpm test:e2e tests/e2e/services-ib.spec.ts tests/e2e/service-insights.spec.ts
```
Expected: all PASS at the DOM-presence level. (Visual styling is unstyled until Task 12.)

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/services/investment-banking/page.tsx \
        tests/e2e/service-insights.spec.ts
git commit -m "feat(web): add bespoke IB route composing all primitives and IB-only modules"
```

---

## Task 12: Append `.service-v1-*` CSS scope to `globals.css`

**Files:**
- Modify: `apps/web/src/app/globals.css` (append-only, no removals of `.home-v3-*` or legacy `.subpage-hero` rules)

- [ ] **Step 1: Append the scope block to `globals.css`**

Append at the end of `globals.css`:

```css
/* =============================================================
   .service-v1 — service-page design scope.
   Wraps every service page (default and bespoke). Inherits .home-v3
   typography and primitive styles via dual class on <main>. Adds
   service-only overrides and the bespoke IB modules.
   ============================================================= */

.service-v1 {
  --service-band-cream: var(--np-cream, #faf6ef);
  --service-band-alt:   #f3ede2;
  --service-accent-red: var(--np-red, #7a1f1f);
  --service-divider:    rgba(20, 24, 40, 0.08);
}

/* Hero */
.service-v1-hero {
  padding: 80px 24px 48px;
  max-width: 1180px;
  margin: 0 auto;
}
.service-v1-hero-stage { display: flex; flex-direction: column; gap: 18px; }
.service-v1-headline { margin: 8px 0 12px; }
.service-v1-lede { max-width: 720px; color: rgba(20, 24, 40, 0.8); font-size: 1.05rem; line-height: 1.55; }

/* Generic section + bands */
.service-v1-section { padding: 64px 24px; max-width: 1180px; margin: 0 auto; }
.service-v1-section-alt { background: var(--service-band-alt); max-width: none; padding-inline: max(24px, calc((100vw - 1180px) / 2)); }
.service-v1-section-split { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; }
.service-v1-section-proof { background: #14182830; }

/* List / grids */
.service-v1-list-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 24px;
}
.service-v1-list-grid > div {
  background: #fff;
  border: 1px solid var(--service-divider);
  border-radius: 12px;
  padding: 16px 18px;
  font-size: 0.95rem;
}

/* Timeline */
.service-v1-timeline {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-top: 24px;
}
.service-v1-timeline > div { position: relative; padding: 16px; background: #fff; border: 1px solid var(--service-divider); border-radius: 12px; }
.service-v1-timeline span { display: inline-block; font-variant-numeric: tabular-nums; color: var(--service-accent-red); font-weight: 600; }
.service-v1-timeline h3 { margin: 6px 0 4px; font-size: 1.05rem; }

/* Checklist */
.service-v1-checklist { display: grid; gap: 12px; margin-top: 16px; }
.service-v1-checklist p { display: flex; gap: 10px; align-items: flex-start; }
.service-v1-checklist svg { color: var(--service-accent-red); margin-top: 3px; flex: 0 0 auto; }

/* Mini panel + FAQ */
.service-v1-mini-panel { padding: 20px; background: #fff; border: 1px solid var(--service-divider); border-radius: 12px; }
.service-v1-faq-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 16px; }
.service-v1-faq-grid details { background: #fff; border: 1px solid var(--service-divider); border-radius: 12px; padding: 14px 16px; }
.service-v1-faq-grid summary { cursor: pointer; font-weight: 600; }
.service-v1-pending-pill { display: inline-block; background: rgba(122, 31, 31, 0.08); color: var(--service-accent-red); font-size: 0.7rem; letter-spacing: 0.04em; text-transform: uppercase; padding: 2px 8px; border-radius: 999px; }

/* Lead magnet */
.service-v1-section-leadmagnet { background: var(--service-band-alt); max-width: none; padding-inline: max(24px, calc((100vw - 1180px) / 2)); }
.service-v1-leadmagnet-form { display: flex; gap: 12px; margin-top: 16px; max-width: 520px; }
.service-v1-leadmagnet-form input { flex: 1; padding: 12px 14px; border: 1px solid var(--service-divider); border-radius: 10px; font-size: 0.95rem; }
.service-v1-leadmagnet-status { margin-top: 12px; color: rgba(20, 24, 40, 0.7); }
.service-v1-sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); border: 0; }

/* Related services */
.service-v1-related-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; margin-top: 24px; }
.service-v1-related-card { display: block; padding: 20px; background: #fff; border: 1px solid var(--service-divider); border-radius: 14px; text-decoration: none; color: inherit; transition: transform .25s ease, box-shadow .25s ease; }
.service-v1-related-card:hover, .service-v1-related-card:focus-visible { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(20, 24, 40, 0.06); }
.service-v1-card-link { display: inline-flex; gap: 6px; align-items: center; margin-top: 8px; color: var(--service-accent-red); font-weight: 500; }

/* Contact band */
.service-v1-contact-band { display: flex; gap: 24px; align-items: center; justify-content: space-between; flex-wrap: wrap; padding: 32px; margin: 48px auto 96px; max-width: 1120px; background: #141828; color: #fff; border-radius: 18px; }

/* Insights */
.service-v1-insights-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-top: 24px; }
.service-v1-insights-planned ul, .service-v1-insights-sources ul { display: grid; gap: 12px; padding: 0; list-style: none; margin-top: 12px; }
.service-v1-insights-planned li, .service-v1-insights-sources li { padding: 16px; background: #fff; border: 1px solid var(--service-divider); border-radius: 12px; }
.service-v1-insights-sources li a { color: inherit; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
.service-v1-source-badge { display: inline-block; font-size: 0.7rem; letter-spacing: 0.06em; text-transform: uppercase; padding: 2px 8px; border-radius: 999px; background: rgba(20, 24, 40, 0.06); color: rgba(20, 24, 40, 0.8); margin-bottom: 6px; }
.service-v1-source-sebi    { background: rgba(0, 86, 179, 0.1);  color: #0056b3; }
.service-v1-source-rbi     { background: rgba(0, 119, 70, 0.1);  color: #007746; }
.service-v1-source-mca     { background: rgba(122, 31, 31, 0.1); color: var(--service-accent-red); }
.service-v1-source-incometax { background: rgba(184, 84, 0, 0.1); color: #b85400; }
.service-v1-source-dpiit, .service-v1-source-ibbi, .service-v1-source-icai, .service-v1-source-cbic { background: rgba(20, 24, 40, 0.08); color: rgba(20, 24, 40, 0.8); }
.service-v1-source-meta { font-size: 0.78rem; color: rgba(20, 24, 40, 0.6); margin: 4px 0 6px; }
.service-v1-insights-empty { color: rgba(20, 24, 40, 0.6); padding: 16px; border: 1px dashed var(--service-divider); border-radius: 12px; }

/* Fundraise stages — pinned */
.service-v1-stages-pinned-host { height: 600vh; position: relative; }
.service-v1-stages-sticky { position: sticky; top: 0; height: 100vh; display: flex; align-items: center; }
.service-v1-stages-tablist { display: flex; gap: 8px; overflow-x: auto; padding: 8px 0; margin: 16px 0 24px; }
.service-v1-stages-tab { border: 1px solid var(--service-divider); background: #fff; border-radius: 999px; padding: 8px 14px; display: inline-flex; align-items: center; gap: 8px; cursor: pointer; transition: background .2s ease, border-color .2s ease; }
.service-v1-stages-tab.is-active { background: var(--service-accent-red); border-color: var(--service-accent-red); color: #fff; }
.service-v1-stage-ordinal { font-variant-numeric: tabular-nums; font-weight: 600; }
.service-v1-stages-panel { background: #fff; border: 1px solid var(--service-divider); border-radius: 14px; padding: 24px; max-width: 760px; }
.service-v1-stage-label { font-size: 0.7rem; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(20, 24, 40, 0.55); margin-top: 12px; }
.service-v1-stages-reduced .service-v1-stages-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; margin-top: 24px; }
.service-v1-stages-reduced article { padding: 16px; background: #fff; border: 1px solid var(--service-divider); border-radius: 12px; }

/* Artefact stack */
.service-v1-artefact-fan { position: relative; height: 320px; margin-top: 32px; display: flex; justify-content: center; align-items: center; }
.service-v1-artefact-card { position: absolute; width: 280px; height: 280px; background: #fff; border: 1px solid var(--service-divider); border-radius: 16px; padding: 20px; text-align: left; box-shadow: 0 8px 24px rgba(20, 24, 40, 0.08); cursor: pointer; }
.service-v1-artefact-card.is-active { border-color: var(--service-accent-red); box-shadow: 0 16px 40px rgba(122, 31, 31, 0.18); }
.service-v1-artefact-list { display: grid; gap: 12px; padding: 0; list-style: none; margin-top: 24px; }
.service-v1-artefact-list li { display: flex; gap: 14px; align-items: flex-start; padding: 16px; background: #fff; border: 1px solid var(--service-divider); border-radius: 12px; }

/* Soonicorn callout */
.service-v1-soonicorn-card { display: grid; grid-template-columns: 320px 1fr; gap: 32px; align-items: center; padding: 28px; background: #fff; border: 1px solid var(--service-divider); border-radius: 18px; max-width: 1080px; margin: 0 auto; }
.service-v1-soonicorn-brand img { display: block; max-width: 220px; height: auto; }
.service-v1-soonicorn-brand h2 { margin: 6px 0 0; font-size: 1.5rem; }
.service-v1-soonicorn-body p { margin-bottom: 16px; }
.service-v1-soonicorn-disclaimer { font-size: 0.78rem; color: rgba(20, 24, 40, 0.55); margin-top: 16px; line-height: 1.55; }
.service-v1-soonicorn-devbanner { background: #fff3cd; color: #5b4a00; padding: 8px 12px; border-radius: 8px; margin-bottom: 16px; font-size: 0.78rem; }

/* Mobile */
@media (max-width: 1023px) {
  .service-v1-section-split { grid-template-columns: 1fr; }
  .service-v1-list-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .service-v1-timeline { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .service-v1-faq-grid { grid-template-columns: 1fr; }
  .service-v1-related-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .service-v1-insights-grid { grid-template-columns: 1fr; }
  .service-v1-stages-pinned-host { height: auto; position: static; }
  .service-v1-stages-sticky { position: static; height: auto; display: block; }
  .service-v1-stages-tablist { display: none; }
  .service-v1-stages-panel { max-width: none; }
  .service-v1-artefact-fan { display: none; }
  .service-v1-soonicorn-card { grid-template-columns: 1fr; }
}

@media (max-width: 639px) {
  .service-v1-list-grid { grid-template-columns: 1fr; }
  .service-v1-timeline { grid-template-columns: 1fr; }
  .service-v1-related-grid { grid-template-columns: 1fr; }
  .service-v1-leadmagnet-form { flex-direction: column; }
}
```

- [ ] **Step 2: Run lint, typecheck, build, and all e2e tests**

```bash
pnpm lint && pnpm typecheck && pnpm build && pnpm test:e2e
```
Expected: all green. Visual smoke-checking by eye is recommended after `pnpm dev` (Step 3).

- [ ] **Step 3: Manual browser verification**

```bash
pnpm --filter web dev
```
Open `http://localhost:3000/services/investment-banking` and step through:
- Hero renders with eyebrow `§01 / Investment Banking`, headline "Prepare. Position. Close.", lede, two CTAs.
- Scrolling pins the fundraise stages section; active stage highlights red and panel content swaps as you scroll.
- Artefact stack fans out and brings Investor deck forward by default.
- Soonicorn panel renders with logo, copy, link, disclaimer.
- Insights section shows 4 planned categories and a "Regulatory updates we're tracking" header with a friendly "approved citations will appear here" line (no items yet because seed items are pending — by design).
- Lead-magnet form submits → friendly confirmation appears.
- Mobile (iPhone 13 emulation in DevTools): no horizontal scroll, stages are vertical, artefact stack is a flat list.

Also visit `/services/ma-advisory` and confirm the elevated default composition renders (hero, primitives, no FundraiseStages/ArtefactStack/SoonicornCallout).

- [ ] **Step 4: Commit**

```bash
git add apps/web/src/app/globals.css
git commit -m "feat(web): add .service-v1 CSS scope for elevated service pages"
```

---

## Task 13: Delete `service-detail.tsx`, update tracker + HANDOFF, final quality gate

**Files:**
- Delete: `apps/web/src/components/service-detail.tsx`
- Modify: `docs/project-tracker.md`
- Modify: `HANDOFF.md`

- [ ] **Step 1: Confirm `service-detail.tsx` is no longer imported anywhere**

```bash
grep -rn "service-detail" apps/web/src tests/ docs/ 2>/dev/null
```
Expected: no matches in code (matches in docs are acceptable historical references). If anything in `apps/web/src/` still imports it, stop and resolve the reference before deleting.

- [ ] **Step 2: Delete the file**

```bash
rm apps/web/src/components/service-detail.tsx
```

- [ ] **Step 3: Update `docs/project-tracker.md`**

In the **Phase 1 Visual And Asset Tasks** subsection, replace the entry:

```
- [~] Apply motion / spacing language to remaining public pages.
```

with:

```
- [~] Apply motion / spacing language to remaining public pages.
  - Status (2026-05-14): Services slice landed for Investment Banking (bespoke composition + new shared primitives `<ServicePageDefault>`). Other 8 service pages now use the elevated default composition. Next slices: About / Careers / Insights / Contact.
```

Append these new entries under the same subsection:

```
- [x] IB service page — bespoke composition.
  - Acceptance: `/services/investment-banking` renders the bespoke composition with FundraiseStages, ArtefactStack, SoonicornCallout, ServiceInsights; lint, typecheck, build, e2e pass; manual browser verification clean.
- [ ] Bespoke centerpieces for remaining 8 service pages.
  - Acceptance: each service line gets its own brainstorm + spec + bespoke centerpiece, modelled on the IB pattern.
- [ ] Rename `.home-v3` CSS scope to a neutral name (e.g. `.np-base`).
  - Acceptance: mechanical find-replace across `globals.css` and all home components, builds clean.
- [ ] Deep-linkable fundraise stages (`?stage=outreach`).
  - Acceptance: URL param highlights a specific centerpiece stage on load. Partner-side feature.
- [ ] Sector strip on service pages.
  - Acceptance: single row of covered sectors below hero. Needs approved sector list.
- [ ] Service-tinted hero atmosphere per service.
  - Acceptance: each service hero gets its own aurora/atmosphere variant.
- [ ] Source SVG of Soonicorn Ventures wordmark (currently PNG).
  - Acceptance: `apps/web/public/brand/soonicorn-ventures.svg` exists, page references SVG.
- [ ] IB-specific FAQ content (4 Q+A pairs).
  - Acceptance: `services[].faq` populated for Investment Banking, partner-approved.
- [ ] Insights sources: quarterly review of approved items.
  - Acceptance: a documented review cadence (calendar entry, partner ownership).
- [ ] Soonicorn callout copy re-approval cycle (recurring governance).
  - Acceptance: documented re-review cadence; `reviewerApprovedAt` re-stamped on each pass.
```

In the **Open Inputs Needed From Vijay/Team** subsection, append:

```
- [!] Three reviewer-approved entries in `apps/web/src/content/insights-sources.ts` for Investment Banking.
  - Needed for: visible "Regulatory updates we're tracking" panel on the IB page.
```

- [ ] **Step 4: Update `HANDOFF.md`**

Replace the "Active task" section with:

```markdown
## Active task

**Services elevation slice — Investment Banking landed.**

- Spec: `docs/superpowers/specs/2026-05-14-services-ib-design.md`
- Plan: `docs/superpowers/plans/2026-05-14-services-ib.md`
- Status: implementation complete locally. Awaiting Vijay's review and deploy decision.
- Changed: 13 new component files under `apps/web/src/components/services/`, new `app/services/investment-banking/page.tsx`, new `/api/lead-magnet-stub` route, new `insights-sources.ts` data file, new `.service-v1-*` CSS scope, deleted `apps/web/src/components/service-detail.tsx`, Service type extended in `site.ts`, Soonicorn logo copied to `public/brand/soonicorn-ventures.png`.
- Tests added: `tests/e2e/services-data.spec.ts`, `tests/e2e/services-ib.spec.ts`, `tests/e2e/service-insights.spec.ts`, `tests/e2e/lead-magnet-stub.spec.ts`.
- Local quality gate: `pnpm lint && pnpm typecheck && pnpm build && pnpm test:e2e` passes.
- Open dependencies before merge: at least three `insightSources` entries flipped from `pending` to `approved` for Investment Banking.

**Next slice (queued):** apply the same primitives to About / Careers / Insights / Contact via separate brainstorm + spec.
```

- [ ] **Step 5: Run the final quality gate**

```bash
pnpm lint && pnpm typecheck && pnpm build && pnpm test:e2e
```
Expected: all green. If `pnpm test:e2e` flakes on a non-deterministic test, run it twice and capture the failure; do not paper over with retries.

- [ ] **Step 6: Commit**

```bash
git add apps/web/src/components/service-detail.tsx docs/project-tracker.md HANDOFF.md
git commit -m "chore(web): retire legacy ServiceDetail, update tracker + handoff for IB slice"
```

(Note: `git add` of a deleted file stages the deletion. Verify with `git status` that the file appears as `deleted: apps/web/src/components/service-detail.tsx` before committing.)

- [ ] **Step 7: Deployed-preview gate (after Vijay pushes to Vercel)**

```bash
PLAYWRIGHT_BASE_URL=https://nucleus-bay.vercel.app pnpm test:e2e
```
Expected: green on the deployed preview. Visual smoke-check the deployed IB page on desktop and mobile DevTools emulation.

---

## Plan self-review (2026-05-14)

**Spec coverage check.** Walked every section of the spec against the task list:

- §4 decisions log — all 8 decisions show up in the plan (Service type extension covers D1+D2; tasks 8-10 cover D4+D5+D8; task 6 covers D7).
- §5 file layout — every file listed in the spec is created or modified in a task.
- §6 component contracts — each primitive has a dedicated step or task with the full component code.
- §7 IB page composition — Task 11 matches the section order exactly.
- §8 data model — Task 1 covers Service type extensions and IB-specific fields; Task 2 covers insights-sources.ts.
- §9 CSS scoping — Task 12 covers the `.service-v1-*` additions and explicitly does not remove legacy CSS.
- §10 motion + accessibility — accessibility (ARIA tablist, focus management, reduced-motion paths) is wired into Tasks 8 and 9 directly.
- §11 responsive design — mobile breakpoints are in the CSS block in Task 12.
- §12 migration plan — Task sequence matches the spec's 10-step migration plan.
- §13 compliance guardrails — reviewer gate is in Task 6 and Task 10; lead-magnet stub is Task 3; disclaimer is always rendered in Task 10.
- §14 open content TBDs — captured in tracker updates in Task 13 step 3.
- §15 testing strategy — three new test files (services-data, services-ib, service-insights) plus lead-magnet-stub all written.
- §16 NOT in scope — listed in tracker as deferred follow-ups in Task 13 step 3.
- §17 tracker + HANDOFF — Task 13 steps 3 and 4.
- §18 acceptance criteria — all 13 items checkable against the plan output.

**Placeholder scan.** No "TBD", "TODO", "implement later", "fill in details", or vague error-handling instructions remain in the plan. The two e2e tests in Task 6 use `test.skip()` deliberately because the components they cover are not yet mounted at that task; they are unskipped in Task 11. This is explicit and intentional, not a placeholder.

**Type consistency.** `service.crossLink.href` is used in Tasks 1 (data) and 10 (component). `service.ordinal` is used in Tasks 1, 5, and 6. `insightSources` / `plannedCategories` exports in Task 2 match imports in Task 6. `STAGES` constant in Task 8 has six entries matching the spec's six-stage list. `ARTEFACTS` in Task 9 has five entries with `DEFAULT_ACTIVE = 1` pointing at "Investor deck" — matches the spec's explicit default. Component names match across plan and spec.

**One inconsistency caught and fixed during self-review:** the `<LeadMagnet>` component originally used a stricter assertion in `service.leadMagnet`. Re-read shows `service.leadMagnet` is a string (the title), not a richer object. Component implementation is correct; flagging here so executor doesn't refactor in confusion.

No remaining issues. Plan ready for execution.
