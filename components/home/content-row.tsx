import Link from 'next/link';
import Image from 'next/image';
import type { Show } from '../../lib/data/content';
import type { Locale } from '../../i18n/config';

export function ContentRow({ title, items, locale }: { title: string; items: Show[]; locale: Locale }) {
  return (
    <section>
      <h3 className="mb-3 text-xl font-semibold">{title}</h3>
      <div className="flex gap-4 overflow-x-auto pb-2">
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/${locale}/watch/${item.id}`}
            className="min-w-60 overflow-hidden rounded-xl border border-emerald/15 bg-white/60 transition hover:-translate-y-1 hover:border-emerald dark:bg-zinc-900/60"
          >
            <Image src={item.cover} alt={item.title} width={640} height={320} className="h-32 w-full object-cover" />
            <div className="p-3">
              <p className="font-semibold">{item.title}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-300">{item.language} • {item.episodes.length} eps</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
