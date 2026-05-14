import { getTranslations } from 'next-intl/server';
import dynamic from 'next/dynamic';

// BarcodeScanner requires camera API — client only
const BarcodeScanner = dynamic(
  () => import('@/components/scanner/BarcodeScanner'),
  { ssr: false, loading: () => <p className="text-center py-12 text-gray-500">Cargando escáner…</p> },
);

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'scanner' });
  return { title: `VerifEye — ${t('title')}` };
}

export default async function ScanPage({ params }: Props) {
  const { locale } = await params;
  return <BarcodeScanner locale={locale} />;
}
