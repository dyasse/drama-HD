import type { Locale } from '../../i18n/config';
import { VideoPlayer } from './video-player';

type StreamPlayerProps = {
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

export function StreamPlayer({ tmdbId, type, season = 1, episode = 1, locale, title, nextEpisodeHref, previousEpisodeHref, maxEpisode }: StreamPlayerProps) {
  return (
    <VideoPlayer
      tmdbId={tmdbId}
      type={type}
      season={season}
      episode={episode}
      locale={locale}
      title={title}
      nextEpisodeHref={nextEpisodeHref}
      previousEpisodeHref={previousEpisodeHref}
      maxEpisode={maxEpisode}
    />
  );
}
