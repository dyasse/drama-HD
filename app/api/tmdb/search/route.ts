import { NextRequest, NextResponse } from 'next/server';
import { searchTmdb } from '../../../../lib/data/media';
import { isValidLocale } from '../../../../i18n/config';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query') ?? '';
  const locale = searchParams.get('locale') ?? 'en';

  if (!isValidLocale(locale)) {
    return NextResponse.json({ error: 'Invalid locale' }, { status: 400 });
  }

  const results = await searchTmdb(query, locale);
  return NextResponse.json({ results });
}
