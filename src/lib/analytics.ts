/**
 * Analytics abstraction. Components only call `track()`; providers are swappable.
 * Add Firebase / Amplitude / Plausible by pushing another provider into `providers`.
 * No credentials live in code: GA reads NEXT_PUBLIC_GA_MEASUREMENT_ID at build time.
 */
export type AnalyticsEvent =
  | 'page_view' | 'hero_cta_click' | 'google_play_click' | 'app_store_click'
  | 'trailer_play' | 'social_click' | 'community_click' | 'level_view'
  | 'newsletter_signup' | 'presskit_download';

export type EventProps = Record<string, string | number | boolean | undefined>;

type Provider = { name: string; send: (event: AnalyticsEvent, props: EventProps) => void };

declare global {
  interface Window { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] }
}

const providers: Provider[] = [
  {
    name: 'gtag',
    send: (event, props) => { if (typeof window !== 'undefined' && window.gtag) window.gtag('event', event, props); },
  },
  {
    name: 'debug',
    send: (event, props) => {
      if (process.env.NODE_ENV !== 'production') console.info('[analytics]', event, props);
    },
  },
];

export function track(event: AnalyticsEvent, props: EventProps = {}) {
  for (const p of providers) {
    try { p.send(event, props); } catch { /* never let analytics break the page */ }
  }
}
