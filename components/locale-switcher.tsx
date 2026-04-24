'use client';

import { Globe, Languages } from 'lucide-react';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { locales, type Locale } from '../i18n/config';

type LocaleSwitcherProps = {
  locale: string;
};

export function LocaleSwitcher({ locale }: LocaleSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [selectedLocale, setSelectedLocale] = useState<Locale>('en');

  useEffect(() => {
    if (locales.includes(locale as Locale)) {
      setSelectedLocale(locale as Locale);
    }
  }, [locale]);

  const handleChange = (nextLocale: Locale) => {
    setSelectedLocale(nextLocale);

    const segments = pathname.split('/');
    segments[1] = nextLocale;

    router.push(segments.join('/') || `/${nextLocale}`);
  };

  return (
    <div>
      <label htmlFor="locale-select">
        <Globe size={16} aria-hidden="true" /> Language
      </label>
      <div>
        <Languages size={16} aria-hidden="true" />
        <select
          id="locale-select"
          value={selectedLocale}
          onChange={(event) => handleChange(event.target.value as Locale)}
        >
          {locales.map((item) => (
            <option key={item} value={item}>
              {item.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
