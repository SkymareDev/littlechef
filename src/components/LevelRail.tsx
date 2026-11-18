'use client';
import { useEffect, useRef, useState } from 'react';
import type { Level } from '@/content/types';
import { Media } from './Media';
import { ArrowL, ArrowR } from './Icons';
import { track } from '@/lib/analytics';

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

type Curve = { t0: number; x0: number; d: number; m0: number; T: number };

/**
 * Restaurant carousel with a start and an end. Cards stay in normal grid flow (so the rail keeps its height) and
 * are shifted together with a transform. Drag, flick, wheel, keys, buttons and the bar all move one offset.
 * Letting go starts a curve at the hand's own speed that slows down and stops exactly on a card edge, always a
 * card in the direction of travel; pulling past either end gives a little and springs back.
 */
export function LevelRail({ levels, heading }: { levels: Level[]; heading: React.ReactNode }) {
  const rail = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const thumb = useRef<HTMLSpanElement>(null);
  const goRef = useRef<(n: number) => void>(() => {});
  const seen = useRef(new Set<string>());
  const s = useRef({
    offset: 0, target: 0, vel: 0, step: 0, max: 0, view: 0, raf: 0, last: 0,
    mode: 'ease' as 'ease' | 'curve', tau: 0.1, curve: { t0: 0, x0: 0, d: 0, m0: 0, T: 1 } as Curve,
  }).current;
  const [edges, setEdges] = useState({ start: true, end: false, scrollable: true });

  useEffect(() => {
    const el = rail.current, b = bar.current; if (!el) return;
    const cards = () => Array.from(el.children) as HTMLElement[];
    const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /** Card edges the rail can rest on: every card start, and the very end. */
    const stops = () => {
      const out: number[] = [];
      for (let x = 0; s.step > 0 && x < s.max - 1; x += s.step) out.push(x);
      out.push(s.max);
      return out;
    };
    const nearest = (o: number) => stops().reduce((a, c) => (Math.abs(c - o) < Math.abs(a - o) ? c : a), 0);

    let shown = { start: true, end: false, scrollable: true };
    const paint = () => {
      const x = -s.offset;
      cards().forEach((c) => { c.style.transform = `translate3d(${x}px,0,0)`; });
      const size = s.max > 0 ? s.view / (s.view + s.max) : 1;
      const at = s.max > 0 ? clamp(s.offset / s.max, 0, 1) : 0;
      if (thumb.current) { thumb.current.style.width = `${size * 100}%`; thumb.current.style.left = `${at * (1 - size) * 100}%`; }
      const next = { start: s.offset <= 1, end: s.offset >= s.max - 1, scrollable: s.max > 1 };
      if (next.start !== shown.start || next.end !== shown.end || next.scrollable !== shown.scrollable) { shown = next; setEdges(next); }
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
      s.step = step; s.view = el.clientWidth; s.max = Math.max(0, el.scrollWidth - el.clientWidth);
      halt(); s.offset = s.target = nearest(clamp(index * step, 0, s.max));
      paint();
    };

    goRef.current = (n: number) => {
      const list = stops();
      const i = list.indexOf(nearest(s.target));
      glideTo(list[clamp(i + n, 0, list.length - 1)], s.vel);
    };

    // Drag and flick: mouse, pen and touch. touch-action: pan-y leaves vertical swipes to the page.
    let pid = -1, x0 = 0, y0 = 0, o0 = 0, moved = false, swallow = false, mouse = false;
    let trail: [number, number][] = [];
    /** Past either end the rail only gives a third as much, so it feels held. */
    const resist = (raw: number) => (raw < 0 ? raw / 3 : raw > s.max ? s.max + (raw - s.max) / 3 : raw);
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
      s.offset = s.target = resist(o0 - dx);
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
      const list = stops(), slack = 0.1 * s.step;
      const ahead = clamp(s.offset + clamp(v * 0.45, -s.view * 3, s.view * 3), 0, s.max);
      const dir = Math.abs(v) > 250 ? Math.sign(v) : Math.abs(dragged) > 0.15 * s.step ? Math.sign(dragged) : 0;
      if (dir > 0) return list.find((x) => x >= Math.max(ahead, Math.min(s.offset, s.max)) - slack) ?? s.max;
      if (dir < 0) return [...list].reverse().find((x) => x <= Math.min(ahead, Math.max(s.offset, 0)) + slack) ?? 0;
      return nearest(clamp(s.offset, 0, s.max));
    };
    const up = (e: PointerEvent) => {
      if (e.pointerId !== pid) return;
      pid = -1; el.classList.remove('is-dragging');
      if (moved) { swallow = true; window.setTimeout(() => { swallow = false; }, 0); }
      const outside = s.offset < 0 || s.offset > s.max;
      const v = moved && !outside ? releaseSpeed(e.timeStamp) : 0;
      glideTo(landing(v, moved ? s.offset - o0 : 0), v);
    };
    const click = (e: MouseEvent) => { if (swallow) { e.preventDefault(); e.stopPropagation(); } };
    const noNativeDrag = (e: DragEvent) => e.preventDefault();

    // Trackpad side-swipe and Shift + wheel follow directly, then settle on a card once the wheel goes quiet.
    let wheelTimer = 0, wheelDir = 0;
    const wheel = (e: WheelEvent) => {
      let d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
      if (!d || s.max <= 0) return;
      if (e.deltaMode === 1) d *= 40;
      const at = s.mode === 'curve' && s.raf ? s.offset : s.target;
      if ((d < 0 && at <= 0) || (d > 0 && at >= s.max)) return;
      e.preventDefault();
      wheelDir = Math.sign(d);
      s.target = clamp(at + d, 0, s.max); follow(0.1);
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
      if (!b || (e.pointerType === 'mouse' && e.button !== 0) || s.max <= 0) return;
      e.preventDefault();
      const r = b.getBoundingClientRect(), size = s.view / (s.view + s.max);
      const thumbLeft = r.left + (s.offset / s.max) * (1 - size) * r.width, thumbW = size * r.width;
      bid = e.pointerId; bx0 = e.clientX; bMoved = false; b.setPointerCapture(bid); b.classList.add('is-active');
      if (e.clientX >= thumbLeft && e.clientX <= thumbLeft + thumbW) { halt(); bo0 = s.offset; return; }
      bo0 = clamp(((e.clientX - r.left - thumbW / 2) / (r.width - thumbW)) * s.max, 0, s.max);
      glideTo(nearest(bo0), s.vel);
    };
    const barMove = (e: PointerEvent) => {
      if (e.pointerId !== bid || !b) return;
      if (!bMoved && Math.abs(e.clientX - bx0) < 3) return;
      bMoved = true; halt();
      const r = b.getBoundingClientRect(), size = s.view / (s.view + s.max);
      s.offset = s.target = clamp(bo0 + ((e.clientX - bx0) / (r.width * (1 - size))) * s.max, 0, s.max); paint();
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
  }, [levels.length, s]);

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
          <button className="icon-btn" onClick={() => page(-1)} disabled={edges.start} aria-label="Previous restaurants"><ArrowL /></button>
          <button className="icon-btn" onClick={() => page(1)} disabled={edges.end} aria-label="Next restaurants"><ArrowR /></button>
        </div>
      </div>
      <div className="rail" ref={rail} role="list" aria-label="Restaurants" aria-roledescription="carousel" tabIndex={0}>
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
      <div className="rail-scrub" ref={bar} aria-hidden="true" hidden={!edges.scrollable}>
        <div className="rail-progress"><span ref={thumb} /></div>
      </div>
    </>
  );
}
