'use client';

import { Globe, Palette } from 'lucide-react';
import type { Locale } from '../i18n/config';
import { uiCopy } from '../lib/data/i18n';
import { LocaleSwitcher } from './locale-switcher';
import { ThemeToggle } from './theme-toggle';

export function SettingsPanel({ locale }: { locale: Locale }) {
  const t = uiCopy[locale];

  return (
    <section className="grid gap-4 sm:grid-cols-2">
      <div className="rounded-xl border border-emerald/15 bg-white/70 p-4 dark:bg-zinc-900/70">
        <p className="mb-3 flex items-center gap-2 font-semibold"><Globe size={16} /> {t.language}</p>
        <LocaleSwitcher locale={locale} />
      </div>
      <div className="rounded-xl border border-emerald/15 bg-white/70 p-4 dark:bg-zinc-900/70">
        <p className="mb-3 flex items-center gap-2 font-semibold"><Palette size={16} /> {t.theme}</p>
        <ThemeToggle />
      </div>
    </section>
  );
}
