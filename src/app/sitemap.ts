import type { MetadataRoute } from 'next';
import { site } from '@/content/site';
import { news } from '@/content/news';
export const dynamic = 'force-static';
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['', 'showcase/', 'game/', 'news/', 'community/', 'about/', 'press/', 'support/', 'privacy/', 'terms/'];
  return [
    ...pages.map((p) => ({ url: new URL(`/${p}`, site.url).toString(), changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.6 })),
    ...news.map((n) => ({ url: new URL(`/news/${n.slug}/`, site.url).toString(), lastModified: n.date, priority: 0.5 })),
  ];
}
