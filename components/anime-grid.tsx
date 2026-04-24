'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Locale } from '../i18n/config';
import type { MediaItem } from '../lib/data/media';
import { getTopAiringAnime } from '../lib/data/media';
import { PosterImage } from './ui/poster-image';
import { LoadingSkeleton } from './ui/loading-skeleton';

export function AnimeGrid({ locale }: { locale: Locale }) {
  const [items, setItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    getTopAiringAnime().then(setItems);
  }, []);

  return (
    <main>
      <h1 className="text-2xl font-bold">Top Airing Anime</h1>
      <p className="mb-4 mt-1 text-sm text-zinc-600 dark:text-zinc-300">Live data from Jikan API.</p>
      {items.length === 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => <LoadingSkeleton key={idx} className="h-72 w-full" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <Link key={item.id} href={`/${locale}/watch/${item.id}`} className="group overflow-hidden rounded-xl border border-gold/30 bg-black text-cream">
              <PosterImage
                src={item.poster}
                alt={item.title}
                width={640}
                height={352}
                className="h-52 w-full object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="space-y-1 p-3">
                <h2 className="font-semibold text-gold">{item.title}</h2>
                <p className="text-xs text-gold">Score ⭐ {item.rating.toFixed(1)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
