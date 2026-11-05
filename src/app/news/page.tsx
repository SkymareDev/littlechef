import Link from 'next/link';
import { pageMeta } from '@/lib/seo';
import { sortedNews } from '@/content/news';
import { Media } from '@/components/Media';

export const metadata = pageMeta({ title: 'News and devlog', description: 'Game updates, new levels and behind-the-scenes notes from the team.', path: '/news/' });
const fmt = (d: string) => new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

export default function News() {
  const posts = sortedNews();
  return (
    <div className="wrap" style={{ paddingBottom: 96 }}>
      <header className="page-head"><h1>News and devlog</h1></header>
      <div className="news-grid">
        {posts.map((p) => (
          <Link key={p.slug} href={`/news/${p.slug}/`} className="post">
            <Media media={p.thumbnail} label="Post image" />
            <span className="meta">{p.category}, {fmt(p.date)}</span>
            <h3>{p.title}</h3><p className="muted">{p.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
