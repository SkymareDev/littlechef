import Link from 'next/link';
import { pageMeta } from '@/lib/seo';
import { site, company } from '@/content/site';
import { Media } from '@/components/Media';
import { img } from '@/content/assets';
export const metadata = pageMeta({ title: `About ${site.studio}`, path: '/about/' });
export default function About() {
  return (
    <div className="wrap" style={{ paddingBottom: 96 }}>
      <header className="page-head"><h1>We make cosy games that feel good to play</h1></header>
      <div className="behind">
        <Media media={{ kind: 'image', src: img('04_Images/Studio/team'), alt: 'The studio team', ratio: '4/3', spec: '1600A-1200 WebP team photo' }} label="Team photo" />
        <div className="article">
          <p>
            {site.studio} is the game studio of {company.name}, based in Hanoi, Vietnam. We make casual mobile games that are
            easy to pick up, kind to your time and fun to come back to.
          </p>
          <p>
            <strong>Little Chef: Let’s Cook</strong> is our cooking game: remember each customer’s order, cook it just right and
            grow a street of restaurants, from Pizza House and Fried Chicken House to Steak House and beyond. It’s free to play
            on Google Play and the App Store, and we keep adding new kitchens.
          </p>
          <p>
            We read every review and message. Have an idea, found a bug, or just want to say hi? Email us, or find us on our{' '}
            <Link href="/community/">social pages</Link>.
          </p>
          <h2>Contact us</h2>
          <ul>
            <li><strong>Company:</strong> {company.name}</li>
            <li><strong>Address:</strong> {company.address}</li>
            <li><strong>Email:</strong> <a href={`mailto:${company.email}`}>{company.email}</a></li>
          </ul>
          <p className="muted">Need help with the game? See <Link href="/support/">Support</Link>.</p>
        </div>
      </div>
    </div>
  );
}
