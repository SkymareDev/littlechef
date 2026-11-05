#!/usr/bin/env node
/**
 * npm run sync-assets
 * Pulls finished assets from the shared Drive folder into the website:
 *  - images (PNG/JPG/JPEG/WebP/AVIF/GIF) are resized to the size each slot needs and
 *    saved as optimised WebP; only the WebP ships, never the original
 *  - SVG and video files (MP4/WebM) are copied as they are
 *  - the favicon set (favicon.ico, icon-192/512, apple-touch-icon, site.webmanifest)
 *    is generated from 01_Brand/app-icon (or mark.svg)
 *  - the social share image is generated from 02_KeyArt/og-default
 *  - files in public/media that no longer come from Drive are removed
 * Then writes src/content/assets.generated.json and reports missing slots.
 * Source folder: ASSETS_DIR in .env.local (default: G:/My Drive/Little Chef/Website Assets).
 */
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
function readEnv() {
  const f = path.join(ROOT, '.env.local');
  if (!fs.existsSync(f)) return {};
  return Object.fromEntries(fs.readFileSync(f, 'utf8').split(/\r?\n/)
    .filter((l) => l.trim() && !l.trim().startsWith('#') && l.includes('='))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')]; }));
}
const env = { ...readEnv(), ...process.env };
const SRC = env.ASSETS_DIR || 'G:/My Drive/Little Chef/Website Assets';
const PUBLIC = path.join(ROOT, 'public');
const OUT = path.join(PUBLIC, 'media');
const MAP = path.join(ROOT, 'src', 'content', 'assets.generated.json');
const MEDIA_DIRS = ['01_Brand', '02_KeyArt', '03_Video', '04_Images', '08_Store-Badges'];
const RASTER = new Set(['png', 'jpg', 'jpeg', 'webp', 'avif', 'gif', 'tif', 'tiff']);
const COPY = new Set(['svg', 'mp4', 'webm']);
const QUALITY = Number(env.WEBP_QUALITY || 80);

/** Largest box each folder needs (images are scaled down to fit, never up). */
const BOX = [
  ['01_Brand/app-icon', 1024, 1024], ['01_Brand/ornament', 1400, 1400], ['01_Brand', 1600, 1600],
  ['02_KeyArt', 2560, 2560],
  ['03_Video', 1080, 1920],
  ['04_Images/BeforeAfter', 1080, 1350], ['04_Images/World', 1200, 1200], ['04_Images/Screenshots', 1290, 2796],
  ['04_Images/Showcase', 1920, 1920], ['04_Images/Studio', 1600, 1600], ['04_Images/News', 1600, 1600],
  ['08_Store-Badges', 600, 600],
];
const boxFor = (key) => (BOX.find(([p]) => key === p || key.startsWith(p + '/') || key.startsWith(p + '-') || key.startsWith(p)) || [null, 1920, 1920]).slice(1);

/** What the site expects; budgets (KB) apply to what ships (WebP / video). */
const KB = 1024;
const EXPECTED = [
  ['01_Brand/logo-light', 300], ['01_Brand/app-icon', 300], ['01_Brand/ornament', 300],
  ['02_KeyArt/keyart-landscape', 600], ['02_KeyArt/og-default', 300],
  ['03_Video/Hero/hero-loop', 2048], ['03_Video/Hero/hero-poster', 200],
  ['03_Video/Steps/step-1-discover', 800], ['03_Video/Steps/step-2-interact', 800], ['03_Video/Steps/step-3-satisfy', 800],
  ...[1, 2, 3, 4, 5, 6].map((n) => [`03_Video/Levels/level-${String(n).padStart(3, '0')}`, 1536]),
  ['03_Video/Trailer/trailer-16x9', 30720], ['03_Video/Trailer/trailer-poster', 300],
  ...[1, 2, 3, 4, 5].flatMap((n) => [[`04_Images/BeforeAfter/moment-${n}-before`, 250], [`04_Images/BeforeAfter/moment-${n}-after`, 250]]),
  ...[1, 2, 3].map((n) => [`04_Images/World/world-${n}`, 300]),
  ...[1, 2, 3, 4].map((n) => [`04_Images/Screenshots/screen-0${n}`, 500]),
  ...[1, 2, 3, 4, 5].map((n) => [`04_Images/Showcase/showcase-0${n}`, 400]),
  ['04_Images/Showcase/block-1-phone', 400], ['04_Images/Showcase/block-2-tablet', 400], ['04_Images/Showcase/block-3-tall', 400],
  ['04_Images/Studio/team', 300],
  ['04_Images/News/news-announcing-the-game', 200], ['04_Images/News/news-how-a-level-is-made', 200], ['04_Images/News/news-why-it-feels-satisfying', 200],
];

if (!fs.existsSync(SRC)) {
  console.error(`\n✗ Asset folder not found: ${SRC}\n  Set ASSETS_DIR in .env.local or check that Google Drive is running.\n`);
  process.exit(1);
}
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
  const p = path.join(dir, d.name);
  return d.isDirectory() ? walk(p) : (d.name.startsWith('.') || d.name.startsWith('~$') || d.name === 'desktop.ini' ? [] : [p]);
});
const fresh = (src, dest) => fs.existsSync(dest) && fs.statSync(dest).mtimeMs >= fs.statSync(src).mtimeMs;
const url = (rel) => '/media/' + rel.split('/').map(encodeURIComponent).join('/');

const map = {};
const produced = new Set();
const shipped = {};
const sources = {};   // key -> best source path (for favicon / og)
let converted = 0, copied = 0, unchanged = 0;
const problems = [];

for (const top of MEDIA_DIRS) {
  const base = path.join(SRC, top);
  if (!fs.existsSync(base)) continue;
  // prefer the highest-quality source when the same name exists in several formats
  const byKey = new Map();
  for (const file of walk(base)) {
    const ext = path.extname(file).slice(1).toLowerCase();
    if (!RASTER.has(ext) && !COPY.has(ext)) continue;
    const rel = path.relative(SRC, file).split(path.sep).join('/');
    const key = rel.slice(0, -(ext.length + 1));
    (byKey.get(key) || byKey.set(key, []).get(key)).push({ file, ext, rel });
  }
  for (const [key, list] of byKey) {
    const rank = (e) => ['png', 'tif', 'tiff', 'jpg', 'jpeg', 'avif', 'webp', 'gif'].indexOf(e);
    const raster = list.filter((x) => RASTER.has(x.ext)).sort((a, b) => rank(a.ext) - rank(b.ext))[0];
    const others = list.filter((x) => COPY.has(x.ext));
    if (raster) sources[key] = raster.file;
    else if (others.find((x) => x.ext === 'svg')) sources[key] = others.find((x) => x.ext === 'svg').file;

    if (raster) {
      const rel = `${key}.webp`;
      const dest = path.join(OUT, rel);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      if (fresh(raster.file, dest)) unchanged++;
      else {
        try {
          const [w, h] = boxFor(key);
          await sharp(raster.file, { animated: raster.ext === 'gif' })
            .rotate().resize({ width: w, height: h, fit: 'inside', withoutEnlargement: true })
            .webp({ quality: QUALITY, effort: 5, smartSubsample: true }).toFile(dest);
          converted++;
        } catch (e) { problems.push(`${raster.rel}: không đọc được ảnh (${e.message.split('\n')[0]})`); continue; }
      }
      produced.add(dest); (map[key] ||= {}).webp = url(rel); shipped[key] = Math.max(shipped[key] || 0, fs.statSync(dest).size);
    }
    for (const x of others) {
      const dest = path.join(OUT, x.rel);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      if (fresh(x.file, dest) && fs.statSync(dest).size === fs.statSync(x.file).size) unchanged++;
      else { fs.copyFileSync(x.file, dest); copied++; }
      produced.add(dest); (map[key] ||= {})[x.ext] = url(x.rel);
      if (x.ext !== 'svg') shipped[key] = Math.max(shipped[key] || 0, fs.statSync(dest).size);
    }
  }
}

// remove media that no longer comes from Drive (including originals from older syncs)
let removed = 0;
if (fs.existsSync(OUT)) for (const f of walk(OUT)) if (!produced.has(f) && path.basename(f) !== '.gitkeep') { fs.unlinkSync(f); removed++; }
const pruneEmpty = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) if (e.isDirectory()) { const p = path.join(d, e.name); pruneEmpty(p); if (!fs.readdirSync(p).length) fs.rmdirSync(p); } };
if (fs.existsSync(OUT)) pruneEmpty(OUT);
fs.writeFileSync(MAP, JSON.stringify(map, null, 2) + '\n');

// ---------- favicon set ----------
const PLACEHOLDER_ICON = path.join(ROOT, 'scripts', 'placeholder-icon.svg');
const iconSrc = sources['01_Brand/app-icon'] || sources['01_Brand/mark'] || PLACEHOLDER_ICON;
const markSvg = (map['01_Brand/mark'] || {}).svg ? path.join(SRC, '01_Brand', 'mark.svg') : null;
const iconTag = path.join(PUBLIC, '.icon-source');
const iconStamp = `${iconSrc}|${fs.statSync(iconSrc).mtimeMs}|${markSvg || ''}`;
if (!fs.existsSync(iconTag) || fs.readFileSync(iconTag, 'utf8') !== iconStamp || !fs.existsSync(path.join(PUBLIC, 'favicon.ico'))) {
  const png = (size, bg) => {
    let s = sharp(iconSrc, { density: 512 }).resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } });
    if (bg) s = s.flatten({ background: bg });
    return s.png({ compressionLevel: 9 }).toBuffer();
  };
  const ico = async (sizes) => {
    const imgs = await Promise.all(sizes.map((s) => png(s)));
    const head = Buffer.alloc(6 + 16 * sizes.length);
    head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(sizes.length, 4);
    let offset = head.length;
    sizes.forEach((s, i) => {
      const o = 6 + 16 * i;
      head.writeUInt8(s >= 256 ? 0 : s, o); head.writeUInt8(s >= 256 ? 0 : s, o + 1);
      head.writeUInt16LE(1, o + 4); head.writeUInt16LE(32, o + 6);
      head.writeUInt32LE(imgs[i].length, o + 8); head.writeUInt32LE(offset, o + 12);
      offset += imgs[i].length;
    });
    return Buffer.concat([head, ...imgs]);
  };
  fs.writeFileSync(path.join(PUBLIC, 'favicon.ico'), await ico([16, 32, 48]));
  fs.writeFileSync(path.join(PUBLIC, 'icon-192.png'), await png(192));
  fs.writeFileSync(path.join(PUBLIC, 'icon-512.png'), await png(512));
  fs.writeFileSync(path.join(PUBLIC, 'apple-touch-icon.png'), await png(180, '#FFFFFF'));
  // a vector favicon only when a real SVG exists (the designer's mark, or the placeholder before any icon is uploaded)
  const svgFav = path.join(PUBLIC, 'favicon.svg');
  if (markSvg) fs.copyFileSync(markSvg, svgFav);
  else if (iconSrc === PLACEHOLDER_ICON) fs.copyFileSync(PLACEHOLDER_ICON, svgFav);
  else if (fs.existsSync(svgFav)) fs.unlinkSync(svgFav);
  fs.writeFileSync(iconTag, iconStamp);
  console.log(`  favicon set generated from ${iconSrc === PLACEHOLDER_ICON ? 'the placeholder icon (no 01_Brand/app-icon yet)' : path.basename(iconSrc)}`);
}
const siteTs = fs.readFileSync(path.join(ROOT, 'src', 'content', 'site.ts'), 'utf8');
const gameName = (siteTs.match(/gameName:\s*'([^']+)'/) || [, 'Game'])[1];
fs.writeFileSync(path.join(PUBLIC, 'site.webmanifest'), JSON.stringify({
  name: gameName, short_name: gameName, start_url: '/', display: 'standalone',
  background_color: '#EAF1F4', theme_color: '#17324A',
  icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }],
}, null, 2) + '\n');

// ---------- social share image (must stay PNG/JPG for Facebook, X, Zalo) ----------
if (sources['02_KeyArt/og-default']) {
  const dest = path.join(PUBLIC, 'og', 'og-default.png');
  if (!fresh(sources['02_KeyArt/og-default'], dest)) {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    await sharp(sources['02_KeyArt/og-default'], { density: 300 }).resize(1200, 630, { fit: 'cover' }).png({ compressionLevel: 9, palette: false }).toFile(dest);
    console.log('  social share image generated (1200×630)');
  }
}

// ---------- report ----------
const found = EXPECTED.filter(([k]) => map[k]);
const missing = EXPECTED.filter(([k]) => !map[k]);
const heavy = found.filter(([k, b]) => (shipped[k] || 0) > b * KB);
console.log(`\nAsset sync from: ${SRC}`);
console.log(`  WebP created ${converted}, copied ${copied}, unchanged ${unchanged}, removed ${removed}`);
console.log(`  site slots filled: ${found.length}/${EXPECTED.length}`);
if (problems.length) { console.log('\n✗ Problems:'); problems.forEach((p) => console.log('  ' + p)); }
if (heavy.length) { console.log('\n⚠ Over size budget after optimising (export smaller or shorter):'); heavy.forEach(([k, b]) => console.log(`  ${k}  ${(shipped[k] / KB).toFixed(0)} KB > ${b} KB`)); }
if (missing.length) console.log(`\n… ${missing.length} slots still empty (placeholder shown). See the "Kết quả" column in the task sheet.`);
console.log('');
