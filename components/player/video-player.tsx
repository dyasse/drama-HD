'use client';

import { useEffect, useMemo, useState } from 'react';
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
  const [server, setServer] = useState<1 | 2>(1);

  const hasValidTmdbId = Number.isFinite(tmdbId) && tmdbId > 0;
  const normalizedType = type === 'movie' ? 'movie' : 'tv';

  const src = useMemo(() => {
    const queryBase = `${normalizedType}?${server === 1 ? 'id' : 'tmdb'}=${tmdbId}`;
    const episodeQuery = normalizedType === 'tv' ? `&s=${season}&e=${episode}` : '';
    if (server === 1) {
      return `https://vidsrc.me/embed/${queryBase}${episodeQuery}`;
    }
    return `https://www.2embed.cc/embed/${queryBase}${episodeQuery}`;
  }, [episode, normalizedType, season, server, tmdbId]);

  useEffect(() => {
    setIsLoading(true);
  }, [src]);

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

  if (!hasValidTmdbId) {
    return (
      <section className="overflow-hidden rounded-2xl border-2 border-[#047857] bg-black shadow-[0_0_35px_rgba(212,175,55,0.35)]">
        <div className="grid aspect-video place-items-center px-6 text-center text-cream">
          <p className="text-base text-gold md:text-lg">
            Video not found, please try another server.
            <br />
            الفيديو غير موجود، يرجى تجربة سيرفر آخر.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full overflow-hidden rounded-2xl border-2 border-[#047857] bg-black shadow-[0_0_35px_rgba(212,175,55,0.35)]">
      <div className="flex flex-wrap items-center gap-2 border-b border-[#047857]/40 bg-zinc-950/80 px-3 py-2">
        <button
          type="button"
          onClick={() => {
            setServer(1);
            setIsLoading(true);
            setOverlayActive(true);
          }}
          className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
            server === 1 ? 'border-[#D4AF37] bg-[#D4AF37] text-black' : 'border-[#047857] text-[#D4AF37] hover:border-[#D4AF37]'
          }`}
        >
          Server 1
        </button>
        <button
          type="button"
          onClick={() => {
            setServer(2);
            setIsLoading(true);
            setOverlayActive(true);
          }}
          className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
            server === 2 ? 'border-[#D4AF37] bg-[#D4AF37] text-black' : 'border-[#047857] text-[#D4AF37] hover:border-[#D4AF37]'
          }`}
        >
          Server 2
        </button>
        <span className="rounded-full border border-[#D4AF37]/70 bg-[#D4AF37]/20 px-3 py-1 text-xs font-semibold text-[#D4AF37]">Server Status: Online</span>
      </div>

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
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="origin"
          onLoad={() => setIsLoading(false)}
        />
      </div>
    </section>
  );
}
