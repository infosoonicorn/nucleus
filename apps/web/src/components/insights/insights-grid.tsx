'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Clock, Search, X } from 'lucide-react';

/**
 * Minimal shape carried over from the server component. Keeping this
 * local to avoid coupling the client component to the full Article
 * type — only the fields the grid actually renders.
 */
export type GridArticle = {
  slug: string;
  title: string;
  excerpt: string;
  tag: string;
  readMinutes: number;
  isDraft: boolean;
  thumbnailSrc?: string;
  author: {
    name: string;
    role: string;
    initials: string;
    headshotSrc?: string;
  };
};

/**
 * Client-side search + grid render for the insights hub. The server
 * has already applied service / tag / author filters and passes the
 * post-filter article list down. This component handles the inline
 * text search (title + excerpt + author name + tag) with `useDeferredValue`
 * so typing stays smooth on large lists, and renders the resulting cards.
 */
export function InsightsGrid({
  articles,
  filterDescription,
}: Readonly<{
  articles: readonly GridArticle[];
  filterDescription: string | null;
}>) {
  const [query, setQuery] = useState('');
  const deferred = useDeferredValue(query);

  const filtered = useMemo(() => {
    const q = deferred.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.tag.toLowerCase().includes(q) ||
        a.author.name.toLowerCase().includes(q),
    );
  }, [articles, deferred]);

  return (
    <>
      <div className="hub-search" role="search">
        <Search size={16} aria-hidden="true" className="hub-search-icon" />
        <input
          type="search"
          className="hub-search-input"
          placeholder="Search insights by title, tag, or author"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search insights"
        />
        {query ? (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="hub-search-clear"
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        ) : null}
        <span className="hub-search-count">
          {filtered.length} {filtered.length === 1 ? 'article' : 'articles'}
          {filterDescription ? ` · ${filterDescription}` : ''}
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="hub-empty">
          <p>
            {query
              ? `No insights match "${query}"${filterDescription ? ` in ${filterDescription}` : ''}.`
              : 'No insights match these filters yet.'}
          </p>
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="hub-empty-reset"
            >
              Clear search
            </button>
          ) : (
            <Link href="/insights" className="hub-empty-reset">
              Clear filters
            </Link>
          )}
        </div>
      ) : (
        <div className="service-v1-articles-grid hub-articles-grid">
          {filtered.map((article) => (
            <Link
              key={article.slug}
              href={`/insights/${article.slug}`}
              className="service-v1-articles-card"
            >
              <span className="service-v1-articles-thumb" aria-hidden="true">
                {article.thumbnailSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={article.thumbnailSrc} alt="" loading="lazy" />
                ) : (
                  <span className="service-v1-articles-thumb-placeholder">
                    <span className="service-v1-articles-thumb-tag">{article.tag}</span>
                    <span className="service-v1-articles-thumb-brand">
                      Nucleus <em>Insights</em>
                    </span>
                  </span>
                )}
              </span>
              <div className="service-v1-articles-meta">
                <span className="service-v1-articles-tag">{article.tag}</span>
                {article.isDraft ? (
                  <span
                    className="service-v1-articles-draft"
                    title="Draft — visible in dev only"
                  >
                    Draft
                  </span>
                ) : null}
              </div>
              <h3 className="service-v1-articles-title">{article.title}</h3>
              <p className="service-v1-articles-excerpt">{article.excerpt}</p>
              <div className="service-v1-articles-foot">
                <span className="service-v1-articles-author">
                  <span className="service-v1-articles-avatar" aria-hidden="true">
                    {article.author.headshotSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={article.author.headshotSrc} alt="" />
                    ) : (
                      article.author.initials
                    )}
                  </span>
                  <span>
                    <span className="service-v1-articles-name">{article.author.name}</span>
                    <span className="service-v1-articles-role">{article.author.role}</span>
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
          ))}
        </div>
      )}
    </>
  );
}
