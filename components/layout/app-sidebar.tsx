import Link from 'next/link';
import { Clapperboard, Home, Search, Settings, Sparkles, Tv, Film, ShieldCheck } from 'lucide-react';
import type { Locale } from '../../i18n/config';
import { uiCopy } from '../../lib/data/i18n';

export function AppSidebar({ locale }: { locale: Locale }) {
  const t = uiCopy[locale];

  const links = [
    { href: `/${locale}`, label: t.home, icon: Home },
    { href: `/${locale}/movies`, label: t.movies, icon: Film },
    { href: `/${locale}/tv-series`, label: t.tvSeries, icon: Tv },
    { href: `/${locale}/anime`, label: t.anime, icon: Clapperboard },
    { href: `/${locale}/dmca`, label: t.dmca, icon: ShieldCheck },
    { href: `/${locale}/search`, label: t.search, icon: Search },
    { href: `/${locale}/settings`, label: t.settings, icon: Settings },
  ];

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-24 rounded-2xl border border-emerald/20 bg-white/70 p-4 shadow-card dark:bg-zinc-900/70">
        <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-emerald">
          <Sparkles size={14} className="text-gold" /> Drama HD
        </p>
        <nav className="space-y-2">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm transition hover:bg-emerald hover:text-white"
            >
              <Icon size={16} />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
