'use client';

import { useMemo, useState } from 'react';

type StreamPlayerProps = {
  tmdbId: number;
  type: 'movie' | 'tv';
  season?: number;
  episode?: number;
};

export function StreamPlayer({ tmdbId, type, season = 1, episode = 1 }: StreamPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);

  const src = useMemo(() => {
    if (type === 'movie') {
      return `https://vidsrc.to/embed/movie/${tmdbId}`;
    }

    return `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`;
  }, [episode, season, tmdbId, type]);

  const isPremiumLocked = type === 'tv' && episode > 20;

  if (isPremiumLocked) {
    return (
      <section className="overflow-hidden rounded-2xl border-2 border-emerald bg-zinc-950 shadow-[0_0_30px_rgba(212,175,55,0.35)]">
        <div className="grid aspect-video place-items-center px-5 py-10 text-center text-cream">
          <p className="max-w-2xl text-lg font-semibold md:text-2xl">
            This episode is part of our Premium Collection. Unlock all 50+ episodes for just $6.
          </p>
          <button type="button" className="mt-5 rounded-full bg-gold px-6 py-3 text-sm font-bold text-emerald md:text-base">
            Pay Now
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border-2 border-emerald bg-black shadow-[0_0_30px_rgba(212,175,55,0.35)]">
      <div className="relative w-full pt-[56.25%]">
        {isLoading && (
          <div className="absolute inset-0 z-10 grid place-items-center bg-black/80">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald/35 border-t-emerald" />
          </div>
        )}
        <iframe
          src={src}
          title="Stream player"
          className="absolute inset-0 h-full w-full"
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-presentation allow-popups allow-forms"
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </section>
  );
}
