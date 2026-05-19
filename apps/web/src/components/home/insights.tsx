import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/motion-primitives';
import { articles, getArticleAuthor } from '@/content/articles';
import { HomeInsightsGrid, type InsightCard } from './insights-grid';

const CARD_LIMIT = 4;

function pickInsights(): InsightCard[] {
  // Mirror the production gate used on /insights: drafts visible in
  // dev only, approved articles in production. Section auto-hides
  // when nothing's available — see HomeInsights below.
  const allowDrafts = process.env.NODE_ENV !== 'production';
  const visible = articles.filter((a) =>
    allowDrafts ? true : a.reviewerStatus === 'approved',
  );
  if (visible.length === 0) return [];

  const sorted = [...visible].sort((a, b) =>
    b.publishedOn.localeCompare(a.publishedOn),
  );

  return sorted.slice(0, CARD_LIMIT).map((a) => {
    let authorName = '';
    try {
      authorName = getArticleAuthor(a).name;
    } catch {
      authorName = '';
    }
    return {
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      tag: a.tag,
      publishedOn: a.publishedOn,
      readMinutes: a.readMinutes,
      thumbnailSrc: a.thumbnailSrc ?? null,
      authorName,
    };
  });
}

export function HomeInsights() {
  const cards = pickInsights();
  // Auto-hide in production when no reviewer-approved articles exist
  // yet. Avoids a blank section on partner go-live.
  if (cards.length === 0) return null;

  return (
    <section className="home-v3-insights" aria-label="Insights from Nucleus partners">
      <Reveal>
        <div className="home-v3-section-header">
          <span className="home-v3-section-eyebrow">Insights</span>
          <h2>Long-form writing from Nucleus partners.</h2>
          <p>
            Practitioner-authored deep-dives across our nine practices — the
            same partners who run mandates writing about how they think.
          </p>
        </div>
      </Reveal>

      <HomeInsightsGrid cards={cards} />

      <div className="home-v3-insights-foot">
        <Link
          className="home-v3-button home-v3-button-primary home-v3-insights-cta"
          href="/insights"
        >
          See all insights
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </div>
    </section>
  );
}
