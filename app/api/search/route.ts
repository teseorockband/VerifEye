import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim() ?? '';

  if (q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  if (q.length > 100) {
    return NextResponse.json({ error: 'Query too long' }, { status: 400 });
  }

  const supabase = await createClient();

  // Use pg_trgm similarity via ilike for autocomplete
  const { data, error } = await supabase
    .from('products')
    .select('id, ean, name, brand, category, link_level')
    .or(`name.ilike.%${q}%,brand.ilike.%${q}%`)
    .order('link_level', { ascending: false }) // surface relevant results first
    .limit(10);

  if (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }

  return NextResponse.json({ results: data ?? [] });
}
