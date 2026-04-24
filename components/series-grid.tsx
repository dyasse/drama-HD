'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Show } from '../lib/data/content';
import type { Locale } from '../i18n/config';
import { uiCopy } from '../lib/data/i18n';

type Filter = 'translated' | 'english' | 'french';

export function SeriesGrid({ items, locale }: { items: Show[]; locale: Locale }) {
  const t = uiCopy[locale];
  const [filter, setFilter] = useState<Filter>('translated');

  const filtered = useMemo(() => {
    if (filter === 'translated') return items.filter((item) => item.category === 'translated' || item.category === 'arabic');
    if (filter === 'english') return items.filter((item) => item.language === 'EN');
    return items.filter((item) => item.language === 'FR');
  }, [filter, items]);

  const tabs: { key: Filter; label: string; subtitle: string }[] = [
    { key: 'translated', label: t.translated, subtitle: 'AR audio • Motrjam subtitles' },
    { key: 'english', label: t.english, subtitle: 'English subtitles' },
    { key: 'french', label: t.french, subtitle: 'Sous-titres français' },
  ];

  return (
    <section>
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            type="button"
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`rounded-2xl px-4 py-2 text-left text-sm ${filter === tab.key ? 'bg-emerald text-white' : 'border border-emerald/25 bg-white/70 dark:bg-zinc-900/70'}`}
          >
            <span className="block font-semibold">{tab.label}</span>
            <span className={`block text-xs ${filter === tab.key ? 'text-cream/90' : 'text-zinc-500 dark:text-zinc-300'}`}>{tab.subtitle}</span>
          </button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <Link key={item.id} href={`/${locale}/watch/${item.id}`} className="overflow-hidden rounded-xl border border-emerald/15 bg-white/60 dark:bg-zinc-900/70">
            <Image src={item.cover} alt={item.title} width={640} height={352} className="h-44 w-full object-cover" />
            <div className="p-3">
              <p className="font-semibold">{item.title}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-300">{item.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
