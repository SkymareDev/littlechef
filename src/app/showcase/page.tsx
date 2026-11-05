import { pageMeta } from '@/lib/seo';
import { site } from '@/content/site';
import { showcase } from '@/content/showcase';
import { Media } from '@/components/Media';
import { StoreButtons } from '@/components/StoreButtons';
import { SocialLinks } from '@/components/SocialLinks';
import { Carousel } from '@/components/Carousel';

export const metadata = pageMeta({ title: site.gameName, description: showcase.summary, path: '/showcase/' });

export default function Showcase() {
  const s = showcase;
  return (
    <div className="sc">
      {/* Hero: logo on key art, one sentence, stores */}
      <section className="sc-hero" aria-labelledby="sc-title">
        <Media media={s.heroBackground} className="sc-hero-bg" eager label="Key art background" />
        <div className="wrap sc-hero-inner">
          <div className="sc-logo">
            <Media media={s.ornament} className="sc-ornament" label="Ornament" />
            <h1 id="sc-title" className="sc-logo-mark">
              {s.logo.src ? <Media media={s.logo} eager /> : site.gameName}
            </h1>
          </div>
          <StoreButtons placement="showcase-hero" />
          <p className="sc-summary">{s.summary}</p>
        </div>
      </section>

      {/* Screenshot carousel */}
      <section className="wrap sc-shots" aria-label="Screenshots">
        <Carousel items={s.screenshots} label="Gameplay screenshots" />
      </section>

      {/* Story blocks, alternating */}
      <section className="wrap sc-blocks" aria-label="About the game">
        {s.blocks.map((b, i) => (
          <article key={b.id} className={`sc-block ${i % 2 ? 'flip' : ''}`}>
            <div className={`device device-${b.device}`}><Media media={b.media} label={`${b.device} screen`} /></div>
            <div className="sc-copy"><h2>{b.title}</h2><p className="lede">{b.line}</p></div>
          </article>
        ))}
      </section>

      {/* Press quote: rendered only when a real quote is supplied */}
      {s.pressQuote ? (
        <section className="wrap sc-quote" aria-label="Press">
          <blockquote><p>“{s.pressQuote.quote}”</p><footer>{s.pressQuote.source}</footer></blockquote>
          <Media media={s.pressQuote.logo} label="Outlet logo" />
        </section>
      ) : (
        <section className="wrap sc-quote" aria-label="Press quote placeholder">
          <div className="sc-quote-ph"><b>Press quote slot</b><span>Hidden on the live site until a real, published review quote is added in showcase.ts.</span></div>
        </section>
      )}

      {/* Closing card */}
      <section className="wrap sc-close" aria-labelledby="sc-close-title">
        <div className="sc-close-card">
          <Media media={s.appIcon} className="sc-icon" label="App icon" />
          <h2 id="sc-close-title">{site.gameName}</h2>
          <p className="lede">{s.summary}</p>
          <StoreButtons placement="showcase-final" />
        </div>
      </section>

      {/* Studio strip */}
      <section className="sc-studio">
        <div className="wrap sc-studio-inner">
          <p className="sc-studio-line">{s.studioLine}</p>
          <SocialLinks placement="showcase" compact />
        </div>
      </section>
    </div>
  );
}
