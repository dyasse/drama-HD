'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Locale } from '../../i18n/config';
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

type ProviderSource = {
  id: string;
  label: string;
  buildUrl: (params: { type: 'movie' | 'tv'; id: number; season: number; episode: number }) => string;
};

const PROVIDER_TEMPLATES = {
  source1: 'https://embed.su/embed/[type]/{id}/{s}/{e}',
  source2: 'https://vidsrc.cc/v2/embed/[type]/{id}',
  source3: 'https://vidsrc.pro/embed/[type]/{id}',
  source4: 'https://vidsrc.in/embed/[type]/{id}',
  source5: 'https://vidsrc.xyz/embed/[type]?tmdb={id}',
  source6: 'https://multiembed.mov/directstream.php?video_id={id}&tmdb=1',
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

const PROVIDER_SOURCES: ProviderSource[] = [
  {
    id: 'source-1',
    label: 'Source 1',
    buildUrl: (params) => buildServerUrl(PROVIDER_TEMPLATES.source1, params),
  },
  {
    id: 'source-2',
    label: 'Source 2',
    buildUrl: (params) => buildServerUrl(PROVIDER_TEMPLATES.source2, params),
  },
  {
    id: 'source-3',
    label: 'Source 3',
    buildUrl: (params) => buildServerUrl(PROVIDER_TEMPLATES.source3, params),
  },
  {
    id: 'source-4',
    label: 'Source 4',
    buildUrl: (params) => buildServerUrl(PROVIDER_TEMPLATES.source4, params),
  },
  {
    id: 'source-5',
    label: 'Source 5',
    buildUrl: (params) => buildServerUrl(PROVIDER_TEMPLATES.source5, params),
  },
  {
    id: 'source-6',
    label: 'Source 6',
    buildUrl: (params) => buildServerUrl(PROVIDER_TEMPLATES.source6, params),
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
  const [selectedProvider, setSelectedProvider] = useState(PROVIDER_SOURCES[0].id);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
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

  const activeProvider = PROVIDER_SOURCES.find((source) => source.id === selectedProvider) ?? PROVIDER_SOURCES[0];
  const providerUrl = useMemo(
    () => activeProvider.buildUrl({ type, id: tmdbId, season: normalizedSeason, episode: currentEpisode }),
    [activeProvider, currentEpisode, normalizedSeason, tmdbId, type],
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
              iframeKey={`${selectedProvider}-${tmdbId}-${currentEpisode}-${providerUrl}`}
              src={providerUrl}
              title={title ?? 'Stream Player'}
              onLoad={() => setIsLoading(false)}
              onError={() => setIsLoading(false)}
              overlayVisible={overlayVisible}
              onDismissOverlay={() => setOverlayVisible(false)}
            />
          </>
        ) : (
          <div className="grid h-full place-items-center p-6 text-center" dir={isArabic ? 'rtl' : 'ltr'}>
            <div className="max-w-lg rounded-2xl border border-[#D4AF37] bg-gradient-to-b from-[#1e1a10] to-[#0c0a06] p-6 shadow-[0_0_25px_rgba(212,175,55,0.25)]">
              <p className="text-xs uppercase tracking-[0.22em] text-[#D4AF37]">Premium Access</p>
              <h3 className="mt-2 text-3xl font-bold text-[#D4AF37]">Unlock Series</h3>
              <p className="mt-2 text-sm text-[#FFF6D1]">Episodes after 20 require Premium membership access for a one-time fee of $6.</p>
            </div>
          </div>
        )}
      </div>

      {!isLocked && (
        <div className="space-y-3 px-3 py-3 sm:px-4">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {PROVIDER_SOURCES.map((source) => {
              const isActive = source.id === selectedProvider;
              return (
                <button
                  key={source.id}
                  type="button"
                  onClick={() => {
                    setIsLoading(true);
                    setOverlayVisible(true);
                    setSelectedProvider(source.id);
                  }}
                  className={`rounded-md border px-2 py-1.5 text-[10px] font-semibold transition sm:text-xs ${
                    isActive
                      ? 'border-[#D4AF37] bg-[#D4AF37] text-black shadow-[0_0_18px_rgba(212,175,55,0.42)]'
                      : 'border-[#D4AF37]/60 bg-[#120f05] text-[#D4AF37] hover:border-[#D4AF37] hover:bg-[#1b1709]'
                  }`}
                >
                  {source.label}
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
    </section>
  );
}
