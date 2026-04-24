export type MediaType = 'movie' | 'tv' | 'anime';

export type MediaItem = {
  id: string;
  sourceId: number;
  mediaType: MediaType;
  title: string;
  description: string;
  poster: string;
  backdrop: string;
  rating: number;
  language: 'AR' | 'EN' | 'FR';
  releaseDate?: string;
};

export type CastMember = {
  id: number;
  name: string;
  character?: string;
  image: string;
};

export type MediaDetail = MediaItem & {
  runtime?: number;
  genres: string[];
  trailerKey?: string;
  cast: CastMember[];
  seasons?: Array<{ seasonNumber: number; episodeCount: number; name: string }>;
};

export type EpisodeItem = {
  episodeNumber: number;
  title: string;
  description: string;
  runtime?: number;
  still: string;
};

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/original';
const FALLBACK_POSTER = 'https://placehold.co/780x1170/0a0a0a/FFFDD0?text=Drama+HD';

export function localeToTmdbLanguage(locale: 'ar' | 'en' | 'fr') {
  if (locale === 'ar') return 'ar-SA';
  if (locale === 'fr') return 'fr-FR';
  return 'en-US';
}

function resolveTmdbImage(path?: string | null) {
  return path ? `${TMDB_IMAGE_BASE}${path}` : FALLBACK_POSTER;
}

function detectLanguage(languageCode: string): 'AR' | 'EN' | 'FR' {
  if (languageCode === 'ar') return 'AR';
  if (languageCode === 'fr') return 'FR';
  return 'EN';
}

async function fetchTmdb(path: string, revalidate = 900) {
  const key = process.env.TMDB_API_KEY ?? process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!key) return { results: [] };

  const response = await fetch(`https://api.themoviedb.org/3${path}${path.includes('?') ? '&' : '?'}api_key=${key}`, {
    next: { revalidate },
  });

  if (!response.ok) {
    return { results: [] };
  }

  return response.json();
}

function mapTmdbItem(item: any, mediaTypeOverride?: 'movie' | 'tv'): MediaItem {
  const mediaType = mediaTypeOverride ?? (item.media_type === 'movie' ? 'movie' : 'tv');

  return {
    id: `${mediaType}-${item.id}`,
    sourceId: item.id,
    mediaType,
    title: item.title ?? item.name ?? 'Untitled',
    description: item.overview ?? 'No description available yet.',
    poster: resolveTmdbImage(item.poster_path),
    backdrop: resolveTmdbImage(item.backdrop_path),
    rating: Number(item.vote_average ?? 0),
    language: detectLanguage(item.original_language ?? 'en'),
    releaseDate: item.release_date ?? item.first_air_date,
  };
}

export async function getHomeCollections(locale: 'ar' | 'en' | 'fr') {
  const language = localeToTmdbLanguage(locale);

  const [trendingToday, popularMovies, topRatedArabicSeries] = await Promise.all([
    fetchTmdb(`/trending/all/day?language=${language}`),
    fetchTmdb(`/movie/popular?language=${language}&page=1`),
    fetchTmdb(`/discover/tv?language=${language}&with_original_language=ar&sort_by=vote_average.desc&vote_count.gte=150&page=1`),
  ]);

  const trendingItems = (trendingToday.results ?? [])
    .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
    .map((item: any) => mapTmdbItem(item));

  return {
    hero: trendingItems[0],
    trendingToday: trendingItems.slice(0, 16),
    popularMovies: (popularMovies.results ?? []).slice(0, 16).map((item: any) => mapTmdbItem(item, 'movie')),
    topRatedArabicSeries: (topRatedArabicSeries.results ?? []).slice(0, 16).map((item: any) => mapTmdbItem(item, 'tv')),
  };
}

export async function discoverMedia(params: {
  mediaType: 'movie' | 'tv';
  locale: 'ar' | 'en' | 'fr';
  page?: number;
  genreId?: number;
}) {
  const language = localeToTmdbLanguage(params.locale);
  const page = params.page ?? 1;
  const withGenres = params.genreId ? `&with_genres=${params.genreId}` : '';

  const data = await fetchTmdb(
    `/discover/${params.mediaType}?language=${language}&sort_by=popularity.desc&include_adult=false&page=${page}${withGenres}`,
  );

  return {
    page: data.page ?? page,
    totalPages: Math.min(data.total_pages ?? 1, 500),
    results: (data.results ?? []).map((item: any) => mapTmdbItem(item, params.mediaType)),
  };
}

export async function searchTmdb(query: string, locale: 'ar' | 'en' | 'fr') {
  if (!query.trim()) return [];
  const language = localeToTmdbLanguage(locale);
  const data = await fetchTmdb(`/search/multi?query=${encodeURIComponent(query)}&language=${language}&include_adult=false&page=1`, 60);

  return (data.results ?? [])
    .filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv')
    .slice(0, 20)
    .map((item: any) => mapTmdbItem(item));
}

export async function getTmdbGenres(mediaType: 'movie' | 'tv', locale: 'ar' | 'en' | 'fr') {
  const language = localeToTmdbLanguage(locale);
  const data = await fetchTmdb(`/genre/${mediaType}/list?language=${language}`, 86400);
  return data.genres ?? [];
}

export async function getSeriesByLanguage(language: 'AR' | 'EN' | 'FR') {
  const locale = language === 'AR' ? 'ar' : language === 'FR' ? 'fr' : 'en';
  const data = await discoverMedia({ mediaType: 'tv', locale, page: 1 });
  return data.results.slice(0, 18);
}

export async function getTopAiringAnime(): Promise<MediaItem[]> {
  const response = await fetch('https://api.jikan.moe/v4/top/anime?filter=airing&limit=18', {
    next: { revalidate: 1800 },
  });

  if (!response.ok) return [];
  const data = await response.json();

  return (data.data ?? []).map((item: any) => ({
    id: `anime-${item.mal_id}`,
    sourceId: item.mal_id,
    mediaType: 'anime' as const,
    title: item.title ?? 'Untitled anime',
    description: item.synopsis ?? 'No synopsis available yet.',
    poster: item.images?.jpg?.large_image_url ?? FALLBACK_POSTER,
    backdrop: item.trailer?.images?.maximum_image_url ?? item.images?.jpg?.large_image_url ?? FALLBACK_POSTER,
    rating: Number(item.score ?? 0),
    language: 'EN' as const,
  }));
}

export async function getTmdbDetail(mediaType: 'movie' | 'tv', id: number, locale: 'ar' | 'en' | 'fr'): Promise<MediaDetail | null> {
  const language = localeToTmdbLanguage(locale);
  const [detail, credits, videos] = await Promise.all([
    fetchTmdb(`/${mediaType}/${id}?language=${language}`, 1800),
    fetchTmdb(`/${mediaType}/${id}/credits?language=${language}`, 1800),
    fetchTmdb(`/${mediaType}/${id}/videos?language=${language}`, 1800),
  ]);

  if (!detail?.id) return null;

  const trailer = (videos.results ?? []).find((item: any) => item.site === 'YouTube' && item.type === 'Trailer');

  const mapped = mapTmdbItem(detail, mediaType);
  return {
    ...mapped,
    genres: (detail.genres ?? []).map((genre: { name?: string }) => genre.name).filter(Boolean),
    runtime: detail.runtime ?? detail.episode_run_time?.[0],
    trailerKey: trailer?.key,
    cast: (credits.cast ?? []).slice(0, 12).map((member: any) => ({
      id: member.id,
      name: member.name ?? 'Unknown',
      character: member.character,
      image: resolveTmdbImage(member.profile_path),
    })),
    seasons:
      mediaType === 'tv'
        ? (detail.seasons ?? [])
            .filter((season: any) => season.season_number > 0)
            .map((season: any) => ({
              seasonNumber: season.season_number,
              episodeCount: season.episode_count ?? 0,
              name: season.name ?? `Season ${season.season_number}`,
            }))
        : undefined,
  };
}

export async function getTvSeasonEpisodes(
  id: number,
  seasonNumber: number,
  locale: 'ar' | 'en' | 'fr',
): Promise<{ seasonTitle: string; episodes: EpisodeItem[] }> {
  const language = localeToTmdbLanguage(locale);
  const season = await fetchTmdb(`/tv/${id}/season/${seasonNumber}?language=${language}`, 1800);

  return {
    seasonTitle: season.name ?? `Season ${seasonNumber}`,
    episodes: (season.episodes ?? []).map((episode: any) => ({
      episodeNumber: episode.episode_number,
      title: episode.name ?? `Episode ${episode.episode_number}`,
      description: episode.overview ?? 'No episode summary available yet.',
      runtime: episode.runtime,
      still: resolveTmdbImage(episode.still_path),
    })),
  };
}

export async function getAnimeDetail(id: number): Promise<MediaDetail | null> {
  const response = await fetch(`https://api.jikan.moe/v4/anime/${id}/full`, { next: { revalidate: 1800 } });
  if (!response.ok) return null;

  const payload = await response.json();
  const anime = payload.data;
  if (!anime) return null;

  const castResponse = await fetch(`https://api.jikan.moe/v4/anime/${id}/characters`, { next: { revalidate: 1800 } });
  const castPayload = castResponse.ok ? await castResponse.json() : { data: [] };

  return {
    id: `anime-${anime.mal_id}`,
    sourceId: anime.mal_id,
    mediaType: 'anime',
    title: anime.title ?? anime.title_english ?? 'Untitled anime',
    description: anime.synopsis ?? 'No synopsis available yet.',
    poster: anime.images?.jpg?.large_image_url ?? FALLBACK_POSTER,
    backdrop: anime.trailer?.images?.maximum_image_url ?? anime.images?.jpg?.large_image_url ?? FALLBACK_POSTER,
    rating: Number(anime.score ?? 0),
    language: 'EN',
    releaseDate: anime.aired?.from,
    runtime: typeof anime.duration === 'string' ? Number.parseInt(anime.duration, 10) || undefined : undefined,
    genres: (anime.genres ?? []).map((genre: { name: string }) => genre.name),
    trailerKey: anime.trailer?.youtube_id,
    cast: (castPayload.data ?? []).slice(0, 12).map((member: any) => ({
      id: member.character?.mal_id ?? 0,
      name: member.character?.name ?? 'Unknown',
      character: member.role,
      image: member.character?.images?.jpg?.image_url ?? FALLBACK_POSTER,
    })),
  };
}

export async function getAnimeEpisodes(id: number): Promise<EpisodeItem[]> {
  const response = await fetch(`https://api.jikan.moe/v4/anime/${id}/episodes`, {
    next: { revalidate: 1800 },
  });

  if (!response.ok) return [];
  const payload = await response.json();

  return (payload.data ?? []).map((episode: any) => ({
    episodeNumber: episode.mal_id ?? episode.episode_id,
    title: episode.title ?? `Episode ${episode.mal_id}`,
    description: episode.synopsis ?? 'No episode summary available yet.',
    runtime: undefined,
    still: FALLBACK_POSTER,
  }));
}


export async function mapAnimeToTmdbTvId(animeId: number, fallbackTitle?: string): Promise<number | null> {
  const anime = fallbackTitle
    ? { title: fallbackTitle }
    : await fetch(`https://api.jikan.moe/v4/anime/${animeId}`, { next: { revalidate: 3600 } })
        .then((response) => (response.ok ? response.json() : null))
        .then((payload) => payload?.data ?? null);

  const title = anime?.title ?? anime?.title_english;
  if (!title) return null;

  const data = await fetchTmdb(`/search/tv?query=${encodeURIComponent(title)}&language=en-US&page=1`, 3600);
  const first = (data.results ?? [])[0];
  return first?.id ?? null;
}

export async function getWatchMedia(mediaType: 'movie' | 'tv', id: number, locale: 'ar' | 'en' | 'fr'): Promise<MediaItem | null> {
  const detail = await getTmdbDetail(mediaType, id, locale);
  if (!detail) return null;

  return {
    id: detail.id,
    sourceId: detail.sourceId,
    mediaType: detail.mediaType,
    title: detail.title,
    description: detail.description,
    poster: detail.poster,
    backdrop: detail.backdrop,
    rating: detail.rating,
    language: detail.language,
    releaseDate: detail.releaseDate,
  };
}
