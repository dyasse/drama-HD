import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Play, Star } from 'lucide-react';
import type { Locale } from '../../../../i18n/config';
import { PosterImage } from '../../../../components/ui/poster-image';
import { getAnimeDetail, getTmdbDetail } from '../../../../lib/data/media';

function resolveType(raw: string): 'movie' | 'tv' | 'anime' | null {
  if (raw === 'movie' || raw === 'tv' || raw === 'anime') return raw;
  return null;
}

export default async function MediaDetailPage({ params }: { params: Promise<{ locale: string; type: string; id: string }> }) {
  const { locale, type, id } = await params;
  const mediaType = resolveType(type);
  const sourceId = Number(id);

  if (!mediaType || Number.isNaN(sourceId)) notFound();

  const detail = mediaType === 'anime' ? await getAnimeDetail(sourceId) : await getTmdbDetail(mediaType, sourceId, locale as Locale);

  if (!detail) notFound();

  return (
    <main className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-emerald/20 bg-black text-cream">
        <div className="relative h-72 w-full">
          <PosterImage src={detail.backdrop} alt={detail.title} fill className="object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute bottom-0 z-10 grid w-full gap-4 p-4 md:grid-cols-[220px_1fr]">
            <PosterImage src={detail.poster} alt={detail.title} width={220} height={330} className="hidden h-[280px] w-[190px] rounded-xl object-cover md:block" />
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-gold">{detail.title}</h1>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-1 rounded-full bg-gold/20 px-3 py-1 text-gold"><Star size={14} /> {detail.rating.toFixed(1)}</span>
                {detail.releaseDate ? <span className="rounded-full bg-white/10 px-3 py-1">{detail.releaseDate.slice(0, 4)}</span> : null}
                {detail.runtime ? <span className="rounded-full bg-white/10 px-3 py-1">{detail.runtime} min</span> : null}
              </div>
              <p className="max-w-4xl text-sm text-zinc-200">{detail.description}</p>
              <div className="flex flex-wrap gap-2">
                {detail.genres.map((genre) => (
                  <span key={genre} className="rounded-full border border-emerald/40 bg-emerald/10 px-3 py-1 text-xs text-emerald">
                    {genre}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href={`/${locale}/watch/${mediaType}/${sourceId}`} className="inline-flex items-center gap-2 rounded-full bg-emerald px-4 py-2 font-semibold text-cream">
                  <Play size={16} /> Watch Now
                </Link>
                {detail.trailerKey ? (
                  <a href={`https://www.youtube.com/watch?v=${detail.trailerKey}`} target="_blank" rel="noreferrer" className="rounded-full border border-gold/40 px-4 py-2 text-gold">
                    Trailer
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {detail.seasons && detail.seasons.length > 0 ? (
        <section className="rounded-2xl border border-emerald/20 bg-white/80 p-4 dark:bg-zinc-900/70">
          <h2 className="mb-3 text-xl font-semibold">Seasons</h2>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {detail.seasons.map((season) => (
              <Link
                key={season.seasonNumber}
                href={`/${locale}/${mediaType}/${sourceId}/season/${season.seasonNumber}/episode/1`}
                className="rounded-xl border border-gold/30 bg-black p-3 text-cream"
              >
                <p className="font-semibold text-gold">{season.name}</p>
                <p className="text-xs">{season.episodeCount} episodes</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {detail.cast.length > 0 ? (
        <section className="rounded-2xl border border-emerald/20 bg-white/80 p-4 dark:bg-zinc-900/70">
          <h2 className="mb-3 text-xl font-semibold">Cast</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {detail.cast.map((member) => (
              <article key={`${member.id}-${member.name}`} className="overflow-hidden rounded-xl border border-gold/20 bg-black text-cream">
                <PosterImage src={member.image} alt={member.name} width={300} height={220} className="h-36 w-full object-cover" />
                <div className="space-y-0.5 p-2 text-xs">
                  <p className="font-semibold text-gold">{member.name}</p>
                  <p className="line-clamp-1 text-zinc-300">{member.character}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
