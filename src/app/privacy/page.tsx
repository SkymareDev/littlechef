import { pageMeta } from '@/lib/seo';
export const metadata = pageMeta({ title: 'Privacy policy', path: '/privacy/' });
export default function Page() {
  return (<div className="wrap article" style={{ paddingBottom: 96 }}><header className="page-head" style={{ paddingInline: 0 }}><h1>Privacy policy</h1></header>
    <p><strong>Placeholder.</strong> Replace with the legal text approved by your counsel. It must match the policy linked in the App Store and Google Play listings.</p></div>);
}
