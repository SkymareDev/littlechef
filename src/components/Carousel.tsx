'use client';
import { useRef } from 'react';
import type { Media as M } from '@/content/types';
import { Media } from './Media';
import { ArrowL, ArrowR } from './Icons';

export function Carousel({ items, label }: { items: M[]; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const go = (d: number) => {
    const el = ref.current; if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: d * el.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
  };
  return (
    <div className="carousel">
      <div className="carousel-track" ref={ref} role="list" aria-label={label} tabIndex={0}>
        {items.map((m, i) => (
          <div key={i} role="listitem" className="carousel-slide"><Media media={m} label={`Screenshot ${i + 1}`} /></div>
        ))}
      </div>
      <div className="carousel-nav">
        <button className="icon-btn" onClick={() => go(-1)} aria-label="Previous screenshot"><ArrowL /></button>
        <button className="icon-btn" onClick={() => go(1)} aria-label="Next screenshot"><ArrowR /></button>
      </div>
    </div>
  );
}
