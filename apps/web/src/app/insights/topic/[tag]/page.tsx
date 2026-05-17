import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, ChevronRight, Clock } from 'lucide-react';
import { PageShell } from '@/components/site-chrome';
import { articles, getArticleAuthor } from '@/content/articles';
import { getTopicDescription } from '@/content/topics';

type Props = { params: Promise<{ tag: string }> };

export function generateStaticParams() {
  // Every distinct tag in the article set gets a topic page.
  const tags = new Set<string>();
  for (const a of articles) tags.add(a.tag);
  return Array.from(tags).map((tag) => ({ tag: encodeURIComponent(tag) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag: encoded } = await params;
  const tag = decodeURIComponent(encoded);
  const description = getTopicDescription(tag);
  return {
    title: `${tag} — Insights | Nucleus Advisors`,
    description,
    alternates: { canonical: `/insights/topic/${encodeURIComponent(tag)}` },
    openGraph: {
      type: 'website',
      title: `${tag} — Insights`,
      description,
      url: `/insights/topic/${encodeURIComponent(tag)}`,
      images: [{ url: '/og-default.png', width: 1200, height: 630 }],
    },
  };
}

export default async function TopicPage({ params }: Props) {
  const { tag: encoded } = await params;
  const tag = decodeURIComponent(encoded);

  const allowDrafts = process.env.NODE_ENV !== 'production';
  const tagged = articles
    .filter((a) => a.tag === tag && (allowDrafts ? true : a.reviewerStatus === 'approved'))
    .sort((a, b) => b.publishedOn.localeCompare(a.publishedOn));

  if (tagged.length === 0) notFound();

  const description = getTopicDescription(tag);

  return (
    <PageShell>
      <main className="home-v3 service-v1">
        <article className="topic-page">
          <nav className="article-breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li aria-hidden="true" className="article-breadcrumb-sep"><ChevronRight size={12} /></li>
              <li><Link href="/insights">Insights</Link></li>
              <li aria-hidden="true" className="article-breadcrumb-sep"><ChevronRight size={12} /></li>
              <li><Link href={`/insights/topic/${encodeURIComponent(tag)}`}>{tag}</Link></li>
            </ol>
          </nav>

          <header className="topic-page-head">
            <p className="topic-page-eyebrow">Topic</p>
            <h1 className="topic-page-title">{tag}</h1>
            <p className="topic-page-lede">{description}</p>
            <p className="topic-page-count">
              {tagged.length} {tagged.length === 1 ? 'article' : 'articles'}
            </p>
          </header>

          <section className="topic-page-list" aria-label={`Articles tagged ${tag}`}>
            {tagged.map((a) => {
              const author = getArticleAuthor(a);
              return (
                <Link
                  key={a.slug}
                  href={`/insights/${a.slug}`}
                  className="author-archive-item"
                >
                  <span className="author-archive-item-thumb" aria-hidden="true">
                    {a.thumbnailSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.thumbnailSrc} alt="" loading="lazy" />
                    ) : (
                      <span className="author-archive-item-thumb-fallback">{a.tag}</span>
                    )}
                  </span>
                  <div className="author-archive-item-body">
                    <p className="author-archive-item-tag">{author.name}</p>
                    <h3 className="author-archive-item-title">{a.title}</h3>
                    <p className="author-archive-item-excerpt">{a.excerpt}</p>
                    <p className="author-archive-item-foot">
                      <Clock size={11} aria-hidden="true" />
                      {a.readMinutes} min read
                      <ArrowUpRight
                        size={12}
                        aria-hidden="true"
                        className="author-archive-item-arrow"
                      />
                    </p>
                  </div>
                </Link>
              );
            })}
          </section>
        </article>
      </main>
    </PageShell>
  );
}
