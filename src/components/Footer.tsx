import Link from 'next/link';
import { site, storeLinks } from '@/content/site';
import { SocialLinks } from './SocialLinks';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Link href="/" className="wordmark"><i aria-hidden="true" />{site.gameName}</Link>
            <p className="muted" style={{ marginTop: 12 }}>A game by {site.studio}.</p>
            <div style={{ marginTop: 16 }}><SocialLinks placement="footer" compact /></div>
          </div>
          <div><h3>Game</h3><ul>
            <li><Link href="/game/">Levels and world</Link></li>
            <li><Link href="/#trailer">Trailer</Link></li>
            <li><a href={storeLinks.googlePlay ?? '/#notify'}>Google Play</a></li>
            <li><a href={storeLinks.appStore ?? '/#notify'}>App Store</a></li>
          </ul></div>
          <div><h3>Studio</h3><ul>
            <li><Link href="/about/">About {site.studio}</Link></li>
            <li><Link href="/news/">News and devlog</Link></li>
            <li><Link href="/press/">Press kit</Link></li>
            <li><a href={`mailto:${site.contactEmail}`}>Contact</a></li>
          </ul></div>
          <div><h3>Help</h3><ul>
            <li><Link href="/support/">Support</Link></li>
            <li><Link href="/privacy/">Privacy policy</Link></li>
            <li><Link href="/terms/">Terms</Link></li>
          </ul></div>
        </div>
        <p className="legal">© {year} {site.studio}. {site.gameName} is a trademark of {site.studio}. Google Play and the App Store are trademarks of their respective owners.</p>
      </div>
    </footer>
  );
}
