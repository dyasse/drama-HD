import { notFound } from 'next/navigation';
import type { Locale } from '../../../../i18n/config';
import { VideoPlayerPanel } from '../../../../components/player/video-player-panel';
import { findShowById } from '../../../../lib/data/content';

export default async function WatchPage({ params }: { params: Promise<{ locale: string; seriesId: string }> }) {
  const { locale, seriesId } = await params;
  const show = findShowById(seriesId);

  if (!show) notFound();

  return (
    <main className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{show.title}</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">{show.description}</p>
      </div>
      <VideoPlayerPanel show={show} locale={locale as Locale} />
    </main>
  );
}
