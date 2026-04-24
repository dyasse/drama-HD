'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Locale } from '../../i18n/config';
import type { MediaItem } from '../../lib/data/media';
import { PosterImage } from '../ui/poster-image';

export function LiveSearch({ locale }: { locale: Locale }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MediaItem[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      const url = new URL('/api/tmdb/search', window.location.origin);
      url.searchParams.set('query', query);
      url.searchParams.set('locale', locale);
      const response = await fetch(url);
      const payload = await response.json();
      setResults(payload.results ?? []);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, locale]);

  return (
    <main className="space-y-4">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search TMDB titles in real-time..."
        className="w-full rounded-xl border border-emerald/30 bg-white p-3 dark:bg-zinc-900"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {results.map((item) => (
          <Link key={item.id} href={`/${locale}/watch/${item.mediaType}/${item.sourceId}`} className="overflow-hidden rounded-xl border border-gold/30 bg-white/70 dark:bg-zinc-900/70">
            <PosterImage src={item.poster} alt={item.title} width={640} height={900} className="h-72 w-full object-cover" />
            <div className="p-3">
              <h3 className="line-clamp-1 font-semibold">{item.title}</h3>
              <p className="text-xs text-gold">TMDB ⭐ {item.rating.toFixed(1)}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
