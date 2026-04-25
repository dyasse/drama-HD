'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
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

type ServerOption = {
  id: 1 | 2 | 3;
  label: string;
  badge: string;
};

const serverOptions: ServerOption[] = [
  { id: 1, label: 'Server 1', badge: 'Pro' },
  { id: 2, label: 'Server 2', badge: 'VIP' },
  { id: 3, label: 'Server 3', badge: 'Direct' },
];

export function VideoPlayer({ tmdbId, type, season = 1, episode = 1, locale, title, nextEpisodeHref }: VideoPlayerProps) {
  const t = uiCopy[locale];
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeServer, setActiveServer] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [clientReady, setClientReady] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const hasValidTmdbId = Number.isFinite(tmdbId) && tmdbId > 0;
  const isArabic = locale === 'ar';
  const normalizedType = type === 'movie' ? 'movie' : 'tv';
  const normalizedSeason = Math.max(1, season);
  const normalizedEpisode = Math.max(1, episode);

  useEffect(() => {
    setClientReady(true);
  }, []);

  useEffect(() => {
    setIsLoading(true);
  }, [activeServer, normalizedSeason, normalizedEpisode, tmdbId]);

  useEffect(() => {
    setOpenModal(type === 'tv' && normalizedEpisode > 20);
  }, [type, normalizedEpisode]);

  const src = useMemo(() => {
    if (activeServer === 1) {
      return `https://vidsrc.xyz/embed/${normalizedType}?tmdb=${tmdbId}&s=${normalizedSeason}&e=${normalizedEpisode}`;
    }

    if (activeServer === 2) {
      return `https://vidsrc.pm/api/track/${normalizedType}?${normalizedType}=${tmdbId}&s=${normalizedSeason}&e=${normalizedEpisode}`;
    }

    return `https://embed.su/embed/${normalizedType}/${tmdbId}/${normalizedSeason}/${normalizedEpisode}`;
  }, [activeServer, normalizedEpisode, normalizedSeason, normalizedType, tmdbId]);

  const frameKey = `${activeServer}-${tmdbId}-${normalizedSeason}-${normalizedEpisode}-${pathname}-${searchParams.toString()}`;
  const isPremiumLocked = type === 'tv' && normalizedEpisode > 20;

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
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#047857]/40 bg-black/80 px-3 py-3 sm:px-4">
        <div className="flex items-center gap-2">
          {serverOptions.map((server) => (
            <button
              key={server.id}
              type="button"
              onClick={() => setActiveServer(server.id)}
              className={`rounded-full border px-3 py-1 text-xs font-semibold transition sm:text-sm ${
                activeServer === server.id
                  ? 'border-[#047857] bg-[#047857] text-[#FFFDD0]'
                  : 'border-[#047857]/70 bg-transparent text-[#047857] hover:border-[#D4AF37] hover:text-[#D4AF37]'
              }`}
            >
              {server.label} <span className="text-[#D4AF37]">{server.badge}</span>
            </button>
          ))}
        </div>
        <span className="rounded-full border border-[#D4AF37]/80 bg-[#D4AF37]/15 px-3 py-1 text-xs font-semibold text-[#D4AF37]">Server Switcher</span>
      </div>

      <div className="relative aspect-video w-full">
        {(!clientReady || isLoading) && (
          <div className="absolute inset-0 z-20 overflow-hidden bg-gradient-to-br from-[#047857]/35 via-black to-[#D4AF37]/20">
            <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.35),transparent_60%)]" />
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.7s_infinite] bg-gradient-to-r from-transparent via-[#FFFDD0]/15 to-transparent" />
            <div className="absolute inset-x-6 bottom-6 h-3 rounded-full bg-[#047857]/40" />
          </div>
        )}

        {!isPremiumLocked && clientReady && (
          <div className="aspect-video">
            <iframe
              key={frameKey}
              src={src}
              title={title ?? t.streamPlayerTitle}
              className="h-full w-full"
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
              allowFullScreen
              referrerPolicy="no-referrer"
              onLoad={() => setIsLoading(false)}
            />
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

      {nextEpisodeHref && !isPremiumLocked && type === 'tv' && (
        <div className="border-t border-[#047857]/40 bg-black/80 px-4 py-3 text-center sm:text-right">
          <Link href={nextEpisodeHref} className="inline-flex rounded-full border border-[#047857] bg-[#047857] px-5 py-2 text-sm font-semibold text-[#FFFDD0] transition hover:border-[#D4AF37] hover:text-[#D4AF37]">
            Next Episode
          </Link>
        </div>
      )}

      <PremiumModal open={openModal} onClose={() => setOpenModal(false)} title={t.unlock} subtitle={t.oneTime} />
    </section>
  );
}
