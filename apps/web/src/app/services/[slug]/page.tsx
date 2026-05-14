import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageShell } from '@/components/site-chrome';
import { ServiceDetail } from '@/components/service-detail';
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

  if (!service) {
    return {};
  }

  return {
    title: service.seoTitle,
    description: service.metaDescription,
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);

  if (!service) {
    notFound();
  }

  return (
    <PageShell>
      {service.slug === 'investment-banking' ? (
        <ServiceDetail service={service} />
      ) : (
        <ServicePageDefault service={service} />
      )}
    </PageShell>
  );
}
