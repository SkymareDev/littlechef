import type { Metadata } from 'next';
import { site } from '@/content/site';

/** Per-page metadata with consistent Open Graph + X card defaults. */
export function pageMeta(opts: { title?: string; description?: string; path?: string; image?: string } = {}): Metadata {
  const title = opts.title ? `${opts.title} | ${site.gameName}` : `${site.gameName} | A cosy restaurant cooking game`;
  const description = opts.description ?? site.description;
  const url = new URL(opts.path ?? '/', site.url).toString();
  const image = opts.image ?? '/og/og-default.png';
  return {
    title, description,
    alternates: { canonical: url },
    openGraph: { type: 'website', url, title, description, siteName: site.gameName, locale: site.locale,
      images: [{ url: image, width: 1200, height: 630, alt: `${site.gameName} by ${site.studio}` }] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}
