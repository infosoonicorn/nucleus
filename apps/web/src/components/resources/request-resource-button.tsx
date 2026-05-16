'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Check, FileText, X } from 'lucide-react';
import type { Resource } from '@/content/resources';

type Props = Readonly<{
  resource: Resource;
  label?: string;
  className?: string;
  variant?: 'primary' | 'ghost';
}>;

type Status = 'idle' | 'submitting' | 'ok' | 'error';

const ROLES = [
  'Founder / CEO',
  'CFO / Finance lead',
  'Investor',
  'Operator',
  'Advisor',
  'Other',
];

export function RequestResourceButton({
  resource,
  label = 'Get this',
  className,
  variant = 'primary',
}: Props) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string>('');
  const firstFieldRef = useRef<HTMLInputElement | null>(null);
  const titleId = useId();

  const close = useCallback(() => {
    if (status === 'submitting') return;
    setOpen(false);
  }, [status]);

  // Esc to close + focus first field on open + body scroll lock
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = setTimeout(() => firstFieldRef.current?.focus(), 60);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      clearTimeout(t);
    };
  }, [open, close]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    const body = {
      resourceSlug: resource.slug,
      name: String(fd.get('name') ?? ''),
      email: String(fd.get('email') ?? ''),
      company: String(fd.get('company') ?? ''),
      role: String(fd.get('role') ?? ''),
    };
    setStatus('submitting');
    setMessage('');
    try {
      const res = await fetch('/api/resources/request', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as { ok: boolean; message: string };
      if (res.ok && json.ok) {
        setStatus('ok');
        setMessage(json.message);
      } else {
        setStatus('error');
        setMessage(json.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setMessage('Network unavailable. Please try again in a moment.');
    }
  }

  function reopen() {
    setStatus('idle');
    setMessage('');
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          className ??
          (variant === 'primary'
            ? 'resource-cta resource-cta-primary'
            : 'resource-cta resource-cta-ghost')
        }
        aria-haspopup="dialog"
      >
        {label}
        <ArrowRight size={14} aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="resource-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="resource-modal"
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                onClick={close}
                className="resource-modal-close"
                aria-label="Close"
                disabled={status === 'submitting'}
              >
                <X size={16} />
              </button>

              <div className="resource-modal-head">
                <span className="resource-modal-cover" aria-hidden="true">
                  <FileText size={22} />
                </span>
                <div>
                  <p className="resource-modal-eyebrow">
                    {resource.kind} · {resource.format}
                    {resource.pages ? ` · ${resource.pages} pp` : ''}
                  </p>
                  <h2 id={titleId} className="resource-modal-title">
                    {resource.title}
                  </h2>
                </div>
              </div>

              {status === 'ok' ? (
                <div className="resource-modal-success" role="status">
                  <span className="resource-modal-success-mark" aria-hidden="true">
                    <Check size={18} strokeWidth={3} />
                  </span>
                  <p>{message}</p>
                  <button
                    type="button"
                    onClick={close}
                    className="resource-cta resource-cta-primary"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="resource-modal-form" noValidate>
                  <p className="resource-modal-lede">
                    A partner will email you the PDF within an hour. We use these details
                    only to follow up on what you&rsquo;ve requested.
                  </p>

                  <div className="resource-modal-row">
                    <label className="resource-modal-label">
                      <span>Full name</span>
                      <input
                        ref={firstFieldRef}
                        type="text"
                        name="name"
                        required
                        minLength={2}
                        autoComplete="name"
                        disabled={status === 'submitting'}
                      />
                    </label>
                    <label className="resource-modal-label">
                      <span>Work email</span>
                      <input
                        type="email"
                        name="email"
                        required
                        autoComplete="email"
                        placeholder="you@company.com"
                        disabled={status === 'submitting'}
                      />
                    </label>
                  </div>

                  <div className="resource-modal-row">
                    <label className="resource-modal-label">
                      <span>Company</span>
                      <input
                        type="text"
                        name="company"
                        required
                        minLength={2}
                        autoComplete="organization"
                        disabled={status === 'submitting'}
                      />
                    </label>
                    <label className="resource-modal-label">
                      <span>
                        Your role
                        <span className="resource-modal-optional"> · optional</span>
                      </span>
                      <select name="role" defaultValue="" disabled={status === 'submitting'}>
                        <option value="">Select…</option>
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  {status === 'error' ? (
                    <p className="resource-modal-error" role="alert">
                      {message}
                    </p>
                  ) : null}

                  <div className="resource-modal-actions">
                    <button
                      type="button"
                      className="resource-cta resource-cta-ghost"
                      onClick={close}
                      disabled={status === 'submitting'}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="resource-cta resource-cta-primary"
                      disabled={status === 'submitting'}
                      aria-busy={status === 'submitting'}
                    >
                      {status === 'submitting' ? 'Sending…' : 'Send me the PDF'}
                      <ArrowRight size={14} aria-hidden="true" />
                    </button>
                  </div>

                  {status === 'error' ? (
                    <button
                      type="button"
                      onClick={reopen}
                      className="resource-modal-reset"
                    >
                      Reset form
                    </button>
                  ) : null}
                </form>
              )}
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
