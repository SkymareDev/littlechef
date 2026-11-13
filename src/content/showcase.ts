import type { Media } from './types';
import { img, vid, vec } from './assets';

/**
 * Content for the single-game showcase page (/showcase).
 * Layout pattern: logo hero → screenshot carousel → 3 alternating story blocks
 * on device frames → press quote → closing card with icon + stores → studio strip.
 */
const slot = (key: string, alt: string, ratio: string, spec: string): Media => {
  const v = vid(key);
  return v ? { kind: 'video', src: v, poster: img(key), alt, ratio, spec } : { kind: 'image', src: img(key), alt, ratio, spec };
};

export const showcase = {
  logo: { ...slot('01_Brand/logo-light', 'Game logo', '5/3', 'Logo 1600×960 transparent PNG/SVG, light-background version'), src: vec('01_Brand/logo-light') },
  ornament: slot('01_Brand/ornament', 'Decorative key art element behind the logo', '1/1', '1400×1400 transparent PNG, a signature object or shape'),
  heroBackground: slot('02_KeyArt/keyart-landscape', 'Little Chef key art: the restaurant street', '16/9', '3840×2160 key art, no text, focal point centred'),
  /** One sentence. Shown under the logo and in the closing card. */
  summary: 'Run your own little restaurants: remember every order, cook pizza, fried chicken, hot dogs, burgers and steak by hand, and earn the coins and tips to open the next one.',
  screenshots: Array.from({ length: 5 }, (_, i) =>
    slot(`04_Images/Showcase/showcase-0${i + 1}`, `Little Chef gameplay screenshot ${i + 1}`, '16/9', '1920×1080 PNG/WebP, landscape crop of real gameplay, no UI clutter')),
  /** Three story beats. Device: which frame to show the media in. */
  blocks: [
    { id: 'story', device: 'phone' as const, title: 'Every customer has an order', line: 'Read it, remember it, then cook it exactly right. Fast, accurate service earns bigger tips.',
      media: slot('04_Images/Showcase/block-1-phone', 'A customer orders a Cheese Pizza', '9/19.5', '1170×2532 portrait screenshot or 9:16 loop') },
    { id: 'world', device: 'tablet' as const, title: 'Open restaurant after restaurant', line: 'Start at the Pizza House, save your coins and unlock the Fried Chicken, Hot Dog, Burger and Steak houses, each with its own kitchen.',
      media: slot('04_Images/Showcase/block-2-tablet', 'The Pizza House with the Little Chef outside', '4/3', '2048×1536 landscape screenshot') },
    { id: 'mechanic', device: 'tall' as const, title: 'Cook it with your own hands', line: 'Roll the dough, spread the sauce, sprinkle the cheese, bake and slice, all with simple taps, drags and swipes.',
      media: slot('04_Images/Showcase/block-3-tall', 'Making a pizza at the pizza station', '9/16', '1242×2208 portrait screenshot or loop') },
  ],
  /** Only real, published quotes with permission/attribution. Leave null to hide. */
  pressQuote: null as null | { quote: string; source: string; logo: Media; url?: string },
  appIcon: slot('01_Brand/app-icon', 'App icon', '1/1', '1080×1080 PNG app icon, rounded corners applied by the page'),
  studioLine: 'Skymare Studio makes cosy, colourful games that feel good in your hands.',
};
