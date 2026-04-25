'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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

const LICENSED_PROVIDER_HOSTS = {
  server1: process.env.NEXT_PUBLIC_STREAM_SERVER_1 ?? 'https://licensed-1.example.com/embed/[type]/{id}/{s}/{e}',
  server2: process.env.NEXT_PUBLIC_STREAM_SERVER_2 ?? 'https://licensed-2.example.com/embed/[type]/{id}?autoPlay=false',
  server3: process.env.NEXT_PUBLIC_STREAM_SERVER_3 ?? 'https://licensed-3.example.com/embed/[type]/{id}/{s}/{e}',
  server4: process.env.NEXT_PUBLIC_STREAM_SERVER_4 ?? 'https://licensed-4.example.com/embed/[type]/{id}/{s}/{e}',
  server5: process.env.NEXT_PUBLIC_STREAM_SERVER_5 ?? 'https://licensed-5.example.com/embed/[type]?tmdb={id}&s={s}&e={e}',
  server6: process.env.NEXT_PUBLIC_STREAM_SERVER_6 ?? 'https://licensed-6.example.com/embed/[type]?tmdb={id}&s={s}&e={e}',
  server7: process.env.NEXT_PUBLIC_STREAM_SERVER_7 ?? 'https://licensed-7.example.com/directstream.php?video_id={id}&tmdb=1&s={s}&e={e}',
  server8: process.env.NEXT_PUBLIC_STREAM_SERVER_8 ?? 'https://licensed-8.example.com/embed/[type]/{id}/{s}/{e}',
} as const;

function buildServerUrl(template: string, params: { type: 'movie' | 'tv'; id: number; season: number; episode: number }) {
  const safeType = params.type;
  const safeId = String(params.id);
  const safeSeason = String(params.season);
  const safeEpisode = String(params.episode);

  return template
    .replaceAll('[type]', safeType)
    .replaceAll('{id}', safeId)
    .replaceAll('{s}', safeSeason)
    .replaceAll('{e}', safeEpisode);
}

const ELITE_SERVERS: EliteServer[] = [
  {
    id: 'server-1',
    label: 'Server 1',
    buildUrl: (params) => buildServerUrl(LICENSED_PROVIDER_HOSTS.server1, params),
  },
  {
    id: 'server-2',
    label: 'Server 2',
    buildUrl: (params) => buildServerUrl(LICENSED_PROVIDER_HOSTS.server2, params),
  },
  {
    id: 'server-3',
    label: 'Server 3',
    buildUrl: (params) => buildServerUrl(LICENSED_PROVIDER_HOSTS.server3, params),
  },
  {
    id: 'server-4',
    label: 'Server 4',
    buildUrl: (params) => buildServerUrl(LICENSED_PROVIDER_HOSTS.server4, params),
  },
  {
    id: 'server-5',
    label: 'Server 5',
    buildUrl: (params) => buildServerUrl(LICENSED_PROVIDER_HOSTS.server5, params),
  },
  {
    id: 'server-6',
    label: 'Server 6',
    buildUrl: (params) => buildServerUrl(LICENSED_PROVIDER_HOSTS.server6, params),
  },
  {
    id: 'server-7',
    label: 'Server 7',
    buildUrl: (params) => buildServerUrl(LICENSED_PROVIDER_HOSTS.server7, params),
  },
  {
    id: 'server-8',
    label: 'Server 8',
    buildUrl: (params) => buildServerUrl(LICENSED_PROVIDER_HOSTS.server8, params),
  },
];

export function VideoPlayer({ tmdbId, type, season = 1, episode = 1, locale, title, maxEpisode }: VideoPlayerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const normalizedSeason = Math.max(1, season);
  const normalizedEpisode = Math.max(1, episode);
  const isArabic = locale === 'ar';

  const [hasMounted, setHasMounted] = useState(false);
  const [selectedServer, setSelectedServer] = useState(ELITE_SERVERS[0].id);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [currentEpisode, setCurrentEpisode] = useState(normalizedEpisode);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    setCurrentEpisode(normalizedEpisode);
    setIsLoading(true);
    setOverlayVisible(true);
  }, [normalizedEpisode, tmdbId]);

  const isLocked = type === 'tv' && currentEpisode > 20;

  const activeServer = ELITE_SERVERS.find((server) => server.id === selectedServer) ?? ELITE_SERVERS[0];
  const iframeSrc = useMemo(
    () => activeServer.buildUrl({ type, id: tmdbId, season: normalizedSeason, episode: currentEpisode }),
    [activeServer, currentEpisode, normalizedSeason, tmdbId, type],
  );

  const hasPreviousEpisode = type === 'tv' && currentEpisode > 1;
  const hasNextEpisode = type === 'tv' && (maxEpisode ? currentEpisode < maxEpisode : true);

  const updateEpisode = (nextEpisode: number) => {
    const normalizedNextEpisode = Math.max(1, nextEpisode);
    setCurrentEpisode(normalizedNextEpisode);
    setIsLoading(true);
    setOverlayVisible(true);

    const params = new URLSearchParams(searchParams.toString());
    params.set('season', String(normalizedSeason));
    params.set('episode', String(normalizedNextEpisode));
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  if (!hasMounted) {
    return (
      <section className="mx-auto w-full max-w-5xl rounded-2xl border border-[#047857] bg-[#050505] shadow-[0_0_0_1px_rgba(4,120,87,0.4),0_0_40px_rgba(212,175,55,0.32)]">
        <div className="aspect-video w-full animate-pulse bg-gradient-to-br from-[#047857]/20 via-[#050505] to-[#D4AF37]/15" />
      </section>
    );
  }

  return (
    <section
      className="mx-auto w-full max-w-5xl rounded-2xl border border-[#047857] bg-[#050505] text-[#FFFDD0] shadow-[0_0_0_1px_rgba(4,120,87,0.4),0_0_45px_rgba(212,175,55,0.35)]"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="relative mx-auto aspect-video w-full max-w-5xl overflow-hidden rounded-t-2xl border-b border-[#047857]/40">
        {!isLocked ? (
          <>
            {isLoading && <div className="absolute inset-0 z-10 animate-pulse bg-gradient-to-br from-[#047857]/20 via-black to-[#D4AF37]/20" />}
            <StreamContainer
              iframeKey={`${selectedServer}-${tmdbId}-${currentEpisode}`}
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
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
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
                  className={`rounded-md border px-2 py-1.5 text-[10px] font-semibold transition sm:text-xs ${
                    isActive
                      ? 'border-[#D4AF37] bg-[#D4AF37] text-black shadow-[0_0_18px_rgba(212,175,55,0.42)]'
                      : 'border-[#D4AF37]/60 bg-[#120f05] text-[#D4AF37] hover:border-[#D4AF37] hover:bg-[#1b1709]'
                  }`}
                >
                  {server.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {type === 'tv' && (
        <div className="flex flex-wrap items-center gap-3 border-t border-[#047857]/40 px-3 py-3 sm:px-4">
          <button
            type="button"
            onClick={() => updateEpisode(currentEpisode - 1)}
            disabled={!hasPreviousEpisode}
            className="inline-flex rounded-full border border-[#047857] bg-[#047857] px-5 py-2 text-sm font-semibold text-[#FFFDD0] transition enabled:hover:border-[#D4AF37] enabled:hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous Episode
          </button>

          <button
            type="button"
            onClick={() => updateEpisode(currentEpisode + 1)}
            disabled={!hasNextEpisode}
            className="inline-flex rounded-full border border-[#047857] bg-[#047857] px-5 py-2 text-sm font-semibold text-[#FFFDD0] transition enabled:hover:border-[#D4AF37] enabled:hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next Episode
          </button>
        </div>
      )}

      <PremiumModal open={showPremiumModal} onClose={() => setShowPremiumModal(false)} title="Unlock Full Series" subtitle="One-time payment · $6" />
    </section>
  );
}
