'use client';

import { useEffect, useState } from 'react';
import type { Locale } from '../../i18n/config';
import type { VideoType } from '../../lib/player/types';
import { VideoPlayer } from './video-player';

type StreamPlayerProps = {
  tmdbId: number;
  type: VideoType;
  season?: number;
  episode?: number;
  locale: Locale;
  title?: string;
  nextEpisodeHref?: string;
  previousEpisodeHref?: string;
  maxEpisode?: number;
};

export function StreamPlayer({ tmdbId, type, season = 1, episode = 1, locale, title, nextEpisodeHref, previousEpisodeHref, maxEpisode }: StreamPlayerProps) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <section className="mx-auto w-full max-w-5xl rounded-2xl border border-[#047857] bg-[#050505] shadow-[0_0_0_1px_rgba(4,120,87,0.4),0_0_40px_rgba(212,175,55,0.32)]">
        <div className="aspect-video w-full animate-pulse bg-gradient-to-br from-[#047857]/20 via-[#050505] to-[#D4AF37]/15" />
      </section>
    );
  }

  return (
    <VideoPlayer
      tmdbId={Math.max(0, Math.trunc(tmdbId))}
      type={type}
      season={Math.max(1, Math.trunc(season))}
      episode={Math.max(1, Math.trunc(episode))}
      locale={locale}
      title={title}
      nextEpisodeHref={nextEpisodeHref}
      previousEpisodeHref={previousEpisodeHref}
      maxEpisode={maxEpisode}
    />
  );
}
