import { pageMeta } from '@/lib/seo';
import { site } from '@/content/site';
import { SocialLinks } from '@/components/SocialLinks';
import { Signup } from '@/components/Signup';
import { Media } from '@/components/Media';

export const metadata = pageMeta({ title: 'Community', description: `Share your best dishes, fan art and favourite restaurants with other ${site.gameName} players.`, path: '/community/' });
const art = (i: number) => ({ kind: 'image' as const, src: null, alt: `Featured fan art ${i}`, ratio: '1/1', spec: '1080×1080 WebP, credited to the artist' });

export default function Community() {
  return (
    <div className="wrap" style={{ paddingBottom: 96 }}>
      <header className="page-head"><h1>Join the community</h1>
        <p className="lede">Community spaces open at launch. Follow along now and you’ll get the first challenge.</p></header>
      <div className="community" style={{ marginTop: 0 }}>
        <div className="c-card wide"><h3>Follow the game</h3><SocialLinks placement="community-page" /><Signup placement="community-page" /></div>
        <div className="c-card"><span className="badge">Opens at launch</span><h3>Weekly challenge</h3><p className="muted">One featured order each week. Who earns the biggest tip?</p></div>
      </div>
      <section className="section" aria-labelledby="fanart" style={{ paddingBottom: 0 }}>
        <h2 id="fanart">Fan art wall</h2>
        <p className="lede">We only post art with the artist’s permission, always credited.</p>
        <div className="news-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
          {[1, 2, 3, 4].map((i) => <Media key={i} media={art(i)} label="Fan art slot" />)}
        </div>
      </section>
    </div>
  );
}
