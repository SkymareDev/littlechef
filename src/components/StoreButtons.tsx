'use client';
import { site, storeLinks } from '@/content/site';
import { track } from '@/lib/analytics';
import { PhoneGlyph } from './Icons';

/** When a store URL is missing we send people to the notify form instead of a dead link. */
export function StoreButtons({ placement }: { placement: string }) {
  const soon = site.releaseState === 'coming-soon';
  const items = [
    { id: 'google', event: 'google_play_click' as const, href: storeLinks.googlePlay, small: soon ? 'Pre-register on' : 'Get it on', big: 'Google Play' },
    { id: 'apple', event: 'app_store_click' as const, href: storeLinks.appStore, small: soon ? 'Notify me on the' : 'Download on the', big: 'App Store' },
  ];
  return (
    <div className="store-row">
      {items.map((s) => (
        <a key={s.id} className="btn store" href={s.href ?? '#notify'}
          {...(s.href ? { target: '_blank', rel: 'noopener' } : {})}
          onClick={() => { track(s.event, { placement, has_link: Boolean(s.href) }); if (placement === 'hero') track('hero_cta_click', { target: s.id }); }}>
          <PhoneGlyph /><span><small>{s.small}</small>{s.big}</span>
        </a>
      ))}
    </div>
  );
}
