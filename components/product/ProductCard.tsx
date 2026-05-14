import Link from 'next/link';
import Image from 'next/image';
import LinkBadge from '@/components/ui/LinkBadge';
import type { Product } from '@/lib/supabase/types';

interface ProductCardProps {
  product: Pick<Product, 'id' | 'ean' | 'name' | 'brand' | 'category' | 'country_of_origin' | 'link_level' | 'image_url'>;
  locale: string;
  linkLevelLabel: string;
}

export default function ProductCard({ product, locale, linkLevelLabel }: ProductCardProps) {
  return (
    <Link
      href={`/${locale}/product/${product.ean}`}
      className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:border-blue-300 hover:shadow-sm transition-all"
    >
      {/* Image */}
      <div className="w-14 h-14 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            width={56}
            height={56}
            className="object-contain"
          />
        ) : (
          <span className="text-2xl">📦</span>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{product.name}</p>
        <p className="text-sm text-gray-500 truncate">{product.brand} · {product.country_of_origin}</p>
      </div>

      {/* Badge */}
      <div className="flex-shrink-0">
        <LinkBadge level={product.link_level} label={linkLevelLabel} size="sm" />
      </div>
    </Link>
  );
}
