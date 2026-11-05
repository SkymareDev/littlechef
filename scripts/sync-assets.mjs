#!/usr/bin/env node
/**
 * npm run sync-assets
 * Copies finished assets from the shared Drive folder into /public/media and
 * writes src/content/assets.generated.json so the site uses them automatically.
 * Source folder: ASSETS_DIR in .env.local (default: G:/My Drive/Little Chef/Website Assets).
 * Only image/video/font files from the media folders are copied; docs stay in Drive.
 */
import fs from 'node:fs';
import path from 'node:path';

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
const OUT = path.join(ROOT, 'public', 'media');
const MAP = path.join(ROOT, 'src', 'content', 'assets.generated.json');
const MEDIA_DIRS = ['01_Brand', '02_KeyArt', '03_Video', '04_Images', '08_Store-Badges'];
const EXT = new Set(['webp', 'avif', 'png', 'jpg', 'jpeg', 'svg', 'gif', 'mp4', 'webm']);
const SPECIAL = { // copied to fixed public paths as well
  '02_KeyArt/og-default': (ext) => ['png', 'jpg', 'jpeg'].includes(ext) && path.join(ROOT, 'public', 'og', `og-default.${ext === 'jpeg' ? 'jpg' : ext}`),
  '01_Brand/favicon': (ext) => ext === 'svg' && path.join(ROOT, 'public', 'favicon.svg'),
  '01_Brand/apple-touch-icon': (ext) => ext === 'png' && path.join(ROOT, 'public', 'apple-touch-icon.png'),
};
/** What the site expects, with size budgets (KB) from the asset sheet. */
const KB = 1024;
const EXPECTED = [
  ['01_Brand/logo-light', 600], ['01_Brand/app-icon', 600], ['01_Brand/ornament', 600],
  ['02_KeyArt/keyart-landscape', 2500], ['02_KeyArt/og-default', 300],
  ['03_Video/Hero/hero-loop', 2048], ['03_Video/Hero/hero-poster', 200],
  ['03_Video/Steps/step-1-discover', 800], ['03_Video/Steps/step-2-interact', 800], ['03_Video/Steps/step-3-satisfy', 800],
  ...[1, 2, 3, 4, 5, 6].map((n) => [`03_Video/Levels/level-${String(n).padStart(3, '0')}`, 1536]),
  ['03_Video/Trailer/trailer-16x9', 30720], ['03_Video/Trailer/trailer-poster', 300],
  ...[1, 2, 3, 4, 5].flatMap((n) => [[`04_Images/BeforeAfter/moment-${n}-before`, 250], [`04_Images/BeforeAfter/moment-${n}-after`, 250]]),
  ...[1, 2, 3].map((n) => [`04_Images/World/world-${n}`, 300]),
  ...[1, 2, 3, 4].map((n) => [`04_Images/Screenshots/screen-0${n}`, 500]),
  ...[1, 2, 3, 4, 5].map((n) => [`04_Images/Showcase/showcase-0${n}`, 500]),
  ['04_Images/Showcase/block-1-phone', 500], ['04_Images/Showcase/block-2-tablet', 500], ['04_Images/Showcase/block-3-tall', 500],
  ['04_Images/Studio/team', 300],
  ['04_Images/News/news-announcing-the-game', 200], ['04_Images/News/news-how-a-level-is-made', 200], ['04_Images/News/news-why-it-feels-satisfying', 200],
];

if (!fs.existsSync(SRC)) {
  console.error(`\n✗ Asset folder not found: ${SRC}\n  Set ASSETS_DIR in .env.local or check that Google Drive is running.\n`);
  process.exit(1);
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    return d.isDirectory() ? walk(p) : [p];
  });
}

const map = {};
let copied = 0, skipped = 0;
const sizes = {};
for (const top of MEDIA_DIRS) {
  const base = path.join(SRC, top);
  if (!fs.existsSync(base)) continue;
  for (const file of walk(base)) {
    const ext = path.extname(file).slice(1).toLowerCase();
    if (!EXT.has(ext)) continue;
    const rel = path.relative(SRC, file).split(path.sep).join('/');
    const key = rel.slice(0, -(ext.length + 1));
    const dest = path.join(OUT, rel);
    const st = fs.statSync(file);
    const ds = fs.existsSync(dest) ? fs.statSync(dest) : null;
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    if (!ds || ds.size !== st.size || ds.mtimeMs < st.mtimeMs) { fs.copyFileSync(file, dest); copied++; } else skipped++;
    const special = SPECIAL[key]?.(ext);
    if (special) { fs.mkdirSync(path.dirname(special), { recursive: true }); fs.copyFileSync(file, special); }
    (map[key] ||= {})[ext] = '/media/' + rel.split('/').map(encodeURIComponent).join('/');
    sizes[key] = Math.max(sizes[key] || 0, st.size);
  }
}
fs.writeFileSync(MAP, JSON.stringify(map, null, 2) + '\n');

const found = EXPECTED.filter(([k]) => map[k]);
const missing = EXPECTED.filter(([k]) => !map[k]);
const heavy = found.filter(([k, b]) => sizes[k] > b * KB);
console.log(`\nAsset sync from: ${SRC}`);
console.log(`  copied ${copied}, unchanged ${skipped}, mapped ${Object.keys(map).length} assets`);
console.log(`  site slots filled: ${found.length}/${EXPECTED.length}`);
if (heavy.length) { console.log('\n⚠ Over size budget (compress before launch):'); heavy.forEach(([k, b]) => console.log(`  ${k}  ${(sizes[k] / KB).toFixed(0)} KB > ${b} KB`)); }
if (missing.length) { console.log('\n… Still missing (placeholder shown):'); missing.forEach(([k]) => console.log(`  ${k}.*`)); }
console.log('\nDone. The dev server picks up changes automatically; run `npm run build` before deploying.\n');
