'use client';
import { useEffect, useState } from 'react';

/** Minimal cookie consent. Analytics scripts load only after "Accept" (see layout.tsx). */
export const CONSENT_KEY = 'analytics-consent';
export function ConsentBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => { try { setShow(localStorage.getItem(CONSENT_KEY) === null); } catch { setShow(false); } }, []);
  if (!show) return null;
  const choose = (v: 'granted' | 'denied') => {
    try { localStorage.setItem(CONSENT_KEY, v); } catch {}
    window.dispatchEvent(new Event('consent-change'));
    setShow(false);
  };
  return (
    <div className="consent" role="region" aria-label="Cookie choice">
      <p>We use analytics cookies to see which levels people like. You can change this any time in your browser.</p>
      <div className="consent-actions">
        <button className="btn btn-quiet" onClick={() => choose('denied')}>Decline</button>
        <button className="btn btn-primary" onClick={() => choose('granted')}>Accept</button>
      </div>
    </div>
  );
}
