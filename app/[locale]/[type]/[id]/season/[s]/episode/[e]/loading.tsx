import { LoadingSkeleton } from '../../../../../../../../components/ui/loading-skeleton';

export default function EpisodeLoading() {
  return (
    <main className="space-y-4">
      <LoadingSkeleton className="h-10 w-2/3" />
      <LoadingSkeleton className="h-[420px] w-full" />
    </main>
  );
}
