import type { NewsPost } from './types';
import { img } from './assets';

const thumb = (alt: string, slug: string) => ({ kind: 'image' as const, src: img(`04_Images/News/news-${slug}`), alt, ratio: '16/9', spec: '1600×900 WebP, text-free' });

/** Newest first is handled in code. To add a post, append an object. */
export const news: NewsPost[] = [
  {
    slug: 'announcing-the-game', title: 'Announcing our next game', date: '2026-11-01', category: 'Game Updates', placeholder: true,
    excerpt: 'Placeholder announcement. Replace with the real reveal post.',
    thumbnail: thumb('Key art for the announcement', 'announcing-the-game'),
    body: ['Placeholder text. Use this post for the official reveal: what the game is, when it arrives and where to pre-register.'],
  },
  {
    slug: 'how-a-level-is-made', title: 'From idea to level', date: '2026-10-20', category: 'Behind the Scenes', placeholder: true,
    excerpt: 'Placeholder devlog. How one small situation becomes a playable level.',
    thumbnail: thumb('Sketch of an early level idea', 'how-a-level-is-made'),
    body: ['Placeholder text. Walk through one level: the first sketch, what changed in playtests and the moment that made it feel right.'],
  },
  {
    slug: 'why-it-feels-satisfying', title: 'Why that animation feels so good', date: '2026-10-05', category: 'Development', placeholder: true,
    excerpt: 'Placeholder devlog about timing, sound and the final click.',
    thumbnail: thumb('Animation timing curves from development', 'why-it-feels-satisfying'),
    body: ['Placeholder text. Explain the craft behind the payoff moment: easing, sound design and haptics.'],
  },
];

export const sortedNews = () => [...news].sort((a, b) => b.date.localeCompare(a.date));
export const getPost = (slug: string) => news.find((p) => p.slug === slug);
