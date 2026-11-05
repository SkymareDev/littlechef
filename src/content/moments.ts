import type { Moment } from './types';
import { img } from './assets';

const m = (id: string, n: number, from: string, to: string): Moment => ({
  id, from, to, placeholder: true,
  before: { kind: 'image', src: img(`04_Images/BeforeAfter/moment-${n}-before`), alt: `${from}: before`, ratio: '4/5', spec: '1080×1350 WebP/AVIF, same framing as "after"' },
  after: { kind: 'image', src: img(`04_Images/BeforeAfter/moment-${n}-after`), alt: `${to}: after`, ratio: '4/5', spec: '1080×1350 WebP/AVIF, same framing as "before"' },
});

/** Pairs are shown in a drag-to-compare slider. Before/after must share framing. */
export const moments: Moment[] = [
  m('messy-clean', 1, 'Messy', 'Clean'),
  m('broken-fixed', 2, 'Broken', 'Fixed'),
  m('empty-complete', 3, 'Empty', 'Complete'),
  m('wrong-correct', 4, 'Wrong', 'Correct'),
  m('blocked-solved', 5, 'Blocked', 'Solved'),
];
