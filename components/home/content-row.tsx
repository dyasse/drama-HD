import Link from 'next/link';
import type { Locale } from '../../i18n/config';
import type { MediaItem } from '../../lib/data/media';
import { PosterImage } from '../ui/poster-image';

export function ContentRow({ title, items, locale }: { title: string; items: MediaItem[]; locale: Locale }) {
  return (
    <section>
      <h3 className="mb-3 text-xl font-semibold">{title}</h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/${locale}/watch/${item.id}`}
            className="min-w-60 overflow-hidden rounded-xl border border-gold/30 bg-white/60 transition hover:-translate-y-1 hover:border-emerald dark:bg-zinc-900/60"
          >
            <PosterImage src={item.poster} alt={item.title} width={640} height={320} className="h-40 w-full object-cover" />
            <div className="p-3">
              <p className="font-semibold">{item.title}</p>
              <p className="text-xs text-gold">TMDB ⭐ {item.rating.toFixed(1)}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
