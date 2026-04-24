import { redirect } from 'next/navigation';

export default async function GlobalWatchPage({ params }: { params: Promise<{ type: string; id: string }> }) {
  const { type, id } = await params;
  redirect(`/en/watch/${type}/${id}`);
}
