import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import SearchBar from '@/components/search/SearchBar';

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'home' });

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-800 mb-3">{t('title')}</h1>
        <p className="text-lg text-gray-600 max-w-md mx-auto">{t('tagline')}</p>
      </div>

      {/* Search */}
      <div className="w-full max-w-lg mb-8">
        <SearchBar locale={locale} placeholder={t('searchPlaceholder')} />
      </div>

      {/* CTA scan */}
      <Link
        href={`/${locale}/scan`}
        className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-full shadow transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m0 14v1M4 12h1m14 0h1M6.343 6.343l.707.707m9.9 9.9.707.707M6.343 17.657l.707-.707m9.9-9.9.707-.707" />
        </svg>
        {t('scanCta')}
      </Link>

      {/* Directory shortcut */}
      <Link
        href={`/${locale}/directory`}
        className="mt-4 text-sm text-blue-600 hover:underline"
      >
        Ver directorio completo →
      </Link>
    </div>
  );
}
