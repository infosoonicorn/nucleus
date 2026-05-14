'use client';

import { useState } from 'react';
import type { Service } from '@/content/site';
import { SectionHeader } from '@/components/sections';

export function LeadMagnet({ service }: Readonly<{ service: Service }>) {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'ok' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') ?? '');
    setStatus('submitting');
    try {
      const response = await fetch('/api/lead-magnet-stub', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, kind: 'lead-magnet', serviceSlug: service.slug }),
      });
      const body = (await response.json()) as { ok: boolean; message: string };
      if (response.ok && body.ok) {
        setStatus('ok');
        setMessage(body.message);
      } else {
        setStatus('error');
        setMessage('We could not register your request. Please try again or write to us directly.');
      }
    } catch {
      setStatus('error');
      setMessage('Network unavailable. Please try again in a moment.');
    }
  }

  return (
    <section className="service-v1-section service-v1-section-leadmagnet">
      <SectionHeader eyebrow="Resource" title={service.leadMagnet} />
      <form className="service-v1-leadmagnet-form" onSubmit={handleSubmit}>
        <label htmlFor="lead-email" className="service-v1-sr-only">
          Work email
        </label>
        <input
          id="lead-email"
          name="email"
          type="email"
          required
          placeholder="you@company.com"
          disabled={status === 'submitting' || status === 'ok'}
        />
        <button
          type="submit"
          className="home-v3-button home-v3-button-primary"
          disabled={status === 'submitting' || status === 'ok'}
        >
          {status === 'ok' ? 'Received' : 'Request resource'}
        </button>
      </form>
      {message ? (
        <p className="service-v1-leadmagnet-status" role="status">
          {message}
        </p>
      ) : null}
    </section>
  );
}
