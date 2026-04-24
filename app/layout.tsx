import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Drama HD',
  description: 'Watch premium dramas with 20 free episodes and a $6 monthly plan.',
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: 'Inter, system-ui, sans-serif',
          background: 'linear-gradient(180deg, #023430 0%, #012622 100%)',
          color: '#f8efc8',
          minHeight: '100vh',
        }}
      >
        {children}
      </body>
    </html>
  );
}
