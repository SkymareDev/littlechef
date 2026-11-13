import type { Level } from './types';
import { vid, img } from './assets';

/**
 * One entry per restaurant ("house"), in the order players unlock them (GDD: Chapter Art).
 * `clip` is the media file key in 03_Video/Levels, so entries can be reordered freely.
 * Media: 9:16 looping MP4/WebM clip, 4–8 s, ≤ 1.5 MB, with a WebP poster.
 */
const spec = '1080×1920 MP4/WebM loop, 4–8 s, ≤1.5 MB + WebP poster';

const restaurants: Array<{ title: string; oneLiner: string; clip: string; dish: string; placeholder?: boolean }> = [
  { title: 'Pizza House', oneLiner: 'Roll the dough, spread the sauce, bake it and slice it into eight.', clip: 'level-001', dish: 'making a pizza' },
  { title: 'Fried Chicken House', oneLiner: 'Dip, coat and fry it golden, then fill the box with fries and coleslaw.', clip: 'level-005', dish: 'frying chicken' },
  { title: 'Hot Dog House', oneLiner: 'Grill the sausage, add the sauces and toppings, and wrap it up.', clip: 'level-002', dish: 'building a hot dog' },
  { title: 'Burger House', oneLiner: 'Grill the patty and stack every layer in the right order.', clip: 'level-003', dish: 'stacking a burger' },
  { title: 'Steak House', oneLiner: 'Sear the steak with butter and herbs, then add the sauce and sides.', clip: 'level-004', dish: 'cooking a steak' },
  { title: 'Pancake House', oneLiner: 'Pour, flip and decorate a stack exactly the way they asked.', clip: 'level-006', dish: 'making pancakes', placeholder: true },
];

export const levels: Level[] = restaurants.map((r, i) => ({
  id: r.clip,
  number: i + 1,
  title: r.title,
  oneLiner: r.oneLiner,
  placeholder: Boolean(r.placeholder),
  media: { kind: 'video', src: vid(`03_Video/Levels/${r.clip}`), poster: img(`03_Video/Levels/${r.clip}`), alt: `Gameplay clip from the ${r.title}: ${r.dish}`, ratio: '9/16', spec },
}));
