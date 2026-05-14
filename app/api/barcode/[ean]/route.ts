import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { fetchOFFProduct, extractCountryFromTags } from '@/lib/openfoodfacts';
import { isIsraeliPrefix, getIsraeliPrefixExplanation } from '@/lib/classification/prefixes';

export const runtime = 'nodejs';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ean: string }> },
) {
  const { ean } = await params;

  if (!/^\d{8,14}$/.test(ean)) {
    return NextResponse.json({ error: 'Invalid EAN format' }, { status: 400 });
  }

  const israeliPrefix = isIsraeliPrefix(ean);
  const supabase = await createClient();

  // 1. Look up in our database first
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('ean', ean)
    .single();

  if (error) {
    console.error('Supabase product error:', JSON.stringify(error));
  }

  if (!error && product) {
    // Product found in DB — fetch relationships and alternatives
    const { data: relationships } = await supabase
      .from('relationships')
      .select('*, source:sources(*)')
      .eq('subject_type', 'product')
      .eq('subject_id', product.id);

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

  // 2. Not in DB — try Open Food Facts
  const offProduct = await fetchOFFProduct(ean);

  // 3. Determine link level from prefix detection
  const detectedLinkLevel = israeliPrefix ? 'produced_in_israel' : 'none';
  const detectedCountry = israeliPrefix ? 'IL' : null;

  if (!offProduct && !israeliPrefix) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  const countryCode = offProduct
    ? (extractCountryFromTags(offProduct.countries_tags) ?? detectedCountry ?? 'XX')
    : (detectedCountry ?? 'XX');

  // Build synthetic relationships from prefix detection
  const prefixRelationship = israeliPrefix
    ? [{
        id: 'prefix-detection',
        subject_type: 'product',
        subject_id: null,
        object_type: 'country',
        object_id: 'IL',
        link_type: 'produced_in_israel',
        description: getIsraeliPrefixExplanation(ean),
        source_id: 'gs1',
        verified_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        source: {
          id: 'gs1',
          name: 'GS1 Global Registry',
          url: 'https://www.gs1.org/services/verified-by-gs1',
          description: 'Sistema internacional de codificación de productos',
          last_checked: new Date().toISOString(),
        },
      }]
    : [];

  return NextResponse.json({
    product: {
      id: null,
      ean: offProduct?.code ?? ean,
      name: offProduct?.product_name || 'Producto desconocido',
      brand: offProduct?.brands || 'Marca desconocida',
      category: 'other',
      country_of_origin: countryCode,
      company: null,
      image_url: offProduct?.image_url ?? null,
      link_level: detectedLinkLevel,
      link_summary: israeliPrefix ? getIsraeliPrefixExplanation(ean) : null,
      last_verified: null,
      relationships: prefixRelationship,
      alternatives: [],
    },
    source: offProduct ? 'openfoodfacts+prefix' : 'prefix',
    note: israeliPrefix
      ? 'Producto detectado como israelí por prefijo GS1 (729). No está aún en la base de datos de VerifEye.'
      : 'Producto encontrado en Open Food Facts pero no en la base de datos de VerifEye.',
  });
}
