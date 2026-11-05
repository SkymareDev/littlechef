#!/usr/bin/env node
/**
 * npm run check-assets
 * Fills the "Kết quả" column (L) of the task sheet by checking the real files in Drive:
 *   ✅ Done      every required file is there with the exact standard name
 *   ⚠ Thiếu     some, not all, of the row's files are there
 *   ❌ Sai tên   a file in the folder looks like this row's file but the name is wrong
 *   ⬜ Trống     nothing yet
 * Only the L cells are rewritten inside the .xlsx; every other byte of the workbook is kept.
 * Close the Excel file before running.
 */
import fs from 'node:fs';
import path from 'node:path';
import JSZip from 'jszip';

const ROOT = process.cwd();
function readEnv() {
  const f = path.join(ROOT, '.env.local');
  if (!fs.existsSync(f)) return {};
  return Object.fromEntries(fs.readFileSync(f, 'utf8').split(/\r?\n/)
    .filter((l) => l.trim() && !l.trim().startsWith('#') && l.includes('='))
    .map((l) => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^["']|["']$/g, '')]; }));
}
const env = { ...readEnv(), ...process.env };
const ASSETS = env.ASSETS_DIR || 'G:/My Drive/Little Chef/Website Assets';
const SHEET = env.TASKS_XLSX || path.join(path.dirname(ASSETS), 'Little-Chef-Website-Asset-Tasks.xlsx');
const SHEET_NAME = 'Danh sách Asset';
const FIRST = 5;

// ---------- xlsx helpers ----------
const unxml = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
const xml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
async function openSheet(zip) {
  const wbXml = await zip.file('xl/workbook.xml').async('string');
  const rels = await zip.file('xl/_rels/workbook.xml.rels').async('string');
  const m = [...wbXml.matchAll(/<sheet\b[^>]*>/g)].map((t) => t[0]).find((t) => unxml(t.match(/name="([^"]*)"/)[1]) === SHEET_NAME);
  if (!m) throw new Error(`Sheet "${SHEET_NAME}" not found`);
  const rid = m.match(/r:id="([^"]+)"/)[1];
  const rel = [...rels.matchAll(/<Relationship\b[^>]*>/g)].map((t) => t[0]).find((t) => t.includes(`Id="${rid}"`));
  let target = rel.match(/Target="([^"]+)"/)[1];
  target = target.startsWith('/') ? target.slice(1) : 'xl/' + target;
  const ssFile = zip.file('xl/sharedStrings.xml');
  const shared = ssFile ? [...(await ssFile.async('string')).matchAll(/<si>([\s\S]*?)<\/si>/g)]
    .map((si) => [...si[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => unxml(t[1])).join('')) : [];
  return { path: target, xml: await zip.file(target).async('string'), shared };
}
function cellText(sheetXml, shared, ref) {
  const m = sheetXml.match(new RegExp(`<c r="${ref}"(?=[ >])([^>]*?)(?:/>|>([\\s\\S]*?)</c>)`));
  if (!m || !m[2]) return '';
  const attrs = m[1]; const body = m[2];
  if (/t="s"/.test(attrs)) { const v = body.match(/<v>(\d+)<\/v>/); return v ? shared[+v[1]] ?? '' : ''; }
  if (/t="inlineStr"/.test(attrs)) return [...body.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => unxml(t[1])).join('');
  const v = body.match(/<v>([\s\S]*?)<\/v>/); return v ? unxml(v[1]) : '';
}
function setCell(sheetXml, ref, text) {
  const re = new RegExp(`<c r="${ref}"(?=[ >])([^>]*?)(?:/>|>[\\s\\S]*?</c>)`);
  const m = sheetXml.match(re);
  const style = m ? (m[1].match(/\ss="\d+"/) || [''])[0] : '';
  const cell = `<c r="${ref}"${style} t="inlineStr"><is><t xml:space="preserve">${xml(text)}</t></is></c>`;
  if (m) return sheetXml.replace(re, cell);
  // no L cell in this row yet: insert before the next cell after L (M..), or at row end
  const row = ref.replace(/^[A-Z]+/, '');
  return sheetXml.replace(new RegExp(`(<row r="${row}"[^>]*>)([\\s\\S]*?)(</row>)`), (all, a, b, c) => {
    const i = b.search(/<c r="[M-Z]\d+"/);
    return i < 0 ? a + b + cell + c : a + b.slice(0, i) + cell + b.slice(i) + c;
  });
}

// ---------- matching ----------
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const norm = (s) => s.toLowerCase().replace(/\.[a-z0-9]+$/, '').replace(/[^a-z0-9]/g, '');
/** "a.svg / a.png + b.webp", "screen-01.png …", "news-<slug>.webp" → groups of alternatives */
function parseSpec(spec) {
  return String(spec).split('+').map((g) => g.trim()).filter(Boolean).map((group) =>
    group.split('/').map((a) => a.trim()).filter(Boolean).map((alt) => {
      if (alt.includes('…')) {
        const name = alt.replace('…', '').trim();
        const m = name.match(/^(.*?)(\d+)(\.[a-z0-9]+)$/i);
        return { re: m ? new RegExp(`^${esc(m[1])}\\d+${esc(m[3])}$`) : new RegExp(`^${esc(name)}$`), hint: norm(m ? m[1] : name) };
      }
      return { re: new RegExp(`^${alt.split(/<[^>]+>/).map(esc).join('[^/]+')}$`), hint: norm(alt.split('<')[0]) };
    }));
}
const listFiles = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true })
  .filter((d) => d.isFile() && !d.name.startsWith('.') && !d.name.startsWith('~$') && d.name !== 'desktop.ini').map((d) => d.name) : []);
const prefixLen = (a, b) => { let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++; return i; };

// ---------- run ----------
if (!fs.existsSync(SHEET)) { console.error(`✗ Task sheet not found: ${SHEET}`); process.exit(1); }
try { fs.closeSync(fs.openSync(SHEET, 'r+')); } catch { console.error('✗ The task sheet is open or locked. Close it in Excel and run again.'); process.exit(1); }

const zip = await JSZip.loadAsync(fs.readFileSync(SHEET));
const sh = await openSheet(zip);
const rows = [];
for (let n = FIRST; n < FIRST + 500; n++) {
  if (!new RegExp(`<row r="${n}"[ >]`).test(sh.xml)) break;
  const key = cellText(sh.xml, sh.shared, `P${n}`).trim();
  if (!key) continue;
  rows.push({ n, key, groups: key === '—' ? [] : parseSpec(cellText(sh.xml, sh.shared, `N${n}`)) });
}

// assign each stray (misnamed) file to the row it most resembles, within its folder
const strayFor = new Map();
for (const key of new Set(rows.map((r) => r.key))) {
  if (key === '—') continue;
  const inFolder = rows.filter((r) => r.key === key);
  const files = listFiles(path.join(ASSETS, key));
  for (const f of files) {
    if (inFolder.some((r) => r.groups.flat().some((a) => a.re.test(f)))) continue;
    let best = null, score = 0;
    for (const r of inFolder) for (const a of r.groups.flat()) { const s = prefixLen(norm(f), a.hint); if (s > score) { score = s; best = r; } }
    const target = score >= 3 ? [best] : inFolder.filter((r) => r.groups.length);
    target.forEach((r) => strayFor.set(r.n, [...(strayFor.get(r.n) || []), f]));
  }
}

const tally = { done: 0, partial: 0, wrong: 0, empty: 0 };
for (const r of rows) {
  let text;
  if (r.key === '—') text = '— Không cần file';
  else {
    const files = listFiles(path.join(ASSETS, r.key));
    const ok = r.groups.filter((alts) => files.some((f) => alts.some((a) => a.re.test(f)))).length;
    const strays = strayFor.get(r.n) || [];
    if (r.groups.length && ok === r.groups.length) { text = '✅ Done'; tally.done++; }
    else if (strays.length) { text = `❌ Sai tên: ${strays.slice(0, 2).join(', ')}${strays.length > 2 ? '…' : ''}`; tally.wrong++; }
    else if (ok) { text = `⚠ Thiếu ${r.groups.length - ok}/${r.groups.length} file`; tally.partial++; }
    else { text = '⬜ Trống'; tally.empty++; }
  }
  sh.xml = setCell(sh.xml, `L${r.n}`, text);
}
zip.file(sh.path, sh.xml);
// make Excel recalculate the summary sheet on open
const wbPath = 'xl/workbook.xml';
let wbXml = await zip.file(wbPath).async('string');
wbXml = /<calcPr\b/.test(wbXml) ? wbXml.replace(/<calcPr\b([^>]*?)\/?>/, (m, a) => `<calcPr${a.replace(/\sfullCalcOnLoad="[^"]*"/, '')} fullCalcOnLoad="1"/>`) : wbXml.replace('</workbook>', '<calcPr fullCalcOnLoad="1"/></workbook>');
zip.file(wbPath, wbXml);
fs.writeFileSync(SHEET, await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' }));
console.log(`\nKết quả cập nhật vào: ${SHEET}`);
console.log(`  ✅ Done ${tally.done}   ⚠ Thiếu ${tally.partial}   ❌ Sai tên ${tally.wrong}   ⬜ Trống ${tally.empty}\n`);
