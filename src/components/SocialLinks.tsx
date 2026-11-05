'use client';
import { socialLinks } from '@/content/site';
import { track } from '@/lib/analytics';
import { Dot } from './Icons';

/** Networks without a URL yet render as "soon" chips so the layout is final before accounts exist. */
export function SocialLinks({ placement, compact = false }: { placement: string; compact?: boolean }) {
  return (
    <ul className="socials" aria-label="Follow the game" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {socialLinks.map((s) => (
        <li key={s.key}>
          {s.href ? (
            <a className="social" href={s.href} target="_blank" rel="noopener" onClick={() => track('social_click', { network: s.key, placement })}>
              <Dot />{s.label}
            </a>
          ) : (
            <span className="social" aria-disabled="true" title={`${s.label} account coming soon`}>
              <Dot />{s.label}{compact ? '' : <span className="muted"> (soon)</span>}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
