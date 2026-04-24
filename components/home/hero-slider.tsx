'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { Locale } from '../../i18n/config';
import type { MediaItem } from '../../lib/data/media';
import { PosterImage } from '../ui/poster-image';

export function HeroSlider({ item, locale }: { item: MediaItem; locale: Locale }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-2xl shadow-card"
    >
      <PosterImage src={item.backdrop} alt={item.title} width={1200} height={600} className="h-[380px] w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent p-6 text-cream">
        <p className="inline-block rounded-full bg-gold px-3 py-1 text-xs font-semibold text-black">Trending Now</p>
        <h2 className="mt-3 text-3xl font-semibold">{item.title}</h2>
        <p className="mt-2 max-w-2xl text-sm text-cream/90">{item.description}</p>
        <div className="mt-2 text-sm text-gold">TMDB ⭐ {item.rating.toFixed(1)}</div>
        <Link href={`/${locale}/watch/${item.id}`} className="mt-4 inline-block rounded-full bg-emerald px-4 py-2 text-sm font-semibold text-cream">
          Watch now
        </Link>
      </div>
    </motion.article>
  );
}
