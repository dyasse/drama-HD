'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, PlayCircle } from 'lucide-react';
import type { Locale } from '../../i18n/config';
import { uiCopy } from '../../lib/data/i18n';
import type { EpisodeItem } from '../../lib/data/media';
import { PremiumModal } from './premium-modal';

const subtitleOptions = ['AR', 'EN', 'FR'] as const;

type PlayerType = 'movie' | 'tv' | 'anime';

export function VideoPlayerPanel({
  title,
  locale,
  mediaType,
  tmdbId,
  season = 1,
  initialEpisode = 1,
  episodes,
  seasons,
  routeConfig,
}: {
  title: string;
  locale: Locale;
  mediaType: PlayerType;
  tmdbId: number;
  season?: number;
  initialEpisode?: number;
  episodes?: EpisodeItem[];
  seasons?: Array<{ seasonNumber: number; episodeCount: number; name: string }>;
  routeConfig?: { locale: Locale; type: 'tv' | 'anime'; id: number };
}) {
  const router = useRouter();
  const t = uiCopy[locale];
  const [episode, setEpisode] = useState(initialEpisode);
  const [seasonState, setSeasonState] = useState(season);
  const [subtitle, setSubtitle] = useState<(typeof subtitleOptions)[number]>('EN');
  const [openModal, setOpenModal] = useState(false);
  const [moviePreviewExpired, setMoviePreviewExpired] = useState(false);

  const fallbackEpisodes = useMemo(() => Array.from({ length: 40 }, (_, i) => i + 1), []);
  const episodeNumbers = episodes?.length ? episodes.map((item) => item.episodeNumber) : fallbackEpisodes;

  const isPremium = mediaType === 'movie' ? moviePreviewExpired : episode > 20;

  useEffect(() => {
    setEpisode(initialEpisode);
    setSeasonState(season);
  }, [initialEpisode, tmdbId]);

  useEffect(() => {
    if (mediaType !== 'movie') return;
    setMoviePreviewExpired(false);
    const timer = setTimeout(() => {
      setMoviePreviewExpired(true);
      setOpenModal(true);
    }, 20 * 60 * 1000);

    return () => clearTimeout(timer);
  }, [mediaType, tmdbId]);

  useEffect(() => {
    if ((mediaType === 'tv' || mediaType === 'anime') && episode > 20) {
      setOpenModal(true);
    }
  }, [episode, mediaType]);

  useEffect(() => {
    if (!routeConfig) return;
    const params = new URLSearchParams();
    params.set('season', String(seasonState));
    params.set('episode', String(episode));
    router.replace(`/${routeConfig.locale}/watch/${routeConfig.type}/${routeConfig.id}?${params.toString()}`, { scroll: false });
  }, [episode, routeConfig, router, seasonState]);

  const providerType = mediaType === 'anime' ? 'tv' : mediaType;
  const src =
    providerType === 'movie'
      ? `https://vidsrc.to/embed/movie/${tmdbId}`
      : `https://vidsrc.to/embed/tv/${tmdbId}/${seasonState}/${episode}`;

  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="rounded-2xl border border-gold/40 bg-black p-3 text-cream">
        <div className="relative overflow-hidden rounded-xl">
          {isPremium ? (
            <div className="grid h-[420px] place-items-center bg-zinc-900/95 px-4 text-center">
              <Lock size={42} className="text-gold" />
              <p className="mt-3 max-w-xs text-lg font-semibold">
                {mediaType === 'movie' ? 'Free 20-minute preview ended.' : `Episode ${episode} requires Premium access.`}
              </p>
              <button type="button" onClick={() => setOpenModal(true)} className="mt-4 rounded-full bg-gold px-4 py-2 font-semibold text-zinc-950">
                Unlock Everything for $6
              </button>
            </div>
          ) : (
            <>
              <iframe
                src={src}
                className="h-[420px] w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="origin"
                title={`${title} player`}
              />
              {mediaType === 'movie' && (
                <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-black/80 px-3 py-1 text-xs text-cream">
                  <PlayCircle size={14} className="text-gold" /> 20-minute free preview enabled
                </div>
              )}
            </>
          )}
        </div>

        <label className="mt-3 block text-sm">
          {t.subtitleLanguage}
          <select value={subtitle} onChange={(event) => setSubtitle(event.target.value as 'AR' | 'EN' | 'FR')} className="mt-1 w-full rounded border border-gold/40 bg-zinc-900 p-2">
            {subtitleOptions.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </label>
      </div>

      {(mediaType === 'tv' || mediaType === 'anime') && (
        <aside className="rounded-2xl border border-emerald/20 bg-white/70 p-3 dark:bg-zinc-900/75">
          <label className="mb-3 block text-sm">
            Season
            <select
              value={seasonState}
              onChange={(event) => setSeasonState(Number(event.target.value))}
              className="mt-1 w-full rounded border border-gold/40 bg-zinc-100 p-2 dark:bg-zinc-800"
            >
              {(seasons?.length ? seasons : [{ seasonNumber: seasonState, episodeCount: episodeNumbers.length, name: `Season ${seasonState}` }]).map((item) => (
                <option key={item.seasonNumber} value={item.seasonNumber}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <p className="mb-2 text-sm font-semibold">{t.selectEpisode}</p>
          <div className="grid max-h-[420px] grid-cols-2 gap-2 overflow-auto pr-1">
            {episodeNumbers.map((id) => {
              const premiumEpisode = id > 20;
              return (
                <button
                  type="button"
                  onClick={() => setEpisode(id)}
                  key={id}
                  className={`flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm ${episode === id ? 'bg-emerald text-cream' : 'bg-zinc-100 dark:bg-zinc-800'}`}
                >
                  <span className="truncate">E{id}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] ${premiumEpisode ? 'border border-gold bg-gold/10 text-gold' : 'bg-emerald/20 text-emerald dark:text-cream'}`}>
                    {premiumEpisode ? t.premiumBadge : t.freeBadge}
                  </span>
                </button>
              );
            })}
          </div>
        </aside>
      )}
      <PremiumModal open={openModal} onClose={() => setOpenModal(false)} title={t.unlock} subtitle={t.oneTime} />
    </section>
  );
}
