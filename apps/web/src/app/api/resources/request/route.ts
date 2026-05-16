import { NextRequest, NextResponse } from 'next/server';
import { getResourceBySlug } from '@/content/resources';

/**
 * Resource request capture (Phase 1 stub).
 *
 * A visitor clicks "Get this" on a downloadable resource, the modal
 * collects their details, and posts here. Phase 1 logs the capture
 * for team visibility; Phase 1.5 will swap the console.warn for a
 * Supabase insert into `lead_captures` and email delivery via the
 * marketing service. Do not add third-party calls in this file —
 * keeps Vijay's "no fake delivery" contract intact.
 */

type RequestBody = {
  resourceSlug?: string;
  name?: string;
  email?: string;
  company?: string;
  role?: string;
};

const ROLE_ALLOWLIST = new Set([
  'Founder / CEO',
  'CFO / Finance lead',
  'Investor',
  'Operator',
  'Advisor',
  'Other',
]);

function isLikelyEmail(value: string): boolean {
  // Tight enough to reject obviously broken input, loose enough not to
  // false-reject legitimate addresses. Real validation happens on send.
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
  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  const company = typeof payload.company === 'string' ? payload.company.trim() : '';
  const role = typeof payload.role === 'string' ? payload.role.trim() : '';
  const resourceSlug = typeof payload.resourceSlug === 'string' ? payload.resourceSlug.trim() : '';

  if (!name || name.length < 2) {
    return NextResponse.json(
      { ok: false, message: 'Your name is required.' },
      { status: 400 },
    );
  }
  if (!email || !isLikelyEmail(email)) {
    return NextResponse.json(
      { ok: false, message: 'A valid work email is required.' },
      { status: 400 },
    );
  }
  if (!company || company.length < 2) {
    return NextResponse.json(
      { ok: false, message: 'Company name is required.' },
      { status: 400 },
    );
  }
  if (role && !ROLE_ALLOWLIST.has(role)) {
    return NextResponse.json(
      { ok: false, message: 'Unexpected role value.' },
      { status: 400 },
    );
  }
  if (!resourceSlug) {
    return NextResponse.json(
      { ok: false, message: 'Resource identifier missing.' },
      { status: 400 },
    );
  }
  const resource = getResourceBySlug(resourceSlug);
  if (!resource) {
    return NextResponse.json(
      { ok: false, message: 'Unknown resource.' },
      { status: 404 },
    );
  }

  // Phase 1 capture: log structured JSON to the server console so the
  // team can see who is requesting what during the soft-launch period.
  // The same shape will be persisted to Supabase in Phase 1.5.
  console.warn(
    '[resource-request]',
    JSON.stringify({
      receivedAt: new Date().toISOString(),
      resourceSlug,
      resourceTitle: resource.title,
      resourceKind: resource.kind,
      serviceSlugs: resource.serviceSlugs,
      name,
      email,
      company,
      role: role || null,
    }),
  );

  return NextResponse.json({
    ok: true,
    message: `Thanks, ${name.split(' ')[0]}. We'll email "${resource.title}" to ${email} within an hour.`,
  });
}
