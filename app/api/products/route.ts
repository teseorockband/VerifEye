import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { LinkLevel, ProductCategory } from '@/lib/supabase/types';

export const runtime = 'nodejs';

const VALID_CATEGORIES: ProductCategory[] = [
  'food', 'cosmetics', 'technology', 'fashion', 'household', 'other',
];
const VALID_LINK_LEVELS: LinkLevel[] = [
  'none', 'indirect', 'direct', 'produced_in_israel', 'produced_in_settlements',
];

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const category = searchParams.get('category') as ProductCategory | null;
  const linkLevel = searchParams.get('link_type') as LinkLevel | null;
  const q = searchParams.get('q')?.trim() ?? '';
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') ?? '20', 10)));
  const offset = (page - 1) * limit;

  if (category && !VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
  }
  if (linkLevel && !VALID_LINK_LEVELS.includes(linkLevel)) {
    return NextResponse.json({ error: 'Invalid link_type' }, { status: 400 });
  }

  const supabase = await createClient();

  let query = supabase
    .from('products')
    .select('id, ean, name, brand, category, country_of_origin, link_level, link_summary, last_verified, image_url', { count: 'exact' });

  if (category) query = query.eq('category', category);
  if (linkLevel) query = query.eq('link_level', linkLevel);
  if (q.length >= 2) query = query.or(`name.ilike.%${q}%,brand.ilike.%${q}%`);

  query = query
    .order('link_level', { ascending: false })
    .order('name', { ascending: true })
    .range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) {
    console.error('Products list error:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }

  return NextResponse.json({
    products: data ?? [],
    pagination: {
      page,
      limit,
      total: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / limit),
    },
  });
}
