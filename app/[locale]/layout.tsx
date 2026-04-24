import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { isValidLocale } from '../../i18n/config';

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <div lang={locale} dir={dir}>
      {children}
    </div>
  );
}
