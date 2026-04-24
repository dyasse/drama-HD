import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Locale } from '../../../../../../../../i18n/config';
import { VideoPlayerPanel } from '../../../../../../../../components/player/video-player-panel';
import { getAnimeDetail, getAnimeEpisodes, getTmdbDetail, getTvSeasonEpisodes, mapAnimeToTmdbTvId } from '../../../../../../../../lib/data/media';

function resolveType(raw: string): 'tv' | 'anime' | null {
  if (raw === 'tv' || raw === 'anime') return raw;
  return null;
}

export default async function EpisodeWatchPage({
  params,
}: {
  params: Promise<{ locale: string; type: string; id: string; s: string; e: string }>;
}) {
  const { locale, type, id, s, e } = await params;
  const mediaType = resolveType(type);
  const sourceId = Number(id);
  const season = Number(s);
  const episode = Number(e);

  if (!mediaType || [sourceId, season, episode].some(Number.isNaN)) notFound();

  if (mediaType === 'tv') {
    const [detail, seasonData] = await Promise.all([
      getTmdbDetail('tv', sourceId, locale as Locale),
      getTvSeasonEpisodes(sourceId, season, locale as Locale),
    ]);

    if (!detail) notFound();

    return (
      <main className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">{detail.title}</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">{seasonData.seasonTitle}</p>
        </div>
        <VideoPlayerPanel title={detail.title} locale={locale as Locale} mediaType="tv" tmdbId={sourceId} season={season} initialEpisode={episode} episodes={seasonData.episodes} />
      </main>
    );
  }

  const [anime, episodes] = await Promise.all([getAnimeDetail(sourceId), getAnimeEpisodes(sourceId)]);
  if (!anime) notFound();

  const mappedTmdbId = await mapAnimeToTmdbTvId(sourceId, anime.title);

  return (
    <main className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{anime.title}</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">Anime episode streaming (Jikan metadata + TMDB mapping).</p>
      </div>
      {mappedTmdbId ? (
        <VideoPlayerPanel title={anime.title} locale={locale as Locale} mediaType="anime" tmdbId={mappedTmdbId} season={1} initialEpisode={episode} episodes={episodes} />
      ) : (
        <div className="rounded-xl border border-gold/30 bg-black/80 p-4 text-cream">
          We could not map this anime to a TMDB TV ID automatically yet.
          <Link href={`/${locale}/anime`} className="ml-2 text-gold underline">Back to anime catalog</Link>
        </div>
      )}
    </main>
  );
}
