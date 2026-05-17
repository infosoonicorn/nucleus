'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

/**
 * Right-rail lead-capture form on the article reader. Three fields
 * (name, work email, brief) so the partner replying has enough to act
 * on. Posts to the shared `/api/lead-magnet-stub` route with
 * `kind: 'article-lead'`. Logs only. Phase 1.5 will replace the stub
 * with a Supabase write.
 *
 * UX rules:
 *   - Email is the only hard requirement; name + brief are optional but
 *     prompted so most submissions arrive complete.
 *   - On success the form swaps to a confirmation state so the visitor
 *     gets a visible acknowledgement (no toast that disappears).
 *   - Errors surface as plain English. Raw API codes never reach the UI
 *     (per Vijay's global rule 4).
 */
export function ArticleLeadForm({
  articleSlug,
  serviceSlug,
}: Readonly<{ articleSlug: string; serviceSlug?: string }>) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'ok' | 'error'>('idle');
  const [feedback, setFeedback] = useState<string>('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const email = String(fd.get('email') ?? '').trim();
    const name = String(fd.get('name') ?? '').trim();
    const message = String(fd.get('message') ?? '').trim();
    if (!email || !email.includes('@')) {
      setStatus('error');
      setFeedback('Please share a work email so a partner can write back.');
      return;
    }
    setStatus('submitting');
    try {
      const res = await fetch('/api/lead-magnet-stub', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          message,
          kind: 'article-lead',
          articleSlug,
          serviceSlug,
        }),
      });
      const body = (await res.json()) as { ok: boolean; message?: string };
      if (res.ok && body.ok) {
        setStatus('ok');
        setFeedback(body.message ?? 'Thank you. A partner will be in touch.');
      } else {
        setStatus('error');
        setFeedback(
          body.message ?? 'We could not register your note. Please try again, or write to us directly at hello@nucleusadvisors.in.',
        );
      }
    } catch {
      setStatus('error');
      setFeedback('Network unavailable. Please try again in a moment.');
    }
  }

  if (status === 'ok') {
    return (
      <section className="sidebar-block article-lead-block article-lead-block-success" aria-live="polite">
        <CheckCircle2 size={28} aria-hidden="true" className="article-lead-success-icon" />
        <h2 className="sidebar-block-title">Note received.</h2>
        <p className="article-lead-success-text">{feedback}</p>
        <p className="article-lead-success-sub">
          If it&rsquo;s urgent, you can also reach us at{' '}
          <a href="mailto:hello@nucleusadvisors.in">hello@nucleusadvisors.in</a>.
        </p>
      </section>
    );
  }

  return (
    <section className="sidebar-block article-lead-block" aria-labelledby="article-lead-heading">
      <header className="sidebar-block-head">
        <p className="sidebar-block-eyebrow">Work with us</p>
        <h2 id="article-lead-heading" className="sidebar-block-title">
          Talk to a <em>partner</em>.
        </h2>
        <p className="article-lead-intro">
          A 30-minute scoping call. No deck, no fee. We&rsquo;ll tell you
          whether it&rsquo;s the right time to engage and what the next
          step looks like.
        </p>
      </header>
      <form className="article-lead-form" onSubmit={handleSubmit} noValidate>
        <label className="article-lead-field">
          <span className="article-lead-label">Name</span>
          <input
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your full name"
            disabled={status === 'submitting'}
          />
        </label>
        <label className="article-lead-field">
          <span className="article-lead-label">
            Work email <span className="article-lead-required" aria-hidden="true">*</span>
          </span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@company.com"
            disabled={status === 'submitting'}
          />
        </label>
        <label className="article-lead-field">
          <span className="article-lead-label">What you&rsquo;re working on</span>
          <textarea
            name="message"
            rows={3}
            placeholder="A couple of lines on where you are. Optional but helpful."
            disabled={status === 'submitting'}
          />
        </label>
        <button
          type="submit"
          className="article-lead-submit"
          disabled={status === 'submitting'}
          aria-busy={status === 'submitting'}
        >
          {status === 'submitting' ? 'Sending…' : 'Request the call'}
          <ArrowRight size={14} aria-hidden="true" />
        </button>
        {status === 'error' && feedback ? (
          <p className="article-lead-error" role="alert">
            {feedback}
          </p>
        ) : null}
        <p className="article-lead-fineprint">
          We reply within one business day. No sales sequences, no newsletter sign-up.
        </p>
      </form>
    </section>
  );
}
