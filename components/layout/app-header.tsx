import Link from 'next/link';
import { Crown } from 'lucide-react';
import { ShareSiteButton } from '../share-site-button';
import type { Locale } from '../../i18n/config';
import { uiCopy } from '../../lib/data/i18n';
import { LocaleSwitcher } from '../locale-switcher';
import { ThemeToggle } from '../theme-toggle';

export function AppHeader({ locale, cinemaMode = false }: { locale: Locale; cinemaMode?: boolean }) {
  const t = uiCopy[locale];

  return (
    <header
      className={
        cinemaMode
          ? 'absolute inset-x-0 top-0 z-40 border-b border-[#047857]/20 bg-black/65 backdrop-blur'
          : 'sticky top-0 z-40 mb-4 border-b border-emerald/10 bg-cream/90 backdrop-blur dark:bg-matte/90 md:mb-6'
      }
    >
      <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-3 py-3 sm:px-4">
        <Link href={`/${locale}`} className="flex items-center gap-2 text-base font-semibold text-emerald sm:text-lg">
          <Crown className="text-gold" size={18} /> Drama HD
        </Link>
        <nav className="hidden items-center gap-4 text-sm md:flex">
          <Link href={`/${locale}`}>{t.home}</Link>
          <Link href={`/${locale}/movies`}>{t.movies}</Link>
          <Link href={`/${locale}/tv-series`}>{t.tvSeries}</Link>
          <Link href={`/${locale}/anime`}>{t.anime}</Link>
          <Link href={`/${locale}/dmca`}>{t.dmca}</Link>
          <Link href={`/${locale}/search`}>{t.search}</Link>
          <Link href={`/${locale}/settings`}>{t.settings}</Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <LocaleSwitcher locale={locale} />
          <ShareSiteButton />
          <ThemeToggle />
        </div>
      </div>

      <nav className="no-scrollbar flex gap-2 overflow-x-auto px-3 pb-3 md:hidden sm:px-4" aria-label="Mobile navigation">
        <Link href={`/${locale}`} className="rounded-full border border-emerald/25 px-3 py-1.5 text-xs font-medium">
          {t.home}
        </Link>
        <Link href={`/${locale}/movies`} className="rounded-full border border-emerald/25 px-3 py-1.5 text-xs font-medium">
          {t.movies}
        </Link>
        <Link href={`/${locale}/tv-series`} className="rounded-full border border-emerald/25 px-3 py-1.5 text-xs font-medium">
          {t.tvSeries}
        </Link>
        <Link href={`/${locale}/anime`} className="rounded-full border border-emerald/25 px-3 py-1.5 text-xs font-medium">
          {t.anime}
        </Link>
        <Link href={`/${locale}/search`} className="rounded-full border border-emerald/25 px-3 py-1.5 text-xs font-medium">
          {t.search}
        </Link>
        <Link href={`/${locale}/settings`} className="rounded-full border border-emerald/25 px-3 py-1.5 text-xs font-medium">
          {t.settings}
        </Link>
      </nav>
    </header>
  );
}
