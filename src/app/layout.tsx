import type { Metadata, Viewport } from 'next';
import fs from 'node:fs';
import path from 'node:path';
import './globals.css';
import { site } from '@/content/site';
import { pageMeta } from '@/lib/seo';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PageView } from '@/components/PageView';
import { Analytics } from '@/components/Analytics';
import { ConsentBanner } from '@/components/ConsentBanner';

const hasSvgIcon = fs.existsSync(path.join(process.cwd(), 'public', 'favicon.svg'));
export const metadata: Metadata = {
  metadataBase: new URL(site.url), ...pageMeta(),
  icons: {
    icon: [{ url: '/favicon.ico', sizes: '48x48' }, ...(hasSvgIcon ? [{ url: '/favicon.svg', type: 'image/svg+xml' }] : []), { url: '/icon-192.png', sizes: '192x192', type: 'image/png' }],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};
export const viewport: Viewport = {
  width: 'device-width', initialScale: 1, viewportFit: 'cover',
  themeColor: [{ media: '(prefers-color-scheme: light)', color: '#EAF1F4' }, { media: '(prefers-color-scheme: dark)', color: '#0E1F2E' }],
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600..800&family=Figtree:wght@400;500;600;700;800&family=Sniglet:wght@800&display=swap" />
      </head>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <PageView />
        <Analytics />
        <ConsentBanner />
      </body>
    </html>
  );
}
