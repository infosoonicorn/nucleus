import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, Clock } from 'lucide-react';
import { PageShell } from '@/components/site-chrome';
import { articles, getArticleAuthor, getArticleBySlug } from '@/content/articles';
import { ArticleAuthorBio } from '@/components/insights/article-author-bio';
import { ArticleRelated } from '@/components/insights/article-related';
import { ArticleTOC, type TocHeading } from '@/components/insights/article-toc';
import { ReadingProgress } from '@/components/insights/reading-progress';
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

  const author = getArticleAuthor(article);
  const ogImage = article.thumbnailSrc ?? '/og-default.png';
  const canonicalPath = `/insights/${article.slug}`;

  return {
    title: `${article.title} — Nucleus Advisors`,
    description: article.excerpt,
    authors: [{ name: author.name }],
    keywords: [article.tag, ...article.serviceSlugs],
    alternates: { canonical: canonicalPath },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.excerpt,
      url: canonicalPath,
      siteName: 'Nucleus Advisors',
      images: [{ url: ogImage, width: 1200, height: 630, alt: article.title }],
      publishedTime: `${article.publishedOn}T00:00:00Z`,
      authors: [author.name],
      tags: [article.tag],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt,
      images: [ogImage],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const allowDrafts = process.env.NODE_ENV !== 'production';
  const article = getArticleBySlug(slug, { allowDrafts });
  if (!article) notFound();

  const author = getArticleAuthor(article);
  const isDraft = article.reviewerStatus !== 'approved';
  const paragraphs = article.body.split('\n\n');

  // Walk paragraphs once to extract h2/h3 headings with stable anchor
  // ids. The renderer below consumes the same list (by index) so each
  // rendered <h2>/<h3> carries the matching id attribute — anchors stay
  // in lock-step with the TOC entries.
  const headings: TocHeading[] = [];
  const slugCounts = new Map<string, number>();
  for (const p of paragraphs) {
    let level: 2 | 3 | null = null;
    let text = '';
    if (p.startsWith('### ')) {
      level = 3;
      text = p.slice(4);
    } else if (p.startsWith('## ')) {
      level = 2;
      text = p.slice(3);
    }
    if (level && text) {
      const base = slugify(text);
      const count = slugCounts.get(base) ?? 0;
      slugCounts.set(base, count + 1);
      const id = count === 0 ? base : `${base}-${count + 1}`;
      headings.push({ level, text, id });
    }
  }
  let headingIdx = 0;

  const primaryServiceSlug = article.serviceSlugs[0];

  // JSON-LD Article structured data for Google rich results + future
  // discovery surfaces. Image, dates, author and publisher all named
  // explicitly so the article ranks as a first-class editorial piece,
  // not a generic web page.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: [article.thumbnailSrc ?? '/og-default.png'],
    datePublished: `${article.publishedOn}T00:00:00Z`,
    dateModified: `${article.publishedOn}T00:00:00Z`,
    author: {
      '@type': 'Person',
      name: author.name,
      jobTitle: author.role,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Nucleus Advisors',
      logo: {
        '@type': 'ImageObject',
        url: '/og-default.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `/insights/${article.slug}`,
    },
    keywords: [article.tag, ...article.serviceSlugs].join(', '),
    articleSection: article.tag,
    wordCount: article.body.split(/\s+/).length,
  };

  return (
    <PageShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgress />
      <main className="home-v3 service-v1">
        <div className="article-page-shell">
          <article className="article-page">
            <figure className="article-page-hero">
              {article.thumbnailSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={article.thumbnailSrc} alt="" loading="eager" />
              ) : (
                <span className="article-page-hero-placeholder" aria-hidden="true">
                  <span className="article-page-hero-tag">{article.tag}</span>
                  <span className="article-page-hero-brand">
                    Nucleus <em>Insights</em>
                  </span>
                </span>
              )}
            </figure>
            <header className="article-page-head">
              <nav className="article-breadcrumb" aria-label="Breadcrumb">
                <ol>
                  <li>
                    <Link href="/">Home</Link>
                  </li>
                  <li aria-hidden="true" className="article-breadcrumb-sep">
                    <ChevronRight size={12} />
                  </li>
                  <li>
                    <Link href="/insights">Insights</Link>
                  </li>
                  <li aria-hidden="true" className="article-breadcrumb-sep">
                    <ChevronRight size={12} />
                  </li>
                  <li>
                    <Link href={`/insights?tag=${encodeURIComponent(article.tag)}`}>
                      {article.tag}
                    </Link>
                  </li>
                </ol>
              </nav>
              <div className="article-page-meta">
                <Link
                  href={`/insights?tag=${encodeURIComponent(article.tag)}`}
                  className="article-page-tag article-page-tag-link"
                >
                  {article.tag}
                </Link>
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
                  {author.headshotSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={author.headshotSrc} alt="" />
                  ) : (
                    author.initials
                  )}
                </span>
                <span>
                  <span className="article-page-author-name">{author.name}</span>
                  <span className="article-page-author-role">{author.role}</span>
                </span>
              </div>
            </header>

            <div className="article-page-body">
              {paragraphs.map((p, i) => {
                if (p.startsWith('### ') || p.startsWith('## ')) {
                  const h = headings[headingIdx++];
                  if (h.level === 3) return <h3 key={i} id={h.id}>{h.text}</h3>;
                  return <h2 key={i} id={h.id}>{h.text}</h2>;
                }
                return <p key={i}>{renderInline(p)}</p>;
              })}
            </div>

            <ArticleAuthorBio article={article} />
          </article>

          {/* data-lenis-prevent: lets the rail scroll independently of
              the main column under Lenis smooth-scroll. */}
          <aside
            className="article-page-side"
            aria-label="In this article, related reading, and contact"
            data-lenis-prevent
          >
            <ArticleTOC headings={headings} />
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
 * Stable anchor-id generator for headings. Lower-cases, strips non
 * word/space/hyphen, collapses whitespace to hyphens. Collisions are
 * disambiguated by the caller (which appends -2, -3, etc.).
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
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
