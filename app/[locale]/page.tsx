import { Suspense } from 'react';
import { LocaleSwitcher } from '../../components/locale-switcher';

type PageProps = {
  params: Promise<{ locale: string }>;
};

async function LocaleContent({ params }: PageProps) {
  const { locale } = await params;

  return (
    <main>
      <h1>Welcome ({locale})</h1>
      <LocaleSwitcher locale={locale} />
    </main>
  );
}

export default function LocalePage(props: PageProps) {
  return (
    <Suspense fallback={<main>Loading localized page…</main>}>
      <LocaleContent {...props} />
    </Suspense>
  );
}
