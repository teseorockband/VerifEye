import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

const MAX_DESC_LENGTH = 2000;
const EAN_REGEX = /^\d{8,14}$/;
const URL_REGEX = /^https?:\/\/.+/;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { product_ean, description, source_url } = body as Record<string, string>;

  // Validation
  if (!product_ean || !EAN_REGEX.test(product_ean)) {
    return NextResponse.json({ error: 'Invalid EAN code' }, { status: 400 });
  }
  if (!description || description.trim().length < 10) {
    return NextResponse.json({ error: 'Description too short (min 10 chars)' }, { status: 400 });
  }
  if (description.length > MAX_DESC_LENGTH) {
    return NextResponse.json({ error: 'Description too long' }, { status: 400 });
  }
  if (!source_url || !URL_REGEX.test(source_url)) {
    return NextResponse.json(
      { error: 'A valid source URL is required (must start with http:// or https://)' },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  // Get current user (optional)
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from('user_reports').insert({
    product_ean,
    description: description.trim(),
    source_url,
    user_id: user?.id ?? null,
    status: 'pending',
  });

  if (error) {
    console.error('Report insert error:', error);
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
