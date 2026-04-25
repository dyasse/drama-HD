'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import type { Locale } from '../../i18n/config';
import { uiCopy } from '../../lib/data/i18n';
import { PremiumModal } from './premium-modal';

type VideoPlayerProps = {
  tmdbId: number;
  type: 'movie' | 'tv';
  season?: number;
  episode?: number;
  locale: Locale;
  title?: string;
  nextEpisodeHref?: string;
};

type ServerId = 1 | 2;

type ServerOption = {
  id: ServerId;
  label: string;
};

const serverOptions: ServerOption[] = [
  { id: 1, label: 'Server 1' },
  { id: 2, label: 'Server 2' },
];

export function VideoPlayer({ tmdbId, type, season = 1, episode = 1, locale, title, nextEpisodeHref }: VideoPlayerProps) {
  const t = uiCopy[locale];
  const [activeServer, setActiveServer] = useState<ServerId>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [clientReady, setClientReady] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);

  const hasValidTmdbId = Number.isFinite(tmdbId) && tmdbId > 0;
  const isArabic = locale === 'ar';
  const normalizedType = type === 'movie' ? 'movie' : 'tv';
  const normalizedSeason = Math.max(1, season);
  const normalizedEpisode = Math.max(1, episode);
  const isPremiumLocked = type === 'tv' && normalizedEpisode > 20;

  const src = useMemo(() => {
    if (activeServer === 1) {
      const base = `https://vidsrc.cc/v2/embed/${normalizedType}/${tmdbId}?autoPlay=false`;
      return normalizedType === 'tv' ? `${base}&s=${normalizedSeason}&e=${normalizedEpisode}` : base;
    }

    const base = `https://vidsrc.me/embed/${normalizedType}?tmdb=${tmdbId}`;
    return normalizedType === 'tv' ? `${base}&s=${normalizedSeason}&e=${normalizedEpisode}` : base;
  }, [activeServer, normalizedEpisode, normalizedSeason, normalizedType, tmdbId]);

  useEffect(() => {
    setClientReady(true);
  }, []);

  useEffect(() => {
    setIsLoading(true);
    setOverlayVisible(true);
    if (!clientReady || isPremiumLocked || !hasValidTmdbId) {
      setIframeSrc(null);
      return;
    }

    setIframeSrc(src);
  }, [clientReady, hasValidTmdbId, isPremiumLocked, src]);

  useEffect(() => {
    setOpenModal(isPremiumLocked);
  }, [isPremiumLocked]);

  if (!hasValidTmdbId) {
    return (
      <section className="w-full overflow-hidden rounded-none border-y-2 border-[#047857] bg-black shadow-[0_0_35px_rgba(212,175,55,0.35)] sm:rounded-2xl sm:border-2">
        <div className="grid aspect-video place-items-center px-6 text-center text-[#FFFDD0]" dir={isArabic ? 'rtl' : 'ltr'}>
          <p className="text-base text-[#D4AF37] md:text-lg">
            Video not found, please try another server.
            <br />
            الفيديو غير موجود، يرجى تجربة سيرفر آخر.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full overflow-hidden rounded-none border-y-2 border-[#047857] bg-black text-[#FFFDD0] shadow-[0_0_35px_rgba(212,175,55,0.35)] sm:rounded-2xl sm:border-2" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="relative aspect-video w-full">
        {(!clientReady || isLoading) && (
          <div className="absolute inset-0 z-20 overflow-hidden bg-gradient-to-br from-[#047857]/35 via-black to-[#D4AF37]/20">
            <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.35),transparent_60%)]" />
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.7s_infinite] bg-gradient-to-r from-transparent via-[#FFFDD0]/15 to-transparent" />
            <div className="absolute inset-x-6 bottom-6 h-3 rounded-full bg-[#047857]/40" />
          </div>
        )}

        {!isPremiumLocked && clientReady && iframeSrc && (
          <div className="relative aspect-video">
            <iframe
              key={`${tmdbId}-${normalizedSeason}-${normalizedEpisode}-${activeServer}`}
              src={iframeSrc}
              title={title ?? t.streamPlayerTitle}
              className="h-full w-full"
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
              referrerPolicy="no-referrer"
              sandbox="allow-forms allow-pointer-lock allow-same-origin allow-scripts allow-top-navigation"
              onLoad={() => setIsLoading(false)}
            />
            {overlayVisible && (
              <button
                type="button"
                aria-label="Activate player"
                onClick={() => setOverlayVisible(false)}
                className="absolute inset-0 z-30 cursor-pointer bg-transparent"
              />
            )}
          </div>
        )}

        {isPremiumLocked && (
          <div className="grid h-full place-items-center bg-zinc-950/95 px-5 py-10 text-center">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.2em] text-[#D4AF37]">{t.premiumSubscription}</p>
              <h3 className="text-2xl font-bold text-[#D4AF37] sm:text-3xl">{t.unlockAllEpisodes}</h3>
              <p className="text-[#FFFDD0]/90">{t.premiumDescription}</p>
              <button type="button" onClick={() => setOpenModal(true)} className="rounded-full border border-[#D4AF37] bg-[#D4AF37] px-8 py-3 text-sm font-bold text-black md:text-base">
                {t.unlockForSix}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-[#047857]/40 bg-black/80 px-3 py-3 sm:px-4">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#D4AF37]">Server Switcher</span>
        <div className="flex items-center gap-2">
          {serverOptions.map((server) => (
            <button
              key={server.id}
              type="button"
              onClick={() => setActiveServer(server.id)}
              className={`rounded-full border px-4 py-2 text-xs font-bold transition sm:text-sm ${
                activeServer === server.id
                  ? 'border-[#D4AF37] bg-[#D4AF37] text-black'
                  : 'border-[#D4AF37]/70 bg-[#D4AF37]/15 text-[#D4AF37] hover:border-[#047857] hover:text-[#047857]'
              }`}
            >
              {server.label}
            </button>
          ))}
        </div>

        {nextEpisodeHref && !isPremiumLocked && type === 'tv' && (
          <Link href={nextEpisodeHref} className="ml-auto inline-flex rounded-full border border-[#047857] bg-[#047857] px-5 py-2 text-sm font-semibold text-[#FFFDD0] transition hover:border-[#D4AF37] hover:text-[#D4AF37]">
            Next Episode
          </Link>
        )}
      </div>

      <PremiumModal open={openModal} onClose={() => setOpenModal(false)} title={t.unlock} subtitle={t.oneTime} />
    </section>
  );
}
