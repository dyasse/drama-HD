'use client';

import { useEffect } from 'react';

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function LocaleError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Localized route error:', error);
  }, [error]);

  return (
    <div>
      <h2>Something went wrong on this locale page.</h2>
      <button onClick={reset} type="button">
        Try again
      </button>
    </div>
  );
}
