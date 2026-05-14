import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { fetchOFFProduct, extractCountryFromTags } from '@/lib/openfoodfacts';

export const runtime = 'nodejs';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ean: string }> },
) {
  const { ean } = await params;

  if (!/^\d{8,14}$/.test(ean)) {
    return NextResponse.json({ error: 'Invalid EAN format' }, { status: 400 });
  }

  const supabase = await createClient();

  // 1. Fetch base product
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('ean', ean)
    .single();

  if (error) {
    console.error('Supabase product error:', JSON.stringify(error));
  }

  if (error || !product) {
    // 2. Fallback: Open Food Facts
    const offProduct = await fetchOFFProduct(ean);
    if (!offProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    const countryCode = extractCountryFromTags(offProduct.countries_tags) ?? 'XX';
    return NextResponse.json({
      product: {
        id: null,
        ean: offProduct.code,
        name: offProduct.product_name || 'Unknown product',
        brand: offProduct.brands || 'Unknown brand',
        category: 'other',
        country_of_origin: countryCode,
        company: null,
        image_url: offProduct.image_url,
        link_level: 'none',
        link_summary: null,
        last_verified: null,
        relationships: [],
        alternatives: [],
      },
      source: 'openfoodfacts',
      note: 'Product found in Open Food Facts but not yet in VerifEye database.',
    });
  }

  // 3. Fetch relationships for this product (polymorphic — query manually)
  const { data: relationships } = await supabase
    .from('relationships')
    .select('*, source:sources(*)')
    .eq('subject_type', 'product')
    .eq('subject_id', product.id);

  // 4. Fetch alternatives
  const { data: alternatives } = await supabase
    .from('alternatives')
    .select('*, alternative_product:products!alternatives_alternative_product_id_fkey(*)')
    .eq('product_id', product.id);

  return NextResponse.json({
    product: {
      ...product,
      relationships: relationships ?? [],
      alternatives: alternatives ?? [],
    },
    source: 'database',
  });
}
