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
};

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w780';
const FALLBACK_POSTER = 'https://placehold.co/780x1170/0a0a0a/FFFDD0?text=Drama+HD';

function resolveTmdbImage(path?: string | null) {
  return path ? `${TMDB_IMAGE_BASE}${path}` : FALLBACK_POSTER;
}

function detectLanguage(languageCode: string): 'AR' | 'EN' | 'FR' {
  if (languageCode === 'ar') return 'AR';
  if (languageCode === 'fr') return 'FR';
  return 'EN';
}

async function fetchTmdb(path: string) {
  const key = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!key) return { results: [] };

  const response = await fetch(`https://api.themoviedb.org/3${path}${path.includes('?') ? '&' : '?'}api_key=${key}`, {
    next: { revalidate: 900 },
  });

  if (!response.ok) {
    return { results: [] };
  }

  return response.json();
}

function mapTmdbItem(item: any, mediaTypeOverride?: 'movie' | 'tv'): MediaItem {
  const mediaType = mediaTypeOverride ?? (item.media_type === 'movie' ? 'movie' : 'tv');
  const title = item.title ?? item.name ?? 'Untitled';

  return {
    id: `${mediaType}-${item.id}`,
    sourceId: item.id,
    mediaType,
    title,
    description: item.overview ?? 'No description available yet.',
    poster: resolveTmdbImage(item.poster_path),
    backdrop: resolveTmdbImage(item.backdrop_path),
    rating: Number(item.vote_average ?? 0),
    language: detectLanguage(item.original_language ?? 'en'),
  };
}

export async function getHomeCollections() {
  const [trending, arabicSeries, international, kDrama] = await Promise.all([
    fetchTmdb('/trending/all/week?language=en-US'),
    fetchTmdb('/discover/tv?language=en-US&with_original_language=ar&sort_by=popularity.desc'),
    fetchTmdb('/trending/all/day?language=en-US'),
    fetchTmdb('/discover/tv?language=en-US&with_original_language=ko&sort_by=vote_average.desc&vote_count.gte=100'),
  ]);

  const trendingItems = (trending.results ?? []).filter((item: any) => item.media_type === 'movie' || item.media_type === 'tv').map((item: any) => mapTmdbItem(item));

  return {
    hero: trendingItems[0],
    popularArabicSeries: (arabicSeries.results ?? []).slice(0, 12).map((item: any) => mapTmdbItem(item, 'tv')),
    trendingInternational: (international.results ?? [])
      .filter((item: any) => (item.media_type === 'movie' || item.media_type === 'tv') && item.original_language !== 'ar')
      .slice(0, 12)
      .map((item: any) => mapTmdbItem(item)),
    topRatedKDramas: (kDrama.results ?? []).slice(0, 12).map((item: any) => mapTmdbItem(item, 'tv')),
  };
}

export async function getSeriesByLanguage(language: 'AR' | 'EN' | 'FR') {
  const params =
    language === 'AR'
      ? '/discover/tv?language=en-US&with_original_language=ar&sort_by=popularity.desc'
      : language === 'FR'
        ? '/discover/tv?language=fr-FR&with_original_language=fr&sort_by=popularity.desc'
        : '/discover/tv?language=en-US&with_original_language=en&sort_by=popularity.desc';

  const data = await fetchTmdb(params);
  return (data.results ?? []).slice(0, 18).map((item: any) => mapTmdbItem(item, 'tv'));
}

export async function getTopAiringAnime() {
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

export async function getWatchMediaByRouteId(routeId: string): Promise<MediaItem | null> {
  if (routeId.startsWith('anime-')) {
    const malId = Number(routeId.split('-')[1]);
    if (Number.isNaN(malId)) return null;
    const response = await fetch(`https://api.jikan.moe/v4/anime/${malId}`,
      { next: { revalidate: 1800 } });
    if (!response.ok) return null;
    const payload = await response.json();
    const item = payload.data;
    return {
      id: routeId,
      sourceId: malId,
      mediaType: 'anime',
      title: item?.title ?? 'Anime',
      description: item?.synopsis ?? 'No synopsis available yet.',
      poster: item?.images?.jpg?.large_image_url ?? FALLBACK_POSTER,
      backdrop: item?.trailer?.images?.maximum_image_url ?? item?.images?.jpg?.large_image_url ?? FALLBACK_POSTER,
      rating: Number(item?.score ?? 0),
      language: 'EN',
    };
  }

  const [mediaType, rawId] = routeId.split('-');
  if (!rawId || (mediaType !== 'movie' && mediaType !== 'tv')) return null;
  const sourceId = Number(rawId);
  if (Number.isNaN(sourceId)) return null;

  const key = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!key) return null;
  const response = await fetch(`https://api.themoviedb.org/3/${mediaType}/${sourceId}?api_key=${key}&language=en-US`, {
    next: { revalidate: 1800 },
  });
  if (!response.ok) return null;
  const item = await response.json();

  return {
    id: routeId,
    sourceId,
    mediaType,
    title: item.title ?? item.name ?? 'Untitled',
    description: item.overview ?? 'No description available yet.',
    poster: resolveTmdbImage(item.poster_path),
    backdrop: resolveTmdbImage(item.backdrop_path),
    rating: Number(item.vote_average ?? 0),
    language: detectLanguage(item.original_language ?? 'en'),
  };
}
