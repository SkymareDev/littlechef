import type { SocialLink } from './types';
import { vid, img } from './assets';

/**
 * Global game + studio settings. Everything marked TBD is a placeholder.
 * Update this file first when the real game details arrive.
 */
export const site = {
  gameName: 'Little Chef',
  studio: 'Skymare Studio',
  /** Legal entity responsible for the game and player data (privacy policy, store listings). */
  legalName: 'Think Different FC',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.example-game.com', // TBD
  /** Hero promise. Keep it to one short line. */
  tagline: 'Remember the order. Cook it right. Grow your restaurants.',
  /** ~150 characters, used for meta description and store-like summaries. */
  description:
    'A cosy cooking game: remember each order, roll, fry, grill and top every dish, earn coins and tips, and open new restaurants.',
  /** 'coming-soon' shows pre-register / notify; 'live' shows Get it on / Download. */
  releaseState: 'live' as 'coming-soon' | 'live',
  releaseLabel: 'Out now on Google Play and the App Store',
  contactEmail: 'tdifferentfc@gmail.com',
  pressEmail: 'press@example.com',             // TBD
  supportEmail: 'tdifferentfc@gmail.com',
  locale: 'en_US',
};

export const storeLinks = {
  googlePlay: 'https://play.google.com/store/apps/details?id=com.fc.p.ta.little.chef.cooking.master' as string | null,
  appStore: 'https://apps.apple.com/us/app/little-chef-lets-cook/id6832906748' as string | null,
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
