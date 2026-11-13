'use client';
import { site, storeLinks } from '@/content/site';
import { track } from '@/lib/analytics';
import { PhoneGlyph } from './Icons';
import { vec } from '@/content/assets';

/** When a store URL is missing we send people to the notify form instead of a dead link. */
export function StoreButtons({ placement }: { placement: string }) {
  const soon = site.releaseState === 'coming-soon';
  const items = [
    { id: 'google', badge: vec('08_Store-Badges/badge-googleplay'), event: 'google_play_click' as const, href: storeLinks.googlePlay, small: storeLinks.googlePlay ? 'Get it on' : soon ? 'Pre-register on' : 'Coming soon on', big: 'Google Play' },
    { id: 'apple', badge: vec('08_Store-Badges/badge-appstore'), event: 'app_store_click' as const, href: storeLinks.appStore, small: storeLinks.appStore ? 'Download on the' : 'Coming soon on the', big: 'App Store' },
  ];
  return (
    <div className="store-row">
      {items.map((s) => (
        <a key={s.id} className={s.badge ? 'store-badge' : 'btn store'} href={s.href ?? '#notify'} aria-label={`${s.small} ${s.big}`}
          {...(s.href ? { target: '_blank', rel: 'noopener' } : {})}
          onClick={() => { track(s.event, { placement, has_link: Boolean(s.href) }); if (placement === 'hero') track('hero_cta_click', { target: s.id }); }}>
          {s.badge
            // eslint-disable-next-line @next/next/no-img-element
            ? <img src={s.badge} alt="" height={56} />
            : <><PhoneGlyph /><span><small>{s.small}</small>{s.big}</span></>}
        </a>
      ))}
    </div>
  );
}
