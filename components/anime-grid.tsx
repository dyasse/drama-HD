import type { Locale } from '../i18n/config';
import { getTopAiringAnime } from '../lib/data/media';
import { PosterImage } from './ui/poster-image';

export async function AnimeGrid({ locale: _locale }: { locale: Locale }) {
  const items = await getTopAiringAnime();

  return (
    <main>
      <h1 className="text-2xl font-bold">Top Airing Anime</h1>
      <p className="mb-4 mt-1 text-sm text-zinc-600 dark:text-zinc-300">Live data from Jikan API.</p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article key={item.id} className="group overflow-hidden rounded-xl border border-gold/30 bg-black text-cream">
            <PosterImage
              src={item.poster}
              alt={item.title}
              width={640}
              height={352}
              className="h-52 w-full object-cover transition duration-300 group-hover:scale-105"
            />
            <div className="space-y-1 p-3">
              <h2 className="font-semibold text-gold">{item.title}</h2>
              <p className="text-xs text-gold">Score ⭐ {item.rating.toFixed(1)}</p>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
