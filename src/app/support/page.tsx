import { pageMeta } from '@/lib/seo';
import { site } from '@/content/site';
export const metadata = pageMeta({ title: 'Support', path: '/support/' });
export default function Support() {
  return (<div className="wrap article" style={{ paddingBottom: 96 }}><header className="page-head" style={{ paddingInline: 0 }}><h1>Support</h1></header>
    <p>Stuck on a level or found a bug? Email <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a> with your device model and game version.</p>
    <p className="muted">Placeholder: add an FAQ here (progress sync, purchases, ads, data deletion).</p></div>);
}
