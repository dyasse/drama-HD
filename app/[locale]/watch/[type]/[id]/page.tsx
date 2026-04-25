import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Locale } from '../../../../../i18n/config';
import { StreamPlayer } from '../../../../../components/player/stream-player';
import { PosterImage } from '../../../../../components/ui/poster-image';
import { uiCopy } from '../../../../../lib/data/i18n';
import { getAnimeDetail, getAnimeEpisodes, getSimilarTmdb, getTmdbDetail, getTvSeasonEpisodes, mapAnimeToTmdbTvId } from '../../../../../lib/data/media';

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
  const t = uiCopy[locale as Locale];

  if (!mediaType || [sourceId, selectedSeason, selectedEpisode].some(Number.isNaN)) notFound();

  if (mediaType === 'movie') {
    const [show, recommended] = await Promise.all([
      getTmdbDetail('movie', sourceId, locale as Locale),
      getSimilarTmdb('movie', sourceId, locale as Locale),
    ]);
    if (!show) notFound();

    return (
      <main className="space-y-4 px-1 sm:px-2 md:px-0">
        <StreamPlayer tmdbId={sourceId} type="movie" locale={locale as Locale} title={show.title} />
        <div dir={isArabic ? 'rtl' : 'ltr'} className={isArabic ? 'text-right' : 'text-left'}>
          <h1 className="text-2xl font-bold">{show.title}</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">{show.description}</p>
        </div>

        <section dir={isArabic ? 'rtl' : 'ltr'} className="space-y-2">
          <h2 className="text-lg font-semibold text-gold">{t.recommended}</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {recommended.map((item) => (
              <Link key={item.id} href={`/${locale}/${item.mediaType}/${item.sourceId}`} className="w-36 shrink-0 overflow-hidden rounded-xl border border-emerald/30 bg-black/70 text-cream">
                <PosterImage src={item.poster} alt={item.title} width={144} height={216} className="h-52 w-full object-cover" />
                <div className="p-2">
                  <p className="line-clamp-2 text-xs font-semibold">{item.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (mediaType === 'tv') {
    const [show, seasonData, recommended] = await Promise.all([
      getTmdbDetail('tv', sourceId, locale as Locale),
      getTvSeasonEpisodes(sourceId, selectedSeason, locale as Locale),
      getSimilarTmdb('tv', sourceId, locale as Locale),
    ]);
    if (!show) notFound();

    return (
      <main className="space-y-4 px-1 sm:px-2 md:px-0">
        <StreamPlayer tmdbId={sourceId} type="tv" season={selectedSeason} episode={selectedEpisode} locale={locale as Locale} title={show.title} />
        <div dir={isArabic ? 'rtl' : 'ltr'} className={isArabic ? 'text-right' : 'text-left'}>
          <h1 className="text-2xl font-bold">{show.title}</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">{show.description}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{seasonData.seasonTitle}</p>
        </div>

        <section dir={isArabic ? 'rtl' : 'ltr'}>
          <p className="mb-2 text-sm font-semibold">{t.episodeSelector}</p>
          <div className="mb-3 flex flex-wrap gap-2">
            {(show.seasons?.length ? show.seasons : [{ seasonNumber: selectedSeason, episodeCount: seasonData.episodes.length, name: `${t.season} ${selectedSeason}` }]).map((season) => (
              <Link
                key={season.seasonNumber}
                href={`/${locale}/watch/tv/${sourceId}?season=${season.seasonNumber}&episode=1`}
                className={`rounded-full border px-3 py-1 text-sm ${selectedSeason === season.seasonNumber ? 'border-emerald bg-emerald text-white' : 'border-emerald/40 bg-transparent text-emerald'}`}
              >
                {t.season} {season.seasonNumber}
              </Link>
            ))}
          </div>

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
                  {t.episode} {episodeNumber}
                </Link>
              );
            })}
          </div>
        </section>

        <section dir={isArabic ? 'rtl' : 'ltr'} className="space-y-2">
          <h2 className="text-lg font-semibold text-gold">{t.recommended}</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {recommended.map((item) => (
              <Link key={item.id} href={`/${locale}/${item.mediaType}/${item.sourceId}`} className="w-36 shrink-0 overflow-hidden rounded-xl border border-emerald/30 bg-black/70 text-cream">
                <PosterImage src={item.poster} alt={item.title} width={144} height={216} className="h-52 w-full object-cover" />
                <div className="p-2">
                  <p className="line-clamp-2 text-xs font-semibold">{item.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    );
  }

  const [anime, episodes] = await Promise.all([getAnimeDetail(sourceId), getAnimeEpisodes(sourceId)]);
  if (!anime) notFound();
  const mappedTmdbId = await mapAnimeToTmdbTvId(sourceId, anime.title);
  if (!mappedTmdbId) notFound();
  const recommended = await getSimilarTmdb('tv', mappedTmdbId, locale as Locale);

  return (
    <main className="space-y-4 px-1 sm:px-2 md:px-0">
      <StreamPlayer tmdbId={mappedTmdbId} type="tv" season={1} episode={selectedEpisode} locale={locale as Locale} title={anime.title} />
      <div dir={isArabic ? 'rtl' : 'ltr'} className={isArabic ? 'text-right' : 'text-left'}>
        <h1 className="text-2xl font-bold">{anime.title}</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">{anime.description}</p>
      </div>
      <section dir={isArabic ? 'rtl' : 'ltr'}>
        <p className="mb-2 text-sm font-semibold">{t.episodeSelector}</p>
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
                {t.episode} {episodeNumber}
              </Link>
            );
          })}
        </div>
      </section>

      <section dir={isArabic ? 'rtl' : 'ltr'} className="space-y-2">
        <h2 className="text-lg font-semibold text-gold">{t.recommended}</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {recommended.map((item) => (
            <Link key={item.id} href={`/${locale}/${item.mediaType}/${item.sourceId}`} className="w-36 shrink-0 overflow-hidden rounded-xl border border-emerald/30 bg-black/70 text-cream">
              <PosterImage src={item.poster} alt={item.title} width={144} height={216} className="h-52 w-full object-cover" />
              <div className="p-2">
                <p className="line-clamp-2 text-xs font-semibold">{item.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
