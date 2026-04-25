'use client';

import Link from 'next/link';
import { Clapperboard, Film, Home, Search, Settings, Tv } from 'lucide-react';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import type { Locale } from '../../i18n/config';
import { uiCopy } from '../../lib/data/i18n';
import { AppFooter } from './app-footer';
import { AppHeader } from './app-header';
import { AppSidebar } from './app-sidebar';

export function LocaleShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const pathname = usePathname();
  const isCinemaMode = pathname.startsWith(`/${locale}/watch/`);
  const t = uiCopy[locale];

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

  const mobileLinks = [
    { href: `/${locale}`, label: t.home, icon: Home },
    { href: `/${locale}/movies`, label: t.movies, icon: Film },
    { href: `/${locale}/tv-series`, label: t.tvSeries, icon: Tv },
    { href: `/${locale}/anime`, label: t.anime, icon: Clapperboard },
    { href: `/${locale}/search`, label: t.search, icon: Search },
    { href: `/${locale}/settings`, label: t.settings, icon: Settings },
  ];

  return (
    <div lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'} className="mx-auto max-w-7xl px-3 pb-24 sm:px-4 md:pb-8">
      <AppHeader locale={locale} />
      <div className="grid gap-6 md:grid-cols-[220px_1fr] lg:grid-cols-[240px_1fr]">
        <AppSidebar locale={locale} />
        <div>
          {children}
          <AppFooter locale={locale} />
        </div>
      </div>

      <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-6 rounded-2xl border border-emerald/20 bg-white/95 p-1.5 shadow-card backdrop-blur dark:bg-zinc-950/95 md:hidden">
        {mobileLinks.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={`flex min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[10px] font-medium ${
                active ? 'bg-emerald text-white' : 'text-zinc-700 dark:text-zinc-200'
              }`}
            >
              <Icon size={14} />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
