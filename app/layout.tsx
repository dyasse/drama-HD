import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { PwaRegister } from '../components/pwa-register';
import './globals.css';

export const metadata: Metadata = {
  title: 'Drama HD Streaming',
  description: 'Minimal short-series streaming platform with freemium unlock logic.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Drama HD',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#047857',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen transition-colors duration-300">
        <PwaRegister />
        {children}
      </body>
    </html>
  );
}
