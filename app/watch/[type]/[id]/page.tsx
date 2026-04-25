import { redirect } from 'next/navigation';

export default async function GlobalWatchPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string; id: string }>;
  searchParams: Promise<{ season?: string; episode?: string }>;
}) {
  const { type, id } = await params;
  const { season, episode } = await searchParams;

  const query = new URLSearchParams();
  if (season) query.set('season', season);
  if (episode) query.set('episode', episode);

  const suffix = query.toString() ? `?${query.toString()}` : '';
  redirect(`/en/watch/${type}/${id}${suffix}`);
}
