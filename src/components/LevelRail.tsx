'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Level } from '@/content/types';
import { Media } from './Media';
import { ArrowL, ArrowR } from './Icons';
import { track } from '@/lib/analytics';

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** After a mouse drag (snap is off while dragging), glide to the nearest card, then turn snap back on. */
function settle(el: HTMLElement, fling: number) {
  const max = el.scrollWidth - el.clientWidth;
  const pad = parseFloat(getComputedStyle(el).scrollPaddingInlineStart) || 0;
  const base = el.getBoundingClientRect().left;
  const stops = Array.from(el.children as HTMLCollectionOf<HTMLElement>)
    .map((c) => Math.min(max, Math.max(0, el.scrollLeft + c.getBoundingClientRect().left - base - pad)));
  const aim = el.scrollLeft + Math.max(-el.clientWidth, Math.min(el.clientWidth, fling));
  const left = stops.reduce((a, b) => (Math.abs(b - aim) < Math.abs(a - aim) ? b : a), stops[0] ?? 0);
  const done = () => { if (!el.dataset.drag) el.classList.remove('is-dragging'); };
  if (Math.abs(left - el.scrollLeft) < 1 || reducedMotion()) { el.scrollLeft = left; done(); return; }
  el.scrollTo({ left, behavior: 'smooth' });
  const finish = () => { window.clearTimeout(timer); el.removeEventListener('scrollend', finish); done(); };
  const timer = window.setTimeout(finish, 700);
  el.addEventListener('scrollend', finish);
}

export function LevelRail({ levels, heading }: { levels: Level[]; heading: React.ReactNode }) {
  const rail = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const seen = useRef(new Set<string>());
  const [pos, setPos] = useState({ start: true, end: false, size: 1, offset: 0 });

  const measure = useCallback(() => {
    const el = rail.current; if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const size = el.scrollWidth ? el.clientWidth / el.scrollWidth : 1;
    const ratio = max > 0 ? el.scrollLeft / max : 0;
    setPos({ start: el.scrollLeft <= 2, end: el.scrollLeft >= max - 2, size, offset: ratio * (1 - size) });
  }, []);

  useEffect(() => {
    const el = rail.current; if (!el) return;
    measure();
    el.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        const id = (e.target as HTMLElement).dataset.level;
        if (e.isIntersecting && id && !seen.current.has(id)) { seen.current.add(id); track('level_view', { level: id }); }
      }
    }, { root: el, threshold: 0.6 });
    el.querySelectorAll('[data-level]').forEach((c) => io.observe(c));
    return () => { io.disconnect(); el.removeEventListener('scroll', measure); window.removeEventListener('resize', measure); };
  }, [measure]);

  // Drag with the mouse. Touch and trackpads already scroll the rail natively, so only mouse pointers are handled here.
  useEffect(() => {
    const el = rail.current; if (!el) return;
    let id = -1, x0 = 0, s0 = 0, lastX = 0, lastT = 0, v = 0, moved = false, swallowClick = false;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      id = e.pointerId; x0 = lastX = e.clientX; lastT = e.timeStamp; s0 = el.scrollLeft; v = 0; moved = false;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerId !== id) return;
      const dx = e.clientX - x0;
      if (!moved) {
        if (Math.abs(dx) < 5) return;
        moved = true; el.dataset.drag = '1'; el.classList.add('is-dragging'); el.setPointerCapture(id);
      }
      el.scrollLeft = s0 - dx;
      const dt = e.timeStamp - lastT;
      if (dt > 0) v = 0.8 * ((e.clientX - lastX) / dt) + 0.2 * v;
      lastX = e.clientX; lastT = e.timeStamp;
    };
    const up = (e: PointerEvent) => {
      if (e.pointerId !== id) return;
      id = -1;
      if (!moved) return;
      swallowClick = true; window.setTimeout(() => { swallowClick = false; }, 0);
      delete el.dataset.drag;
      settle(el, e.timeStamp - lastT > 80 ? 0 : -v * 250);
    };
    const click = (e: MouseEvent) => { if (swallowClick) { e.preventDefault(); e.stopPropagation(); } };
    const noNativeDrag = (e: DragEvent) => e.preventDefault();
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('click', click, true);
    el.addEventListener('dragstart', noNativeDrag);
    return () => {
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      el.removeEventListener('click', click, true);
      el.removeEventListener('dragstart', noNativeDrag);
    };
  }, []);

  // The bar under the rail works as a scrollbar: drag the thumb, or click the track to jump there.
  const scrub = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = rail.current, b = bar.current;
    if (!el || !b || e.button !== 0) return;
    e.preventDefault();
    const r = b.getBoundingClientRect();
    const max = el.scrollWidth - el.clientWidth;
    const thumb = r.width * (el.clientWidth / el.scrollWidth);
    const room = r.width - thumb;
    if (max <= 0 || room <= 0) return;
    const thumbLeft = r.left + (el.scrollLeft / max) * room;
    const onThumb = e.clientX >= thumbLeft && e.clientX <= thumbLeft + thumb;
    const grab = onThumb ? e.clientX - thumbLeft : thumb / 2;
    const to = (cx: number) => { el.scrollLeft = ((cx - grab - r.left) / room) * max; };
    el.dataset.drag = '1'; el.classList.add('is-dragging'); b.classList.add('is-active');
    b.setPointerCapture(e.pointerId);
    to(e.clientX);
    const move = (ev: PointerEvent) => to(ev.clientX);
    const end = () => {
      b.removeEventListener('pointermove', move); b.removeEventListener('pointerup', end); b.removeEventListener('pointercancel', end);
      b.classList.remove('is-active'); delete el.dataset.drag;
      settle(el, 0);
    };
    b.addEventListener('pointermove', move); b.addEventListener('pointerup', end); b.addEventListener('pointercancel', end);
  };

  const go = (dir: number) => {
    const el = rail.current; if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth, behavior: reducedMotion() ? 'auto' : 'smooth' });
  };

  return (
    <>
      <div className="levels-head">
        {heading}
        <div className="rail-controls">
          <button className="icon-btn" onClick={() => go(-1)} disabled={pos.start} aria-label="Previous restaurants"><ArrowL /></button>
          <button className="icon-btn" onClick={() => go(1)} disabled={pos.end} aria-label="Next restaurants"><ArrowR /></button>
        </div>
      </div>
      <div className="rail" ref={rail} role="list" aria-label="Restaurants" tabIndex={0}>
        {levels.map((l) => (
          <article key={l.id} className="level-card" role="listitem" data-level={l.id}>
            <Media media={l.media} label={`${l.title} clip`} />
            <p className="num">Restaurant {String(l.number).padStart(2, '0')}</p>
            <h3>{l.title}</h3>
            <p>{l.oneLiner}</p>
          </article>
        ))}
        <article className="level-card next" role="listitem">
          <span className="q" aria-hidden="true">?</span>
          <h3>More on the way</h3>
          <p>Bagel Café and more kitchens are being cooked up. Keep earning to unlock them.</p>
        </article>
      </div>
      {pos.size < 0.999 && (
        <div className="rail-scrub" ref={bar} onPointerDown={scrub} aria-hidden="true">
          <div className="rail-progress">
            <span style={{ width: `${pos.size * 100}%`, transform: `translateX(${(pos.offset / pos.size) * 100}%)` }} />
          </div>
        </div>
      )}
    </>
  );
}
