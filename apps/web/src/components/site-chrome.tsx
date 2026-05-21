import { articles, getArticleAuthor } from '@/content/articles';
import { SiteNav, type NavLatestArticle } from './site-nav';
import { SiteFooter } from './site-footer';

function pickLatestArticle(): NavLatestArticle | null {
  const allowDrafts = process.env.NODE_ENV !== 'production';
  const visible = articles.filter((a) =>
    allowDrafts ? true : a.reviewerStatus === 'approved',
  );
  if (visible.length === 0) return null;
  const latest = [...visible].sort((a, b) =>
    b.publishedOn.localeCompare(a.publishedOn),
  )[0];
  let authorName = '';
  try {
    authorName = getArticleAuthor(latest).name;
  } catch {
    authorName = '';
  }
  return {
    slug: latest.slug,
    title: latest.title,
    tag: latest.tag,
    publishedOn: latest.publishedOn,
    readMinutes: latest.readMinutes,
    thumbnailSrc: latest.thumbnailSrc ?? null,
    authorName,
  };
}

export function Header() {
  return <SiteNav latestArticle={pickLatestArticle()} />;
}

export function Footer() {
  return <SiteFooter />;
}

export function PageShell({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
