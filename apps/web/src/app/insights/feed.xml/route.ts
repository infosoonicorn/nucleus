import { articles, getArticleAuthor } from '@/content/articles';

/**
 * RSS 2.0 feed of approved insights articles, served at
 * `/insights/feed.xml`. Power readers (Feedly, Inoreader, journalists
 * tracking the space) can subscribe; the existence of a real feed
 * signals that the publication runs on a cadence, not a one-off.
 *
 * Production only includes `reviewerStatus === 'approved'` entries.
 * Sort: newest first (publishedOn descending).
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://nucleusadvisors.in';

function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function rfc822(iso: string): string {
  // RSS requires RFC 822 dates. Parse YYYY-MM-DD and emit "Tue, 12 May 2026 00:00:00 GMT".
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toUTCString();
}

export function GET() {
  const allowDrafts = process.env.NODE_ENV !== 'production';
  const items = articles
    .filter((a) => (allowDrafts ? true : a.reviewerStatus === 'approved'))
    .sort((a, b) => b.publishedOn.localeCompare(a.publishedOn))
    .slice(0, 50)
    .map((a) => {
      const author = getArticleAuthor(a);
      const link = `${SITE_URL}/insights/${a.slug}`;
      return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(a.excerpt)}</description>
      <pubDate>${rfc822(a.publishedOn)}</pubDate>
      <category>${escapeXml(a.tag)}</category>
      <dc:creator>${escapeXml(author.name)}</dc:creator>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Nucleus Advisors — Insights</title>
    <link>${SITE_URL}/insights</link>
    <description>Long-form writing from Nucleus Advisors partners on fundraises, term sheets, M&amp;A, valuations, risk, tax and corporate secretarial practice.</description>
    <language>en-IN</language>
    <atom:link href="${SITE_URL}/insights/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
