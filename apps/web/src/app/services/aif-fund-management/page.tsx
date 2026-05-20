import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ServicePageDefault } from '@/components/services/service-page-default';
import { HomeDepth } from '@/components/home/depth';
import { services } from '@/content/site';

// AIF & Fund Management has its own page route (vs. catching the slug
// in [slug]/page.tsx) so we can insert the "AIF operating proof" block
// — originally on /home — directly into the main column. Everything
// else is the default service composition.
const SLUG = 'aif-fund-management';

export function generateMetadata(): Metadata {
  const service = services.find((item) => item.slug === SLUG);
  if (!service) return {};
  return { title: service.seoTitle, description: service.metaDescription };
}

export default function AifFundManagementPage() {
  const service = services.find((item) => item.slug === SLUG);
  if (!service) notFound();
  return (
    <ServicePageDefault
      service={service}
      extraSection={<HomeDepth />}
      hideProof
    />
  );
}
