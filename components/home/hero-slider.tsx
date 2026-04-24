'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Show } from '../../lib/data/content';
import type { Locale } from '../../i18n/config';

export function HeroSlider({ items, locale }: { items: Show[]; locale: Locale }) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {items.map((item, index) => (
        <motion.article
          key={item.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: index * 0.08 }}
          className="relative overflow-hidden rounded-2xl shadow-card"
        >
          <Image src={item.cover} alt={item.title} width={800} height={480} className="h-72 w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 text-white">
            <p className="inline-block rounded-full bg-gold px-2 py-0.5 text-xs font-semibold text-black">Featured</p>
            <h2 className="mt-2 text-xl font-semibold">{item.title}</h2>
            <p className="mt-1 text-sm text-zinc-200">{item.description}</p>
            <Link href={`/${locale}/watch/${item.id}`} className="mt-3 inline-block rounded-full bg-emerald px-3 py-1.5 text-sm font-semibold">
              Watch now
            </Link>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
