import { NextRequest, NextResponse } from 'next/server';

type LeadMagnetStubBody = {
  email?: string;
  name?: string;
  message?: string;
  kind?: 'lead-magnet' | 'insights-subscribe' | 'article-lead';
  serviceSlug?: string;
  articleSlug?: string;
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
  const name = typeof payload.name === 'string' ? payload.name.trim().slice(0, 160) : '';
  const message = typeof payload.message === 'string' ? payload.message.trim().slice(0, 2000) : '';

  // Phase 1 stub: log the submission for team visibility, do NOT persist anywhere.
  // Phase 1.5 will replace this with a Supabase write. Do not add any third-party
  // calls here. That would break the "no fake delivery" contract.
  console.warn(
    '[lead-magnet-stub]',
    JSON.stringify({
      kind: payload.kind ?? 'lead-magnet',
      serviceSlug: payload.serviceSlug ?? null,
      articleSlug: payload.articleSlug ?? null,
      hasName: name.length > 0,
      hasMessage: message.length > 0,
      receivedAt: new Date().toISOString(),
    }),
  );

  const friendlyMessage =
    payload.kind === 'article-lead'
      ? 'Thank you. A partner will reach out within one business day.'
      : "We'll be in touch when this content is published.";

  return NextResponse.json({ ok: true, message: friendlyMessage });
}
