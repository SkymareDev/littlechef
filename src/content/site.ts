import type { SocialLink } from './types';
import { vid, img } from './assets';

/**
 * Global game + studio settings. Everything marked TBD is a placeholder.
 * Update this file first when the real game details arrive.
 */
export const site = {
  gameName: 'Little Chef',
  studio: 'AAA Game Studio',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.example-game.com', // TBD
  /** Hero promise. Keep it to one short line. */
  tagline: 'Every level is a little world waiting to be solved.',
  /** ~150 characters, used for meta description and store-like summaries. */
  description:
    'A relaxing, satisfying mobile puzzle game where every level is a new little situation to figure out. Tap, fix, tidy and watch it all click into place.',
  /** 'coming-soon' shows pre-register / notify; 'live' shows Get it on / Download. */
  releaseState: 'coming-soon' as 'coming-soon' | 'live',
  releaseLabel: 'Coming soon to iOS and Android',
  contactEmail: 'hello@example.com',           // TBD
  pressEmail: 'press@example.com',             // TBD
  supportEmail: 'support@example.com',         // TBD
  locale: 'en_US',
};

export const storeLinks = {
  googlePlay: null as string | null,  // TBD: Play Store listing / pre-registration URL
  appStore: null as string | null,    // TBD: App Store listing / pre-order URL
};

export const trailer = {
  /** Self-hosted MP4/WebM path (recommended) or YouTube ID. */
  src: vid('03_Video/Trailer/trailer-16x9'),
  youtubeId: null as string | null,   // TBD
  poster: img('03_Video/Trailer/trailer-poster'),
  duration: '0:45',                    // TBD
};

export const socialLinks: SocialLink[] = [
  { key: 'tiktok', label: 'TikTok', href: null },
  { key: 'instagram', label: 'Instagram', href: null },
  { key: 'youtube', label: 'YouTube', href: null },
  { key: 'facebook', label: 'Facebook', href: null },
  { key: 'x', label: 'X', href: null },
  { key: 'discord', label: 'Discord', href: null },
];
