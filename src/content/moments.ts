import type { Moment } from './types';
import { img } from './assets';

const m = (id: string, n: number, from: string, to: string, what: string): Moment => ({
  id, from, to, placeholder: false,
  before: { kind: 'image', src: img(`04_Images/BeforeAfter/moment-${n}-before`), alt: `${what}, before: ${from.toLowerCase()}`, ratio: '4/5', spec: '1080×1350 WebP/AVIF, same framing as "after"' },
  after: { kind: 'image', src: img(`04_Images/BeforeAfter/moment-${n}-after`), alt: `${what}, after: ${to.toLowerCase()}`, ratio: '4/5', spec: '1080×1350 WebP/AVIF, same framing as "before"' },
});

/** Pairs are shown in a drag-to-compare slider. Before/after must share framing. One Cheese Pizza, step by step. */
export const moments: Moment[] = [
  m('dough-rolled', 1, 'Dough', 'Rolled', 'Rolling the dough ball into a pizza base'),
  m('base-sauced', 2, 'Plain', 'Sauced', 'Spreading tomato sauce over the base'),
  m('sauce-cheese', 3, 'Sauce', 'Cheesy', 'Sprinkling cheese over the sauce'),
  m('raw-baked', 4, 'Raw', 'Baked', 'Baking the pizza in the oven'),
  m('whole-sliced', 5, 'Whole', 'Sliced', 'Cutting the pizza into eight slices'),
];
