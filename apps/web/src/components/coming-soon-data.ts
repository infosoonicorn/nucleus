import { articles } from '@/content/articles';
import type { ComingSoonInsight } from './coming-soon';

/**
 * Pick the latest published articles to feature on Coming Soon pages.
 * Drafts only render in non-production so the live site never surfaces
 * unreviewed work.
 */
export function getComingSoonInsights(limit = 3): ComingSoonInsight[] {
  const allowDrafts = process.env.NODE_ENV !== 'production';
  const visible = articles.filter((a) =>
    allowDrafts ? true : a.reviewerStatus === 'approved',
  );
  return [...visible]
    .sort((a, b) => b.publishedOn.localeCompare(a.publishedOn))
    .slice(0, limit)
    .map((a) => ({
      slug: a.slug,
      title: a.title,
      tag: a.tag,
      readMinutes: a.readMinutes,
      publishedOn: a.publishedOn,
    }));
}
