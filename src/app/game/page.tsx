import { pageMeta } from '@/lib/seo';
import { levels } from '@/content/levels';
import { coreLoop, boosters } from '@/content/features';
import { world } from '@/content/world';
import { Media } from '@/components/Media';
import { StoreButtons } from '@/components/StoreButtons';
import { img } from '@/content/assets';

export const metadata = pageMeta({ title: 'The game', description: 'Take orders, cook pizza, fried chicken, hot dogs, burgers and steak, earn tips and open new restaurants.', path: '/game/' });

const shots = Array.from({ length: 4 }, (_, i) => ({ kind: 'image' as const, src: img(`04_Images/Screenshots/screen-0${i + 1}`), alt: `In-game screenshot ${i + 1}`, ratio: '9/19.5', spec: '1290×2796 PNG/WebP, store-ready' }));

export default function Game() {
  return (
    <>
      <header className="page-head wrap"><h1>Every restaurant is a new kitchen</h1>
        <p className="lede">Customers walk in with an order. Remember it, cook it step by step, serve it fast and collect your coins and tips. Save up, and a new restaurant opens.</p></header>
      <section className="wrap" aria-labelledby="g-loop" style={{ paddingBottom: 48 }}>
        <h2 id="g-loop">How a day works</h2>
        <ol className="lede" style={{ lineHeight: 1.9, paddingLeft: 24 }}>{coreLoop.map((s) => <li key={s}>{s}</li>)}</ol>
      </section>
      <section className="wrap" aria-labelledby="g-levels">
        <h2 id="g-levels">The restaurants</h2>
        <div className="news-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
          {levels.map((l) => (
            <article key={l.id}><Media media={l.media} label={`${l.title} clip`} />
              <p className="muted" style={{ marginTop: 12, fontWeight: 700 }}>Restaurant {String(l.number).padStart(2, '0')}</p>
              <h3>{l.title}</h3><p className="muted">{l.oneLiner}</p></article>
          ))}
        </div>
      </section>
      <section className="section wrap" aria-labelledby="g-boost" style={{ paddingBottom: 0 }}>
        <h2 id="g-boost">Boosters for busy days</h2>
        <div className="assets">{boosters.map((b) => (<div key={b.name} className="asset"><h3>{b.name}</h3><p className="muted">{b.line}</p></div>))}</div>
      </section>
      <section className="section wrap" aria-labelledby="g-world">
        <h2 id="g-world">The world</h2>
        <div className="world">{world.map((w) => (<figure key={w.id} style={{ margin: 0 }}><Media media={w.media} label={`${w.name} art`} /><figcaption><h3>{w.name}</h3><p>{w.note}</p></figcaption></figure>))}</div>
      </section>
      <section className="wrap" aria-labelledby="g-shots" style={{ paddingBottom: 96 }}>
        <h2 id="g-shots">Screenshots</h2>
        <div className="news-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
          {shots.map((s, i) => <Media key={i} media={s} label="Screenshot" />)}
        </div>
        <div style={{ marginTop: 48 }}><StoreButtons placement="game" /></div>
      </section>
    </>
  );
}
