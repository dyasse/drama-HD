'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import type { Locale } from '../../i18n/config';
import { AppFooter } from './app-footer';
import { AppHeader } from './app-header';
import { AppSidebar } from './app-sidebar';

export function LocaleShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const pathname = usePathname();
  const isCinemaMode = pathname.startsWith(`/${locale}/watch/`);

  if (isCinemaMode) {
    return (
      <div lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#050505]">
        <AppHeader locale={locale} cinemaMode />
        <div className="px-0 pb-8 pt-20">
          {children}
          <div className="mx-auto max-w-7xl px-4">
            <AppFooter locale={locale} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="mx-auto max-w-7xl px-4 pb-8">
      <AppHeader locale={locale} />
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <AppSidebar locale={locale} />
        <div>
          {children}
          <AppFooter locale={locale} />
        </div>
      </div>
    </div>
  );
}
