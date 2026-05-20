'use client';

import { useState, type FormEvent } from 'react';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { services } from '@/content/site';
import { Magnetic } from '@/components/motion-primitives';

type ServiceChoice = {
  slug: string;
  label: string;
};

const SERVICE_CHOICES: ServiceChoice[] = [
  ...services.map((s) => ({ slug: s.slug, label: s.title })),
  { slug: 'general', label: 'General enquiry' },
];

const BRIEF_PLACEHOLDER = [
  'A few sentences are enough. For example —',
  '• Series A fundraise, target $8M, looking to start in 6 weeks.',
  '• Statutory audit for FY ending March; current auditor rotating out.',
  '• AIF setup for an early-stage thesis; need help on structuring and SEBI compliance.',
].join('\n');

const CITIES: { value: string; label: string }[] = [
  { value: 'any', label: 'Any office' },
  { value: 'gurugram', label: 'Gurugram (HQ)' },
  { value: 'jaipur', label: 'Jaipur' },
  { value: 'bhatinda', label: 'Bhatinda' },
  { value: 'faridabad', label: 'Faridabad' },
  { value: 'bengaluru', label: 'Bengaluru' },
];

type Status = 'idle' | 'submitting' | 'ok' | 'error';

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.05 },
  },
};

const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export function ContactForm() {
  const reduceMotion = useReducedMotion();
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState<string>('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'submitting') return;
    const fd = new FormData(e.currentTarget);
    const body = {
      name: String(fd.get('name') ?? ''),
      company: String(fd.get('company') ?? ''),
      email: String(fd.get('email') ?? ''),
      phone: String(fd.get('phone') ?? ''),
      serviceInterest: String(fd.get('serviceInterest') ?? ''),
      preferredCity: String(fd.get('preferredCity') ?? ''),
      message: String(fd.get('message') ?? ''),
      consent: fd.get('consent') === 'on',
    };
    setStatus('submitting');
    setMessage('');
    try {
      const res = await fetch('/api/contact/submit', {
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

  return (
    <motion.div
      className="contact-card"
      initial={reduceMotion ? 'visible' : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={containerVariants}
    >
      <AnimatePresence mode="wait">
        {status === 'ok' ? (
          <motion.div
            key="success"
            className="contact-success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            role="status"
          >
            <span className="contact-success-mark" aria-hidden="true">
              <Check size={28} strokeWidth={3} />
            </span>
            <p className="contact-success-title">Brief received.</p>
            <p className="contact-success-text">{message}</p>
            <p className="contact-success-hint">
              While you wait, you can also email a partner directly at{' '}
              <a href="mailto:info@nucleusadvisors.in">info@nucleusadvisors.in</a>.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            className="contact-form"
            onSubmit={handleSubmit}
            noValidate
            variants={containerVariants}
          >
            <motion.div className="contact-form-head" variants={fieldVariants}>
              <h2>Tell us what you&rsquo;re working on.</h2>
              <p>We&rsquo;ll reach out to you within 24 hours.</p>
            </motion.div>

            <motion.div className="contact-field-row" variants={fieldVariants}>
              <label className="contact-field">
                <span className="contact-field-label">Full name</span>
                <input
                  name="name"
                  type="text"
                  required
                  minLength={2}
                  autoComplete="name"
                  disabled={status === 'submitting'}
                />
              </label>
              <label className="contact-field">
                <span className="contact-field-label">Company</span>
                <input
                  name="company"
                  type="text"
                  required
                  minLength={2}
                  autoComplete="organization"
                  disabled={status === 'submitting'}
                />
              </label>
            </motion.div>

            <motion.div className="contact-field-row" variants={fieldVariants}>
              <label className="contact-field">
                <span className="contact-field-label">Work email</span>
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@company.com"
                  disabled={status === 'submitting'}
                />
              </label>
              <label className="contact-field">
                <span className="contact-field-label">
                  Phone
                  <span className="contact-field-optional"> · optional</span>
                </span>
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  disabled={status === 'submitting'}
                />
              </label>
            </motion.div>

            <motion.div className="contact-field-row" variants={fieldVariants}>
              <label className="contact-field">
                <span className="contact-field-label">What&rsquo;s the work?</span>
                <select
                  name="serviceInterest"
                  defaultValue=""
                  required
                  disabled={status === 'submitting'}
                >
                  <option value="" disabled>
                    Select a practice
                  </option>
                  {SERVICE_CHOICES.map((choice) => (
                    <option key={choice.slug} value={choice.slug}>
                      {choice.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="contact-field">
                <span className="contact-field-label">Preferred office</span>
                <select
                  name="preferredCity"
                  defaultValue="any"
                  disabled={status === 'submitting'}
                >
                  {CITIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </label>
            </motion.div>

            <motion.label
              className="contact-field contact-field-full"
              variants={fieldVariants}
            >
              <span className="contact-field-label">Brief</span>
              <textarea
                name="message"
                rows={6}
                required
                minLength={20}
                placeholder={BRIEF_PLACEHOLDER}
                disabled={status === 'submitting'}
              />
            </motion.label>

            <motion.label className="contact-consent" variants={fieldVariants}>
              <input
                type="checkbox"
                name="consent"
                required
                disabled={status === 'submitting'}
              />
              <span>
                I consent to Nucleus Advisors using this information to respond to my enquiry.
              </span>
            </motion.label>

            {status === 'error' ? (
              <p className="contact-error" role="alert">
                {message}
              </p>
            ) : null}

            <motion.div className="contact-submit-row" variants={fieldVariants}>
              <Magnetic strength={0.22}>
                <button
                  type="submit"
                  className="contact-submit"
                  disabled={status === 'submitting'}
                  aria-busy={status === 'submitting'}
                >
                  <span>
                    {status === 'submitting' ? 'Sending…' : 'Send brief'}
                  </span>
                  <ArrowRight aria-hidden="true" size={16} />
                </button>
              </Magnetic>
              <span className="contact-submit-aside">
                Or email{' '}
                <a href="mailto:info@nucleusadvisors.in">info@nucleusadvisors.in</a>
              </span>
            </motion.div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
