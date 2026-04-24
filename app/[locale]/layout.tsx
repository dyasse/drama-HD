import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { AppHeader } from '../../components/layout/app-header';
import { ThemeProvider } from '../../components/theme-provider';
import { isValidLocale, type Locale } from '../../i18n/config';

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) notFound();

  return (
    <ThemeProvider>
      <div lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="mx-auto max-w-7xl px-4 pb-8">
        <AppHeader locale={locale as Locale} />
        {children}
      </div>
    </ThemeProvider>
  );
}
