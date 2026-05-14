import { NextRequest, NextResponse } from 'next/server';

type LeadMagnetStubBody = {
  email?: string;
  kind?: 'lead-magnet' | 'insights-subscribe';
  serviceSlug?: string;
};

export async function POST(request: NextRequest) {
  let payload: LeadMagnetStubBody;
  try {
    payload = (await request.json()) as LeadMagnetStubBody;
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid request body.' }, { status: 400 });
  }

  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  if (!email || !email.includes('@')) {
    return NextResponse.json({ ok: false, message: 'A valid email is required.' }, { status: 400 });
  }

  // Phase 1 stub: log the submission for team visibility, do NOT persist anywhere.
  // Phase 1.5 will replace this with a Supabase write. Do not add any third-party
  // calls here — that breaks the "no fake delivery" contract.
  console.warn(
    '[lead-magnet-stub]',
    JSON.stringify({
      kind: payload.kind ?? 'lead-magnet',
      serviceSlug: payload.serviceSlug ?? null,
      receivedAt: new Date().toISOString(),
    }),
  );

  return NextResponse.json({
    ok: true,
    message: "We'll be in touch when this content is published.",
  });
}
