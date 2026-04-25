import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Locale } from '../../../../../i18n/config';
import { StreamPlayer } from '../../../../../components/player/stream-player';
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
  const isArabic = locale === 'ar';

  if (!mediaType || [sourceId, selectedSeason, selectedEpisode].some(Number.isNaN)) notFound();

  if (mediaType === 'movie') {
    const show = await getTmdbDetail('movie', sourceId, locale as Locale);
    if (!show) notFound();

    return (
      <main className="space-y-4">
        <StreamPlayer tmdbId={sourceId} type="movie" />
        <div dir={isArabic ? 'rtl' : 'ltr'} className={isArabic ? 'text-right' : 'text-left'}>
          <h1 className="text-2xl font-bold">{show.title}</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">{show.description}</p>
        </div>
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
        <StreamPlayer tmdbId={sourceId} type="tv" season={selectedSeason} episode={selectedEpisode} />
        <div dir={isArabic ? 'rtl' : 'ltr'} className={isArabic ? 'text-right' : 'text-left'}>
          <h1 className="text-2xl font-bold">{show.title}</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">{show.description}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{seasonData.seasonTitle}</p>
        </div>
        <section>
          <p className="mb-2 text-sm font-semibold">Episode Selector</p>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10">
            {seasonData.episodes.map((episodeItem) => {
              const episodeNumber = episodeItem.episodeNumber;
              const isActive = selectedEpisode === episodeNumber;
              const href = `/${locale}/watch/tv/${sourceId}?season=${selectedSeason}&episode=${episodeNumber}`;
              return (
                <Link
                  key={episodeNumber}
                  href={href}
                  className={`rounded-md border px-3 py-2 text-center text-sm font-medium transition ${
                    isActive
                      ? 'border-emerald bg-emerald text-white'
                      : 'border-emerald/50 bg-emerald/10 text-emerald hover:bg-emerald hover:text-white'
                  }`}
                >
                  E{episodeNumber}
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    );
  }

  const [anime, episodes] = await Promise.all([getAnimeDetail(sourceId), getAnimeEpisodes(sourceId)]);
  if (!anime) notFound();
  const mappedTmdbId = await mapAnimeToTmdbTvId(sourceId, anime.title);
  if (!mappedTmdbId) notFound();

  return (
    <main className="space-y-4">
      <StreamPlayer tmdbId={mappedTmdbId} type="tv" season={1} episode={selectedEpisode} />
      <div dir={isArabic ? 'rtl' : 'ltr'} className={isArabic ? 'text-right' : 'text-left'}>
        <h1 className="text-2xl font-bold">{anime.title}</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">Anime episode streaming with dynamic episode selector.</p>
      </div>
      <section>
        <p className="mb-2 text-sm font-semibold">Episode Selector</p>
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10">
          {episodes.map((episodeItem) => {
            const episodeNumber = episodeItem.episodeNumber;
            const isActive = selectedEpisode === episodeNumber;
            const href = `/${locale}/watch/anime/${sourceId}?season=1&episode=${episodeNumber}`;
            return (
              <Link
                key={episodeNumber}
                href={href}
                className={`rounded-md border px-3 py-2 text-center text-sm font-medium transition ${
                  isActive
                    ? 'border-emerald bg-emerald text-white'
                    : 'border-emerald/50 bg-emerald/10 text-emerald hover:bg-emerald hover:text-white'
                }`}
              >
                E{episodeNumber}
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
