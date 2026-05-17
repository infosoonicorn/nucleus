'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';

/**
 * Sticky scoping-call pill that slides up from the bottom of the
 * viewport once the reader has scrolled past 50% of the article.
 * Partner-specific copy ("Talk to {firstName}") and a dismiss button
 * that hides it for the rest of the page (sessionStorage-keyed to
 * the article slug so it stays dismissed on refresh).
 *
 * Self-hides when:
 *  - Scroll position is below 50% of document
 *  - User has dismissed it this session
 *  - Article is shorter than ~600 vertical pixels (no value on
 *    short pieces; the bottom CTA suffices)
 */
export function StickyArticleCTA({
  articleSlug,
  partnerFirstName,
  partnerHref,
}: Readonly<{
  articleSlug: string;
  partnerFirstName: string;
  partnerHref: string;
}>) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Sync dismissed state from sessionStorage on mount. We can't read
  // it during initial render (would cause an SSR/CSR hydration
  // mismatch), so this is the legitimate use case for setState-in-
  // effect — the linter's set-state-in-effect rule is suppressed
  // because the alternative (useSyncExternalStore for a one-time
  // read) is overkill here.
  useEffect(() => {
    try {
      const key = `nucleus.sticky-cta.${articleSlug}.dismissed`;
      if (window.sessionStorage.getItem(key) === '1') {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDismissed(true);
      }
    } catch {
      /* sessionStorage can throw under private browsing */
    }
  }, [articleSlug]);

  // Show after 50% scroll on documents tall enough to warrant it
  useEffect(() => {
    if (dismissed) return;
    const compute = () => {
      const d = document.documentElement;
      const max = d.scrollHeight - d.clientHeight;
      if (max < 600) {
        setVisible(false);
        return;
      }
      const pct = max > 0 ? d.scrollTop / max : 0;
      setVisible(pct >= 0.5);
    };
    compute();
    window.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute, { passive: true });
    return () => {
      window.removeEventListener('scroll', compute);
      window.removeEventListener('resize', compute);
    };
  }, [dismissed]);

  if (dismissed || !visible) return null;

  const dismiss = () => {
    setDismissed(true);
    try {
      window.sessionStorage.setItem(`nucleus.sticky-cta.${articleSlug}.dismissed`, '1');
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="sticky-article-cta" role="complementary" aria-label="Scoping call">
      <Link href={partnerHref} className="sticky-article-cta-link">
        <span className="sticky-article-cta-text">
          Working on this now? Talk to <strong>{partnerFirstName}</strong>
        </span>
        <span className="sticky-article-cta-go">
          <ArrowRight size={14} aria-hidden="true" />
        </span>
      </Link>
      <button
        type="button"
        onClick={dismiss}
        className="sticky-article-cta-dismiss"
        aria-label="Dismiss"
      >
        <X size={14} />
      </button>
    </div>
  );
}
