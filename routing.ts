import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['es', 'en', 'fr', 'it'],
  defaultLocale: 'es',
  localePrefix: 'always',
});
