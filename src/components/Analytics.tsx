'use client';
import Script from 'next/script';
import { useEffect, useState } from 'react';
import { CONSENT_KEY } from './ConsentBanner';

const GA = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
export function Analytics() {
  const [ok, setOk] = useState(false);
  useEffect(() => {
    const read = () => { try { setOk(localStorage.getItem(CONSENT_KEY) === 'granted'); } catch {} };
    read(); window.addEventListener('consent-change', read);
    return () => window.removeEventListener('consent-change', read);
  }, []);
  if (!GA || !ok) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA}`} strategy="afterInteractive" />
      <Script id="ga" strategy="afterInteractive">{`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${GA}');`}</Script>
    </>
  );
}
