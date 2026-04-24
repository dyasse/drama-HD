import type { Locale } from '../../../i18n/config';
import { SeriesGrid } from '../../../components/series-grid';
import { seriesList } from '../../../lib/data/content';

export default function SeriesPage({ params }: { params: { locale: string } }) {
  return (
    <main>
      <h1 className="mb-4 text-2xl font-bold">Series Library</h1>
      <SeriesGrid items={seriesList} locale={params.locale as Locale} />
    </main>
  );
}
