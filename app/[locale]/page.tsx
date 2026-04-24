import type { Locale } from '../../i18n/config';
import { HomeDataView } from '../../components/home/home-data-view';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;

  return <HomeDataView locale={rawLocale as Locale} />;
}
