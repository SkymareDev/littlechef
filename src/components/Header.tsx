'use client';
import Link from 'next/link';
import { BrandMark } from './BrandMark';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { site } from '@/content/site';
import { Menu } from './Icons';
import { track } from '@/lib/analytics';

const nav = [
  { href: '/game/', label: 'The game' },
  { href: '/news/', label: 'News' },
  { href: '/community/', label: 'Community' },
  { href: '/press/', label: 'Press kit' },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => setOpen(false), [path]);
  return (
    <header className="site-header">
      <div className="wrap">
        <Link href="/" className="wordmark" aria-label={`${site.gameName} home`}><BrandMark />{site.gameName}</Link>
        <nav className="nav" aria-label="Main">
          {nav.map((n) => <Link key={n.href} href={n.href} aria-current={path === n.href ? 'page' : undefined}
            onClick={() => n.href === '/community/' && track('community_click', { placement: 'header' })}>{n.label}</Link>)}
        </nav>
        <a className="btn btn-primary header-cta" href="/#play" onClick={() => track('hero_cta_click', { target: 'header' })}>
          {site.releaseState === 'live' ? 'Play free' : 'Get notified'}
        </a>
        <button className="menu-btn" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen(!open)}>
          <Menu open={open} /><span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" className="mobile-nav wrap" aria-label="Main mobile">
          {nav.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
          <a className="btn btn-primary" style={{ marginTop: 16 }} href="/#play" onClick={() => setOpen(false)}>
            {site.releaseState === 'live' ? 'Play free' : 'Get notified'}
          </a>
        </nav>
      )}
    </header>
  );
}
