import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { isValidLocale } from '../../i18n/config';

type LocaleLayoutProps = {
  children: ReactNode;
  params: { locale: string };
};

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <div lang={locale} dir={dir} style={{ padding: '2rem 1.25rem' }}>
      {children}
    </div>
  );
}
