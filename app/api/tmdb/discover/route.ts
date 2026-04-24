import { NextRequest, NextResponse } from 'next/server';
import { discoverMedia } from '../../../../lib/data/media';
import { isValidLocale } from '../../../../i18n/config';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get('type') === 'tv' ? 'tv' : 'movie';
  const locale = searchParams.get('locale') ?? 'en';
  const page = Number(searchParams.get('page') ?? '1');
  const genreIdParam = searchParams.get('genreId');

  if (!isValidLocale(locale)) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
  }

  const genreId = genreIdParam ? Number(genreIdParam) : undefined;
  const data = await discoverMedia({
    mediaType: type,
    locale,
    page: Number.isNaN(page) ? 1 : page,
    genreId: genreId && !Number.isNaN(genreId) ? genreId : undefined,
  });

  return NextResponse.json(data);
}
