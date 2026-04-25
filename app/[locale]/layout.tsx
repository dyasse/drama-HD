import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { LocaleShell } from '../../components/layout/locale-shell';
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
      <LocaleShell locale={locale as Locale}>{children}</LocaleShell>
    </ThemeProvider>
  );
}
