import { notFound } from 'next/navigation';
import { articles } from '@/content/articles';
import { getTeamMemberBySlug } from '@/content/team';

/**
 * Per-author RSS feed at `/insights/by/<slug>/feed.xml`. Power readers
 * who follow a specific partner can subscribe to just their output
 * without noise from the rest of the firm's writing.
 *
 * Mirrors the firm-wide feed at `/insights/feed.xml` in shape and
 * cache headers. Production filters to approved articles only.
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
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toUTCString();
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const member = getTeamMemberBySlug(slug);
  if (!member) notFound();

  const allowDrafts = process.env.NODE_ENV !== 'production';
  const items = articles
    .filter(
      (a) =>
        a.authorSlug === member.slug &&
        (allowDrafts ? true : a.reviewerStatus === 'approved'),
    )
    .sort((a, b) => b.publishedOn.localeCompare(a.publishedOn))
    .slice(0, 50)
    .map((a) => {
      const link = `${SITE_URL}/insights/${a.slug}`;
      return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(a.excerpt)}</description>
      <pubDate>${rfc822(a.publishedOn)}</pubDate>
      <category>${escapeXml(a.tag)}</category>
      <dc:creator>${escapeXml(member.name)}</dc:creator>
    </item>`;
    })
    .join('\n');

  const archiveUrl = `${SITE_URL}/insights/by/${member.slug}`;
  const feedUrl = `${SITE_URL}/insights/by/${member.slug}/feed.xml`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(member.name)} — Insights | Nucleus Advisors</title>
    <link>${archiveUrl}</link>
    <description>Articles by ${escapeXml(member.name)}, ${escapeXml(member.role)} at Nucleus Advisors.</description>
    <language>en-IN</language>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
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
