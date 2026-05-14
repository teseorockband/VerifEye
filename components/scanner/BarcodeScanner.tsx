'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { BrowserMultiFormatReader, NotFoundException } from '@zxing/library';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

interface BarcodeScannerProps {
  locale: string;
}

export default function BarcodeScanner({ locale }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'found' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [showManual, setShowManual] = useState(false);
  const router = useRouter();
  const t = useTranslations('scanner');
  const tErr = useTranslations('errors');

  const navigateToProduct = useCallback(
    (ean: string) => {
      setStatus('found');
      router.push(`/${locale}/product/${ean}`);
    },
    [locale, router],
  );

  const startScanning = useCallback(async () => {
    if (!videoRef.current) return;
    setStatus('scanning');
    setError(null);

    try {
      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;

      await reader.decodeFromVideoDevice(undefined, videoRef.current, (result, err) => {
        if (result) {
          reader.reset();
          navigateToProduct(result.getText());
        } else if (err && !(err instanceof NotFoundException)) {
          console.warn('Scan error:', err);
        }
      });
    } catch (err) {
      console.error('Camera error:', err);
      setStatus('error');
      setError(tErr('scanError'));
    }
  }, [navigateToProduct, tErr]);

  useEffect(() => {
    startScanning();
    return () => {
      readerRef.current?.reset();
    };
  }, [startScanning]);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = manualCode.trim();
    if (/^\d{8,14}$/.test(code)) {
      navigateToProduct(code);
    } else {
      setError('Código inválido. Debe tener entre 8 y 14 dígitos.');
    }
  };

  return (
    <div className="flex flex-col items-center gap-6 py-8 px-4">
      <h1 className="text-2xl font-bold text-gray-800">{t('title')}</h1>

      {/* Video viewfinder */}
      <div className="relative w-full max-w-sm aspect-square bg-black rounded-2xl overflow-hidden shadow-lg">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
        />
        {/* Scan frame overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-56 h-40 border-4 border-blue-400 rounded-lg opacity-80" />
        </div>
        {status === 'scanning' && (
          <div className="absolute bottom-4 left-0 right-0 text-center">
            <span className="bg-black/60 text-white text-xs px-3 py-1 rounded-full">
              {t('instructions')}
            </span>
          </div>
        )}
        {status === 'found' && (
          <div className="absolute inset-0 bg-green-500/30 flex items-center justify-center">
            <span className="text-white text-xl font-bold">✓</span>
          </div>
        )}
        {status === 'error' && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center p-4">
            <p className="text-white text-sm text-center">{error}</p>
          </div>
        )}
      </div>

      {/* Manual entry toggle */}
      <button
        type="button"
        onClick={() => setShowManual((v) => !v)}
        className="text-sm text-blue-600 hover:underline"
      >
        {t('manualEntry')}
      </button>

      {showManual && (
        <form onSubmit={handleManualSubmit} className="flex gap-2 w-full max-w-sm">
          <input
            type="tel"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="8-14 dígitos"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={14}
          />
          <button
            type="submit"
            className="bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-800"
          >
            Buscar
          </button>
        </form>
      )}

      {error && status !== 'error' && (
        <p className="text-red-600 text-sm">{error}</p>
      )}
    </div>
  );
}
