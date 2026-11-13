import type { WorldItem } from './types';
import { img } from './assets';

/** Recurring characters, objects or places. Leave the array empty to hide the section. */
const spec = '1200×1200 transparent WebP or PNG';
export const world: WorldItem[] = [
  { id: 'world-1', name: 'Little Chef', note: 'That’s you: running every kitchen, one order at a time.', placeholder: false, media: { kind: 'image', src: img('04_Images/World/world-1'), alt: 'The Little Chef in her chef hat', ratio: '1/1', spec } },
  { id: 'world-2', name: 'Cheese Pizza', note: 'Your very first dish. Dough, tomato sauce and plenty of cheese.', placeholder: false, media: { kind: 'image', src: img('04_Images/World/world-2'), alt: 'A cheese pizza cut into slices', ratio: '1/1', spec } },
  { id: 'world-3', name: 'Pizza House', note: 'Where it all starts. Earn enough coins and a new restaurant opens next door.', placeholder: false, media: { kind: 'image', src: img('04_Images/World/world-3'), alt: 'The Pizza House restaurant', ratio: '1/1', spec } },
];
