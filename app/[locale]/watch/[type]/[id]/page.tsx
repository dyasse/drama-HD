import { notFound } from 'next/navigation';
import type { Locale } from '../../../../../i18n/config';
import { VideoPlayerPanel } from '../../../../../components/player/video-player-panel';
import { getWatchMedia } from '../../../../../lib/data/media';

export default async function WatchPage({ params }: { params: Promise<{ locale: string; type: string; id: string }> }) {
  const { locale, type, id } = await params;
  const mediaType = type === 'tv' ? 'tv' : type === 'movie' ? 'movie' : null;
  const sourceId = Number(id);

  if (!mediaType || Number.isNaN(sourceId)) notFound();

  const show = await getWatchMedia(mediaType, sourceId, locale as Locale);

  return (
    <main className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{show?.title ?? 'Drama HD Watch'}</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">{show?.description ?? 'Select episodes from the playlist.'}</p>
      </div>
      <VideoPlayerPanel title={show?.title ?? 'Drama HD'} locale={locale as Locale} mediaType={mediaType} tmdbId={sourceId} />
    </main>
  );
}
