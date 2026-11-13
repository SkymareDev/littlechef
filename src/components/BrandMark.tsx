import { vec, img } from '@/content/assets';

/** The small brand mark next to the game name. Uses 01_Brand/mark, else the app icon, else a yellow tile. */
export function BrandMark() {
  const src = vec('01_Brand/mark') ?? img('01_Brand/app-icon');
  // eslint-disable-next-line @next/next/no-img-element
  return src ? <img src={src} alt="" width={30} height={30} className="mark-img" aria-hidden="true" /> : <i aria-hidden="true" />;
}
