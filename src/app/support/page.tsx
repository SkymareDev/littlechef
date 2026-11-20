import Link from 'next/link';
import { pageMeta } from '@/lib/seo';
import { site, company } from '@/content/site';
export const metadata = pageMeta({ title: 'Support', path: '/support/' });
export default function Support() {
  const mail = <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>;
  return (
    <div className="wrap article" style={{ paddingBottom: 96 }}>
      <header className="page-head" style={{ paddingInline: 0 }}><h1>Support</h1></header>
      <p>
        Stuck on an order or found a bug? Email {mail} and tell us your device model, operating system version and game
        version. A screenshot or short screen recording helps a lot.
      </p>

      <h2>Frequently asked questions</h2>

      <h3>Is the game free?</h3>
      <p>Yes. Little Chef is free to play. It shows ads and offers optional in-app purchases; you never have to pay to keep playing.</p>

      <h3>I changed phones or reinstalled the game. Where is my progress?</h3>
      <p>
        Your progress is saved on your device and the Game doesn’t use an account, so uninstalling the Game, clearing its data or
        moving to a new phone starts a fresh game. Items you bought can usually be restored with “Restore purchases” in the Game’s
        settings, where available.
      </p>

      <h3>I bought something but didn’t get it.</h3>
      <p>
        Check that you’re online, then close and reopen the Game. If the item still hasn’t arrived, email {mail} with your order
        ID: on Android it starts with “GPA.” and is in your Google Play order history; on iPhone it’s in the receipt email from
        Apple.
      </p>

      <h3>How do I get a refund?</h3>
      <p>
        Payments are handled by the store, so refunds are too. Request one from{' '}
        <a href="https://support.google.com/googleplay/answer/2479637" target="_blank" rel="noopener noreferrer">Google Play</a> or{' '}
        <a href="https://reportaproblem.apple.com" target="_blank" rel="noopener noreferrer">Apple</a>.
      </p>

      <h3>The game crashes or won’t load.</h3>
      <p>
        Update to the latest version from the store, restart your phone and make sure you have some free storage. If it still
        happens, email us with your device model and what you were doing when it crashed.
      </p>

      <h3>Can I see fewer personalized ads?</h3>
      <p>Yes. See <Link href="/privacy/">section 6 of our Privacy Policy</Link> for how to change your ad settings on Android and iPhone.</p>

      <h3>How do I delete my data?</h3>
      <p>Follow the steps in <Link href="/privacy/#delete-data">How to delete your data</Link>. We delete or anonymize it within 30 days.</p>

      <h2>Contact</h2>
      <ul>
        <li><strong>Email:</strong> {mail}</li>
        <li><strong>Company:</strong> {company.name}, {company.address}</li>
      </ul>
    </div>
  );
}
