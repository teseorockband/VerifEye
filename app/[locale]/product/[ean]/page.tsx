import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import LinkBadge from '@/components/ui/LinkBadge';
import ProductCard from '@/components/product/ProductCard';
import { requiresWarning } from '@/lib/classification';
import type { ProductDetail } from '@/lib/supabase/types';

type Props = { params: Promise<{ locale: string; ean: string }> };

async function fetchProduct(ean: string): Promise<ProductDetail | null> {
  // Use internal API (works server-side via absolute URL in SSR)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const res = await fetch(`${baseUrl}/api/barcode/${ean}`, { next: { revalidate: 3600 } });
  if (!res.ok) return null;
  const data = await res.json();
  return data.product ?? null;
}

export async function generateMetadata({ params }: Props) {
  const { locale, ean } = await params;
  const product = await fetchProduct(ean);
  const t = await getTranslations({ locale, namespace: 'product' });
  return {
    title: product ? `VerifEye — ${product.name}` : `VerifEye — ${t('origin')}`,
  };
}

export default async function ProductPage({ params }: Props) {
  const { locale, ean } = await params;
  const [product, t, tLevel, tErrors] = await Promise.all([
    fetchProduct(ean),
    getTranslations({ locale, namespace: 'product' }),
    getTranslations({ locale, namespace: 'linkLevel' }),
    getTranslations({ locale, namespace: 'errors' }),
  ]);

  if (!product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-xl text-gray-500">{tErrors('notFound')}</p>
        <Link href={`/${locale}`} className="mt-4 inline-block text-blue-600 hover:underline">
          ← Volver al inicio
        </Link>
      </div>
    );
  }

  const levelLabel = tLevel(product.link_level);
  const showWarning = requiresWarning(product.link_level);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        {product.image_url && (
          <Image
            src={product.image_url}
            alt={product.name}
            width={80}
            height={80}
            className="rounded-lg object-contain bg-gray-50 border"
          />
        )}
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
          <p className="text-gray-500">{product.brand}</p>
          <p className="text-xs text-gray-400 mt-1">EAN: {product.ean}</p>
        </div>
      </div>

      {/* Link level card */}
      <div className={`rounded-xl border-2 p-5 space-y-2 ${
        showWarning ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'
      }`}>
        <div className="flex items-center gap-3">
          <LinkBadge level={product.link_level} label={levelLabel} size="lg" />
        </div>
        {product.link_summary && (
          <p className="text-sm text-gray-700">{product.link_summary}</p>
        )}
      </div>

      {/* Details */}
      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
        <DetailRow label={t('origin')} value={product.country_of_origin} />
        {product.company && (
          <>
            <DetailRow label={t('manufacturer')} value={product.company.name} />
            {product.company.parent_company && (
              <DetailRow label={t('parentCompany')} value={product.company.parent_company.name} />
            )}
          </>
        )}
        {product.last_verified && (
          <DetailRow
            label={t('lastVerified')}
            value={new Date(product.last_verified).toLocaleDateString(locale, {
              year: 'numeric', month: 'long', day: 'numeric',
            })}
          />
        )}
      </div>

      {/* Sources */}
      {product.relationships && product.relationships.length > 0 && (
        <section>
          <h2 className="font-semibold text-gray-800 mb-3">{t('sources')}</h2>
          <ul className="space-y-2">
            {product.relationships.map((rel) => (
              <li key={rel.id} className="bg-white rounded-lg border border-gray-200 p-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-gray-700">{rel.description}</span>
                  <LinkBadge level={rel.link_type} label={tLevel(rel.link_type)} size="sm" />
                </div>
                {rel.source && (
                  <a
                    href={rel.source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 text-xs text-blue-600 hover:underline block"
                  >
                    {rel.source.name} ↗
                  </a>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Alternatives */}
      <section>
        <h2 className="font-semibold text-gray-800 mb-3">{t('alternatives')}</h2>
        {product.alternatives && product.alternatives.length > 0 ? (
          <div className="space-y-2">
            {product.alternatives.map((alt) => (
              alt.alternative_product && (
                <div key={alt.id}>
                  <ProductCard
                    product={alt.alternative_product}
                    locale={locale}
                    linkLevelLabel={tLevel(alt.alternative_product.link_level)}
                  />
                  {alt.reason && (
                    <p className="text-xs text-gray-500 mt-1 px-1">{alt.reason}</p>
                  )}
                </div>
              )
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">{t('noAlternatives')}</p>
        )}
      </section>

      {/* Report link */}
      <div className="text-center pt-4">
        <Link
          href={`/${locale}/report?ean=${product.ean}`}
          className="text-sm text-gray-500 hover:text-blue-600 hover:underline"
        >
          {t('reportError')} →
        </Link>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}
