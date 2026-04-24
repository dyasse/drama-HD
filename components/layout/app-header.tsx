import Link from 'next/link';
import { Crown } from 'lucide-react';
import type { Locale } from '../../i18n/config';
import { uiCopy } from '../../lib/data/i18n';
import { LocaleSwitcher } from '../locale-switcher';
import { ThemeToggle } from '../theme-toggle';

export function AppHeader({ locale }: { locale: Locale }) {
  const t = uiCopy[locale];

  return (
    <header className="sticky top-0 z-40 mb-6 border-b border-emerald/10 bg-cream/90 backdrop-blur dark:bg-matte/90">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3">
        <Link href={`/${locale}`} className="flex items-center gap-2 text-lg font-semibold text-emerald">
          <Crown className="text-gold" size={18} /> Drama HD
        </Link>
        <nav className="hidden items-center gap-4 text-sm md:flex">
          <Link href={`/${locale}`}>{t.home}</Link>
          <Link href={`/${locale}/movies`}>{t.movies}</Link>
          <Link href={`/${locale}/tv-series`}>{t.tvSeries}</Link>
          <Link href={`/${locale}/anime`}>{t.anime}</Link>
          <Link href={`/${locale}/search`}>{t.search}</Link>
          <Link href={`/${locale}/settings`}>{t.settings}</Link>
        </nav>
        <div className="flex items-center gap-2">
          <LocaleSwitcher locale={locale} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
