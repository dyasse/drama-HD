import Link from 'next/link';
import type { Locale } from '../../../i18n/config';
import { animeList } from '../../../lib/data/content';

export default function AnimePage({ params }: { params: { locale: string } }) {
  const locale = params.locale as Locale;

  return (
    <main>
      <h1 className="mb-4 text-2xl font-bold">Short-Form Anime</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {animeList.map((item) => (
          <Link key={item.id} href={`/${locale}/watch/${item.id}`} className="group overflow-hidden rounded-xl border border-gold/30 bg-black text-cream">
            <img src={item.cover} alt={item.title} className="h-44 w-full object-cover transition duration-300 group-hover:scale-105" />
            <div className="p-3">
              <h2 className="font-semibold text-gold">{item.title}</h2>
              <p className="text-sm text-zinc-300">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
