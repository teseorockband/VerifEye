'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  locale: string;
}

export default function Navbar({ locale }: NavbarProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();

  const links = [
    { href: `/${locale}`, label: 'VerifEye', isLogo: true },
    { href: `/${locale}/scan`, label: t('scan') },
    { href: `/${locale}/directory`, label: t('directory') },
  ];

  return (
    <nav className="bg-blue-800 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          {links.map(({ href, label, isLogo }) => (
            <Link
              key={href}
              href={href}
              className={
                isLogo
                  ? 'text-xl font-bold tracking-tight'
                  : `text-sm font-medium hover:text-blue-200 transition-colors ${
                      pathname === href ? 'text-blue-200 underline' : ''
                    }`
              }
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Locale switcher */}
        <div className="flex items-center gap-2 text-xs">
          {(['es', 'en', 'fr', 'it'] as const).map((loc) => {
            const newPath = pathname.replace(`/${locale}`, `/${loc}`);
            return (
              <Link
                key={loc}
                href={newPath}
                className={`uppercase px-1 hover:text-blue-200 ${loc === locale ? 'font-bold underline' : ''}`}
              >
                {loc}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
