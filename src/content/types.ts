/** Media slot. `src: null` renders a clearly marked placeholder of the right shape. */
export type Media = {
  kind: 'image' | 'video';
  src: string | null;
  /** Poster frame for videos (WebP/AVIF/JPG). */
  poster?: string | null;
  alt: string;
  /** Aspect ratio used to reserve space (prevents layout shift), e.g. "9/16". */
  ratio: string;
  /** Recommended export size shown on placeholders and in the asset guide. */
  spec: string;
};

export type Level = {
  id: string;
  number: number;
  title: string;
  oneLiner: string;
  media: Media;
  placeholder: boolean;
};

export type Moment = { id: string; from: string; to: string; before: Media; after: Media; placeholder: boolean };

export type NewsCategory = 'Game Updates' | 'New Levels' | 'Behind the Scenes' | 'Community' | 'Events' | 'Development';

export type NewsPost = {
  slug: string;
  title: string;
  date: string;
  category: NewsCategory;
  excerpt: string;
  thumbnail: Media;
  body: string[];
  placeholder: boolean;
};

export type SocialKey = 'tiktok' | 'instagram' | 'youtube' | 'facebook' | 'x' | 'discord';
export type SocialLink = { key: SocialKey; label: string; href: string | null };

export type WorldItem = { id: string; name: string; note: string; media: Media; placeholder: boolean };
