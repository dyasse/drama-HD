'use client';

import { useEffect } from 'react';

export function WatchAutofocus() {
  useEffect(() => {
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }, []);

  return null;
}
