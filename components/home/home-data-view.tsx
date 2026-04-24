import type { Locale } from '../../i18n/config';
import { uiCopy } from '../../lib/data/i18n';
import { getHomeCollections } from '../../lib/data/media';
import { ContentRow } from './content-row';
import { HeroSlider } from './hero-slider';

export async function HomeDataView({ locale }: { locale: Locale }) {
  const data = await getHomeCollections(locale);
  const t = uiCopy[locale];

  if (!data?.hero) {
    return <main className="rounded-xl border border-emerald/20 bg-white/70 p-6 dark:bg-zinc-900/70">No data available.</main>;
  }

  return (
    <main className="space-y-8">
      <HeroSlider item={data.hero} locale={locale} />
      <ContentRow title={t.trendingToday} items={data.trendingToday} locale={locale} />
      <ContentRow title={t.popularMovies} items={data.popularMovies} locale={locale} />
      <ContentRow title={t.topRatedArabicSeries} items={data.topRatedArabicSeries} locale={locale} />
    </main>
  );
}
