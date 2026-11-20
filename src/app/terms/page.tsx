import Link from 'next/link';
import { pageMeta } from '@/lib/seo';
import { site, company as COMPANY } from '@/content/site';

export const metadata = pageMeta({ title: 'Terms of service', path: '/terms/' });

const LAST_UPDATED = 'November 18, 2026';

/**
 * Based on the studio's company-wide terms (skymare.co/term-of-service), adapted to Little Chef: no account,
 * progress saved on the device, purchases through Google Play and the App Store, ads, US players.
 */
export default function Page() {
  const mail = <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>;
  const privacy = <Link href="/privacy/">Privacy Policy</Link>;
  return (
    <div className="wrap article" style={{ paddingBottom: 96 }}>
      <header className="page-head" style={{ paddingInline: 0 }}><h1>Terms of service</h1></header>
      <p className="muted">Last updated: {LAST_UPDATED}</p>

      <p>
        These Terms of Service (the “Terms”) apply to <strong>Little Chef: Let’s Cook</strong> (the “Game”), this website (the
        “Website”) and our social media pages (together, the “Services”). The Services are provided by {COMPANY.name}{' '}
        (“{site.studio}”, “we”, “us”, “our”), together with its affiliates.
      </p>
      <p>
        By downloading, installing or using the Game, or by using the Website, you agree to these Terms and to our {privacy}{' '}
        (together, the “Agreement”). Please read them carefully. If you do not agree, do not use the Services.
      </p>

      <h2>1. Who can use the Services</h2>
      <ul>
        <li>You must be at least 13 years old to use the Services.</li>
        <li>If you are under 18, or under the age of majority where you live, a parent or legal guardian must review and agree to these Terms for you.</li>
        <li>You may not use the Services if we have previously banned you from any of our games or services.</li>
        <li>To download the Game you need an account with the store you use, such as a Google Account or an Apple ID. That account is governed by the store’s own terms.</li>
      </ul>

      <h2>2. Your license to use the Game</h2>
      <p>
        The Game, the Website and everything in them (art, characters, music, sound, text, software and trademarks) are owned
        by us or our licensors and are protected by copyright, trademark and other laws. We give you a personal, limited,
        non-exclusive, non-transferable and revocable license to install the Game on devices you own or control and to use the
        Services for your own non-commercial entertainment. We keep all rights we do not expressly give you.
      </p>

      <h2>3. Your game progress</h2>
      <p>
        The Game does not require an account. Your progress, coins and items are saved on your device. If you uninstall the
        Game, clear its data, reset or change your device, your progress may be lost and we may not be able to restore it.
        Purchases of permanent items can usually be restored through the store’s “Restore purchases” function where the Game
        offers it.
      </p>

      <h2>4. Virtual items and in-app purchases</h2>
      <ul>
        <li>
          <strong>Virtual items.</strong> The Game includes virtual currency (such as coins and tips) and virtual items. They
          can be earned by playing and some can be bought with real money. Either way, you receive a limited license to use
          them in the Game; you do not own them. Virtual items have no real-world value, cannot be exchanged for money or
          anything else of value, and cannot be sold, traded or transferred.
        </li>
        <li>
          <strong>Changes.</strong> We may change, rebalance or remove virtual items as the Game evolves, for example to fix
          bugs or keep the Game fair and fun.
        </li>
        <li>
          <strong>Payments.</strong> Purchases are processed by Google Play or the Apple App Store under their terms. We never
          receive or store your card details. Prices are shown in the store before you buy and may include taxes.
        </li>
        <li>
          <strong>Refunds.</strong> Refund requests are handled by the store you bought from, under its refund policy. Except
          where the law requires otherwise, all purchases are final and we do not refund unused virtual items.
        </li>
        <li>
          <strong>Parents.</strong> You can require approval for purchases in your Google Play or Apple ID family settings.
        </li>
      </ul>

      <h2>5. Subscriptions</h2>
      <p>
        If the Game offers a subscription, it renews automatically at the end of each period at the price shown, until you
        cancel it. You can cancel at any time in your Google Play or App Store subscription settings; cancel at least 24 hours
        before the renewal date to avoid being charged for the next period. Except where the law or the store’s policy
        requires otherwise, there are no refunds or credits for partly used subscription periods.
      </p>

      <h2>6. Ads and links to other sites</h2>
      <p>
        The Game may show ads from us and from other companies, as described in our {privacy}. The Services may also link to
        other websites, apps or stores. We do not control them and are not responsible for their content, products or
        services; your use of them is governed by their own terms.
      </p>

      <h2>7. Rules of conduct</h2>
      <p>When you use the Services, you agree not to:</p>
      <ul>
        <li>Break any law or regulation, or help someone else do so.</li>
        <li>Use cheats, exploits, bots, automation software, hacks, mods or any unauthorized third-party software, or abuse bugs instead of reporting them to us.</li>
        <li>Copy, modify, distribute, rent or sell the Game or any part of it, or use it for any commercial purpose we have not authorized.</li>
        <li>Reverse engineer, decompile, disassemble or otherwise try to obtain the source code of the Game.</li>
        <li>Try to gain unauthorized access to the Services, to our servers or systems, or to other people’s devices or data.</li>
        <li>Collect or harvest other people’s information or content.</li>
        <li>Post content on our pages that is abusive, threatening, obscene, defamatory or hateful, that harasses or harms others, or that infringes someone else’s rights.</li>
      </ul>

      <h2>8. Your content and feedback</h2>
      <p>
        If you send us or post on our pages comments, reviews, ideas, fan art or other content, you confirm you have the right
        to share it, and you give us a worldwide, royalty-free, non-exclusive license to use, reproduce, display and adapt it
        in connection with the Services and their promotion. If you send us ideas or suggestions, we may use them without any
        obligation to you. We may remove any content that breaks these Terms.
      </p>

      <h2>9. Updates and changes to the Game</h2>
      <p>
        The Game keeps evolving. We may release updates, and some may be required to keep playing. We may change, suspend or
        stop offering the Game, or any part of it, at any time, temporarily or permanently. If that happens, we are not
        required to give refunds or other compensation for discontinued features or unused virtual items, except where the law
        requires it.
      </p>

      <h2>10. Suspension and termination</h2>
      <p>
        We may suspend or end your access to the Services if you break these Terms or if we must do so by law. You can stop
        using the Services at any time by uninstalling the Game. The sections on ownership, virtual items, disclaimers,
        limitation of liability, indemnity and governing law continue to apply after your use ends.
      </p>

      <h2>11. Disclaimer</h2>
      <p>
        THE SERVICES ARE PROVIDED “AS IS” AND “AS AVAILABLE”. YOU USE THEM AT YOUR OWN RISK. TO THE EXTENT PERMITTED BY
        APPLICABLE LAW, WE MAKE NO WARRANTIES OR CONDITIONS OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING THAT THE SERVICES WILL BE
        UNINTERRUPTED, ERROR-FREE OR FREE OF HARMFUL COMPONENTS, OR THAT YOUR PROGRESS WILL BE PRESERVED.
      </p>

      <h2>12. Limitation of liability</h2>
      <p>
        TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, WE ARE NOT LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY OR
        CONSEQUENTIAL DAMAGES, INCLUDING LOSS OF PROFITS, GOODWILL OR DATA, ARISING OUT OF OR RELATED TO YOUR USE OF, OR
        INABILITY TO USE, THE SERVICES. OUR TOTAL LIABILITY FOR ANY CLAIM IS LIMITED TO THE AMOUNT YOU PAID US IN THE 180 DAYS
        BEFORE YOU FIRST MAKE THE CLAIM.
      </p>
      <p>
        Some places do not allow some of these exclusions or limits. Nothing in these Terms limits liability that cannot be
        limited by law, or takes away rights you have as a consumer that cannot be waived.
      </p>

      <h2>13. Indemnity</h2>
      <p>
        If your misuse of the Services or your breach of these Terms causes us loss or damage, or leads to a claim against us,
        you agree to compensate us for it, including reasonable legal fees, to the extent permitted by law.
      </p>

      <h2>14. Governing law and disputes</h2>
      <p>
        If you have a problem with the Services, please contact us first at {mail}; most issues can be solved quickly that
        way. These Terms and any dispute arising out of or in connection with them are governed by the laws of Vietnam, and the
        courts of Hanoi, Vietnam have exclusive jurisdiction, unless the law of the country where you live gives you the right
        to bring the claim under its laws or in its courts. If you have a dispute with us, the version of these Terms in effect
        when we received notice of the dispute applies.
      </p>

      <h2>15. Events beyond our control</h2>
      <p>
        We are not responsible for delays or failures caused by events outside our reasonable control, such as natural
        disasters, epidemics, war, terrorism, riots, government action, fire, floods, accidents, network or power failures,
        strikes or shortages.
      </p>

      <h2>16. App store terms</h2>
      <p><strong>Apple App Store.</strong> If you downloaded the Game from the Apple App Store:</p>
      <ul>
        <li>These Terms are between you and us, not Apple. We, not Apple, are solely responsible for the Game and its content.</li>
        <li>Your license is limited to using the Game on Apple-branded devices you own or control, as permitted by the App Store usage rules.</li>
        <li>Apple has no obligation to provide maintenance or support for the Game.</li>
        <li>If the Game fails to conform to any applicable warranty, you may notify Apple and Apple will refund the purchase price (if any) to you. To the maximum extent permitted by law, Apple has no other warranty obligation for the Game.</li>
        <li>We, not Apple, are responsible for any claims relating to the Game, including product liability claims, claims that it fails to meet legal or regulatory requirements, consumer protection claims, and claims that it infringes someone’s intellectual property.</li>
        <li>You confirm you are not located in a country subject to a US government embargo or designated as supporting terrorism, and you are not on any US government list of prohibited or restricted parties.</li>
        <li>Apple and its subsidiaries are third-party beneficiaries of these Terms and may enforce them against you.</li>
      </ul>
      <p>
        <strong>Google Play.</strong> If you downloaded the Game from Google Play, your purchases and refunds are also governed
        by the Google Play Terms of Service.
      </p>

      <h2>17. Changes to these Terms</h2>
      <p>
        We may update these Terms from time to time. We will post the new version on this page and change the “Last updated”
        date. If the changes are significant, we will also tell you in the Game or on our social pages. Changes take effect when
        posted, unless we say otherwise. If you keep using the Services after that, you accept the updated Terms.
      </p>

      <h2>18. General</h2>
      <p>
        These Terms and our {privacy} are the entire agreement between you and us about the Services. If any part of these
        Terms is found unenforceable, the rest stays in effect. If we do not enforce a right, we have not given it up. We may
        transfer our rights and obligations under these Terms, for example as part of a merger or sale of the Game; you may not
        transfer yours.
      </p>

      <h2>19. Contact us</h2>
      <p>Questions about these Terms? Contact {COMPANY.name}:</p>
      <ul>
        <li><strong>Address:</strong> {COMPANY.address}</li>
        <li><strong>Email:</strong> {mail}</li>
      </ul>
    </div>
  );
}
