'use client';
import { useEffect, useRef, useState } from 'react';
import type { Level } from '@/content/types';
import { Media } from './Media';
import { ArrowL, ArrowR } from './Icons';
import { track } from '@/lib/analytics';

const mod = (a: number, n: number) => ((a % n) + n) % n;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/**
 * Endless restaurant carousel. Cards stay in normal grid flow (so the rail keeps its height) and each one is
 * shifted with a transform so the row wraps around. Drag, flick, wheel, keys, buttons and the bar all move one
 * offset; a critically damped spring carries the release velocity into the nearest card.
 */
export function LevelRail({ levels, heading }: { levels: Level[]; heading: React.ReactNode }) {
  const rail = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const thumbA = useRef<HTMLSpanElement>(null);
  const thumbB = useRef<HTMLSpanElement>(null);
  const goRef = useRef<(n: number) => void>(() => {});
  const seen = useRef(new Set<string>());
  const s = useRef({ offset: 0, vel: 0, target: 0, step: 0, total: 0, view: 0, raf: 0, last: 0, tau: 0 }).current;
  const [copies, setCopies] = useState(1);

  useEffect(() => {
    const el = rail.current, b = bar.current; if (!el) return;
    const cards = () => Array.from(el.children) as HTMLElement[];
    const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const snap = (o: number) => (s.step ? Math.round(o / s.step) * s.step : o);

    const paint = () => {
      const { step, total } = s; if (!step || !total) return;
      const off = mod(s.offset, total);
      cards().forEach((c, i) => { c.style.transform = `translate3d(${mod(i * step - off + step, total) - step - i * step}px,0,0)`; });
      const size = Math.min(1, s.view / total), start = off / total, spill = start + size - 1;
      if (thumbA.current) { thumbA.current.style.left = `${start * 100}%`; thumbA.current.style.width = `${Math.min(size, 1 - start) * 100}%`; }
      if (thumbB.current) thumbB.current.style.width = `${Math.max(0, spill) * 100}%`;
    };

    const tick = (t: number) => {
      const dt = s.last ? Math.min(0.034, (t - s.last) / 1000) : 1 / 60; s.last = t;
      let done: boolean;
      if (s.tau > 0) {
        // Glide: the gap to the target shrinks by the same share every moment, so the card slows evenly to a stop.
        const rest = (s.target - s.offset) * Math.exp(-dt / s.tau);
        s.offset = s.target - rest; done = Math.abs(rest) < 0.3;
      } else {
        const k = 190, c = 2 * Math.sqrt(k);
        s.vel += (-k * (s.offset - s.target) - c * s.vel) * dt;
        s.offset += s.vel * dt; done = Math.abs(s.offset - s.target) < 0.25 && Math.abs(s.vel) < 6;
      }
      if (done) { s.offset = s.target; s.vel = 0; s.raf = 0; paint(); return; }
      paint(); s.raf = requestAnimationFrame(tick);
    };
    /** tau > 0: ease out over roughly 4 × tau seconds. tau = 0: spring that keeps the current s.vel. */
    const animate = (tau = 0.2) => {
      s.tau = tau;
      if (reduce()) { cancelAnimationFrame(s.raf); s.raf = 0; s.offset = s.target; s.vel = 0; paint(); return; }
      if (!s.raf) { s.last = 0; s.raf = requestAnimationFrame(tick); }
    };
    const halt = () => { cancelAnimationFrame(s.raf); s.raf = 0; };

    const measure = () => {
      const list = cards(); if (list.length < 2) return;
      const step = list[1].offsetLeft - list[0].offsetLeft; if (step <= 0) return;
      const index = s.step ? Math.round(s.target / s.step) : 0;
      s.step = step; s.total = step * list.length; s.view = el.clientWidth;
      halt(); s.offset = s.target = index * step; s.vel = 0;
      const perCopy = list.length / copies;
      const need = Math.max(1, Math.ceil((s.view + 2 * step) / (perCopy * step)));
      if (need !== copies) setCopies(need);
      paint();
    };

    goRef.current = (n: number) => { s.target = snap(s.target) + n * s.step; animate(0.24); };

    // Drag and flick: mouse, pen and touch. touch-action: pan-y leaves vertical swipes to the page.
    let pid = -1, x0 = 0, y0 = 0, o0 = 0, moved = false, swallow = false;
    let trail: [number, number][] = [];
    const down = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      pid = e.pointerId; x0 = e.clientX; y0 = e.clientY; moved = false; trail = [[e.clientX, e.timeStamp]];
      halt(); s.vel = 0; o0 = s.offset;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerId !== pid) return;
      const dx = e.clientX - x0;
      if (!moved) {
        if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(e.clientY - y0)) return;
        moved = true; el.classList.add('is-dragging'); el.setPointerCapture(pid);
      }
      s.offset = s.target = o0 - dx;
      trail.push([e.clientX, e.timeStamp]);
      while (trail.length > 2 && e.timeStamp - trail[0][1] > 100) trail.shift();
      paint();
    };
    const up = (e: PointerEvent) => {
      if (e.pointerId !== pid) return;
      pid = -1; el.classList.remove('is-dragging');
      if (!moved) { s.target = snap(s.target); animate(0.2); return; }
      swallow = true; window.setTimeout(() => { swallow = false; }, 0);
      // Release speed over the last ~100 ms; a pause before letting go means no flick.
      const [fx, ft] = trail[0], [lx, lt] = trail[trail.length - 1];
      const v = e.timeStamp - lt > 60 || lt - ft < 12 ? 0 : -((lx - fx) / (lt - ft)) * 1000;
      if (Math.abs(v) < 300) { s.target = snap(s.offset); animate(0.2); return; }
      // Flick: coast about 0.38 s worth of the release speed, land on a card edge, and glide there.
      s.target = snap(s.offset + clamp(v * 0.38, -s.view * 2, s.view * 2));
      const d = s.target - s.offset;
      if (d * v > 0) animate(clamp(d / v, 0.2, 0.7));
      else { s.vel = v; animate(0); }
    };
    const click = (e: MouseEvent) => { if (swallow) { e.preventDefault(); e.stopPropagation(); } };
    const noNativeDrag = (e: DragEvent) => e.preventDefault();

    // Trackpad side-swipe and Shift + wheel. Plain vertical wheel keeps scrolling the page.
    let wheelTimer = 0;
    const wheel = (e: WheelEvent) => {
      let d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
      if (!d) return;
      if (e.deltaMode === 1) d *= 40;
      e.preventDefault(); halt(); s.vel = 0;
      s.offset = s.target = s.offset + d; paint();
      window.clearTimeout(wheelTimer);
      wheelTimer = window.setTimeout(() => { s.target = snap(s.offset); animate(0.2); }, 140);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); goRef.current(1); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); goRef.current(-1); }
    };

    // The bar: drag the thumb, or press the track to glide there and keep dragging.
    let bid = -1, bx0 = 0, bo0 = 0, bMoved = false;
    const barDown = (e: PointerEvent) => {
      if (!b || (e.pointerType === 'mouse' && e.button !== 0) || !s.total) return;
      e.preventDefault();
      const r = b.getBoundingClientRect(); const size = Math.min(1, s.view / s.total);
      const frac = (e.clientX - r.left) / r.width, start = mod(s.offset, s.total) / s.total;
      bid = e.pointerId; bx0 = e.clientX; bMoved = false; b.setPointerCapture(bid); b.classList.add('is-active');
      if (mod(frac - start, 1) <= size) { halt(); s.vel = 0; bo0 = s.offset; return; }
      const want = (frac - size / 2) * s.total;
      bo0 = s.offset + mod(want - mod(s.offset, s.total) + s.total / 2, s.total) - s.total / 2;
      s.target = bo0; animate(0.24);
    };
    const barMove = (e: PointerEvent) => {
      if (e.pointerId !== bid || !b) return;
      bMoved = true; halt(); s.vel = 0;
      s.offset = s.target = bo0 + ((e.clientX - bx0) / b.getBoundingClientRect().width) * s.total; paint();
    };
    const barUp = (e: PointerEvent) => {
      if (e.pointerId !== bid || !b) return;
      bid = -1; b.classList.remove('is-active');
      s.target = snap(bMoved ? s.offset : s.target); animate(0.22);
    };

    measure();
    const ro = new ResizeObserver(measure); ro.observe(el);
    el.addEventListener('pointerdown', down);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
    el.addEventListener('click', click, true);
    el.addEventListener('dragstart', noNativeDrag);
    el.addEventListener('wheel', wheel, { passive: false });
    el.addEventListener('keydown', key);
    b?.addEventListener('pointerdown', barDown);
    b?.addEventListener('pointermove', barMove);
    b?.addEventListener('pointerup', barUp);
    b?.addEventListener('pointercancel', barUp);
    return () => {
      halt(); ro.disconnect(); window.clearTimeout(wheelTimer);
      el.removeEventListener('pointerdown', down);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerup', up);
      el.removeEventListener('pointercancel', up);
      el.removeEventListener('click', click, true);
      el.removeEventListener('dragstart', noNativeDrag);
      el.removeEventListener('wheel', wheel);
      el.removeEventListener('keydown', key);
      b?.removeEventListener('pointerdown', barDown);
      b?.removeEventListener('pointermove', barMove);
      b?.removeEventListener('pointerup', barUp);
      b?.removeEventListener('pointercancel', barUp);
    };
  }, [copies, levels.length, s]);

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
  }, [copies]);

  const page = (dir: number) => {
    const el = rail.current, card = el?.children[1] as HTMLElement | undefined, first = el?.children[0] as HTMLElement | undefined;
    const step = card && first ? card.offsetLeft - first.offsetLeft : 0;
    goRef.current(dir * (el && step ? Math.max(1, Math.round(el.clientWidth / step)) : 1));
  };

  return (
    <>
      <div className="levels-head">
        {heading}
        <div className="rail-controls">
          <button className="icon-btn" onClick={() => page(-1)} aria-label="Previous restaurants"><ArrowL /></button>
          <button className="icon-btn" onClick={() => page(1)} aria-label="Next restaurants"><ArrowR /></button>
        </div>
      </div>
      <div className="rail" ref={rail} role="list" aria-label="Restaurants" aria-roledescription="carousel" tabIndex={0}>
        {Array.from({ length: copies }).flatMap((_, c) => [
          ...levels.map((l) => (
            <article key={`${c}-${l.id}`} className="level-card" role={c ? undefined : 'listitem'} aria-hidden={c ? true : undefined} data-level={c ? undefined : l.id}>
              <Media media={l.media} label={`${l.title} clip`} />
              <p className="num">Restaurant {String(l.number).padStart(2, '0')}</p>
              <h3>{l.title}</h3>
              <p>{l.oneLiner}</p>
            </article>
          )),
          <article key={`${c}-next`} className="level-card next" role={c ? undefined : 'listitem'} aria-hidden={c ? true : undefined}>
            <span className="q" aria-hidden="true">?</span>
            <h3>More on the way</h3>
            <p>Bagel Café and more kitchens are being cooked up. Keep earning to unlock them.</p>
          </article>,
        ])}
      </div>
      <div className="rail-scrub" ref={bar} aria-hidden="true">
        <div className="rail-progress"><span ref={thumbA} /><span ref={thumbB} className="wrap" /></div>
      </div>
    </>
  );
}
