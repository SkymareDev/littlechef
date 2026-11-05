import Link from 'next/link';
import { notFound } from 'next/navigation';
import { pageMeta } from '@/lib/seo';
import { news, getPost } from '@/content/news';
import { site } from '@/content/site';
import { Media } from '@/components/Media';

export const dynamicParams = false;
export function generateStaticParams() { return news.map((p) => ({ slug: p.slug })); }
export function generateMetadata({ params }: { params: { slug: string } }) {
  const p = getPost(params.slug);
  return p ? pageMeta({ title: p.title, description: p.excerpt, path: `/news/${p.slug}/`, image: p.thumbnail.src ?? undefined }) : {};
}

export default function Post({ params }: { params: { slug: string } }) {
  const p = getPost(params.slug); if (!p) notFound();
  const ld = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title, datePublished: p.date, author: { '@type': 'Organization', name: site.studio } };
  return (
    <article className="wrap article" style={{ paddingBottom: 96 }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <header className="page-head" style={{ paddingInline: 0 }}>
        <p className="muted"><Link href="/news/">News</Link>, {p.category}</p>
        <h1 style={{ marginTop: 12 }}>{p.title}</h1>
        <p className="muted" style={{ marginTop: 12 }}><time dateTime={p.date}>{new Date(p.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</time></p>
      </header>
      <Media media={p.thumbnail} eager label="Post image" />
      {p.body.map((para, i) => <p key={i}>{para}</p>)}
    </article>
  );
}
