'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PosterImage } from '../ui/poster-image';
import type { MediaItem } from '../../lib/data/media';
import type { Locale } from '../../i18n/config';

export function CatalogGrid({ locale, type, genreId }: { locale: Locale; type: 'movie' | 'tv'; genreId?: number }) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setItems([]);
    setPage(1);
  }, [type, genreId, locale]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      const url = new URL('/api/tmdb/discover', window.location.origin);
      url.searchParams.set('type', type);
      url.searchParams.set('locale', locale);
      url.searchParams.set('page', String(page));
      if (genreId) url.searchParams.set('genreId', String(genreId));
      const response = await fetch(url);
      const payload = await response.json();
      if (!cancelled) setItems((prev) => (page === 1 ? payload.results : [...prev, ...payload.results]));
      setLoading(false);
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [page, type, genreId, locale]);

  return (
    <section className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, index) => (
          <motion.div key={`${item.id}-${index}`} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            <Link href={`/${locale}/${item.mediaType}/${item.sourceId}`} className="block overflow-hidden rounded-xl border border-gold/30 bg-white/70 dark:bg-zinc-900/70">
              <PosterImage src={item.poster} alt={item.title} width={640} height={900} className="h-72 w-full object-cover" />
              <div className="p-3">
                <h3 className="line-clamp-1 font-semibold">{item.title}</h3>
                <p className="text-xs text-gold">TMDB ⭐ {item.rating.toFixed(1)}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => setPage((prev) => prev + 1)}
        disabled={loading}
        className="rounded-full bg-emerald px-5 py-2 text-sm font-semibold text-cream disabled:opacity-50"
      >
        {loading ? 'Loading...' : 'Load More'}
      </button>
    </section>
  );
}
