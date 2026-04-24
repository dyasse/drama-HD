import Link from 'next/link';
import type { Locale } from '../../i18n/config';
import { uiCopy } from '../../lib/data/i18n';

export function AppFooter({ locale }: { locale: Locale }) {
  const t = uiCopy[locale];

  return (
    <footer className="mt-8 rounded-2xl border border-emerald/20 bg-white/70 p-4 text-xs text-zinc-700 dark:bg-zinc-900/70 dark:text-zinc-300">
      <p>{t.footerDisclaimer}</p>
      <Link href={`/${locale}/dmca`} className="mt-2 inline-block font-semibold text-gold underline-offset-2 hover:underline">
        {t.dmca}
      </Link>
    </footer>
  );
}
