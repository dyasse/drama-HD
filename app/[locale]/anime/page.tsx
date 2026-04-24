import type { Locale } from '../../../i18n/config';
import { AnimeGrid } from '../../../components/anime-grid';

export default async function AnimePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;

  return <AnimeGrid locale={rawLocale as Locale} />;
}
