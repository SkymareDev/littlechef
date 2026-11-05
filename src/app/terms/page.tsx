import { pageMeta } from '@/lib/seo';
export const metadata = pageMeta({ title: 'Terms of service', path: '/terms/' });
export default function Page() {
  return (<div className="wrap article" style={{ paddingBottom: 96 }}><header className="page-head" style={{ paddingInline: 0 }}><h1>Terms of service</h1></header>
    <p><strong>Placeholder.</strong> Replace with the legal text approved by your counsel. It must match the policy linked in the App Store and Google Play listings.</p></div>);
}
