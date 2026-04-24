import { notFound } from 'next/navigation';
import type { Locale } from '../../../../../i18n/config';
import { VideoPlayerPanel } from '../../../../../components/player/video-player-panel';
import { getAnimeDetail, getAnimeEpisodes, getTmdbDetail, getTvSeasonEpisodes, mapAnimeToTmdbTvId } from '../../../../../lib/data/media';

export default async function WatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; type: string; id: string }>;
  searchParams: Promise<{ season?: string; episode?: string }>;
}) {
  const { locale, type, id } = await params;
  const { season: seasonRaw, episode: episodeRaw } = await searchParams;
  const mediaType = type === 'tv' ? 'tv' : type === 'movie' ? 'movie' : type === 'anime' ? 'anime' : null;
  const sourceId = Number(id);
  const selectedSeason = Number(seasonRaw ?? '1');
  const selectedEpisode = Number(episodeRaw ?? '1');

  if (!mediaType || [sourceId, selectedSeason, selectedEpisode].some(Number.isNaN)) notFound();

  if (mediaType === 'movie') {
    const show = await getTmdbDetail('movie', sourceId, locale as Locale);
    if (!show) notFound();

    return (
      <main className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">{show.title}</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">{show.description}</p>
        </div>
        <VideoPlayerPanel title={show.title} locale={locale as Locale} mediaType="movie" tmdbId={sourceId} />
      </main>
    );
  }

  if (mediaType === 'tv') {
    const [show, seasonData] = await Promise.all([
      getTmdbDetail('tv', sourceId, locale as Locale),
      getTvSeasonEpisodes(sourceId, selectedSeason, locale as Locale),
    ]);
    if (!show) notFound();

    return (
      <main className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">{show.title}</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">{seasonData.seasonTitle}</p>
        </div>
        <VideoPlayerPanel
          title={show.title}
          locale={locale as Locale}
          mediaType="tv"
          tmdbId={sourceId}
          season={selectedSeason}
          initialEpisode={selectedEpisode}
          episodes={seasonData.episodes}
          seasons={show.seasons ?? []}
          routeConfig={{ locale: locale as Locale, type: 'tv', id: sourceId }}
        />
      </main>
    );
  }

  const [anime, episodes] = await Promise.all([getAnimeDetail(sourceId), getAnimeEpisodes(sourceId)]);
  if (!anime) notFound();
  const mappedTmdbId = await mapAnimeToTmdbTvId(sourceId, anime.title);
  if (!mappedTmdbId) notFound();

  return (
    <main className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{anime.title}</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">Anime episode streaming with dynamic episode selector.</p>
      </div>
      <VideoPlayerPanel
        title={anime.title}
        locale={locale as Locale}
        mediaType="anime"
        tmdbId={mappedTmdbId}
        season={1}
        initialEpisode={selectedEpisode}
        episodes={episodes}
        seasons={[{ seasonNumber: 1, episodeCount: episodes.length, name: 'Season 1' }]}
        routeConfig={{ locale: locale as Locale, type: 'anime', id: sourceId }}
      />
    </main>
  );
}
