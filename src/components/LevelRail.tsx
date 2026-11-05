'use client';
import { useEffect, useRef } from 'react';
import type { Level } from '@/content/types';
import { Media } from './Media';
import { ArrowL, ArrowR } from './Icons';
import { track } from '@/lib/analytics';

export function LevelRail({ levels, heading }: { levels: Level[]; heading: React.ReactNode }) {
  const rail = useRef<HTMLDivElement>(null);
  const seen = useRef(new Set<string>());

  useEffect(() => {
    const el = rail.current; if (!el) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const id = (e.target as HTMLElement).dataset.level;
        if (e.isIntersecting && id && !seen.current.has(id)) { seen.current.add(id); track('level_view', { level: id }); }
      }
    }, { root: el, threshold: 0.6 });
    el.querySelectorAll('[data-level]').forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  const go = (dir: number) => {
    const el = rail.current; if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <>
      <div className="levels-head">
        {heading}
        <div className="rail-controls">
          <button className="icon-btn" onClick={() => go(-1)} aria-label="Previous levels"><ArrowL /></button>
          <button className="icon-btn" onClick={() => go(1)} aria-label="Next levels"><ArrowR /></button>
        </div>
      </div>
      <div className="rail" ref={rail} role="list" aria-label="Featured levels" tabIndex={0}>
        {levels.map((l) => (
          <article key={l.id} className="level-card" role="listitem" data-level={l.id}>
            <Media media={l.media} label={`Level ${l.number} clip`} />
            <p className="num">Level {String(l.number).padStart(2, '0')}</p>
            <h3>{l.title}</h3>
            <p>{l.oneLiner}</p>
          </article>
        ))}
        <article className="level-card next" role="listitem">
          <span className="q" aria-hidden="true">?</span>
          <h3>Level {String(levels.length + 1).padStart(2, '0')}</h3>
          <p>Something new. You will have to play to find out.</p>
        </article>
      </div>
    </>
  );
}
