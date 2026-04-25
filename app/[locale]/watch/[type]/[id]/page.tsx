import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Lock } from 'lucide-react';
import type { Locale } from '../../../../../i18n/config';
import { StreamPlayer } from '../../../../../components/player/stream-player';
import { WatchAutofocus } from '../../../../../components/player/watch-autofocus';
import { PosterImage } from '../../../../../components/ui/poster-image';
import { uiCopy } from '../../../../../lib/data/i18n';
import { getAnimeDetail, getAnimeEpisodes, getSimilarTmdb, getTmdbDetail, getTvSeasonEpisodes, mapAnimeToTmdbTvId } from '../../../../../lib/data/media';

function getAdjacentEpisodeHref({
  locale,
  type,
  id,
  season,
  episode,
  maxEpisode,
  direction,
}: {
  locale: string;
  type: 'tv' | 'anime';
  id: number;
  season: number;
  episode: number;
  maxEpisode: number;
  direction: 'next' | 'prev';
}) {
  if (direction === 'next') {
    if (episode >= maxEpisode) return null;
    return `/${locale}/watch/${type}/${id}?season=${season}&episode=${episode + 1}`;
  }

  if (episode <= 1) return null;
  return `/${locale}/watch/${type}/${id}?season=${season}&episode=${episode - 1}`;
}


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; type: string; id: string }>;
}): Promise<Metadata> {
  const { locale, type, id } = await params;
  const sourceId = Number(id);

  if (Number.isNaN(sourceId)) {
    return {
      title: 'Watch | Drama HD',
      description: 'Watch the latest movies and series on Drama HD.',
    };
  }

  if (type === 'movie' || type === 'tv') {
    const show = await getTmdbDetail(type, sourceId, locale as Locale);
    if (show) {
      return {
        title: `Watch ${show.title} | Drama HD`,
        description: show.description,
      };
    }
  }

  if (type === 'anime') {
    const anime = await getAnimeDetail(sourceId);
    if (anime) {
      return {
        title: `Watch ${anime.title} | Drama HD`,
        description: anime.description,
      };
    }
  }

  return {
    title: 'Watch | Drama HD',
    description: 'Watch the latest movies and series on Drama HD.',
  };
}

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
      <main className="space-y-4 bg-[#050505] px-0 pb-6 text-[#FFFDD0]">
        <WatchAutofocus />
        <StreamPlayer tmdbId={sourceId} type="movie" locale={locale as Locale} title={show.title} />
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-2 px-3 sm:px-0">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center rounded-full border border-[#047857] bg-[#047857] px-4 py-2 text-sm font-semibold text-[#FFFDD0] transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
          >
            ← Back to Home
          </Link>
        </div>
        <div dir={isArabic ? 'rtl' : 'ltr'} className={isArabic ? 'px-3 text-right sm:px-0' : 'px-3 text-left sm:px-0'}>
          <h1 className="text-2xl font-bold">{show.title}</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">{show.description}</p>
        </div>

        <section dir={isArabic ? 'rtl' : 'ltr'} className="space-y-2 px-3 sm:px-0">
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

    const nextEpisodeHref = getAdjacentEpisodeHref({
      locale,
      type: 'tv',
      id: sourceId,
      season: selectedSeason,
      episode: selectedEpisode,
      maxEpisode: seasonData.episodes.length,
      direction: 'next',
    });
    const previousEpisodeHref = getAdjacentEpisodeHref({
      locale,
      type: 'tv',
      id: sourceId,
      season: selectedSeason,
      episode: selectedEpisode,
      maxEpisode: seasonData.episodes.length,
      direction: 'prev',
    });

    return (
      <main className="space-y-4 bg-[#050505] px-0 pb-6 text-[#FFFDD0]">
        <WatchAutofocus />
        <StreamPlayer
          tmdbId={sourceId}
          type="tv"
          season={selectedSeason}
          episode={selectedEpisode}
          locale={locale as Locale}
          title={show.title}
          nextEpisodeHref={nextEpisodeHref ?? undefined}
          previousEpisodeHref={previousEpisodeHref ?? undefined}
          maxEpisode={seasonData.episodes.length}
        />
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-2 px-3 sm:px-0">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center rounded-full border border-[#047857] bg-[#047857] px-4 py-2 text-sm font-semibold text-[#FFFDD0] transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
          >
            ← Back to Home
          </Link>
          <a
            href="#episode-list"
            className="inline-flex items-center rounded-full border border-[#D4AF37] bg-black px-4 py-2 text-sm font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37]/10"
          >
            Episode List
          </a>
        </div>
        <div dir={isArabic ? 'rtl' : 'ltr'} className={isArabic ? 'px-3 text-right sm:px-0' : 'px-3 text-left sm:px-0'}>
          <h1 className="text-2xl font-bold">{show.title}</h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">{show.description}</p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">{seasonData.seasonTitle}</p>
        </div>

        <section id="episode-list" dir={isArabic ? 'rtl' : 'ltr'} className="mx-auto w-full max-w-5xl scroll-mt-24 px-3 sm:px-0">
          <p className="mb-2 text-sm font-semibold text-[#FFFDD0]">{t.episodeSelector}</p>
          <div className="mb-3 overflow-x-auto rounded-xl border border-[#047857]/40 bg-black/40 p-2">
            <div className="flex min-w-max gap-2">
              {(show.seasons?.length ? show.seasons : [{ seasonNumber: selectedSeason, episodeCount: seasonData.episodes.length, name: `${t.season} ${selectedSeason}` }]).map((season) => (
                <Link
                  key={season.seasonNumber}
                  href={`/${locale}/watch/tv/${sourceId}?season=${season.seasonNumber}&episode=1`}
                  className={`inline-flex items-center rounded-md border px-3 py-1.5 text-sm ${selectedSeason === season.seasonNumber ? 'border-[#D4AF37] bg-[#D4AF37] text-black' : 'border-[#047857]/60 bg-[#047857]/20 text-[#FFFDD0] hover:border-[#D4AF37]'}`}
                >
                  {t.season} {season.seasonNumber}
                </Link>
              ))}
            </div>
          </div>

          <p className="mb-2 text-sm font-semibold text-[#047857]">Watching Now · {t.episode} {selectedEpisode}</p>
          <div className="overflow-x-auto rounded-xl border border-[#047857]/40 bg-black/40 p-2">
            <div className="flex min-w-max gap-2">
            {seasonData.episodes.map((episodeItem) => {
              const episodeNumber = episodeItem.episodeNumber;
              const isActive = selectedEpisode === episodeNumber;
              const isPremiumEpisode = episodeNumber > 20;
              const href = `/${locale}/watch/tv/${sourceId}?season=${selectedSeason}&episode=${episodeNumber}`;
              return (
                <Link
                  key={episodeNumber}
                  href={href}
                  className={`inline-flex min-w-[112px] items-center justify-center gap-1 rounded-md border px-3 py-2 text-center text-sm font-medium transition ${
                    isActive
                      ? 'border-[#D4AF37] bg-[#D4AF37] text-black'
                      : 'border-[#047857]/60 bg-[#047857]/15 text-[#FFFDD0] hover:border-[#D4AF37] hover:text-[#D4AF37]'
                  }`}
                >
                  {t.episode} {episodeNumber}
                  {isPremiumEpisode ? <Lock size={12} className="text-[#D4AF37]" /> : null}
                </Link>
              );
            })}
            </div>
          </div>
        </section>

        <section dir={isArabic ? 'rtl' : 'ltr'} className="space-y-2 px-3 sm:px-0">
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
  const nextEpisodeHref = getAdjacentEpisodeHref({
    locale,
    type: 'anime',
    id: sourceId,
    season: 1,
    episode: selectedEpisode,
    maxEpisode: episodes.length,
    direction: 'next',
  });
  const previousEpisodeHref = getAdjacentEpisodeHref({
    locale,
    type: 'anime',
    id: sourceId,
    season: 1,
    episode: selectedEpisode,
    maxEpisode: episodes.length,
    direction: 'prev',
  });

  return (
    <main className="space-y-4 bg-[#050505] px-0 pb-6 text-[#FFFDD0]">
      <WatchAutofocus />
      <StreamPlayer
        tmdbId={mappedTmdbId}
        type="tv"
        season={1}
        episode={selectedEpisode}
        locale={locale as Locale}
        title={anime.title}
        nextEpisodeHref={nextEpisodeHref ?? undefined}
        previousEpisodeHref={previousEpisodeHref ?? undefined}
        maxEpisode={episodes.length}
      />
      <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center gap-2 px-3 sm:px-0">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center rounded-full border border-[#047857] bg-[#047857] px-4 py-2 text-sm font-semibold text-[#FFFDD0] transition hover:border-[#D4AF37] hover:text-[#D4AF37]"
        >
          ← Back to Home
        </Link>
        <a
          href="#episode-list"
          className="inline-flex items-center rounded-full border border-[#D4AF37] bg-black px-4 py-2 text-sm font-semibold text-[#D4AF37] transition hover:bg-[#D4AF37]/10"
        >
          Episode List
        </a>
      </div>
      <div dir={isArabic ? 'rtl' : 'ltr'} className={isArabic ? 'px-3 text-right sm:px-0' : 'px-3 text-left sm:px-0'}>
        <h1 className="text-2xl font-bold">{anime.title}</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">{anime.description}</p>
      </div>
      <section id="episode-list" dir={isArabic ? 'rtl' : 'ltr'} className="mx-auto w-full max-w-5xl scroll-mt-24 px-3 sm:px-0">
        <p className="mb-2 text-sm font-semibold text-[#FFFDD0]">{t.episodeSelector}</p>
        <p className="mb-2 text-sm font-semibold text-[#047857]">Watching Now · {t.episode} {selectedEpisode}</p>
        <div className="overflow-x-auto rounded-xl border border-[#047857]/40 bg-black/40 p-2">
          <div className="flex min-w-max gap-2">
          {episodes.map((episodeItem) => {
            const episodeNumber = episodeItem.episodeNumber;
            const isActive = selectedEpisode === episodeNumber;
            const isPremiumEpisode = episodeNumber > 20;
            const href = `/${locale}/watch/anime/${sourceId}?season=1&episode=${episodeNumber}`;
            return (
              <Link
                key={episodeNumber}
                href={href}
                className={`inline-flex min-w-[112px] items-center justify-center gap-1 rounded-md border px-3 py-2 text-center text-sm font-medium transition ${
                  isActive
                    ? 'border-[#D4AF37] bg-[#D4AF37] text-black'
                    : 'border-[#047857]/60 bg-[#047857]/15 text-[#FFFDD0] hover:border-[#D4AF37] hover:text-[#D4AF37]'
                }`}
              >
                {t.episode} {episodeNumber}
                {isPremiumEpisode ? <Lock size={12} className="text-[#D4AF37]" /> : null}
              </Link>
            );
          })}
          </div>
        </div>
      </section>

      <section dir={isArabic ? 'rtl' : 'ltr'} className="space-y-2 px-3 sm:px-0">
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
