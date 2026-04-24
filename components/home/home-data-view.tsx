'use client';

import { useEffect, useState } from 'react';
import type { Locale } from '../../i18n/config';
import type { MediaItem } from '../../lib/data/media';
import { getHomeCollections } from '../../lib/data/media';
import { ContentRow } from './content-row';
import { HeroSlider } from './hero-slider';
import { LoadingSkeleton } from '../ui/loading-skeleton';

type HomeCollections = {
  hero?: MediaItem;
  popularArabicSeries: MediaItem[];
  trendingInternational: MediaItem[];
  topRatedKDramas: MediaItem[];
};

export function HomeDataView({ locale }: { locale: Locale }) {
  const [data, setData] = useState<HomeCollections | null>(null);

  useEffect(() => {
    getHomeCollections().then(setData);
  }, []);

  if (!data?.hero) {
    return (
      <main className="space-y-8">
        <LoadingSkeleton className="h-[380px] w-full" />
        <LoadingSkeleton className="h-52 w-full" />
        <LoadingSkeleton className="h-52 w-full" />
      </main>
    );
  }

  return (
    <main className="space-y-8">
      <HeroSlider item={data.hero} locale={locale} />
      <ContentRow title="Popular Arabic Series" items={data.popularArabicSeries} locale={locale} />
      <ContentRow title="Trending International" items={data.trendingInternational} locale={locale} />
      <ContentRow title="Top Rated K-Dramas" items={data.topRatedKDramas} locale={locale} />
    </main>
  );
}
