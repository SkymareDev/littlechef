'use client';
import { useState } from 'react';
import type { Moment } from '@/content/types';
import { Media } from './Media';
import { Drag } from './Icons';

export function Moments({ moments }: { moments: Moment[] }) {
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState(50);
  const m = moments[active];
  return (
    <div className="moments">
      <div>
        <h2 id="moments-title">From dough to done</h2>
        <p className="lede">Pick a step, then drag across the picture to watch a Cheese Pizza come together.</p>
        <div className="pairs" role="group" aria-label="Choose a moment">
          {moments.map((x, i) => (
            <button key={x.id} className="pair" aria-pressed={i === active} onClick={() => { setActive(i); setPos(50); }}>
              {x.from} to {x.to}
            </button>
          ))}
        </div>
      </div>
      <div className="compare" style={{ ['--pos' as string]: `${pos}%` }}>
        <Media media={m.before} className="layer" label={`“${m.from}” image`} />
        <Media media={m.after} className="layer after" label={`“${m.to}” image`} />
        <span className="tag l">{m.from}</span><span className="tag r">{m.to}</span>
        <span className="divider" aria-hidden="true" />
        <input type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Compare ${m.from} and ${m.to}`} aria-valuetext={`${100 - pos}% ${m.to} shown`} />
        <span className="knob" aria-hidden="true"><Drag /></span>
      </div>
    </div>
  );
}
