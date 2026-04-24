import type { Locale } from '../../i18n/config';
import { animeList, featuredShows, seriesList } from '../../lib/data/content';
import { uiCopy } from '../../lib/data/i18n';
import { ContentRow } from '../../components/home/content-row';
import { HeroSlider } from '../../components/home/hero-slider';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale as Locale;
  const t = uiCopy[locale];

  return (
    <main className="space-y-8">
      <HeroSlider items={featuredShows} locale={locale} />
      <ContentRow title={t.trending} items={[...seriesList.slice(0, 2), ...animeList.slice(0, 1)]} locale={locale} />
      <ContentRow title={t.newArabic} items={seriesList.filter((item) => item.language === 'AR')} locale={locale} />
      <ContentRow title={t.topAnime} items={animeList} locale={locale} />
    </main>
  );
}
