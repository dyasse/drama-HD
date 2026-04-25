'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Locale } from '../../i18n/config';
import { uiCopy } from '../../lib/data/i18n';
import { getNextEnabledProvider, getProviderDefinitions } from '../../lib/player/providers';
import type { ProviderDef } from '../../lib/player/types';
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

type ProviderWithUrl = ProviderDef & { url: string };

const PLAYER_TIMEOUT_MS = 12_000;
const SUPPORT_EMAIL = process.env.NEXT_PUBLIC_SUPPORT_EMAIL ?? 'support@dramahd.example';

export function VideoPlayer({
  tmdbId,
  type,
  season = 1,
  episode = 1,
  locale,
  title,
  nextEpisodeHref,
  previousEpisodeHref,
  maxEpisode,
}: VideoPlayerProps) {
  const t = uiCopy[locale];
  const providers = useMemo(() => getProviderDefinitions(), []);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);
  const [reloadNonce, setReloadNonce] = useState(0);
  const [activeServerIndex, setActiveServerIndex] = useState(0);
  const [autoFailover, setAutoFailover] = useState(true);
  const loadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasValidTmdbId = Number.isFinite(tmdbId) && tmdbId > 0;
  const isArabic = locale === 'ar';
  const normalizedType = type === 'movie' ? 'movie' : 'tv';
  const normalizedSeason = Math.max(1, season);
  const normalizedEpisode = Math.max(1, episode);
  const isPremiumLocked = type === 'tv' && normalizedEpisode > 20;
  const episodeKey = `${normalizedType}-${tmdbId}-${normalizedSeason}-${normalizedEpisode}`;

  const providerLinks = useMemo<ProviderWithUrl[]>(
    () =>
      [...providers]
        .sort((a, b) => a.priority - b.priority)
        .map((provider) => {
          const url = provider.buildUrl({
            type: normalizedType,
            tmdbId,
            season: normalizedSeason,
            episode: normalizedEpisode,
          });
          const enabled = provider.enabled && Boolean(url) && url !== 'about:blank';
          return { ...provider, enabled, url };
        }),
    [providers, normalizedEpisode, normalizedSeason, normalizedType, tmdbId],
  );

  const enabledProviderCount = providerLinks.filter((provider) => provider.enabled).length;
  const firstEnabledIndex = providerLinks.findIndex((provider) => provider.enabled);
  const activeProvider = providerLinks[activeServerIndex] ?? providerLinks[firstEnabledIndex] ?? providerLinks[0];
  const hasEnabledProviders = firstEnabledIndex >= 0;

  const rotateToNextProvider = () => {
    if (!autoFailover || enabledProviderCount <= 1) return;

    setActiveServerIndex((current) => {
      const nextIndex = getNextEnabledProvider(current, providerLinks);
      if (nextIndex === current) return current;
      setReloadNonce((nonce) => nonce + 1);
      return nextIndex;
    });
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const defaultIndex = firstEnabledIndex >= 0 ? firstEnabledIndex : 0;

    try {
      const storedProvider = localStorage.getItem(`player-provider:${episodeKey}`);
      if (!storedProvider) {
        setActiveServerIndex(defaultIndex);
        return;
      }
      const index = providerLinks.findIndex((provider) => provider.id === storedProvider && provider.enabled);
      setActiveServerIndex(index >= 0 ? index : defaultIndex);
    } catch {
      setActiveServerIndex(defaultIndex);
    }
  }, [episodeKey, firstEnabledIndex, isMounted, providerLinks]);

  useEffect(() => {
    setReloadNonce(0);
    setIsLoading(true);
    setOverlayVisible(true);
  }, [tmdbId, normalizedEpisode, normalizedSeason, normalizedType]);

  useEffect(() => {
    if (!isMounted || isPremiumLocked || !hasValidTmdbId || !activeProvider?.enabled || !hasEnabledProviders) {
      setIframeSrc(null);
      return;
    }

    setIframeSrc(activeProvider.url);
    setIsLoading(true);
    setOverlayVisible(true);

    if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
    loadTimeoutRef.current = setTimeout(() => {
      rotateToNextProvider();
    }, PLAYER_TIMEOUT_MS);

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
    };
  }, [activeProvider?.enabled, activeProvider?.url, hasEnabledProviders, hasValidTmdbId, isMounted, isPremiumLocked, reloadNonce]);

  useEffect(() => {
    setOpenModal(isPremiumLocked);
  }, [isPremiumLocked]);

  const handleIframeLoaded = () => {
    setIsLoading(false);
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }

    if (!isMounted || !activeProvider?.id) return;

    try {
      localStorage.setItem(`player-provider:${episodeKey}`, activeProvider.id);
    } catch {
      // ignore storage write errors
    }
  };

  if (!hasValidTmdbId) {
    return (
      <section className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-[#047857] bg-[#050505] shadow-[0_0_0_1px_rgba(4,120,87,0.4),0_0_30px_rgba(212,175,55,0.28)]">
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

  const hasPreviousEpisode = type === 'tv' && Boolean(previousEpisodeHref);
  const hasNextEpisode = type === 'tv' && Boolean(nextEpisodeHref) && (maxEpisode ? normalizedEpisode < maxEpisode : true);

  return (
    <section
      className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-[#047857] bg-[#050505] text-[#FFFDD0] shadow-[0_0_0_1px_rgba(4,120,87,0.4),0_0_45px_rgba(212,175,55,0.35)]"
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="relative aspect-video w-full">
        {(!isMounted || isLoading) && (
          <div className="absolute inset-0 z-20 overflow-hidden bg-gradient-to-br from-[#047857]/35 via-black to-[#D4AF37]/20">
            <div className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_top,_rgba(212,175,55,0.35),transparent_60%)]" />
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.7s_infinite] bg-gradient-to-r from-transparent via-[#FFFDD0]/15 to-transparent" />
            <div className="absolute inset-x-6 bottom-6 h-3 rounded-full bg-[#047857]/40" />
          </div>
        )}

        {!isPremiumLocked && isMounted && hasEnabledProviders && iframeSrc && (
          <StreamContainer
            iframeKey={`${activeProvider?.id ?? 'p1'}-${tmdbId}-${normalizedSeason}-${normalizedEpisode}-${reloadNonce}`}
            src={iframeSrc}
            title={title ?? t.streamPlayerTitle}
            onLoad={handleIframeLoaded}
            onError={rotateToNextProvider}
            overlayVisible={overlayVisible}
            onDismissOverlay={() => setOverlayVisible(false)}
          />
        )}

        {!isPremiumLocked && isMounted && !hasEnabledProviders && (
          <div className="grid h-full place-items-center bg-zinc-950/95 px-5 py-10 text-center">
            <p className="max-w-lg text-sm text-[#FFFDD0]/85 sm:text-base">
              No licensed streaming providers are currently configured for this title. Please contact support.
            </p>
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

      <div className="space-y-3 border-t border-[#047857]/40 bg-[#050505] px-3 py-3 sm:px-4">
        {!isPremiumLocked && (
          <>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {providerLinks.map((provider, index) => {
                const isActive = activeServerIndex === index;
                return (
                  <button
                    key={provider.id}
                    type="button"
                    disabled={!provider.enabled}
                    onClick={() => {
                      if (!provider.enabled) return;
                      setActiveServerIndex(index);
                      setReloadNonce((current) => current + 1);
                    }}
                    className={`rounded-md border px-3 py-2 text-[11px] font-semibold transition sm:text-xs ${
                      isActive
                        ? 'border-[#D4AF37] bg-[#D4AF37] text-black shadow-[0_0_18px_rgba(212,175,55,0.42)]'
                        : 'border-[#047857] bg-[#050505] text-[#FFFDD0] hover:border-[#D4AF37] hover:text-[#D4AF37]'
                    } ${!provider.enabled ? 'cursor-not-allowed opacity-40' : ''}`}
                  >
                    {provider.label}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setAutoFailover((current) => !current)}
                className={`rounded-full border px-3 py-1 font-semibold ${autoFailover ? 'border-[#D4AF37] text-[#D4AF37]' : 'border-[#047857] text-[#FFFDD0]'}`}
              >
                Auto Failover: {autoFailover ? 'On' : 'Off'}
              </button>
              <a
                href={`mailto:${SUPPORT_EMAIL}?subject=Stream%20Issue`}
                className="text-xs font-semibold text-[#D4AF37] underline underline-offset-2 transition hover:text-[#f3d47a]"
              >
                Report Issue
              </a>
            </div>
          </>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setReloadNonce((current) => current + 1)}
            className="rounded-full border border-[#D4AF37] bg-[#D4AF37] px-4 py-2 text-xs font-bold text-black transition hover:bg-[#d9bc57] sm:text-sm"
          >
            Refresh Player
          </button>

          {hasPreviousEpisode && (
            <Link href={previousEpisodeHref as string} className="inline-flex rounded-full border border-[#047857] bg-[#047857] px-5 py-2 text-sm font-semibold text-[#FFFDD0] transition hover:border-[#D4AF37] hover:text-[#D4AF37]">
              Previous Episode
            </Link>
          )}

          {hasNextEpisode && (
            <Link href={nextEpisodeHref as string} className="ml-auto inline-flex rounded-full border border-[#047857] bg-[#047857] px-5 py-2 text-sm font-semibold text-[#FFFDD0] transition hover:border-[#D4AF37] hover:text-[#D4AF37]">
              Next Episode
            </Link>
          )}
        </div>
      </div>

      <PremiumModal open={openModal} onClose={() => setOpenModal(false)} title={t.unlock} subtitle={t.oneTime} />
    </section>
  );
}
