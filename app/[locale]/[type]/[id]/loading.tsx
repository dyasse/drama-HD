import { LoadingSkeleton } from '../../../../components/ui/loading-skeleton';

export default function MediaDetailLoading() {
  return (
    <main className="space-y-4">
      <LoadingSkeleton className="h-72 w-full" />
      <LoadingSkeleton className="h-40 w-full" />
      <LoadingSkeleton className="h-56 w-full" />
    </main>
  );
}
