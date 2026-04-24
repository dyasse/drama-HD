'use client';

import { Languages } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { locales, type Locale } from '../i18n/config';

type LocaleSwitcherProps = {
  locale: Locale;
};

export function LocaleSwitcher({ locale }: LocaleSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();

  const changeLocale = (nextLocale: Locale) => {
    const segments = pathname.split('/');
    segments[1] = nextLocale;
    router.push(segments.join('/'));
  };

  return (
    <label className="inline-flex items-center gap-2 rounded-full border border-emerald/20 px-3 py-1.5 text-sm">
      <Languages size={14} />
      <select
        aria-label="Language"
        value={locale}
        onChange={(event) => changeLocale(event.target.value as Locale)}
        className="bg-transparent outline-none"
      >
        {locales.map((item) => (
          <option key={item} value={item} className="text-zinc-900">
            {item.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
