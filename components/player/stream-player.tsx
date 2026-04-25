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
