import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const URL_REGEX = /^https?:\/\/.+/;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const {
    product_id,
    company_name,
    contact_email,
    description,
    documentation_url,
  } = body as Record<string, string>;

  if (!company_name || company_name.trim().length < 2) {
    return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
  }
  if (!contact_email || !EMAIL_REGEX.test(contact_email)) {
    return NextResponse.json({ error: 'Valid contact email is required' }, { status: 400 });
  }
  if (!description || description.trim().length < 20) {
    return NextResponse.json(
      { error: 'Description must be at least 20 characters' },
      { status: 400 },
    );
  }
  if (documentation_url && !URL_REGEX.test(documentation_url)) {
    return NextResponse.json(
      { error: 'Documentation URL must start with http:// or https://' },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  const { error } = await supabase.from('disputes').insert({
    product_id: product_id || null,
    company_name: company_name.trim(),
    contact_email,
    description: description.trim(),
    documentation_url: documentation_url || null,
    status: 'pending',
  });

  if (error) {
    console.error('Dispute insert error:', error);
    return NextResponse.json({ error: 'Failed to submit dispute' }, { status: 500 });
  }

  return NextResponse.json(
    {
      success: true,
      message:
        'Your dispute has been received and will be reviewed by our team. ' +
        'We will contact you at the provided email address.',
    },
    { status: 201 },
  );
}
