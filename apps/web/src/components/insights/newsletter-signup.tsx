'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, Mail } from 'lucide-react';

/**
 * "Subscribe to the desk" — newsletter capture. Single email field,
 * posts to the existing /api/lead-magnet-stub route with
 * kind: 'insights-subscribe'. Phase 1.5 will replace the stub with
 * a Supabase write + provider integration.
 *
 * Variants:
 *   - 'hub'             wide horizontal banner, used above the grid
 *                       on /insights
 *   - 'article-footer'  full-width block placed after the author bio
 *                       at the end of an article reader
 *
 * Both share the same form + success state. Errors render as plain
 * English (per the firm-wide rule that raw API codes never reach UI).
 */
export function NewsletterSignup({
  variant,
  heading,
  sub,
}: Readonly<{
  variant: 'hub' | 'article-footer';
  heading?: string;
  sub?: string;
}>) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'ok' | 'error'>('idle');
  const [feedback, setFeedback] = useState<string>('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const email = String(fd.get('email') ?? '').trim();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setFeedback('Please share a valid work email.');
      return;
    }
    setStatus('submitting');
    try {
      const res = await fetch('/api/lead-magnet-stub', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, kind: 'insights-subscribe' }),
      });
      const body = (await res.json()) as { ok: boolean; message?: string };
      if (res.ok && body.ok) {
        setStatus('ok');
        setFeedback("You're on the list. The next piece lands in your inbox.");
      } else {
        setStatus('error');
        setFeedback(
          body.message ?? 'We could not add you to the list. Please try again in a moment.',
        );
      }
    } catch {
      setStatus('error');
      setFeedback('Network unavailable. Please try again in a moment.');
    }
  }

  const resolvedHeading = heading ?? 'Subscribe to the desk.';
  const resolvedSub =
    sub ??
    "One long-form piece every other week. Practitioner-grade, partner-authored. No sales sequences.";

  if (status === 'ok') {
    return (
      <section
        className={`newsletter newsletter-${variant} newsletter-success`}
        aria-live="polite"
      >
        <CheckCircle2 size={28} aria-hidden="true" className="newsletter-success-icon" />
        <div>
          <p className="newsletter-success-title">Welcome to the desk.</p>
          <p className="newsletter-success-text">{feedback}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={`newsletter newsletter-${variant}`} aria-labelledby="newsletter-heading">
      <div className="newsletter-copy">
        <p className="newsletter-eyebrow">
          <Mail size={12} aria-hidden="true" /> Newsletter
        </p>
        <h2 id="newsletter-heading" className="newsletter-title">
          {resolvedHeading}
        </h2>
        <p className="newsletter-sub">{resolvedSub}</p>
      </div>
      <form className="newsletter-form" onSubmit={handleSubmit} noValidate>
        <label htmlFor={`nl-email-${variant}`} className="newsletter-sr-only">
          Work email
        </label>
        <input
          id={`nl-email-${variant}`}
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@company.com"
          disabled={status === 'submitting'}
          className="newsletter-input"
        />
        <button
          type="submit"
          className="newsletter-submit"
          disabled={status === 'submitting'}
          aria-busy={status === 'submitting'}
        >
          {status === 'submitting' ? 'Sending…' : 'Subscribe'}
          <ArrowRight size={14} aria-hidden="true" />
        </button>
        {status === 'error' && feedback ? (
          <p className="newsletter-error" role="alert">
            {feedback}
          </p>
        ) : null}
        <p className="newsletter-fine">
          We send when there is something to publish. Unsubscribe in any email.
        </p>
      </form>
    </section>
  );
}
