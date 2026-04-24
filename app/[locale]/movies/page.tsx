import Link from 'next/link';
import type { Locale } from '../../../i18n/config';
import { uiCopy } from '../../../lib/data/i18n';
import { getTmdbGenres } from '../../../lib/data/media';
import { CatalogGrid } from '../../../components/catalog/catalog-grid';

export default async function MoviesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = uiCopy[locale as Locale];
  const genres = await getTmdbGenres('movie', locale as Locale);

  return (
    <main className="space-y-5">
      <h1 className="text-2xl font-bold">{t.movies}</h1>
      <div className="flex flex-wrap gap-2">
        {genres.slice(0, 10).map((genre: { id: number; name: string }) => (
          <Link key={genre.id} href={`/${locale}/genres/${genre.id}?type=movie`} className="rounded-full border border-gold/40 px-3 py-1 text-sm">
            {genre.name}
          </Link>
        ))}
      </div>
      <CatalogGrid locale={locale as Locale} type="movie" />
    </main>
  );
}
