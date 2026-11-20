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
  contactEmail: 'admin@skymare.co',
  pressEmail: 'admin@skymare.co',
  supportEmail: 'admin@skymare.co',
  locale: 'en_US',
};

/** The company that publishes the game (the developer named on Google Play and the App Store). */
export const company = {
  name: 'Skymare Technology JSC',
  address: '68/116 Nhan Hoa, Thanh Xuan, Hanoi, Vietnam',
  email: 'admin@skymare.co',
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
  { key: 'tiktok', label: 'TikTok', href: 'https://www.tiktok.com/@little_chef.net' },
  { key: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/little_chef_net/' },
  { key: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@little-chef-net' },
  { key: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/littlechef.net' },
  { key: 'x', label: 'X', href: 'https://x.com/littlechef2026' },
  // Telegram and Discord are hidden until they have a channel or server; add them back here with their links
  // ({ key: 'telegram', label: 'Telegram', href: 'https://t.me/…' }, { key: 'discord', label: 'Discord', href: '…' }).
];
