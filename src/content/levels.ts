import type { Level } from './types';
import { vid, img } from './assets';

/**
 * One entry per showcased level. Add, remove or reorder freely.
 * Titles/one-liners below are PLACEHOLDERS that show tone and length only.
 * Media: 9:16 looping MP4/WebM clip, 4–8 s, ≤ 1.5 MB, with a WebP poster.
 */
const spec = '1080×1920 MP4/WebM loop, 4–8 s, ≤1.5 MB + WebP poster';

const draft: Array<[string, string]> = [
  ['Clean It Up', 'Something is a mess. Make it spotless.'],
  ['Find the Missing Piece', 'One thing is not where it belongs.'],
  ['Everything Goes Wrong', 'Fix it before it all tips over.'],
  ['Make It Fit', 'There is exactly enough room. Find it.'],
  ['Wake Them Up', 'Someone is asleep. Get creative.'],
  ['Line It Up', 'Almost tidy is not tidy.'],
];

export const levels: Level[] = draft.map(([title, oneLiner], i) => ({
  id: `level-${String(i + 1).padStart(3, '0')}`,
  number: i + 1,
  title,
  oneLiner,
  placeholder: true,
  media: { kind: 'video', src: vid(`03_Video/Levels/level-${String(i + 1).padStart(3, '0')}`), poster: img(`03_Video/Levels/level-${String(i + 1).padStart(3, '0')}`), alt: `Gameplay clip of level ${i + 1}: ${title}`, ratio: '9/16', spec },
}));
