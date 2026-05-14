import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import LinkBadge from '@/components/ui/LinkBadge';
import type { LinkLevel, ProductCategory } from '@/lib/supabase/types';

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; link_type?: string; q?: string; page?: string }>;
};

const CATEGORIES: ProductCategory[] = ['food', 'cosmetics', 'technology', 'fashion', 'household', 'other'];
const LINK_LEVELS: LinkLevel[] = ['none', 'indirect', 'direct', 'produced_in_israel', 'produced_in_settlements'];

async function fetchProducts(params: URLSearchParams) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/products?${params.toString()}`, { next: { revalidate: 60 } });
  if (!res.ok) return { products: [], pagination: { page: 1, total: 0, totalPages: 0, limit: 20 } };
  return res.json();
}

export default async function DirectoryPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const sp = await searchParams;

  const [, tCat, tLevel, tDir] = await Promise.all([
    getTranslations({ locale, namespace: 'product' }),
    getTranslations({ locale, namespace: 'categories' }),
    getTranslations({ locale, namespace: 'linkLevel' }),
    getTranslations({ locale, namespace: 'directory' }),
  ]);

  const urlParams = new URLSearchParams();
  if (sp.category) urlParams.set('category', sp.category);
  if (sp.link_type) urlParams.set('link_type', sp.link_type);
  if (sp.q) urlParams.set('q', sp.q);
  if (sp.page) urlParams.set('page', sp.page);
  urlParams.set('limit', '20');

  const { products, pagination } = await fetchProducts(urlParams);

  const buildUrl = (overrides: Record<string, string>) => {
    const p = new URLSearchParams({ ...Object.fromEntries(urlParams), ...overrides });
    return `/${locale}/directory?${p.toString()}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{tDir('title')}</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        {/* Category filter */}
        <select
          defaultValue={sp.category ?? ''}
          onChange={undefined} // server-driven via form
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          form="filter-form"
          name="category"
        >
          <option value="">{tDir('allCategories')}</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{tCat(cat)}</option>
          ))}
        </select>

        {/* Link type filter */}
        <select
          defaultValue={sp.link_type ?? ''}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          form="filter-form"
          name="link_type"
        >
          <option value="">{tDir('allLinks')}</option>
          {LINK_LEVELS.map((level) => (
            <option key={level} value={level}>{tLevel(level)}</option>
          ))}
        </select>

        {/* Hidden form for filter submission */}
        <form id="filter-form" action={`/${locale}/directory`} method="GET">
          <input type="hidden" name="q" value={sp.q ?? ''} />
          <button
            type="submit"
            className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800"
          >
            Filtrar
          </button>
        </form>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-500 mb-4">
        {pagination.total} productos encontrados
      </p>

      {/* Product list */}
      {products.length === 0 ? (
        <p className="text-gray-500 text-center py-12">{tDir('noResults')}</p>
      ) : (
        <div className="space-y-2">
          {products.map((product: Parameters<typeof LinkBadge>[0] & { id: string; ean: string; name: string; brand: string; country_of_origin: string; link_level: LinkLevel; image_url: string | null; category: string }) => (
            <Link
              key={product.id}
              href={`/${locale}/product/${product.ean}`}
              className="flex items-center justify-between bg-white rounded-xl border border-gray-200 px-4 py-3 hover:border-blue-300 hover:shadow-sm transition-all"
            >
              <div className="min-w-0">
                <p className="font-medium text-gray-900 truncate">{product.name}</p>
                <p className="text-sm text-gray-500">{product.brand} · {product.country_of_origin}</p>
              </div>
              <div className="ml-4 flex-shrink-0">
                <LinkBadge level={product.link_level} label={tLevel(product.link_level)} size="sm" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          {pagination.page > 1 && (
            <Link
              href={buildUrl({ page: String(pagination.page - 1) })}
              className="text-blue-600 hover:underline text-sm"
            >
              ← Anterior
            </Link>
          )}
          <span className="text-sm text-gray-500">
            Página {pagination.page} de {pagination.totalPages}
          </span>
          {pagination.page < pagination.totalPages && (
            <Link
              href={buildUrl({ page: String(pagination.page + 1) })}
              className="text-blue-600 hover:underline text-sm"
            >
              Siguiente →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
