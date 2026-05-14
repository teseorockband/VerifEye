'use client';

import { useTranslations } from 'next-intl';

export default function Footer() {
  const t = useTranslations('disclaimer');

  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-6 text-center">
        <p className="text-xs text-gray-500 mb-2">{t('text')}</p>
        <a
          href="/methodology"
          className="text-xs text-blue-600 hover:underline"
        >
          {t('methodology')}
        </a>
        <p className="text-xs text-gray-400 mt-4">
          VerifEye © {new Date().getFullYear()} — Datos bajo licencias abiertas. Sin garantía de exactitud.
        </p>
      </div>
    </footer>
  );
}
