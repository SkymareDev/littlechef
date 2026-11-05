import type { WorldItem } from './types';
import { img } from './assets';

/** Recurring characters, objects or places. Leave the array empty to hide the section. */
const spec = '1200×1200 transparent WebP or PNG';
export const world: WorldItem[] = [
  { id: 'world-1', name: 'Recurring character', note: 'Who shows up level after level.', placeholder: true, media: { kind: 'image', src: img('04_Images/World/world-1'), alt: 'Recurring character artwork', ratio: '1/1', spec } },
  { id: 'world-2', name: 'Signature object', note: 'The thing players always end up fixing.', placeholder: true, media: { kind: 'image', src: img('04_Images/World/world-2'), alt: 'Signature object artwork', ratio: '1/1', spec } },
  { id: 'world-3', name: 'A place', note: 'Where many little situations happen.', placeholder: true, media: { kind: 'image', src: img('04_Images/World/world-3'), alt: 'Environment artwork', ratio: '1/1', spec } },
];
