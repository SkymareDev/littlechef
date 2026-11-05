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
  heroBackground: slot('02_KeyArt/keyart-landscape', 'Key art scene', '16/9', '3840×2160 key art, no text, focal point centred'),
  /** One sentence. Shown under the logo and in the closing card. */
  summary: 'TBD: one sentence on who the player is, what they do and what makes it special.',
  screenshots: Array.from({ length: 5 }, (_, i) =>
    slot(`04_Images/Showcase/showcase-0${i + 1}`, `Gameplay screenshot ${i + 1}`, '16/9', '1920×1080 PNG/WebP, landscape crop of real gameplay, no UI clutter')),
  /** Three story beats. Device: which frame to show the media in. */
  blocks: [
    { id: 'story', device: 'phone' as const, title: 'TBD: the heart of the game', line: 'TBD: one or two sentences.',
      media: slot('04_Images/Showcase/block-1-phone', 'Gameplay on a phone', '9/19.5', '1170×2532 portrait screenshot or 9:16 loop') },
    { id: 'world', device: 'tablet' as const, title: 'TBD: what makes the world special', line: 'TBD: one or two sentences.',
      media: slot('04_Images/Showcase/block-2-tablet', 'Gameplay on a tablet', '4/3', '2048×1536 landscape screenshot') },
    { id: 'mechanic', device: 'tall' as const, title: 'TBD: the signature interaction', line: 'TBD: one or two sentences.',
      media: slot('04_Images/Showcase/block-3-tall', 'Signature mechanic', '9/16', '1242×2208 portrait screenshot or loop') },
  ],
  /** Only real, published quotes with permission/attribution. Leave null to hide. */
  pressQuote: null as null | { quote: string; source: string; logo: Media; url?: string },
  appIcon: slot('01_Brand/app-icon', 'App icon', '1/1', '1080×1080 PNG app icon, rounded corners applied by the page'),
  studioLine: 'TBD: one line about what Skymare Studio stands for.',
};
