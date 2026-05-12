import type { MetadataRoute } from 'next';
import { services } from '@/content/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://nucleusadvisors.in';
  const routes = [
    '',
    '/about',
    '/services',
    '/careers',
    '/careers/life-at-nucleus',
    '/careers/alumni',
    '/insights',
    '/insights/live-updates',
    '/downloads',
    '/contact',
    ...services.map((service) => `/services/${service.slug}`),
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));
}
