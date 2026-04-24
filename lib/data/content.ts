export type Episode = {
  id: number;
  title: string;
  duration: string;
};

export type Show = {
  id: string;
  title: string;
  category: 'translated' | 'english' | 'french' | 'anime' | 'arabic';
  language: 'AR' | 'EN' | 'FR';
  cover: string;
  episodes: Episode[];
  description: string;
};

const buildEpisodes = (count: number): Episode[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Episode ${i + 1}`,
    duration: `${12 + (i % 4)} min`,
  }));

export const seriesList: Show[] = [
  {
    id: 'desert-oath',
    title: 'Desert Oath',
    category: 'translated',
    language: 'AR',
    cover: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80',
    episodes: buildEpisodes(30),
    description: 'A gripping revenge tale reborn in modern subtitles.',
  },
  {
    id: 'city-of-echoes',
    title: 'City of Echoes',
    category: 'english',
    language: 'EN',
    cover: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80',
    episodes: buildEpisodes(24),
    description: 'Fast-cut mystery episodes designed for mobile binging.',
  },
  {
    id: 'paris-minute',
    title: 'Paris Minute',
    category: 'french',
    language: 'FR',
    cover: 'https://images.unsplash.com/photo-1522093007474-d86e9bf7ba6f?auto=format&fit=crop&w=900&q=80',
    episodes: buildEpisodes(22),
    description: 'Romance in snapshots, one short episode at a time.',
  },
  {
    id: 'cairo-flash',
    title: 'Cairo Flash',
    category: 'arabic',
    language: 'AR',
    cover: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?auto=format&fit=crop&w=900&q=80',
    episodes: buildEpisodes(26),
    description: 'High-energy stories from the heart of Cairo.',
  },
];

export const animeList: Show[] = [
  {
    id: 'blade-comet',
    title: 'Blade Comet',
    category: 'anime',
    language: 'EN',
    cover: 'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=900&q=80',
    episodes: buildEpisodes(28),
    description: 'Futuristic ninja duels in 8-15 minute arcs.',
  },
  {
    id: 'mini-mecha',
    title: 'Mini Mecha',
    category: 'anime',
    language: 'FR',
    cover: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80',
    episodes: buildEpisodes(18),
    description: 'Compact battles with cinematic pacing.',
  },
];

export const featuredShows = [...seriesList.slice(0, 2), ...animeList.slice(0, 1)];

export const allShows = [...seriesList, ...animeList];

export const findShowById = (seriesId: string) => allShows.find((show) => show.id === seriesId);
