import { vec } from '@/content/assets';

/** The small brand mark next to the game name. Falls back to the yellow tile until 01_Brand/mark is uploaded. */
export function BrandMark() {
  const src = vec('01_Brand/mark');
  // eslint-disable-next-line @next/next/no-img-element
  return src ? <img src={src} alt="" width={22} height={22} className="mark-img" aria-hidden="true" /> : <i aria-hidden="true" />;
}
