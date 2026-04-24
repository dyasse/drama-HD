import type { Locale } from '../../../../i18n/config';
import { CatalogGrid } from '../../../../components/catalog/catalog-grid';

export default async function GenrePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; genreId: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { locale, genreId } = await params;
  const query = await searchParams;
  const type = query.type === 'tv' ? 'tv' : 'movie';

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">Genre #{genreId}</h1>
      <CatalogGrid locale={locale as Locale} type={type} genreId={Number(genreId)} />
    </main>
  );
}
