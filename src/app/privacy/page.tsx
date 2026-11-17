import { pageMeta } from '@/lib/seo';
import { site } from '@/content/site';

export const metadata = pageMeta({ title: 'Privacy policy', path: '/privacy/' });

const LAST_UPDATED = 'November 17, 2026';

/** Third-party services used by the Game. TBD: verify against the SDKs actually shipped in the Android build. */
const partners = [
  { name: 'Google Play Services and Google Play Billing', use: 'app delivery and in-app purchases on Android', href: 'https://policies.google.com/privacy' },
  { name: 'Apple App Store and In-App Purchase', use: 'app delivery and in-app purchases on iOS', href: 'https://www.apple.com/legal/privacy/en-ww/' },
  { name: 'Google Firebase (Analytics, Crashlytics)', use: 'usage statistics and crash reports', href: 'https://firebase.google.com/support/privacy' },
  { name: 'Google AdMob', use: 'showing ads in the Game', href: 'https://policies.google.com/technologies/ads' },
];

export default function Page() {
  const mail = <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a>;
  return (
    <div className="wrap article" style={{ paddingBottom: 96 }}>
      <header className="page-head" style={{ paddingInline: 0 }}><h1>Privacy policy</h1></header>
      <p className="muted">Last updated: {LAST_UPDATED}</p>

      <p>
        This Privacy Policy explains how {site.legalName} (“we”, “us”, “our”) collects, uses, shares and protects information
        when you play <strong>Little Chef: Let’s Cook</strong> (the “Game”), visit this website (the “Website”), contact us,
        or follow our social media pages (together, the “Services”). {site.legalName} is responsible for the personal data
        described here. By using the Services you agree to the practices in this policy.
      </p>

      <h2>1. Information you give us</h2>
      <ul>
        <li><strong>Support requests.</strong> When you email us, we receive your email address, your message and anything you choose to attach, such as your device model, game version or screenshots.</li>
        <li><strong>Email sign-up.</strong> If you join our mailing list on the Website, we keep your email address to send you game news and launch updates. Every email has a way to unsubscribe.</li>
        <li><strong>Feedback.</strong> Reviews, ratings, survey answers and comments you send us or post on our pages.</li>
      </ul>
      <p>The Game does not require you to create an account or give us your name.</p>

      <h2>2. Information collected automatically in the Game</h2>
      <ul>
        <li><strong>Device information:</strong> device brand and model, operating system version, language, time zone and screen size.</li>
        <li><strong>Identifiers:</strong> on Android, your device’s advertising ID; on iOS, the identifier for vendors (IDFV) and, only if you allow tracking, the advertising identifier (IDFA); plus app-specific identifiers created by the services listed in section 4.</li>
        <li><strong>Gameplay and usage:</strong> levels played, progress, coins and items earned, session length, features used and crash reports.</li>
        <li><strong>Purchases:</strong> what you bought, when, and the order ID. Payments are handled by Google Play or the Apple App Store; we never receive or store your card details.</li>
        <li><strong>Approximate location:</strong> country or region worked out from your IP address. We do not collect precise GPS location.</li>
      </ul>

      <h2>3. Information collected on the Website</h2>
      <ul>
        <li><strong>Server logs.</strong> Our hosting provider (GitHub Pages) may record your IP address, browser type and the pages requested, for security and reliability.</li>
        <li><strong>Analytics cookies.</strong> We use Google Analytics only if you click “Accept” on the cookie banner. It tells us which pages and buttons people use. If you click “Decline”, no analytics scripts are loaded.</li>
        <li><strong>Your cookie choice</strong> is stored in your browser’s local storage so we don’t ask again. You can clear it at any time in your browser settings.</li>
      </ul>

      <h2>4. Third-party services</h2>
      <p>The Game uses the following services. They may collect the information described in section 2 under their own privacy policies:</p>
      <ul>
        {partners.map((p) => (
          <li key={p.name}><a href={p.href} target="_blank" rel="noopener noreferrer">{p.name}</a>: {p.use}.</li>
        ))}
      </ul>

      <h2>5. How we use information</h2>
      <ul>
        <li>To run the Game, save your progress and deliver the items you purchase.</li>
        <li>To answer your questions and give player support.</li>
        <li>To understand how the Game is played so we can fix bugs, balance levels and improve performance.</li>
        <li>To show ads and measure how well they work, and to measure our own marketing campaigns.</li>
        <li>To send news and updates you asked for.</li>
        <li>To prevent fraud and abuse, keep the Services secure, and meet our legal obligations.</li>
      </ul>
      <p>We only use information for the purposes it was collected for, or for purposes compatible with them.</p>

      <h2>6. Advertising</h2>
      <p>
        The Game may show ads. Our ad partners may use your advertising ID to show ads that are more relevant to you and to
        limit how often you see the same ad. You can turn off personalized ads at any time:
      </p>
      <ul>
        <li><strong>Android:</strong> <em>Settings › Google › Ads</em>, then reset or delete your advertising ID.</li>
        <li><strong>iOS:</strong> the Game asks for your permission before tracking (App Tracking Transparency). You can change your choice in <em>Settings › Privacy &amp; Security › Tracking</em>.</li>
      </ul>
      <p>You will still see ads, but they will be less tailored.</p>

      <h2>7. How we share information</h2>
      <p>We do not sell your personal information for money. We share it only with:</p>
      <ul>
        <li>Service providers that help us run the Services (hosting, analytics, crash reporting, email, payments), who may use it only on our behalf.</li>
        <li>Advertising partners, as described in section 6.</li>
        <li>Authorities or other parties when required by law, or when needed to protect the rights, safety or property of our players, our studio or others.</li>
        <li>A buyer or successor if our studio or the Game is involved in a merger, acquisition or sale of assets. This policy will continue to apply to your data.</li>
      </ul>

      <h2>8. How long we keep information</h2>
      <p>
        We keep personal information only as long as we need it for the purposes above. Support emails are kept for up to
        two years after the conversation ends. Analytics data is kept in aggregated or pseudonymous form. We may keep some
        records longer when the law requires it or to resolve disputes.
      </p>

      <h2>9. Children</h2>
      <p>
        The Game and the Website are intended for a general audience and are not directed at children under 13. We do not
        knowingly collect personal information from children under 13 (or under 16 in the European Economic Area and the UK).
        If you are a parent or guardian and believe your child has given us personal information, contact us at {mail} and
        we will delete it.
      </p>

      <h2>10. Your privacy rights</h2>
      <p>Depending on where you live, you may have the right to:</p>
      <ul>
        <li>Know what personal information we hold about you and get a copy of it.</li>
        <li>Ask us to correct or delete it.</li>
        <li>Opt out of targeted advertising, and of any “sale” or “sharing” of personal information as those terms are defined by law.</li>
        <li>Withdraw consent you have given, such as for analytics cookies or marketing emails.</li>
      </ul>
      <p>
        <strong>US residents.</strong> Residents of California and other US states with privacy laws (such as Virginia,
        Colorado, Connecticut, Utah and Texas) have the rights above. Using an advertising ID for targeted ads may count as
        “sharing” under California law; you can opt out using the device setting in section 6 or by emailing us. We will
        not treat you differently for using your rights. You may use an authorized agent to make a request for you.
      </p>
      <p>
        <strong>EEA, UK and Switzerland.</strong> We process your data to provide the Game you requested, on the basis of our
        legitimate interests in running and improving it, with your consent where the law requires it (for example, analytics
        cookies and personalized ads), and to meet legal obligations. You also have the right to restrict or object to
        processing, to data portability, and to complain to your local data protection authority.
      </p>
      <p>To make any request, email {mail}. We will reply within 30 days (45 days where US state law allows). We may ask for information to confirm the request is yours.</p>

      <h2 id="delete-data">11. How to delete your data</h2>
      <ul>
        <li><strong>Game data on your device:</strong> uninstalling the Game removes progress saved on your phone.</li>
        <li><strong>Data held by us or our partners:</strong> email {mail} with the subject “Delete my data”, and tell us your device model and roughly when you installed the Game. We will delete or anonymize your data within 30 days and confirm by email.</li>
        <li><strong>Mailing list:</strong> click “unsubscribe” in any email, or contact us.</li>
      </ul>
      <p>Purchase records kept by Google Play or the Apple App Store are controlled by Google or Apple; please contact them to manage those records.</p>

      <h2>12. Security</h2>
      <p>
        We use reasonable technical and organizational measures to protect your information, such as encrypted connections
        and limited access. No method of storage or transmission over the internet is completely secure, so we cannot
        guarantee absolute security.
      </p>

      <h2>13. International transfers</h2>
      <p>
        Our studio and our service providers may process information in countries other than yours, including Vietnam and
        the United States. Where required, we rely on appropriate safeguards such as standard contractual clauses.
      </p>

      <h2>14. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. We will post the new version on this page and change the “Last updated”
        date. If the changes are significant, we will also tell you in the Game or on our social pages.
      </p>

      <h2>15. Contact us</h2>
      <p>Questions about this policy or your data? Email {mail}.</p>
    </div>
  );
}
