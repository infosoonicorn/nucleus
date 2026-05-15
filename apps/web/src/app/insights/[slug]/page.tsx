import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock } from 'lucide-react';
import { PageShell } from '@/components/site-chrome';
import { articles, getArticleBySlug } from '@/content/articles';

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

  return (
    <PageShell>
      <main className="home-v3 service-v1">
        <article className="article-page">
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
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <footer className="article-page-foot">
            <p>
              <strong>{article.author.name}</strong> is a {article.author.role} at Nucleus Advisors.
              Comments and pushback welcome —{' '}
              <Link href="/contact">write to the desk</Link>.
            </p>
          </footer>
        </article>
      </main>
    </PageShell>
  );
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: '2-digit' });
}
