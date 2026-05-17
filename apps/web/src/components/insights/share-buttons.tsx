'use client';

import { useState } from 'react';
import { Check, Copy, Linkedin } from 'lucide-react';

/**
 * Compact share-button cluster placed in the article meta row.
 *   - LinkedIn — opens the standard LinkedIn sharer with the article
 *     URL pre-filled. The B2B audience for this writing is on
 *     LinkedIn; no other social platform earns its keep here.
 *   - Copy link — copies the canonical article URL to clipboard
 *     with a brief "Copied" confirmation.
 *
 * Lives client-side because clipboard access and the popup window
 * call both need the browser. Server-renders the same markup so
 * there's no layout shift.
 */
export function ShareButtons({
  url,
  title,
}: Readonly<{ url: string; title: string }>) {
  const [copied, setCopied] = useState(false);

  const absoluteUrl = (() => {
    if (typeof window !== 'undefined') {
      return new URL(url, window.location.origin).toString();
    }
    return url;
  })();

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(absoluteUrl)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(absoluteUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API can fail in older browsers or permission-locked
      // contexts. Fall back to a no-op rather than surfacing a raw
      // error — the LinkedIn button still works.
    }
  }

  return (
    <span className="article-share" aria-label={`Share "${title}"`}>
      <a
        href={linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="article-share-btn"
        aria-label="Share on LinkedIn"
        title="Share on LinkedIn"
      >
        <Linkedin size={13} aria-hidden="true" />
        <span className="article-share-label">LinkedIn</span>
      </a>
      <button
        type="button"
        onClick={copy}
        className={`article-share-btn${copied ? ' is-copied' : ''}`}
        aria-label={copied ? 'Link copied' : 'Copy article link'}
        title={copied ? 'Copied' : 'Copy link'}
      >
        {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
        <span className="article-share-label">{copied ? 'Copied' : 'Copy link'}</span>
      </button>
    </span>
  );
}
