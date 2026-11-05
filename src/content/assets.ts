/**
 * Lookup for real asset files copied in by `npm run sync-assets`.
 * Keys are the Drive path without extension, e.g. "03_Video/Levels/level-001".
 * Returns null when the file is not there yet, so the page keeps its placeholder.
 */
import generated from './assets.generated.json';

type Entry = Record<string, string>; // ext -> public url
const map = generated as Record<string, Entry>;

const IMG = ['webp', 'avif', 'png', 'jpg', 'jpeg', 'svg', 'gif'];
const VID = ['mp4', 'webm'];

export function pick(key: string, prefer: string[] = [...IMG, ...VID]): string | null {
  const e = map[key];
  if (!e) return null;
  for (const ext of prefer) if (e[ext]) return e[ext];
  return null;
}
export const img = (key: string) => pick(key, IMG);
export const vid = (key: string) => pick(key, VID);
