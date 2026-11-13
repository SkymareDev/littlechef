import Link from 'next/link';
import { site, trailer } from '@/content/site';
import { levels } from '@/content/levels';
import { world } from '@/content/world';
import { coreSteps } from '@/content/features';
import { sortedNews } from '@/content/news';
import { Media } from '@/components/Media';
import { SolveToy } from '@/components/SolveToy';
import { StoreButtons } from '@/components/StoreButtons';
import { SocialLinks } from '@/components/SocialLinks';
import { LevelRail } from '@/components/LevelRail';
import { TrailerPlayer } from '@/components/Trailer';
import { Signup } from '@/components/Signup';
import { TrackedLink } from '@/components/TrackedLink';
import { PlayIcon } from '@/components/Icons';
import { vid, img } from '@/content/assets';

const stepKey = (n: number, id: string) => `03_Video/Steps/step-${n}-${id.toLowerCase()}`;
const stepMedia = (n: number, id: string, title: string) => ({ kind: 'video' as const, src: vid(stepKey(n, id)), poster: img(stepKey(n, id)), alt: `${title}: gameplay clip`, ratio: '9/16', spec: '720×1280 loop, 3–5 s, ≤800 KB' });
const heroLoop = { kind: 'video' as const, src: vid('03_Video/Hero/hero-loop'), poster: img('03_Video/Hero/hero-poster'), alt: 'Gameplay loop: making a pizza in the Pizza House', ratio: '9/16', spec: '1080×1920 loop' };

export default function Home() {
  const heroBg = img('02_KeyArt/hero-bg');
  const finalBg = img('02_KeyArt/keyart-landscape');
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'VideoGame', name: site.gameName, description: site.description, url: site.url,
    genre: ['Cooking', 'Simulation', 'Casual'], gamePlatform: ['iOS', 'Android'], operatingSystem: 'iOS, Android', applicationCategory: 'Game',
    author: { '@type': 'Organization', name: site.studio }, publisher: { '@type': 'Organization', name: site.studio },
    ...(trailer.src || trailer.youtubeId ? { trailer: { '@type': 'VideoObject', name: `${site.gameName} trailer`, thumbnailUrl: trailer.poster, uploadDate: '2026-01-01' } } : {}),
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 01 Hero */}
      <section className={heroBg ? 'hero hero-scene' : 'hero'} aria-labelledby="hero-title">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {heroBg && <div className="scene-bg" aria-hidden="true"><img src={heroBg} alt="" /></div>}
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <h1 id="hero-title" className="sr-only">{site.gameName}</h1>
            <p className="tagline">{site.tagline}</p>
            <p className="release">{site.releaseLabel}</p>
          </div>
          <div className="hero-visual">
            {/* Replace SolveToy with <Media media={heroLoop} eager /> once the real hero gameplay loop exists */}
            <div className="phone"><div className="phone-screen">
              {heroLoop.src ? <Media media={heroLoop} eager className="hero-loop" /> : <SolveToy />}
            </div></div>
            {!heroLoop.src && <p className="toy-note">A little taste of the feeling. Real gameplay coming to this spot.</p>}
          </div>
          <div className="hero-cta" id="play">
            <StoreButtons placement="hero" />
            <div className="hero-secondary">
              <a className="btn btn-quiet" href="#trailer"><PlayIcon />Watch the trailer</a>
            </div>
            <div className="hero-social"><SocialLinks placement="hero" compact /></div>
          </div>
        </div>
      </section>

      {/* 02 Core experience */}
      <section className="section" aria-labelledby="how-title" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <h2 id="how-title">Simple to pick up. Hard to put down.</h2>
          <ol className="steps" style={{ listStyle: 'none', padding: 0 }}>
            {coreSteps.map((s, i) => (
              <li key={s.id} className="step">
                <Media media={stepMedia(i + 1, s.id, s.title)} label={`${s.title} clip`} />
                <div><h3>{s.title}</h3><p>{s.line}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 03 Restaurants */}
      <section className="section" aria-labelledby="levels-title" style={{ background: 'var(--paper)' }}>
        <div className="wrap">
          <LevelRail levels={levels} heading={
            <div><h2 id="levels-title">A new restaurant, a new kitchen</h2>
              <p className="lede">Start with pizza, then unlock fried chicken, hot dogs, burgers, steak and more. Every house has its own ingredients, tools and tricks.</p></div>
          } />
        </div>
      </section>

      {/* 05 World */}
      {world.length > 0 && (
        <section className="section" aria-labelledby="world-title" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <h2 id="world-title">Welcome to the kitchen</h2>
            <div className="world">
              {world.map((w) => (
                <figure key={w.id} style={{ margin: 0 }}>
                  <Media media={w.media} label={`${w.name} art`} />
                  <figcaption><h3>{w.name}</h3><p>{w.note}</p></figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 06 Trailer */}
      <section className="section" id="trailer" aria-labelledby="trailer-title" style={{ paddingTop: 0 }}>
        <div className="wrap trailer"><div className="trailer-inner">
          <h2 id="trailer-title">Watch the trailer</h2>
          <TrailerPlayer />
        </div></div>
      </section>

      {/* 07 Community */}
      <section className="section" aria-labelledby="community-title" style={{ background: 'var(--paper)' }}>
        <div className="wrap">
          <h2 id="community-title">Join the community</h2>
          <p className="lede">Share your best dishes, vote for your favourite restaurant and see what other chefs cooked up.</p>
          <div className="community">
            <div className="c-card wide" id="notify">
              <h3>Be first to play</h3>
              <p className="muted">One email on launch day, plus the occasional sneak peek at a new restaurant.</p>
              <Signup placement="home" />
              <SocialLinks placement="community" />
            </div>
            <div className="c-card">
              <span className="badge">Opens at launch</span>
              <h3>Weekly challenge</h3>
              <p className="muted">Cook the featured order, beat your best tip and post it with the game’s tag.</p>
            </div>
            <div className="c-card wide">
              <span className="badge">Opens at launch</span>
              <h3>Fan art wall</h3>
              <p className="muted">Selected player art, credited to the artist.</p>
            </div>
            <div className="c-card">
              <span className="badge">Opens at launch</span>
              <h3>Favourite restaurant poll</h3>
              <p className="muted">Pizza, fried chicken, burgers or steak? Pick the kitchen you love most.</p>
            </div>
          </div>
          <p style={{ marginTop: 32 }}><TrackedLink href="/community/" event="community_click" props={{ placement: 'home' }} className="btn btn-quiet">See the community page</TrackedLink></p>
        </div>
      </section>

      {/* 09 News */}
      <section className="section" aria-labelledby="news-title">
        <div className="wrap">
          <div>
            <h2 id="news-title">News and devlog</h2>
            <div className="news-grid">
              {sortedNews().slice(0, 3).map((p) => (
                <Link key={p.slug} href={`/news/${p.slug}/`} className="post">
                  <Media media={p.thumbnail} label="Post image" />
                  <span className="meta">{p.category}, {new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <h3>{p.title}</h3>
                  <p className="muted">{p.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 10 Final CTA */}
      <section className={finalBg ? 'section final final-scene' : 'section final'} aria-labelledby="final-title" style={finalBg ? undefined : { background: 'var(--paper)' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {finalBg && <div className="scene-bg" aria-hidden="true"><img src={finalBg} alt="" loading="lazy" /></div>}
        <div className="wrap">
          <h2 id="final-title">Ready to open your first restaurant?</h2>
          <p className="lede" style={{ marginInline: 'auto' }}>{site.releaseLabel}.</p>
          <StoreButtons placement="final" />
        </div>
      </section>
    </>
  );
}
