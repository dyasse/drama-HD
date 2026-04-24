import type { Locale } from '../../../../i18n/config';
import { VideoPlayerPanel } from '../../../../components/player/video-player-panel';
import { getWatchMediaByRouteId } from '../../../../lib/data/media';

export default async function WatchPage({ params }: { params: Promise<{ locale: string; seriesId: string }> }) {
  const { locale, seriesId } = await params;
  const show = await getWatchMediaByRouteId(seriesId);

  return (
    <main className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">{show?.title ?? 'Drama HD Watch'}</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">{show?.description ?? 'Select episodes from the playlist.'}</p>
      </div>
      <VideoPlayerPanel title={show?.title ?? 'Drama HD'} locale={locale as Locale} />
    </main>
  );
}
