import { pageMeta } from '@/lib/seo';
import { site } from '@/content/site';
import { Media } from '@/components/Media';
import { img } from '@/content/assets';
export const metadata = pageMeta({ title: `About ${site.studio}`, path: '/about/' });
export default function About() {
  return (
    <div className="wrap" style={{ paddingBottom: 96 }}>
      <header className="page-head"><h1>We make cosy games that feel good to play</h1></header>
      <div className="behind">
        <Media media={{ kind: 'image', src: img('04_Images/Studio/team'), alt: 'The studio team', ratio: '4/3', spec: '1600×1200 WebP team photo' }} label="Team photo" />
        <div className="article">
          <p>Placeholder. Two or three short paragraphs: who {site.studio} is, where you are based, and what you care about when you make a game.</p>
          <p>Placeholder. Mention other games, if any, and how players can reach you.</p>
          <p><a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a></p>
        </div>
      </div>
    </div>
  );
}
