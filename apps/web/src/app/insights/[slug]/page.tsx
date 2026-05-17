import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock } from 'lucide-react';
import { PageShell } from '@/components/site-chrome';
import { articles, getArticleBySlug } from '@/content/articles';
import { ArticleRelated } from '@/components/insights/article-related';
import { SidebarCTA } from '@/components/services/sidebar-blocks';

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  // In production, only generate routes for approved articles.
  return articles
    .filter((a) => process.env.NODE_ENV !== 'production' || a.reviewerStatus === 'approved')
    .map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const allowDrafts = process.env.NODE_ENV !== 'production';
  const article = getArticleBySlug(slug, { allowDrafts });
  if (!article) return { title: 'Article — Nucleus Advisors' };
  return {
    title: `${article.title} — Nucleus Advisors`,
    description: article.excerpt,
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const allowDrafts = process.env.NODE_ENV !== 'production';
  const article = getArticleBySlug(slug, { allowDrafts });
  if (!article) notFound();

  const isDraft = article.reviewerStatus !== 'approved';
  const paragraphs = article.body.split('\n\n');

  const primaryServiceSlug = article.serviceSlugs[0];

  return (
    <PageShell>
      <main className="home-v3 service-v1">
        <div className="article-page-shell">
          <article className="article-page">
            {article.thumbnailSrc ? (
              <figure className="article-page-hero">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={article.thumbnailSrc} alt="" loading="eager" />
              </figure>
            ) : null}
            <header className="article-page-head">
              <Link href="/insights" className="article-page-back">
                <ArrowLeft size={14} aria-hidden="true" />
                <span>All insights</span>
              </Link>
              <div className="article-page-meta">
                <span className="article-page-tag">{article.tag}</span>
                {isDraft ? <span className="article-page-draft">Draft — not yet published</span> : null}
                <span className="article-page-date">{formatDate(article.publishedOn)}</span>
                <span className="article-page-readtime">
                  <Clock size={12} aria-hidden="true" />
                  {article.readMinutes} min read
                </span>
              </div>
              <h1 className="article-page-title">{article.title}</h1>
              <p className="article-page-excerpt">{article.excerpt}</p>
              <div className="article-page-author">
                <span className="article-page-avatar" aria-hidden="true">
                  {article.author.initials}
                </span>
                <span>
                  <span className="article-page-author-name">{article.author.name}</span>
                  <span className="article-page-author-role">{article.author.role}</span>
                </span>
              </div>
            </header>

            <div className="article-page-body">
              {paragraphs.map((p, i) => {
                if (p.startsWith('### ')) {
                  return <h3 key={i}>{p.slice(4)}</h3>;
                }
                if (p.startsWith('## ')) {
                  return <h2 key={i}>{p.slice(3)}</h2>;
                }
                return <p key={i}>{renderInline(p)}</p>;
              })}
            </div>

            <footer className="article-page-foot">
              <p>
                <strong>{article.author.name}</strong> is a {article.author.role} at Nucleus Advisors.{' '}
                <Link href="/contact">Write to the desk</Link>.
              </p>
            </footer>
          </article>

          {/* data-lenis-prevent: lets the rail scroll independently of
              the main column under Lenis smooth-scroll. */}
          <aside
            className="article-page-side"
            aria-label="Related articles and contact"
            data-lenis-prevent
          >
            <ArticleRelated current={article} />
            {primaryServiceSlug ? <SidebarCTA serviceSlug={primaryServiceSlug} /> : null}
          </aside>
        </div>
      </main>
    </PageShell>
  );
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: '2-digit' });
}

/**
 * Inline emphasis renderer for article body paragraphs. Supports
 * **bold** segments only (no italics — we avoid em tags in articles
 * because the editorial pages reserve italics for brand emphasis).
 */
function renderInline(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const m = part.match(/^\*\*(.+)\*\*$/);
    if (m) return <strong key={i}>{m[1]}</strong>;
    return <span key={i}>{part}</span>;
  });
}
