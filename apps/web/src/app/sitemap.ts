import type { MetadataRoute } from 'next';
import { articles } from '@/content/articles';
import { team } from '@/content/team';
import { services } from '@/content/site';

/**
 * Auto-generated sitemap.xml served at `/sitemap.xml`. Lists every
 * indexable page so Google can crawl the depth of the site: static
 * routes, service pages, individual articles, author archives, and
 * topic landing pages.
 *
 * Production excludes pending-review articles and any partner with
 * no approved articles. Dev includes everything so the reviewer
 * flow can preview the full inventory.
 */
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nucleusadvisors.in';

export default function sitemap(): MetadataRoute.Sitemap {
  const allowDrafts = process.env.NODE_ENV !== 'production';
  const visible = articles.filter(
    (a) => allowDrafts || a.reviewerStatus === 'approved',
  );
  const now = new Date();

  // ─── Static pages ─────────────────────────────────────────────────
  const staticRoutes: Array<{ path: string; priority: number; freq: MetadataRoute.Sitemap[number]['changeFrequency'] }> = [
    { path: '', priority: 1.0, freq: 'weekly' },
    { path: '/about', priority: 0.7, freq: 'monthly' },
    { path: '/services', priority: 0.8, freq: 'monthly' },
    { path: '/team', priority: 0.8, freq: 'monthly' },
    // Coming-soon shells — keep indexable but low priority until built.
    { path: '/careers', priority: 0.3, freq: 'monthly' },
    { path: '/careers/life-at-nucleus', priority: 0.2, freq: 'monthly' },
    { path: '/careers/alumni', priority: 0.2, freq: 'monthly' },
    { path: '/insights', priority: 0.9, freq: 'weekly' },
    { path: '/insights/live-updates', priority: 0.5, freq: 'weekly' },
    { path: '/downloads', priority: 0.5, freq: 'monthly' },
    { path: '/contact', priority: 0.6, freq: 'monthly' },
  ];
  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }));

  // ─── Service pages ────────────────────────────────────────────────
  const serviceEntries: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${SITE_URL}/services/${s.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // ─── Individual article pages ────────────────────────────────────
  const articleEntries: MetadataRoute.Sitemap = visible.map((a) => ({
    url: `${SITE_URL}/insights/${a.slug}`,
    lastModified: new Date(`${a.publishedOn}T00:00:00Z`),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // ─── Author archive pages ────────────────────────────────────────
  const authoredSlugs = new Set(visible.map((a) => a.authorSlug));
  const authorEntries: MetadataRoute.Sitemap = team
    .filter((m) => allowDrafts || authoredSlugs.has(m.slug))
    .map((m) => ({
      url: `${SITE_URL}/insights/by/${m.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

  // ─── Topic landing pages ─────────────────────────────────────────
  const tagSet = new Set<string>();
  for (const a of visible) tagSet.add(a.tag);
  const topicEntries: MetadataRoute.Sitemap = Array.from(tagSet).map((tag) => ({
    url: `${SITE_URL}/insights/topic/${encodeURIComponent(tag)}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    ...staticEntries,
    ...serviceEntries,
    ...articleEntries,
    ...authorEntries,
    ...topicEntries,
  ];
}
