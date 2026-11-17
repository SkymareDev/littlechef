'use client';
import { useEffect, useRef, useState } from 'react';
import type { Level } from '@/content/types';
import { Media } from './Media';
import { ArrowL, ArrowR } from './Icons';
import { track } from '@/lib/analytics';

const mod = (a: number, n: number) => ((a % n) + n) % n;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

type Curve = { t0: number; x0: number; d: number; m0: number; T: number };

/**
 * Endless restaurant carousel. Cards stay in normal grid flow (so the rail keeps its height) and each one is
 * shifted with a transform so the row wraps around. Drag, flick, wheel, keys, buttons and the bar all move one
 * offset. Letting go starts a curve at the hand's own speed that slows down and stops exactly on a card edge,
 * always a card in the direction of travel, so there is no jump in speed and no pull backwards.
 */
export function LevelRail({ levels, heading }: { levels: Level[]; heading: React.ReactNode }) {
  const rail = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const thumbA = useRef<HTMLSpanElement>(null);
  const thumbB = useRef<HTMLSpanElement>(null);
  const goRef = useRef<(n: number) => void>(() => {});
  const seen = useRef(new Set<string>());
  const s = useRef({
    offset: 0, target: 0, vel: 0, step: 0, total: 0, view: 0, raf: 0, last: 0,
    mode: 'ease' as 'ease' | 'curve', tau: 0.1, curve: { t0: 0, x0: 0, d: 0, m0: 0, T: 1 } as Curve,
  }).current;
  const [copies, setCopies] = useState(1);

  useEffect(() => {
    const el = rail.current, b = bar.current; if (!el) return;
    const cards = () => Array.from(el.children) as HTMLElement[];
    const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nearest = (o: number) => (s.step ? Math.round(o / s.step) * s.step : o);

    const paint = () => {
      const { step, total } = s; if (!step || !total) return;
      const off = mod(s.offset, total);
      cards().forEach((c, i) => { c.style.transform = `translate3d(${mod(i * step - off + step, total) - step - i * step}px,0,0)`; });
      const size = Math.min(1, s.view / total), start = off / total, spill = start + size - 1;
      if (thumbA.current) { thumbA.current.style.left = `${start * 100}%`; thumbA.current.style.width = `${Math.min(size, 1 - start) * 100}%`; }
      if (thumbB.current) thumbB.current.style.width = `${Math.max(0, spill) * 100}%`;
    };

    const tick = (t: number) => {
      const dt = s.last ? Math.min(0.05, (t - s.last) / 1000) : 1 / 60; s.last = t;
      const prev = s.offset;
      let done: boolean;
      if (s.mode === 'curve') {
        // Cubic from (start, hand speed) to (card edge, standing still).
        const c = s.curve, u = clamp((performance.now() - c.t0) / 1000 / c.T, 0, 1);
        s.offset = c.x0 + c.m0 * (u * u * u - 2 * u * u + u) + c.d * (3 * u * u - 2 * u * u * u);
        done = u >= 1;
      } else {
        // Follow: the gap to the target shrinks by the same share every moment.
        const rest = (s.target - s.offset) * Math.exp(-dt / s.tau);
        s.offset = s.target - rest; done = Math.abs(rest) < 0.3;
      }
      s.vel = dt > 0 ? (s.offset - prev) / dt : 0;
      if (done) { s.offset = s.target; s.vel = 0; s.raf = 0; paint(); return; }
      paint(); s.raf = requestAnimationFrame(tick);
    };
    const run = () => {
      if (reduce()) { cancelAnimationFrame(s.raf); s.raf = 0; s.offset = s.target; s.vel = 0; paint(); return; }
      if (!s.raf) { s.last = 0; s.raf = requestAnimationFrame(tick); }
    };
    const halt = () => { cancelAnimationFrame(s.raf); s.raf = 0; s.vel = 0; };
    const follow = (tau: number) => { s.mode = 'ease'; s.tau = tau; run(); };
    /** Move to `target` (a card edge), starting at speed `v` px/s and ending at rest, without overshooting. */
    const glideTo = (target: number, v: number) => {
      const d = target - s.offset;
      s.target = target;
      if (Math.abs(d) < 0.5) { halt(); s.offset = target; paint(); return; }
      const T = v * d > 0 ? clamp((2.2 * d) / v, 0.3, 1.1) : clamp(0.32 + Math.abs(d) / 2500, 0.32, 0.6);
      const k = clamp((v * T) / d, -1, 3);
      s.mode = 'curve'; s.curve = { t0: performance.now(), x0: s.offset, d, m0: k * d, T };
      run();
    };

    const measure = () => {
      const list = cards(); if (list.length < 2) return;
      const step = list[1].offsetLeft - list[0].offsetLeft; if (step <= 0) return;
      const index = s.step ? Math.round(s.target / s.step) : 0;
      s.step = step; s.total = step * list.length; s.view = el.clientWidth;
      halt(); s.offset = s.target = index * step;
      const perCopy = list.length / copies;
      const need = Math.max(1, Math.ceil((s.view + 2 * step) / (perCopy * step)));
      if (need !== copies) setCopies(need);
      paint();
    };

    goRef.current = (n: number) => glideTo(nearest(s.target) + n * s.step, s.vel);

    // Drag and flick: mouse, pen and touch. touch-action: pan-y leaves vertical swipes to the page.
    let pid = -1, x0 = 0, y0 = 0, o0 = 0, moved = false, swallow = false, mouse = false;
    let trail: [number, number][] = [];
    const down = (e: PointerEvent) => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      pid = e.pointerId; x0 = e.clientX; y0 = e.clientY; moved = false; mouse = e.pointerType === 'mouse';
      trail = [[e.clientX, e.timeStamp]];
      halt(); o0 = s.offset;
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
      while (trail.length > 2 && e.timeStamp - trail[0][1] > 250) trail.shift();
      paint();
    };
    /**
     * Flick speed in offset px/s. A hand eases off in the last frames before letting go (a mouse hand often stops
     * outright before the button comes up), so take the fastest ~30 ms stretch of the recent trail and fade it by
     * how long ago it happened. Holding still long enough before letting go counts as no flick.
     */
    const releaseSpeed = (now: number) => {
      const hold = mouse ? 300 : 150, fade = mouse ? 200 : 120;
      if (trail.length < 2 || now - trail[trail.length - 1][1] > hold) return 0;
      let best = 0;
      for (let i = trail.length - 1, j = i; i > 0; i--) {
        const [xi, ti] = trail[i];
        while (j > 0 && ti - trail[j][1] < 30) j--;
        const [xj, tj] = trail[j];
        if (ti - tj < 8) continue;
        const speed = (-(xi - xj) / (ti - tj)) * 1000 * Math.exp(-(now - ti) / fade);
        if (Math.abs(speed) > Math.abs(best)) best = speed;
        if (j === 0) break;
      }
      return best;
    };
    /** The card to land on: where the glide would carry it, rounded on in the direction of travel. */
    const landing = (v: number, dragged: number) => {
      const step = s.step;
      const pos = s.offset / step;
      const ahead = (s.offset + clamp(v * 0.45, -s.view * 3, s.view * 3)) / step;
      const dir = Math.abs(v) > 250 ? Math.sign(v) : Math.abs(dragged) > 0.15 * step ? Math.sign(dragged) : 0;
      if (dir > 0) return Math.max(Math.ceil(ahead - 0.1), Math.ceil(pos - 0.1)) * step;
      if (dir < 0) return Math.min(Math.floor(ahead + 0.1), Math.floor(pos + 0.1)) * step;
      return Math.round(pos) * step;
    };
    const up = (e: PointerEvent) => {
      if (e.pointerId !== pid) return;
      pid = -1; el.classList.remove('is-dragging');
      if (moved) { swallow = true; window.setTimeout(() => { swallow = false; }, 0); }
      const v = moved ? releaseSpeed(e.timeStamp) : 0;
      glideTo(landing(v, moved ? s.offset - o0 : 0), v);
    };
    const click = (e: MouseEvent) => { if (swallow) { e.preventDefault(); e.stopPropagation(); } };
    const noNativeDrag = (e: DragEvent) => e.preventDefault();

    // Trackpad side-swipe and Shift + wheel follow directly, then settle on a card once the wheel goes quiet.
    let wheelTimer = 0, wheelDir = 0;
    const wheel = (e: WheelEvent) => {
      let d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
      if (!d) return;
      if (e.deltaMode === 1) d *= 40;
      e.preventDefault();
      wheelDir = Math.sign(d);
      if (s.mode === 'curve') s.target = s.offset;
      s.target += d; follow(0.1);
      window.clearTimeout(wheelTimer);
      wheelTimer = window.setTimeout(() => glideTo(landing(s.vel, wheelDir * s.step), s.vel), 160);
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
      if (mod(frac - start, 1) <= size) { halt(); bo0 = s.offset; return; }
      const want = (frac - size / 2) * s.total;
      bo0 = s.offset + mod(want - mod(s.offset, s.total) + s.total / 2, s.total) - s.total / 2;
      glideTo(nearest(bo0), s.vel);
    };
    const barMove = (e: PointerEvent) => {
      if (e.pointerId !== bid || !b) return;
      if (!bMoved && Math.abs(e.clientX - bx0) < 3) return;
      bMoved = true; halt();
      s.offset = s.target = bo0 + ((e.clientX - bx0) / b.getBoundingClientRect().width) * s.total; paint();
    };
    const barUp = (e: PointerEvent) => {
      if (e.pointerId !== bid || !b) return;
      bid = -1; b.classList.remove('is-active');
      if (bMoved) glideTo(nearest(s.offset), 0);
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
