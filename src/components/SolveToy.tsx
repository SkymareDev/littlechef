'use client';
import { useEffect, useState } from 'react';

/**
 * A tiny site interaction that previews the *feeling* of the game (wrong → right).
 * It is not gameplay and is labelled as such. Swap for the real hero loop with <Media eager>.
 */
const TILT = [-14, 9, -6, 12, -10, 7, 15, -8, 5];
const SHIFT = [[-6, 4], [5, -3], [0, 6], [-4, -5], [6, 3], [-3, 4], [4, -6], [-5, 2], [3, 5]];

export function SolveToy() {
  const [ok, setOk] = useState<boolean[]>(() => Array(9).fill(false));
  const done = ok.every(Boolean);
  const count = ok.filter(Boolean).length;

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setOk(Array(9).fill(false)), 2600);
    return () => clearTimeout(t);
  }, [done]);

  return (
    <div className="toy">
      <div className="toy-top"><span>Try it</span><span aria-live="polite">{count}/9</span></div>
      <div className="toy-board">
        {TILT.map((r, i) => (
          <button key={i} className="tile" data-ok={ok[i]} aria-pressed={ok[i]} aria-label={`Straighten tile ${i + 1}`}
            style={{ transform: `translate(${SHIFT[i][0]}px, ${SHIFT[i][1]}px) rotate(${r}deg)` }}
            onClick={() => setOk((s) => s.map((v, j) => (j === i ? true : v)))} />
        ))}
      </div>
      <p className="toy-msg" aria-live="polite">{done ? 'Ahh. Much better.' : count ? 'Keep going…' : 'Tap every tile to put it right.'}</p>
    </div>
  );
}
