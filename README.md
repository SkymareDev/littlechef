# Official game website (Next.js starter)

Mobile-first launch site for a satisfying casual mobile game by **Skymare Studio**.
Everything marked *placeholder* / `TBD` is waiting for real game content.

- **Stack:** Next.js 14 (App Router, static export) + TypeScript + plain CSS design tokens.
  Tailwind was left out on purpose: the design system is ~1 CSS file of tokens, which keeps JS at ~100 kB first load and is easy for non-engineers to tweak.
- **No backend.** `npm run build` outputs static files in `/out`.

```
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in /out
```

## Folder structure

```
src/
  app/                    routes
    page.tsx              homepage (10 sections)
    game/                 levels, world, screenshots
    news/  news/[slug]/   devlog list + article pages (static)
    community/ about/ press/ support/ privacy/ terms/
    sitemap.ts robots.ts  generated sitemap.xml / robots.txt
    globals.css           design system (tokens, components, breakpoints)
  components/             reusable UI (Media, StoreButtons, LevelRail, Moments, TrailerPlayer, Signup, ...)
  content/                ALL editable content: site.ts, levels.ts, moments.ts, world.ts, features.ts, news.ts
  lib/analytics.ts        provider-agnostic track()
  lib/seo.ts              per-page title / description / OG / X card
public/
  media/  og/  press/     assets (see guide below)
```

## Two page layouts

- `/` is the full launch homepage (10 sections).
- `/showcase/` is a single-game showcase in the logo-led pattern used by premium studio game pages: logo on key art, store badges, screenshot carousel, three alternating story blocks on device frames, press quote, closing card with app icon, studio strip. Content lives in `src/content/showcase.ts`. To make it the homepage, move `src/app/showcase/page.tsx` to `src/app/page.tsx`.

Analytics only loads after the visitor accepts the cookie banner.

## Updating content

| What | File |
|---|---|
| Game name, tagline, release state, emails | `src/content/site.ts` (`site`) |
| Store URLs (Play / App Store) | `storeLinks` in `site.ts` (null = button scrolls to the notify form) |
| Trailer | `trailer` in `site.ts` (`src` MP4 or `youtubeId`, plus `poster`) |
| Social accounts | `socialLinks` in `site.ts` (null = shown as “soon”) |
| Showcased levels | `src/content/levels.ts` (add/remove/reorder entries) |
| Before/after moments | `src/content/moments.ts` |
| Characters / world | `src/content/world.ts` (empty array hides the section) |
| News posts | `src/content/news.ts` (append an object; page is generated) |
| Press facts and features | `src/content/features.ts`, files listed in `src/app/press/page.tsx` |

Set `releaseState: 'live'` in `site.ts` at launch: CTAs switch from “Pre-register / Notify me” to “Get it on / Download”.

## Syncing assets from Google Drive

The team drops finished files into the shared Drive folder (`G:/My Drive/Little Chef/Website Assets`, set `ASSETS_DIR` in `.env.local` to change it), using the folder and file names from the task sheet `G:/My Drive/Little Chef/Little-Chef-Website-Asset-Tasks.xlsx`. Then run:

```
npm run sync-assets
```

Images (PNG/JPG/WebP/AVIF) are resized to the size each slot needs and saved as WebP (only the WebP ships); SVG and video are copied as-is; the favicon set (`favicon.ico`, `icon-192/512.png`, `apple-touch-icon.png`, `site.webmanifest`) is generated from `01_Brand/app-icon` and the share image from `02_KeyArt/og-default`. It writes the results into `public/media`, updates `src/content/assets.generated.json`, lists which slots are still empty or over their size budget, and then runs `npm run check-assets`, which writes the "Kết quả" column of the task sheet (✅ Done / ⚠ Thiếu / ❌ Sai tên / ⬜ Trống) by checking every row's files in Drive. Close the Excel file before running. Anything not found keeps its placeholder on the site. Text, legal and press documents stay in Drive.

## Asset replacement guide

Put files in `public/media/...` and set `src` (and `poster` for video) on the matching entry. Any media with `src: null` renders as a striped, labelled placeholder showing the required size, so nothing ships looking “final” by accident.

| Slot | Size / format | Budget |
|---|---|---|
| Hero gameplay loop (replaces the hero “Try it” toy) | 1080×1920 (9:16) MP4 H.264 + WebM, 6–10 s, muted, seamless loop; WebP poster | ≤2 MB (serve a 720p version on mobile) |
| Core step clips ×3 | 720×1280 loop, 3–5 s | ≤800 KB each |
| Level clips | 1080×1920 loop, 4–8 s + WebP poster | ≤1.5 MB each |
| Before / after pairs | 1080×1350 (4:5) WebP/AVIF, identical framing | ≤250 KB each |
| World art | 1200×1200 transparent WebP/PNG | ≤300 KB |
| Trailer | 1920×1080 MP4 (H.264) or YouTube ID; poster 1920×1080 WebP | poster ≤300 KB |
| Screenshots | 1290×2796 PNG/WebP | ≤500 KB |
| News thumbnails | 1600×900 WebP, no text | ≤200 KB |
| Open Graph image | 1200×630 PNG/JPG, `public/og/og-default.png` (current file is a placeholder) | ≤300 KB |
| Favicon set | generated from `01_Brand/app-icon.png` by `npm run sync-assets` | — |

Encoding tip: `ffmpeg -i in.mov -vf scale=1080:-2 -an -c:v libx264 -crf 26 -preset slow -movflags +faststart out.mp4`
and `-c:v libvpx-vp9 -crf 36 -b:v 0` for WebM.

**Store badges:** the buttons are generic text buttons. Before launch, swap in the official badges from Apple (App Store Marketing Guidelines) and Google (Play badge generator); their usage rules forbid redrawing them.

**Social icons:** shown as text chips. Add official brand icons per each network’s brand guidelines if desired.

## SEO

- Per-page `<title>`, meta description, canonical, Open Graph and X `summary_large_image` via `pageMeta()`.
- JSON-LD `VideoGame` on the homepage, `BlogPosting` on news articles.
- `sitemap.xml` and `robots.txt` generated at build. Set `NEXT_PUBLIC_SITE_URL` so canonical and OG URLs are absolute.
- Semantic HTML: one `h1` per page, ordered headings, alt text from content files.
- Target phrases (used naturally in copy, not stuffed): mobile puzzle game, satisfying mobile game, relaxing puzzle game, casual puzzle game, [game name].

## Analytics event map

All calls go through `track()` in `src/lib/analytics.ts`. GA4 loads only if `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set. To add Firebase or another tool, push a provider into `providers`. Add a consent banner before enabling tracking for EU visitors.

| Event | Fired when | Props |
|---|---|---|
| page_view | every route change | path |
| hero_cta_click | store button in hero / header CTA | target |
| google_play_click | any Google Play button | placement, has_link |
| app_store_click | any App Store button | placement, has_link |
| trailer_play | trailer play button | has_video |
| social_click | social link with a URL | network, placement |
| community_click | links to /community | placement |
| level_view | a level card is 60% visible in the rail (once each) | level |
| newsletter_signup | valid email submitted | placement |
| presskit_download | press asset downloaded | asset |

## Deployment

Static `/out` folder works on Vercel, Netlify, Cloudflare Pages, Firebase Hosting or S3 + CloudFront.
- **Vercel:** import the repo, framework “Next.js”, add env vars. Done.
- **Netlify / Cloudflare Pages:** build command `npm run build`, publish directory `out`.
- Set long cache headers for `/_next/static/*` and `/media/*`.

## Newsletter

`src/components/Signup.tsx` validates and tracks but does not send anywhere yet. Connect a provider (Brevo, Mailchimp, ConvertKit or a serverless function) in `submit()` and add a privacy notice line under the form.

## Performance checklist

- [x] Static HTML, ~100 kB first-load JS on the homepage
- [x] Media space reserved with `aspect-ratio` (no layout shift)
- [x] Non-hero images `loading="lazy"`, videos `preload="none"`
- [x] Trailer loads only after the play button is pressed (youtube-nocookie)
- [x] Fonts with `display=swap` and system fallbacks
- [x] `prefers-reduced-motion` disables transitions and smooth scroll
- [ ] Self-host fonts (optional, saves a DNS round-trip)
- [ ] Compress real media to the budgets above; serve 720p loops to phones
- [ ] Run Lighthouse on a mid-range Android profile after real assets land

## Remaining placeholders

Game name, tagline check, release date and price, store URLs, social URLs, trailer + poster, hero gameplay loop, 3 step clips, level titles/one-liners/clips, before/after images, world art, screenshots, studio photo and copy, news posts, press files and boilerplate, OG image, favicon/app icon, privacy policy and terms, support FAQ, newsletter provider, contact emails.
