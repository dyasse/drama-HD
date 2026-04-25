'use client';

import { useMemo, useState } from 'react';
import { uiCopy } from '../../lib/data/i18n';
import type { Locale } from '../../i18n/config';

type VideoPlayerProps = {
  tmdbId: number;
  type: 'movie' | 'tv';
  season?: number;
  episode?: number;
  locale: Locale;
  title?: string;
};

export function VideoPlayer({ tmdbId, type, season = 1, episode = 1, locale, title }: VideoPlayerProps) {
  const t = uiCopy[locale];
  const [isLoading, setIsLoading] = useState(true);
  const [overlayActive, setOverlayActive] = useState(true);

  const src = useMemo(() => {
    if (type === 'movie') {
      return `https://vidsrc.to/embed/movie/${tmdbId}`;
    }

    return `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`;
  }, [episode, season, tmdbId, type]);

  const isPremiumLocked = type === 'tv' && episode > 20;

  if (isPremiumLocked) {
    return (
      <section className="overflow-hidden rounded-2xl border-2 border-[#047857] bg-zinc-950 shadow-[0_0_35px_rgba(212,175,55,0.4)]">
        <div className="grid aspect-video place-items-center px-5 py-10 text-center text-cream">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm uppercase tracking-[0.2em] text-gold/80">{t.premiumSubscription}</p>
            <h3 className="text-2xl font-bold text-gold md:text-3xl">{t.unlockAllEpisodes}</h3>
            <p className="text-zinc-200">{t.premiumDescription}</p>
            <button type="button" className="rounded-full border border-gold bg-gold px-8 py-3 text-sm font-bold text-zinc-950 md:text-base">
              {t.unlockForSix}
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border-2 border-[#047857] bg-black shadow-[0_0_35px_rgba(212,175,55,0.35)]">
      <div className="relative aspect-video w-full">
        {isLoading && (
          <div className="absolute inset-0 z-20 grid place-items-center bg-black/80">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#047857]/35 border-t-[#047857]" />
          </div>
        )}

        {overlayActive && (
          <button
            type="button"
            aria-label={t.safePlayOverlay}
            className="absolute inset-0 z-30 cursor-pointer bg-transparent"
            onClick={() => setOverlayActive(false)}
          />
        )}

        <iframe
          src={src}
          title={title ?? t.streamPlayerTitle}
          className="h-full w-full"
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
