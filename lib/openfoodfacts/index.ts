const OFF_BASE = 'https://world.openfoodfacts.org/api/v2';

export interface OFFProduct {
  code: string;
  product_name: string;
  brands: string;
  countries_tags: string[];
  image_url: string | null;
  categories_tags: string[];
}

export async function fetchOFFProduct(ean: string): Promise<OFFProduct | null> {
  try {
    const res = await fetch(`${OFF_BASE}/product/${ean}?fields=code,product_name,brands,countries_tags,image_url,categories_tags`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.status !== 1 || !data.product) return null;
    return data.product as OFFProduct;
  } catch {
    return null;
  }
}

/**
 * Maps Open Food Facts country tags to ISO 3166-1 alpha-2 codes.
 * e.g. "en:france" → "FR"
 */
export function extractCountryFromTags(tags: string[]): string | null {
  if (!tags || tags.length === 0) return null;
  const tag = tags[0]; // first tag is primary country
  const parts = tag.split(':');
  const name = parts[parts.length - 1];
  return name ? name.toUpperCase().slice(0, 2) : null;
}
