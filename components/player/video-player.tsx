'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Locale } from '../../i18n/config';
import { PremiumModal } from './premium-modal';
import { StreamContainer } from './stream-container';

type VideoPlayerProps = {
  tmdbId: number;
  type: 'movie' | 'tv';
  season?: number;
  episode?: number;
  locale: Locale;
  title?: string;
  nextEpisodeHref?: string;
  previousEpisodeHref?: string;
  maxEpisode?: number;
};

type EliteServer = {
  id: string;
  label: string;
  buildUrl: (params: { type: 'movie' | 'tv'; id: number; season: number; episode: number }) => string;
};

const ELITE_SERVERS: EliteServer[] = [
  {
    id: 'server-1',
    label: 'Server 1 (Pro)',
    buildUrl: ({ type, id, season, episode }) =>
      type === 'tv' ? `https://vidsrc.pro/embed/tv/${id}/${season}/${episode}` : `https://vidsrc.pro/embed/movie/${id}`,
  },
  {
    id: 'server-2',
    label: 'Server 2 (VIP)',
    buildUrl: ({ type, id, season, episode }) =>
      type === 'tv' ? `https://vidsrc.in/embed/tv/${id}/${season}/${episode}` : `https://vidsrc.in/embed/movie/${id}`,
  },
  {
    id: 'server-3',
    label: 'Server 3 (Stable)',
    buildUrl: ({ type, id, season, episode }) =>
      type === 'tv' ? `https://embed.su/embed/tv/${id}/${season}/${episode}` : `https://embed.su/embed/movie/${id}`,
  },
  {
    id: 'server-4',
    label: 'Server 4 (Alternative)',
    buildUrl: ({ type, id, season, episode }) =>
      type === 'tv'
        ? `https://vidsrc.xyz/embed/tv?tmdb=${id}&s=${season}&e=${episode}`
        : `https://vidsrc.xyz/embed/movie?tmdb=${id}`,
  },
  {
    id: 'server-5',
    label: 'Server 5 (Backup)',
    buildUrl: ({ type, id, season, episode }) =>
      type === 'tv'
        ? `https://vidsrc.me/embed/tv?tmdb=${id}&s=${season}&e=${episode}`
        : `https://vidsrc.me/embed/movie?tmdb=${id}`,
  },
  {
    id: 'server-6',
    label: 'Server 6 (Global)',
    buildUrl: ({ id, season, episode }) => `https://multiembed.mov/directstream.php?video_id=${id}&tmdb=1&s=${season}&e=${episode}`,
  },
];

export function VideoPlayer({ tmdbId, type, season = 1, episode = 1, locale, title, nextEpisodeHref, previousEpisodeHref, maxEpisode }: VideoPlayerProps) {
  const normalizedSeason = Math.max(1, season);
  const normalizedEpisode = Math.max(1, episode);
  const isArabic = locale === 'ar';

  const [selectedServer, setSelectedServer] = useState(ELITE_SERVERS[0].id);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const isLocked = type === 'tv' && normalizedEpisode > 20;

  const activeServer = ELITE_SERVERS.find((server) => server.id === selectedServer) ?? ELITE_SERVERS[0];
  const iframeSrc = useMemo(
    () => activeServer.buildUrl({ type, id: tmdbId, season: normalizedSeason, episode: normalizedEpisode }),
    [activeServer, episode, normalizedEpisode, normalizedSeason, tmdbId, type],
  );

  const hasPreviousEpisode = type === 'tv' && Boolean(previousEpisodeHref);
  const hasNextEpisode = type === 'tv' && Boolean(nextEpisodeHref) && (maxEpisode ? normalizedEpisode < maxEpisode : true);

  return (
    <section
      className="mx-auto w-full max-w-5xl rounded-2xl border border-[#047857] bg-[#050505] text-[#FFFDD0] shadow-[0_0_0_1px_rgba(4,120,87,0.4),0_0_45px_rgba(212,175,55,0.35)]"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-5xl mx-auto aspect-video relative overflow-hidden rounded-t-2xl border-b border-[#047857]/40">
        {!isLocked ? (
          <>
            {isLoading && <div className="absolute inset-0 z-10 animate-pulse bg-gradient-to-br from-[#047857]/20 via-black to-[#D4AF37]/20" />}
            <StreamContainer
              iframeKey={`${selectedServer}-${tmdbId}-${normalizedEpisode}`}
              src={iframeSrc}
              title={title ?? 'Stream Player'}
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
              overlayVisible={overlayVisible}
              onDismissOverlay={() => setOverlayVisible(false)}
            />
          </>
        ) : (
          <div className="grid h-full place-items-center p-6 text-center">
            <div className="max-w-lg rounded-2xl border border-[#D4AF37] bg-gradient-to-b from-[#1e1a10] to-[#0c0a06] p-6 shadow-[0_0_25px_rgba(212,175,55,0.25)]">
              <p className="text-xs uppercase tracking-[0.22em] text-[#D4AF37]">Premium Access</p>
              <h3 className="mt-2 text-3xl font-bold text-[#D4AF37]">Unlock Series</h3>
              <p className="mt-2 text-sm text-[#FFF6D1]">This title requires a one-time $6 unlock for episodes after 20.</p>
              <button
                type="button"
                onClick={() => setShowPremiumModal(true)}
                className="mt-5 rounded-full border border-[#D4AF37] bg-[#D4AF37] px-7 py-2 text-sm font-bold text-black hover:bg-[#e3c35a]"
              >
                Unlock for $6
              </button>
            </div>
          </div>
        )}
      </div>

      {!isLocked && (
        <div className="space-y-3 px-3 py-3 sm:px-4">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {ELITE_SERVERS.map((server) => {
              const isActive = server.id === selectedServer;
              return (
                <button
                  key={server.id}
                  type="button"
                  onClick={() => {
                    setIsLoading(true);
                    setOverlayVisible(true);
                    setSelectedServer(server.id);
                  }}
                  className={`rounded-md border px-2 py-2 text-[11px] font-semibold transition sm:text-xs ${
                    isActive
                      ? 'border-[#D4AF37] bg-[#D4AF37] text-black shadow-[0_0_18px_rgba(212,175,55,0.42)]'
                      : 'border-[#047857] bg-[#050505] text-[#FFFDD0] hover:border-[#D4AF37] hover:text-[#D4AF37]'
                  }`}
                >
                  {server.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 border-t border-[#047857]/40 px-3 py-3 sm:px-4">
        {hasPreviousEpisode && (
          <Link href={previousEpisodeHref as string} className="inline-flex rounded-full border border-[#047857] bg-[#047857] px-5 py-2 text-sm font-semibold text-[#FFFDD0] transition hover:border-[#D4AF37] hover:text-[#D4AF37]">
            Previous Episode
          </Link>
        )}

        {hasNextEpisode && (
          <Link href={nextEpisodeHref as string} className="inline-flex rounded-full border border-[#047857] bg-[#047857] px-5 py-2 text-sm font-semibold text-[#FFFDD0] transition hover:border-[#D4AF37] hover:text-[#D4AF37]">
            Next Episode
          </Link>
        )}
      </div>

      <PremiumModal open={showPremiumModal} onClose={() => setShowPremiumModal(false)} title="Unlock Full Series" subtitle="One-time payment · $6" />
    </section>
  );
}
