import type { Locale } from '../../../i18n/config';
import { uiCopy } from '../../../lib/data/i18n';
import { LiveSearch } from '../../../components/search/live-search';

export default async function SearchPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = uiCopy[locale as Locale];

  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-bold">{t.search}</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-300">{t.realtimeSearch}</p>
      <LiveSearch locale={locale as Locale} />
    </section>
  );
}
