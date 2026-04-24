'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import type { Locale } from '../i18n/config';
import type { MediaItem } from '../lib/data/media';
import { getSeriesByLanguage } from '../lib/data/media';
import { PosterImage } from './ui/poster-image';
import { LoadingSkeleton } from './ui/loading-skeleton';

type Filter = 'AR' | 'EN' | 'FR';

export function SeriesGrid({ locale }: { locale: Locale }) {
  const [filter, setFilter] = useState<Filter>('AR');
  const [catalog, setCatalog] = useState<Record<Filter, MediaItem[]>>({ AR: [], EN: [], FR: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getSeriesByLanguage('AR'), getSeriesByLanguage('EN'), getSeriesByLanguage('FR')]).then(([ar, en, fr]) => {
      setCatalog({ AR: ar, EN: en, FR: fr });
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => catalog[filter], [catalog, filter]);

  const tabs: { key: Filter; label: string; subtitle: string }[] = [
    { key: 'AR', label: 'Arabic (Motrjam)', subtitle: 'Arabic originals with translated support' },
    { key: 'EN', label: 'English', subtitle: 'English library' },
    { key: 'FR', label: 'French', subtitle: 'Bibliothèque française' },
  ];

  return (
    <section>
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`rounded-2xl border px-4 py-2 text-left text-sm ${filter === tab.key ? 'border-emerald bg-emerald text-cream' : 'border-gold/40 bg-white/70 dark:bg-zinc-900/70'}`}
          >
            <span className="block font-semibold">{tab.label}</span>
            <span className={`block text-xs ${filter === tab.key ? 'text-cream/90' : 'text-zinc-500 dark:text-zinc-300'}`}>{tab.subtitle}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => <LoadingSkeleton key={idx} className="h-72 w-full" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <Link key={item.id} href={`/${locale}/watch/${item.id}`} className="overflow-hidden rounded-xl border border-gold/30 bg-white/60 dark:bg-zinc-900/70">
              <PosterImage src={item.poster} alt={item.title} width={640} height={352} className="h-52 w-full object-cover" />
              <div className="space-y-1 p-3">
                <p className="font-semibold">{item.title}</p>
                <p className="text-xs text-gold">TMDB ⭐ {item.rating.toFixed(1)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
