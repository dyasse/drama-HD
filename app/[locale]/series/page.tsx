import type { Locale } from '../../../i18n/config';
import { SeriesGrid } from '../../../components/series-grid';

export default async function SeriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <main>
      <h1 className="mb-4 text-2xl font-bold">Series Library</h1>
      <SeriesGrid locale={locale as Locale} />
    </main>
  );
}
