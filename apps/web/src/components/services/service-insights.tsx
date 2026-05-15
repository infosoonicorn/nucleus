import Link from 'next/link';
import { ArrowUpRight, Clock } from 'lucide-react';
import { SectionHeader } from '@/components/sections';
import { getArticlesForService } from '@/content/articles';
import type { Service } from '@/content/site';

const MAX_CARDS = 6;

export function ServiceInsights({ service }: Readonly<{ service: Service }>) {
  // In development, surface drafts so partners can review unreviewed articles
  // on the page. In production, only `reviewerStatus: 'approved'` items render.
  const allowDrafts = process.env.NODE_ENV !== 'production';
  const articles = getArticlesForService(service.slug, { allowDrafts }).slice(0, MAX_CARDS);

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="service-v1-section service-v1-articles">
      <SectionHeader
        eyebrow={`§${service.ordinal} / Insights`}
        title="Notes from the desk."
        text="Long-form writing from Nucleus partners — fundraise mechanics, term sheets, deal observations."
      />

      <div className="service-v1-articles-grid">
        {articles.map((article) => {
          const isDraft = article.reviewerStatus !== 'approved';
          return (
            <Link
              key={article.slug}
              href={`/insights/${article.slug}`}
              className="service-v1-articles-card"
            >
              <div className="service-v1-articles-meta">
                <span className="service-v1-articles-tag">{article.tag}</span>
                {isDraft ? (
                  <span className="service-v1-articles-draft" title="Draft — visible in dev only">
                    Draft
                  </span>
                ) : null}
              </div>
              <h3 className="service-v1-articles-title">{article.title}</h3>
              <p className="service-v1-articles-excerpt">{article.excerpt}</p>
              <div className="service-v1-articles-foot">
                <span className="service-v1-articles-author">
                  <span className="service-v1-articles-avatar" aria-hidden="true">
                    {article.author.initials}
                  </span>
                  <span>
                    {article.author.name}
                    <span className="service-v1-articles-role"> · {article.author.role}</span>
                  </span>
                </span>
                <span className="service-v1-articles-time">
                  <Clock size={12} aria-hidden="true" />
                  {article.readMinutes} min
                </span>
              </div>
              <span className="service-v1-articles-read" aria-hidden="true">
                Read
                <ArrowUpRight size={14} />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
