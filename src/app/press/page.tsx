import { pageMeta } from '@/lib/seo';
import { site } from '@/content/site';
import { pressFacts, pressFeatures } from '@/content/features';
import { PressDownload } from '@/components/PressDownload';
import { SocialLinks } from '@/components/SocialLinks';

export const metadata = pageMeta({ title: 'Press kit', description: `Logos, key art, screenshots, footage and facts about ${site.gameName}.`, path: '/press/' });

/** Put files in /public/press and set `href`. Keep everything zipped and press-ready. */
const assets = [
  { id: 'logo', name: 'Logo pack', note: 'SVG + PNG, light and dark, 4000px wide', href: null },
  { id: 'icon', name: 'App icon', note: '1024×1024 PNG', href: null },
  { id: 'keyart', name: 'Key art', note: '3840×2160 and 2160×3840, with and without logo', href: null },
  { id: 'screens', name: 'Screenshots', note: '1290×2796 PNG, 8–12 images', href: null },
  { id: 'footage', name: 'Gameplay footage', note: 'Clean 1080×1920 MP4 captures, no UI overlays', href: null },
  { id: 'trailer', name: 'Trailer', note: '1920×1080 and 1080×1920 MP4 (H.264)', href: null },
];

export default function Press() {
  return (
    <div className="wrap" style={{ paddingBottom: 96 }}>
      <header className="page-head"><h1>Press kit</h1>
        <p className="lede">Everything here is cleared for editorial use about {site.gameName}. Questions or review codes: <a href={`mailto:${site.pressEmail}`}>{site.pressEmail}</a></p></header>
      <section aria-labelledby="facts"><h2 id="facts">Fact sheet</h2>
        <dl className="facts">{pressFacts.map(([k, v]) => (<div key={k} style={{ display: 'contents' }}><dt>{k}</dt><dd>{v}</dd></div>))}</dl>
      </section>
      <section className="section" aria-labelledby="desc" style={{ paddingBottom: 0 }}><h2 id="desc">About the game</h2>
        <p className="lede">{site.description}</p>
        <ul style={{ marginTop: 24, lineHeight: 1.9 }}>{pressFeatures.map((f) => <li key={f}>{f}</li>)}</ul>
      </section>
      <section className="section" aria-labelledby="dl" style={{ paddingBottom: 0 }}><h2 id="dl">Downloads for press</h2>
        <div className="assets">{assets.map((a) => (<div key={a.id} className="asset"><h3>{a.name}</h3><p className="muted">{a.note}</p><PressDownload href={a.href} label={`Download ${a.name.toLowerCase()}`} asset={a.id} /></div>))}</div>
      </section>
      <section className="section" aria-labelledby="studio" style={{ paddingBottom: 0 }}><h2 id="studio">About {site.studio}</h2>
        <p className="lede">Placeholder studio boilerplate, 2–3 sentences, written for journalists.</p>
        <div style={{ marginTop: 24 }}><SocialLinks placement="press" /></div>
      </section>
    </div>
  );
}
