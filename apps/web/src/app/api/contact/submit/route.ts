import { NextRequest, NextResponse } from 'next/server';
import { services } from '@/content/site';

/**
 * Contact-form submission capture (Phase 1 stub).
 *
 * Mirrors the /api/resources/request shape: the route validates the
 * payload server-side and logs each submission as structured JSON for
 * the team to read in dev. Phase 1.5 swaps the console.warn for a
 * Supabase `lead_captures` insert + transactional email. No third-
 * party calls in this file — keeps the "no fake delivery" contract
 * intact through Vercel review.
 */

type RequestBody = {
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  serviceInterest?: string;
  preferredCity?: string;
  message?: string;
  consent?: boolean;
};

const VALID_CITIES = new Set([
  '',
  'any',
  'gurugram',
  'jaipur',
  'bhatinda',
  'faridabad',
  'bengaluru',
]);

const VALID_SERVICE_SLUGS = new Set([
  ...services.map((s) => s.slug),
  'general',
]);

function isLikelyEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: NextRequest) {
  let payload: RequestBody;
  try {
    payload = (await request.json()) as RequestBody;
  } catch {
    return NextResponse.json(
      { ok: false, message: 'Invalid request body.' },
      { status: 400 },
    );
  }

  const name = typeof payload.name === 'string' ? payload.name.trim() : '';
  const company =
    typeof payload.company === 'string' ? payload.company.trim() : '';
  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const phone = typeof payload.phone === 'string' ? payload.phone.trim() : '';
  const serviceInterest =
    typeof payload.serviceInterest === 'string'
      ? payload.serviceInterest.trim()
      : '';
  const preferredCity =
    typeof payload.preferredCity === 'string'
      ? payload.preferredCity.trim().toLowerCase()
      : '';
  const message =
    typeof payload.message === 'string' ? payload.message.trim() : '';
  const consent = payload.consent === true;

  if (!name || name.length < 2) {
    return NextResponse.json(
      { ok: false, message: 'Your name is required.' },
      { status: 400 },
    );
  }
  if (!company || company.length < 2) {
    return NextResponse.json(
      { ok: false, message: 'Company name is required.' },
      { status: 400 },
    );
  }
  if (!email || !isLikelyEmail(email)) {
    return NextResponse.json(
      { ok: false, message: 'A valid work email is required.' },
      { status: 400 },
    );
  }
  if (!serviceInterest || !VALID_SERVICE_SLUGS.has(serviceInterest)) {
    return NextResponse.json(
      { ok: false, message: 'Please pick what the work is.' },
      { status: 400 },
    );
  }
  if (preferredCity && !VALID_CITIES.has(preferredCity)) {
    return NextResponse.json(
      { ok: false, message: 'Unrecognised office choice.' },
      { status: 400 },
    );
  }
  if (!message || message.length < 20) {
    return NextResponse.json(
      {
        ok: false,
        message: 'Add a short brief (20 characters minimum) so we can match the right partner.',
      },
      { status: 400 },
    );
  }
  if (!consent) {
    return NextResponse.json(
      { ok: false, message: 'Please tick the consent box to continue.' },
      { status: 400 },
    );
  }

  // Phase 1 capture. Same shape Phase 1.5 will persist to Supabase.
  console.warn(
    '[contact-submit]',
    JSON.stringify({
      receivedAt: new Date().toISOString(),
      name,
      company,
      email,
      phone: phone || null,
      serviceInterest,
      preferredCity: preferredCity || null,
      message,
      consent,
    }),
  );

  return NextResponse.json({
    ok: true,
    message: `Thanks, ${name.split(' ')[0]}. We'll reach out to ${email} within 24 hours.`,
  });
}
